import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { ScrollArea } from './ui/scroll-area.jsx';
import { toast } from 'sonner';
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';
import {
  Settings,
  Music,
  Search,
  Download,
  RefreshCw,
  Clock,
} from 'lucide-react';

// Parsear formato LRC estándar
const parseLRC = (lrcContent) => {
  if (!lrcContent) return [];

  const lines = lrcContent.split('\n');
  const lyrics = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

  lines.forEach((line) => {
    const matches = [...line.matchAll(timeRegex)];
    if (matches.length > 0) {
      const text = line.replace(timeRegex, '').trim();

      matches.forEach((match) => {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = parseInt(match[3].padEnd(3, '0'));
        const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;

        if (text) {
          lyrics.push({
            time: totalSeconds,
            text: text,
            original: line,
          });
        }
      });
    }
  });

  return lyrics.sort((a, b) => a.time - b.time);
};

// Buscar letras en LRCLIB
const searchLyrics = async (trackName, artistName, duration) => {
  try {
    // URL de la API de LRCLIB
    const baseUrl = 'https://lrclib.net/api';
    const searchUrl = `${baseUrl}/search?track_name=${encodeURIComponent(
      trackName
    )}&artist_name=${encodeURIComponent(artistName)}`;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results = await response.json();

    if (results && results.length > 0) {
      // Buscar el resultado más cercano por duración
      let bestMatch = results[0];
      let minDurationDiff = Math.abs(
        (bestMatch.duration || 0) - (duration || 0)
      );

      for (const result of results) {
        const durationDiff = Math.abs((result.duration || 0) - (duration || 0));
        if (durationDiff < minDurationDiff) {
          bestMatch = result;
          minDurationDiff = durationDiff;
        }
      }

      return {
        syncedLyrics: bestMatch.syncedLyrics,
        plainLyrics: bestMatch.plainLyrics,
        instrumental: bestMatch.instrumental,
        trackName: bestMatch.trackName,
        artistName: bestMatch.artistName,
        albumName: bestMatch.albumName,
        duration: bestMatch.duration,
      };
    }

    return null;
  } catch (error) {
    console.error('Error buscando letras en LRCLIB:', error);
    return null;
  }
};

const LyricsSync = ({
  song,
  currentTime,
  isPlaying,
  onSeek,
  playerRef,
  persistentState = {},
  onStateChange,
}) => {
  const [lyrics, setLyrics] = useState(persistentState.lyrics || []);
  const [currentIndex, setCurrentIndex] = useState(
    persistentState.currentIndex || -1
  );
  const [isLoading, setIsLoading] = useState(
    persistentState.isLoading || false
  );
  const [lyricsData, setLyricsData] = useState(
    persistentState.lyricsData || null
  );
  const [manualOffset, setManualOffset] = useState(
    persistentState.manualOffset || 0
  );
  const [autoScroll, setAutoScroll] = useState(
    persistentState.autoScroll !== undefined ? persistentState.autoScroll : true
  );
  const scrollAreaRef = useRef(null);
  const [error, setError] = useState(persistentState.error || null);
  const scrollTimeoutRef = useRef(null);

  // Spring para animaciones suaves
  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  // Buscar letras automáticamente cuando cambia la canción (inmediatamente)
  useEffect(() => {
    if (song?.name && song?.artist) {
      // Solo pre-cargar si no hay letras ya cargadas para esta canción
      if (lyrics.length === 0 && !isLoading && !error) {
        fetchLyrics();
      }
    }
  }, [song?.videoId, song?.name, song?.artist]);

  // Actualizar índice actual basado en el tiempo con tolerancia mejorada
  useEffect(() => {
    if (lyrics.length === 0 || !isPlaying) return;

    const adjustedTime = currentTime + manualOffset;
    let newIndex = -1;
    const tolerance = 0.3; // Tolerancia reducida para mejor sincronización

    // Buscar la línea más precisa basada en tiempo actual
    for (let i = 0; i < lyrics.length; i++) {
      const lyricTime = lyrics[i].time;
      const nextLyricTime =
        i < lyrics.length - 1 ? lyrics[i + 1].time : Infinity;

      if (
        adjustedTime >= lyricTime - tolerance &&
        adjustedTime < nextLyricTime
      ) {
        newIndex = i;
        break;
      }
    }

    // Solo actualizar si hay un cambio real
    if (newIndex !== currentIndex && newIndex >= 0) {
      setCurrentIndex(newIndex);

      if (autoScroll) {
        // Scroll directo sin delays para mejor fluidez
        scrollToLyric(newIndex, true);
      }
    }
  }, [currentTime, lyrics, manualOffset, isPlaying, autoScroll]); // Removido currentIndex para evitar loops

  // Cleanup timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Actualizar estado persistente cuando cambie cualquier estado interno
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        lyrics,
        currentIndex,
        isLoading,
        lyricsData,
        manualOffset,
        autoScroll,
        error,
      });
    }
  }, [
    lyrics,
    currentIndex,
    isLoading,
    lyricsData,
    manualOffset,
    autoScroll,
    error,
  ]); // Removido onStateChange de las dependencias

  const fetchLyrics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const artistName =
        typeof song.artist === 'string'
          ? song.artist
          : song.artist?.name || 'Unknown Artist';

      const duration = song.duration || 0;

      const result = await searchLyrics(song.name, artistName, duration);

      if (result) {
        setLyricsData(result);

        if (result.instrumental) {
          setLyrics([]);
          // Sin notificación para pistas instrumentales
        } else if (result.syncedLyrics) {
          const parsedLyrics = parseLRC(result.syncedLyrics);
          setLyrics(parsedLyrics);
          // Sin notificación de éxito - carga silenciosa
        } else if (result.plainLyrics) {
          // Convertir letras planas a formato básico
          const lines = result.plainLyrics
            .split('\n')
            .filter((line) => line.trim());
          const estimatedDuration = duration || 180;
          const timePerLine = estimatedDuration / lines.length;

          const estimatedLyrics = lines.map((line, index) => ({
            time: index * timePerLine,
            text: line.trim(),
            estimated: true,
          }));

          setLyrics(estimatedLyrics);
          // Sin notificación para letras estimadas
        } else {
          setLyrics([]);
          setError('No se encontraron letras para esta canción');
        }
      } else {
        setLyrics([]);
        setError('No se encontraron letras en la base de datos');
      }
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      setError('Error al buscar letras');
      // Sin notificación de error - silencioso
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToLyric = useCallback((index, immediate = false) => {
    if (!scrollAreaRef.current || index < 0) return;

    // Limpiar timeout anterior para evitar scrolls múltiples
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const container = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    const lyricElement = container?.querySelector(
      `[data-lyric-index="${index}"]`
    );

    if (container && lyricElement) {
      const containerHeight = container.clientHeight;
      const elementTop = lyricElement.offsetTop;
      const elementHeight = lyricElement.clientHeight;

      const scrollTop = elementTop - containerHeight / 2 + elementHeight / 2;

      if (immediate) {
        // Scroll inmediato y directo para sincronización automática
        container.scrollTop = Math.max(0, scrollTop);
      } else {
        // Scroll suave para interacciones manuales
        container.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth',
        });
      }
    }
  }, []);

  const handleLyricClick = (lyric) => {
    if (onSeek && lyric.time !== undefined) {
      onSeek(lyric.time - manualOffset);
      const newIndex = lyrics.findIndex((l) => l.time === lyric.time);
      setCurrentIndex(newIndex);
      setAutoScroll(true);
      // Usar scroll suave para clicks manuales
      setTimeout(() => scrollToLyric(newIndex, false), 100);
    }
  };

  const adjustOffset = (delta) => {
    setManualOffset((prev) => {
      const newOffset = prev + delta;
      // Sin notificación de ajuste - solo cambio silencioso
      return newOffset;
    });
  };

  const resetOffset = () => {
    setManualOffset(0);
    setCurrentIndex(-1);
    // Sin notificación de reset - silencioso
  };

  // Gestos para control táctil
  const bind = useGesture({
    onDrag: ({ delta: [, dy], memo = y.get() }) => {
      if (!autoScroll) {
        api.start({ y: memo + dy });
      }
      return memo;
    },
    onWheel: ({ delta: [, dy] }) => {
      if (Math.abs(dy) > 50) {
        setAutoScroll(false);
      }
    },
  });

  // Optimización: Memorizar las líneas renderizadas para evitar re-renders innecesarios
  const renderedLyrics = useMemo(() => {
    return lyrics.map((lyric, index) => {
      const isActive = index === currentIndex;
      const isPast = index < currentIndex;
      const isFuture = index > currentIndex;

      return {
        ...lyric,
        index,
        isActive,
        isPast,
        isFuture,
      };
    });
  }, [lyrics, currentIndex]);

  // Solo mostrar spinner si está cargando Y no hay letras previas Y es la primera carga
  if (
    isLoading &&
    lyrics.length === 0 &&
    !error &&
    !persistentState.lyrics?.length
  ) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="text-slate-400">Buscando letras...</p>
        </div>
      </div>
    );
  }

  if (error || lyrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <Music className="w-16 h-16 text-slate-600 mx-auto" />
          <div>
            <p className="text-slate-400 mb-2">
              {error || 'No hay letra para este tema brotherr'}
            </p>
            <Button
              onClick={fetchLyrics}
              variant="outline"
              size="sm"
              className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-400">
              <RefreshCw className="w-4 h-4 mr-2" />
              Probá otra vez
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info de estado simplificada */}
      {(lyricsData?.instrumental || lyrics.some((l) => l.estimated)) && (
        <motion.div
          className="bg-slate-900/30 rounded-lg p-3 border border-slate-700/30 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2">
            {lyricsData?.instrumental && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-500/20 border-blue-500/50 text-blue-300">
                Instrumental
              </Badge>
            )}
            {lyrics.some((l) => l.estimated) && (
              <Badge
                variant="outline"
                className="text-xs bg-yellow-500/20 border-yellow-500/50 text-yellow-300">
                Tiempos Estimados
              </Badge>
            )}
          </div>
        </motion.div>
      )}

      {/* Lista de letras */}
      <ScrollArea ref={scrollAreaRef} className="h-[340px] w-full" {...bind()}>
        <AnimatePresence>
          <animated.div
            className="space-y-2 pr-4"
            style={{ transform: y.to((y) => `translateY(${y}px)`) }}>
            {renderedLyrics.map((lyric) => {
              const { isActive, isPast, isFuture, index } = lyric;

              return (
                <motion.div
                  key={`${lyric.time}-${index}`}
                  data-lyric-index={index}
                  className={`
                    p-3 rounded-lg cursor-pointer select-none will-change-transform
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 text-white font-semibold shadow-lg transform translate-x-1.5 scale-[1.01]'
                        : isPast
                        ? 'text-slate-500 opacity-60 hover:opacity-80'
                        : 'text-slate-300 hover:bg-slate-700/30'
                    }
                  `}
                  style={{
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onClick={() => handleLyricClick(lyric)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeOut',
                  }}
                  whileHover={{
                    x: isActive ? 6 : 3,
                    transition: { duration: 0.15 },
                  }}>
                  <div className="flex items-center gap-3">
                    {isActive && (
                      <motion.div
                        className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{
                          duration: 0.2,
                          ease: 'easeOut',
                          type: 'tween',
                        }}
                        style={{
                          transformOrigin: 'center',
                          willChange: 'transform',
                        }}
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-base leading-relaxed">
                          {lyric.text}
                        </span>

                        <div className="flex items-center gap-2 text-xs opacity-60">
                          {lyric.estimated && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-yellow-500/20 border-yellow-500/50 text-yellow-300">
                              Est.
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>
                              {Math.floor(lyric.time / 60)}:
                              {(lyric.time % 60).toFixed(1).padStart(4, '0')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Barra de progreso para línea actual */}
                      {isActive && (
                        <motion.div
                          className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden"
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{
                            duration: 0.15,
                            ease: 'easeOut',
                            type: 'tween',
                          }}
                          style={{
                            transformOrigin: 'left center',
                            willChange: 'transform, opacity',
                          }}>
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                            animate={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  ((currentTime + manualOffset - lyric.time) /
                                    4) *
                                    100
                                )
                              )}%`,
                            }}
                            transition={{
                              duration: 0.05,
                              ease: 'linear',
                              type: 'tween',
                            }}
                            style={{
                              willChange: 'width',
                            }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </animated.div>
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
};

export default LyricsSync;
