import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import {
  Heart,
  Music,
  Play,
  Clock,
  Users,
  Shuffle,
  PlayCircle,
  ListMusic,
} from 'lucide-react';
import usePlayerStore from '../../stores/playerStore.js';
import { toast } from 'sonner';

const LikedSongsPage = () => {
  const getLikedSongsArray = usePlayerStore(
    (state) => state.getLikedSongsArray
  );
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const toggleLike = usePlayerStore((state) => state.toggleLike);

  // Obtener array de canciones favoritas
  const likedSongs = getLikedSongsArray();

  const getArtistName = (artist) => {
    if (!artist) return 'Artista desconocido';
    if (typeof artist === 'string') return artist;
    if (typeof artist === 'object' && artist.name) return artist.name;
    return 'Artista desconocido';
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    toast.success('🎵 Reproduciendo canción', {
      description: song.name,
    });
  };

  const handlePlayAllLiked = () => {
    if (likedSongs.length > 0) {
      // Reproducir la primera canción de favoritos
      handlePlaySong(likedSongs[0]);
      toast.success('🎵 Reproduciendo favoritas', {
        description: `Empezando con: ${likedSongs[0].name}`,
      });
    }
  };

  const handleShufflePlay = () => {
    if (likedSongs.length > 0) {
      // Reproducir una canción aleatoria
      const randomIndex = Math.floor(Math.random() * likedSongs.length);
      const randomSong = likedSongs[randomIndex];
      handlePlaySong(randomSong);
      toast.success('🔀 Reproducción aleatoria', {
        description: `Reproduciendo: ${randomSong.name}`,
      });
    }
  };

  const handleRemoveFromLiked = (song) => {
    toggleLike(song);
    toast.success('💔 Removido de favoritos', {
      description: song.name,
    });
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <motion.div
      className="h-full flex flex-col"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.4, ease: 'easeOut' }}>
      <div className="flex-1 overflow-y-auto main-scrollbar">
        <div className="p-8 pb-24 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-6">
            <div className="w-48 h-48 bg-gradient-to-br from-red-500 via-pink-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Heart className="w-24 h-24 text-white fill-current" />
            </div>

            <div className="space-y-4">
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                <ListMusic className="w-3 h-3 mr-1" />
                Playlist
              </Badge>

              <h1 className="text-6xl font-bold text-white">Mis favoritas</h1>

              <div className="flex items-center gap-2 text-slate-400">
                <Users className="w-4 h-4" />
                <span>Tu música favorita</span>
                <span>•</span>
                <span>{likedSongs.length} canciones</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          {likedSongs.length > 0 && (
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 py-3 shadow-lg"
                onClick={handlePlayAllLiked}>
                <Play className="w-5 h-5 mr-2" />
                Reproducir todo
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 rounded-full px-6"
                onClick={handleShufflePlay}>
                <Shuffle className="w-5 h-5 mr-2" />
                Aleatorio
              </Button>
            </div>
          )}

          {/* Content */}
          {likedSongs.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-16 h-16 text-slate-500" />
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-2">
                No hay favoritas aún
              </h3>

              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Buscá música y tocá el corazón para agregar canciones a tus
                favoritas. Aparecerán aquí para que las tengas siempre a mano.
              </p>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => window.history.back()}>
                <Music className="w-4 h-4 mr-2" />
                Buscar música
              </Button>
            </div>
          ) : (
            /* Songs List */
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-slate-400 text-sm font-medium border-b border-slate-800">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Título</div>
                <div className="col-span-3">Artista</div>
                <div className="col-span-2">Duración</div>
                <div className="col-span-1"></div>
              </div>

              {likedSongs.map((song, index) => (
                <motion.div
                  key={song.videoId}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="group">
                  <Card className="bg-transparent hover:bg-slate-800/30 border-none transition-all duration-200 cursor-pointer">
                    <CardContent
                      className="p-4"
                      onClick={() => handlePlaySong(song)}>
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Index/Play Button */}
                        <div className="col-span-1">
                          <div className="w-8 h-8 flex items-center justify-center">
                            <span className="text-slate-400 group-hover:hidden">
                              {index + 1}
                            </span>
                            <PlayCircle className="w-5 h-5 text-white hidden group-hover:block" />
                          </div>
                        </div>

                        {/* Song Info */}
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-white font-medium line-clamp-1">
                              {song.name || `Canción #${index + 1}`}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {song.album?.name || 'Álbum desconocido'}
                            </div>
                          </div>
                        </div>

                        {/* Artist */}
                        <div className="col-span-3 text-slate-300">
                          {getArtistName(song.artist)}
                        </div>

                        {/* Duration */}
                        <div className="col-span-2 text-slate-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {formatDuration(song.duration)}
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromLiked(song);
                            }}>
                            <Heart className="w-4 h-4 fill-current" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LikedSongsPage;
