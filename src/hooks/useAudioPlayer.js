import { useState, useRef, useEffect, useCallback } from 'react';

const useAudioPlayer = (song) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const playerRef = useRef(null);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleReady = (event) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
  };

  const handleStateChange = (event) => {
    const state = event.data;
    if (state === 1) {
      setIsPlaying(true);
    } else if (state === 2 || state === 0) {
      setIsPlaying(false);
    }
  };

  const handleProgress = (event) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      setCurrentTime(currentTime);
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleSeek = (newValue) => {
    if (playerRef.current && duration > 0) {
      const seekTime = (newValue / 100) * duration;
      playerRef.current.seekTo(seekTime);
      setCurrentTime(seekTime);
    }
  };

  const handleSeekToTime = (time) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time);
      setCurrentTime(time);
    }
  };

  // Set up progress tracking
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        handleProgress();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Configuración del player optimizada para redes locales
  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      // No incluir origin para evitar bloqueos de CORS en red local
      ...(window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
        ? { origin: window.location.origin }
        : {}),
    },
  };

  return {
    // Estado
    isPlaying,
    currentTime,
    duration,
    isExpanded,
    setIsExpanded,
    progressPercentage,
    playerRef,
    opts,

    // Funciones
    formatTime,
    handleReady,
    handleStateChange,
    togglePlayPause,
    handleSeek,
    handleSeekToTime,
  };
};

export default useAudioPlayer;
