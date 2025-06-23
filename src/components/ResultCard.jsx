import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ResultCard.css';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip.jsx';
import { Skeleton } from './ui/skeleton.jsx';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './ui/hover-card.jsx';
import { toast } from 'sonner';
import usePlayerStore from '../stores/playerStore.js';
import {
  Play,
  Music,
  Users,
  Disc3,
  Clock,
  Calendar,
  Heart,
  Share,
  MoreVertical,
  PlayCircle,
  Star,
  ExternalLink,
} from 'lucide-react';

const ResultCard = ({ result, searchType, index, onSongSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Sistema de favoritos del store - suscripción reactiva
  const toggleLikeInStore = usePlayerStore((state) => state.toggleLike);
  const likedSongs = usePlayerStore((state) => state.likedSongs);
  const isLiked = result?.videoId ? likedSongs.has(result.videoId) : false;

  // Debug logging to see the result structure
  console.log('ResultCard render:', { result, searchType, index });

  const getArtistName = (artist) => {
    if (!artist) return 'Artista desconhecido';

    if (typeof artist === 'string') {
      return artist;
    } else if (typeof artist === 'object' && artist.name) {
      return artist.name;
    }

    return 'Artista desconhecido';
  };

  const getAlbumName = (album) => {
    if (!album) return null;

    if (typeof album === 'string') {
      return album;
    } else if (typeof album === 'object' && album.name) {
      return album.name;
    }

    return null;
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return null;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getThumbnailUrl = (videoId, type = 'medium') => {
    if (!videoId) return null;

    // YouTube thumbnail URLs
    const thumbnailTypes = {
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };

    return thumbnailTypes[type] || thumbnailTypes.medium;
  };

  const handleCardClick = () => {
    if (searchType === 'songs' && result.type === 'SONG') {
      onSongSelect(result);
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(
      '🔥 Handle Like clicked for:',
      result?.videoId,
      'Current liked state:',
      isLiked
    );

    if (result?.videoId) {
      toggleLikeInStore(result);
      toast.success(
        isLiked ? '💔 Removido de favoritos' : '❤️ ¡Agregado a favoritos!',
        {
          description: result.name,
        }
      );
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('📋 Handle Share clicked for:', result?.videoId);

    if (!result?.videoId || isSharing) return;

    setIsSharing(true);

    try {
      const url = `https://music.youtube.com/watch?v=${result.videoId}`;
      const shareData = {
        title: result.name || 'Música',
        text: `Escucha ${result.name} en YouTube Music`,
        url: url,
      };

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        toast.success('🚀 ¡Compartido exitosamente!');
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('📋 ¡Enlace copiado al portapapeles!', {
          description: 'Ya podés pegarlo donde quieras',
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('❌ Error al compartir', {
          description: 'Intentá de nuevo',
        });
      }
    } finally {
      // Delay para mostrar la animación
      setTimeout(() => {
        console.log('📋 Resetting isSharing state');
        setIsSharing(false);
      }, 1000);
    }
  };

  // Ensure we have a valid result object
  if (!result || typeof result !== 'object') {
    console.error('Invalid result object:', result);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}>
        <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
          <CardContent className="text-center py-6">
            <p className="text-slate-400">Resultado inválido</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  };

  const renderCardContent = () => {
    switch (searchType) {
      case 'songs':
        if (result.type === 'SONG') {
          const artistName = getArtistName(result.artist);
          const albumName = getAlbumName(result.album);
          const duration = formatDuration(result.duration);
          const songName = result.name || 'Canción sin nombre';
          const thumbnailUrl = getThumbnailUrl(result.videoId, 'medium');

          return (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="h-full">
              <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group overflow-hidden shadow-2xl shadow-purple-500/5 hover:shadow-purple-500/20 h-full">
                <div className="relative">
                  {/* Thumbnail Section */}
                  <div className="relative h-48 overflow-hidden">
                    {!imageError && thumbnailUrl ? (
                      <>
                        {!imageLoaded && (
                          <Skeleton className="w-full h-full bg-slate-800" />
                        )}
                        <motion.img
                          src={thumbnailUrl}
                          alt={songName}
                          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                          onLoad={() => setImageLoaded(true)}
                          onError={() => {
                            setImageError(true);
                            setImageLoaded(true);
                          }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-900/20 via-slate-800 to-pink-900/20 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear',
                          }}>
                          <Music className="w-16 h-16 text-purple-400/60" />
                        </motion.div>
                      </div>
                    )}

                    {/* Overlay with duration */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      {duration && (
                        <motion.div
                          className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-sm px-2 py-1 rounded-lg border border-white/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {duration}
                        </motion.div>
                      )}
                    </div>

                    {/* Play button overlay */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}>
                      <Button
                        size="lg"
                        className="bg-purple-600/90 hover:bg-purple-700 text-white rounded-full p-4 backdrop-blur-sm border border-white/20 shadow-2xl"
                        onClick={handleCardClick}>
                        <PlayCircle className="w-8 h-8" />
                      </Button>
                    </motion.div>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className="bg-purple-950/50 text-purple-300 border-purple-600/30 text-xs px-2 py-1">
                            <Music className="w-3 h-3 mr-1" />
                            Canción
                          </Badge>
                        </div>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CardTitle className="text-white text-lg font-bold line-clamp-2 group-hover:text-purple-200 transition-colors cursor-pointer">
                                {songName}
                              </CardTitle>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{songName}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div className="space-y-1 mt-2">
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <div className="flex items-center gap-2 cursor-pointer hover:text-purple-300 transition-colors">
                                <Users className="w-4 h-4 text-purple-400" />
                                <span className="text-slate-300 text-sm font-medium truncate">
                                  {artistName}
                                </span>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80 bg-slate-900/95 backdrop-blur-xl border-slate-700">
                              <div className="flex items-center space-x-4">
                                <Avatar>
                                  <AvatarFallback className="bg-purple-600">
                                    <Users className="w-4 h-4" />
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="text-sm font-semibold text-white">
                                    {artistName}
                                  </h4>
                                  <p className="text-sm text-slate-400">
                                    Artista
                                  </p>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>

                          {albumName && (
                            <div className="flex items-center gap-2">
                              <Disc3 className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-400 text-sm truncate">
                                {albumName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 group/btn"
                          onClick={handleCardClick}>
                          <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                          Escuchar
                        </Button>
                      </motion.div>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              whileTap={{ scale: 0.95 }}
                              whileHover={{ scale: 1.05 }}>
                              <Button
                                size="sm"
                                variant="outline"
                                className={`transition-all duration-300 ${
                                  isLiked
                                    ? 'bg-red-500/20 border-red-500/50 text-red-400'
                                    : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400'
                                }`}
                                onClick={handleLike}>
                                <Heart
                                  className={`w-4 h-4 transition-all duration-200 ${
                                    isLiked ? 'fill-current scale-110' : ''
                                  }`}
                                />
                              </Button>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>este me gustó 🔥</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              whileTap={{ scale: 0.95 }}
                              whileHover={{ scale: 1.05 }}
                              animate={
                                isSharing
                                  ? {
                                      scale: [1, 1.1, 1],
                                      rotate: [0, 5, -5, 0],
                                    }
                                  : {}
                              }
                              transition={{ duration: 0.6 }}>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isSharing}
                                className={`transition-all duration-300 ${
                                  isSharing
                                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                    : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400'
                                }`}
                                onClick={handleShare}>
                                <Share
                                  className={`w-4 h-4 transition-all duration-200 ${
                                    isSharing ? 'scale-110' : ''
                                  }`}
                                />
                              </Button>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {isSharing ? '📋 Copiando...' : 'Mandá el tema'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          );
        }
        break;

      case 'artists':
        if (result.type === 'ARTIST') {
          const artistName = result.name || 'Artista sin nombre';
          const artistId = result.artistId || 'N/A';

          return (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="h-full">
              <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 group shadow-2xl shadow-purple-500/5 hover:shadow-purple-500/20 h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}>
                    <Avatar className="w-24 h-24 mx-auto border-4 border-purple-500/20 group-hover:border-purple-500/50 transition-all duration-300">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-bold">
                        <Users className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  <div>
                    <Badge
                      variant="outline"
                      className="bg-purple-950/50 text-purple-300 border-purple-600/30 mb-3">
                      <Users className="w-3 h-3 mr-1" />
                      Artista
                    </Badge>

                    <CardTitle className="text-white text-xl font-bold group-hover:text-purple-200 transition-colors">
                      {artistName}
                    </CardTitle>

                    <div className="text-slate-400 text-sm mt-2 space-y-1">
                      <p>Artista de YouTube Music</p>
                      <p className="text-xs opacity-70">ID: {artistId}</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-300 transition-all duration-300"
                    onClick={() => toast.info('aguanta que ahi viene')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver el disco
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        }
        break;

      case 'albums':
        if (result.type === 'ALBUM') {
          const artistName = getArtistName(result.artist);
          const albumName = result.name || 'Álbum sin nombre';
          const albumId = result.albumId || 'N/A';
          const year = result.year || null;

          return (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="h-full">
              <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 group shadow-2xl shadow-purple-500/5 hover:shadow-purple-500/20 h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ duration: 0.2 }}
                      className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-900/30 via-slate-800 to-pink-900/30 rounded-xl flex items-center justify-center border-4 border-purple-500/20 group-hover:border-purple-500/50 transition-all duration-300">
                      <Disc3 className="w-12 h-12 text-purple-400" />
                    </motion.div>
                  </div>

                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-purple-950/50 text-purple-300 border-purple-600/30 mb-3">
                      <Disc3 className="w-3 h-3 mr-1" />
                      Álbum
                    </Badge>

                    <CardTitle className="text-white text-lg font-bold line-clamp-2 group-hover:text-purple-200 transition-colors">
                      {albumName}
                    </CardTitle>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-300 text-sm font-medium">
                        {artistName}
                      </span>
                    </div>
                    {year && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400 text-sm">{year}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-300 transition-all duration-300"
                    onClick={() => toast.info('aguanta que ahi viene')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver el disco
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        }
        break;

      default:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
              <CardContent className="text-center py-6">
                <p className="text-slate-400">Resultado no reconocido</p>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  return renderCardContent();
};

export default ResultCard;
