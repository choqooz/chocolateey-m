import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import './AudioPlayer.css';
import { Card, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip.jsx';
import { Skeleton } from './ui/skeleton.jsx';
import LyricsSync from './LyricsSync.jsx';
import ProgressBar from './audio/ProgressBar';
import PlayerControls from './audio/PlayerControls';
import {
  Play,
  Pause,
  X,
  Music,
  FileText,
  Heart,
  Share,
  Maximize2,
  Minimize2,
  User,
  Disc3,
} from 'lucide-react';

// Hooks and Stores
import useAudioPlayer from '../hooks/useAudioPlayer';
import useVolumeControl from '../hooks/useVolumeControl';
import usePlayerControls from '../hooks/usePlayerControls';
import usePlayerStore from '../stores/playerStore';
import useUIStore from '../stores/uiStore';

const AudioPlayer = () => {
  // Get current song from store
  const {
    currentSong: song,
    isExpanded,
    setIsExpanded,
    closeSong,
    imageLoaded,
    setImageLoaded,
    persistentLyricsState,
    updateLyricsState,
    getLyricsState,
  } = usePlayerStore();

  // If no song, don't render
  if (!song) return null;

  // Custom hooks
  const audioPlayer = useAudioPlayer(song);
  const volumeControl = useVolumeControl(audioPlayer.playerRef);
  const playerControls = usePlayerControls(song);

  const getArtistName = (artist) => {
    if (!artist) return 'Artista desconhecido';
    if (typeof artist === 'string') return artist;
    if (typeof artist === 'object' && artist.name) return artist.name;
    return 'Artista desconhecido';
  };

  const getOptimizedThumbnail = (videoId) => {
    const maxresUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    return { src: maxresUrl, fallback: fallbackUrl };
  };

  // Manejar estado persistente de letras
  const handleLyricsStateChange = useCallback(
    (newState) => {
      updateLyricsState(song.videoId, newState);
    },
    [song.videoId, updateLyricsState]
  );

  const getCurrentLyricsState = () => {
    return getLyricsState(song.videoId);
  };

  const playerVariants = {
    collapsed: {
      height: 'auto',
      transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] },
    },
    expanded: {
      height: 'auto',
      transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] },
    },
  };

  const contentVariants = {
    collapsed: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    expanded: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeInOut', delay: 0.1 },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="relative">
      {/* Hidden YouTube player */}
      <div style={{ display: 'none' }}>
        <YouTube
          videoId={song.videoId}
          opts={audioPlayer.opts}
          onReady={audioPlayer.handleReady}
          onStateChange={audioPlayer.handleStateChange}
        />
      </div>

      {isExpanded ? (
        // Expanded Player View (Modal)
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <Card className="bg-slate-900 border-slate-700">
              <ExpandedPlayerView
                song={song}
                audioPlayer={audioPlayer}
                volumeControl={volumeControl}
                playerControls={playerControls}
                imageLoaded={imageLoaded}
                setImageLoaded={setImageLoaded}
                getArtistName={getArtistName}
                getOptimizedThumbnail={getOptimizedThumbnail}
                onClose={closeSong}
                getCurrentLyricsState={getCurrentLyricsState}
                handleLyricsStateChange={handleLyricsStateChange}
                contentVariants={contentVariants}
                headerVariants={headerVariants}
              />
            </Card>
          </motion.div>
        </motion.div>
      ) : (
        // Collapsed Player View (Bottom Bar) - Posición fija en la parte inferior
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md px-4">
          <CollapsedPlayerView
            song={song}
            audioPlayer={audioPlayer}
            playerControls={playerControls}
            getArtistName={getArtistName}
            getOptimizedThumbnail={getOptimizedThumbnail}
            onClose={closeSong}
            contentVariants={contentVariants}
          />
        </div>
      )}
    </div>
  );
};

// Componente de vista expandida
const ExpandedPlayerView = ({
  song,
  audioPlayer,
  volumeControl,
  playerControls,
  imageLoaded,
  setImageLoaded,
  getArtistName,
  getOptimizedThumbnail,
  onClose,
  getCurrentLyricsState,
  handleLyricsStateChange,
  contentVariants,
  headerVariants,
}) => {
  const setIsExpanded = usePlayerStore((state) => state.setIsExpanded);
  const isMobile = useUIStore((state) => state.isMobile);

  return (
    <motion.div
      className="p-6"
      variants={contentVariants}
      animate="expanded"
      initial="collapsed">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Reproductor</h3>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  className="text-slate-400 hover:text-purple-400 hover:bg-purple-500/20">
                  <Minimize2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Contraer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-500/20">
                  <X className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cerrar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Song Info & Controls */}
        <div className="space-y-6">
          {/* Song Info & Artwork */}
          <div className="flex items-start gap-6">
            {/* Artwork */}
            <motion.div
              className="relative w-32 h-32 rounded-xl overflow-hidden shadow-2xl flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}>
              {!imageLoaded && (
                <Skeleton className="w-full h-full bg-slate-800" />
              )}
              {song.videoId ? (
                <img
                  src={getOptimizedThumbnail(song.videoId).src}
                  alt={song.name}
                  crossOrigin="anonymous"
                  className={`w-full h-full transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    if (
                      e.target.src !==
                      getOptimizedThumbnail(song.videoId).fallback
                    ) {
                      e.target.src = getOptimizedThumbnail(
                        song.videoId
                      ).fallback;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                  <Music className="w-12 h-12 text-purple-400" />
                </div>
              )}
            </motion.div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 ">
                <Music className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                <h2 className="text-2xl font-bold text-white line-clamp-2">
                  {song.name}
                </h2>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <p className="text-lg text-slate-400">
                  {getArtistName(song.artist)}
                </p>
              </div>
              {song.album && (
                <div className="flex items-center gap-2">
                  <Disc3 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <p className="text-sm text-slate-500">
                    {typeof song.album === 'string'
                      ? song.album
                      : song.album?.name || 'Álbum desconocido'}
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center gap-3 mt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`${
                          playerControls.isLiked
                            ? 'bg-red-500/20 border-red-500/50 text-red-400'
                            : 'bg-slate-800/50 border-slate-600/50 text-slate-300'
                        } hover:scale-110 transition-all duration-200 ${
                          isMobile ? 'h-10 w-10 p-0' : ''
                        }`}
                        onClick={playerControls.toggleLike}>
                        <Heart
                          className={`w-4 h-4 ${!isMobile ? 'mr-2' : ''} ${
                            playerControls.isLiked ? 'fill-current' : ''
                          } transition-all duration-200`}
                        />
                        {!isMobile && 'Me gusta'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p> este me gustó 🔥</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        animate={
                          playerControls.isSharing
                            ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                            : {}
                        }
                        transition={{ duration: 0.6 }}>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={playerControls.isSharing}
                          className={`transition-all duration-200 hover:scale-110 ${
                            playerControls.isSharing
                              ? 'bg-green-500/20 border-green-500/50 text-green-400'
                              : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400'
                          } ${isMobile ? 'h-10 w-10 p-0' : ''}`}
                          onClick={playerControls.handleShare}>
                          <Share
                            className={`w-4 h-4 ${!isMobile ? 'mr-2' : ''} transition-all duration-200 ${
                              playerControls.isSharing ? 'scale-110' : ''
                            }`}
                          />
                          {!isMobile &&
                            (playerControls.isSharing
                              ? 'Copiando...'
                              : 'Compartir')}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {playerControls.isSharing
                          ? '📋 Copiando...'
                          : 'Compartir'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <ProgressBar
              currentTime={audioPlayer.currentTime}
              duration={audioPlayer.duration}
              progressPercentage={audioPlayer.progressPercentage}
              handleSeek={audioPlayer.handleSeek}
              formatTime={audioPlayer.formatTime}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center">
            <PlayerControls
              isPlaying={audioPlayer.isPlaying}
              isShuffled={playerControls.isShuffled}
              repeatMode={playerControls.repeatMode}
              togglePlayPause={audioPlayer.togglePlayPause}
              toggleShuffle={playerControls.toggleShuffle}
              toggleRepeat={playerControls.toggleRepeat}
              compact={false}
              volumeProps={{
                volume: volumeControl.volume,
                isMuted: volumeControl.isMuted,
                showVolumeControl: volumeControl.showVolumeControl,
                volumeControlPosition: volumeControl.volumeControlPosition,
                setShowVolumeControl: volumeControl.setShowVolumeControl,
                toggleMute: volumeControl.toggleMute,
                handleVolumeClick: volumeControl.handleVolumeClick,
                handleVolumeSliderClick: volumeControl.handleVolumeSliderClick,
              }}
            />
          </div>
        </div>

        {/* Right Column - Lyrics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" />
            <span className="text-lg font-semibold text-white">Letras</span>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-4 h-[500px] overflow-hidden">
            <LyricsSync
              song={song}
              currentTime={audioPlayer.currentTime}
              isPlaying={audioPlayer.isPlaying}
              onSeek={audioPlayer.handleSeekToTime}
              playerRef={audioPlayer.playerRef}
              persistentState={getCurrentLyricsState()}
              onStateChange={handleLyricsStateChange}
              compact={false}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente de vista colapsada
const CollapsedPlayerView = ({
  song,
  audioPlayer,
  playerControls,
  getArtistName,
  getOptimizedThumbnail,
  onClose,
  contentVariants,
}) => {
  const setIsExpanded = usePlayerStore((state) => state.setIsExpanded);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl w-full px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Song Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <motion.div
            className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-600/50 shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            {song.videoId ? (
              <img
                src={getOptimizedThumbnail(song.videoId).src}
                alt={song.name}
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (
                    e.target.src !==
                    getOptimizedThumbnail(song.videoId).fallback
                  ) {
                    e.target.src = getOptimizedThumbnail(song.videoId).fallback;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500/60 to-pink-500/60 flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>

          <div className="min-w-0 flex-1" onClick={() => setIsExpanded(true)}>
            <h3 className="text-white font-semibold truncate text-sm cursor-pointer hover:text-purple-300 transition-colors">
              {song.name}
            </h3>
            <p className="text-slate-400 text-xs truncate">
              {getArtistName(song.artist)}
            </p>
          </div>
        </div>

        {/* Controles centralizados */}
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="ghost"
              className={`${
                playerControls.isLiked
                  ? 'text-red-400 hover:bg-red-500/20'
                  : 'text-slate-400 hover:text-red-400 hover:bg-red-500/20'
              } transition-all duration-200 w-8 h-8 p-0 rounded-full`}
              onClick={playerControls.toggleLike}>
              <Heart
                className={`w-3.5 h-3.5 transition-all duration-200 ${
                  playerControls.isLiked ? 'fill-current scale-110' : ''
                }`}
              />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              className="bg-white/90 hover:bg-white text-black rounded-full w-8 h-8 p-0 shadow-lg"
              onClick={audioPlayer.togglePlayPause}>
              {audioPlayer.isPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" />
              )}
            </Button>
          </motion.div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(true)}
            className="text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 transition-all duration-200 w-8 h-8 p-0 rounded-full">
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-all duration-200 w-8 h-8 p-0 rounded-full">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Progress Bar compacta */}
      <div className="mt-3 px-1">
        <ProgressBar
          currentTime={audioPlayer.currentTime}
          duration={audioPlayer.duration}
          progressPercentage={audioPlayer.progressPercentage}
          handleSeek={audioPlayer.handleSeek}
          formatTime={audioPlayer.formatTime}
          compact={true}
        />
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
