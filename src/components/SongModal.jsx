import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SongModal.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Separator } from './ui/separator.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx';
import { ScrollArea } from './ui/scroll-area.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { Skeleton } from './ui/skeleton.jsx';
import { toast } from 'sonner';
import {
  X,
  Music,
  Users,
  Disc3,
  Clock,
  FileText,
  ExternalLink,
  AlertCircle,
  Play,
  Share,
  Heart,
  Download,
  Calendar,
  Tag,
  BarChart3,
  Sparkles,
  Copy,
  Eye,
  Star,
} from 'lucide-react';

const SongModal = ({ song, onClose }) => {
  // Use song directly instead of extracting from data
  const songDetails = song;
  const lyrics = null; // Lyrics will be handled separately
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

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

  const getThumbnailUrl = (videoId, type = 'maxres') => {
    if (!videoId) return null;

    const thumbnailTypes = {
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };

    return thumbnailTypes[type] || thumbnailTypes.medium;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(
      isLiked ? 'Removido dos favoritos' : 'Adicionado aos favoritos!'
    );
  };

  const handleShare = () => {
    if (songDetails?.videoId) {
      const url = `https://music.youtube.com/watch?v=${songDetails.videoId}`;
      if (navigator.share) {
        navigator.share({
          title: songDetails.name || 'Música',
          text: `Escuta ${songDetails.name} no YouTube Music`,
          url: url,
        });
      } else {
        navigator.clipboard.writeText(url);
        toast.success('Link copiado pra área de transferência!');
      }
    }
  };

  const handleCopyVideoId = () => {
    if (songDetails?.videoId) {
      navigator.clipboard.writeText(songDetails.videoId);
      toast.success('Video ID copiado pra área de transferência');
    }
  };

  const formatLyrics = (lyricsText) => {
    if (!lyricsText) return [];

    let text = lyricsText;
    if (Array.isArray(lyricsText)) {
      text = lyricsText.join('\n');
    }

    // Clean up the lyrics text
    text = text.replace(/\["|"\]/g, '').replace(/",\s*"/g, '\n');

    return text.split('\n').map((line, index) => ({
      id: index,
      text: line.trim(),
      isEmpty: line.trim() === '',
    }));
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900/95 backdrop-blur-xl border-slate-700/50 p-0 overflow-hidden">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
            <div className="flex items-center gap-4">
              {/* Song Image */}
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-purple-500/30">
                  <AvatarImage
                    src={getThumbnailUrl(songDetails?.videoId)}
                    alt={songDetails?.name}
                    onLoad={() => setImageLoaded(true)}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600">
                    <Music className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                {imageLoaded && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Eye className="w-3 h-3 text-white" />
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-bold text-white truncate">
                  {songDetails?.name || 'Detalhes da música'}
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-lg">
                  {songDetails
                    ? getArtistName(songDetails.artist)
                    : 'Informação detalhada'}
                </DialogDescription>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="bg-purple-950/50 text-purple-300 border-purple-600/30">
                    <Music className="w-3 h-3 mr-1" />
                    Música
                  </Badge>
                  {songDetails?.duration && (
                    <Badge
                      variant="outline"
                      className="bg-slate-800/50 text-slate-300 border-slate-600/50">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(songDetails.duration)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className={`${
                    isLiked
                      ? 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'bg-slate-800/50 border-slate-600/50 text-slate-300'
                  } hover:scale-110 transition-all duration-300`}
                  onClick={handleLike}>
                  <Heart
                    className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
                  />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 hover:scale-110 transition-all duration-300"
                  onClick={handleShare}>
                  <Share className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-green-500/20 hover:border-green-500/50 hover:text-green-400 hover:scale-110 transition-all duration-300"
                  onClick={() =>
                    toast.info('guarda no te va a perseguir la gorra, botón')
                  }>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 m-4 mb-0">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-purple-600">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  La posta
                </TabsTrigger>
                <TabsTrigger
                  value="lyrics"
                  className="data-[state=active]:bg-purple-600">
                  <FileText className="w-4 h-4 mr-2" />
                  La letra
                </TabsTrigger>
                <TabsTrigger
                  value="info"
                  className="data-[state=active]:bg-purple-600">
                  <Tag className="w-4 h-4 mr-2" />
                  Info técnica
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="details" className="h-full m-4 mt-4">
                  <ScrollArea className="h-full">
                    {songDetails ? (
                      <motion.div
                        className="space-y-6"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.1,
                            },
                          },
                        }}>
                        {/* Main Info Card */}
                        <motion.div variants={itemVariants}>
                          <Card className="bg-slate-800/30 border-slate-700/50">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-white">
                                <Music className="w-5 h-5 text-purple-400" />
                                Data del tema
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <span className="text-slate-400 text-sm">
                                      Título:
                                    </span>
                                    <span className="text-white font-medium">
                                      {songDetails.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-slate-400 text-sm">
                                      Pibe/Mina:
                                    </span>
                                    <span className="text-white font-medium">
                                      {getArtistName(songDetails.artist)}
                                    </span>
                                  </div>

                                  {getAlbumName(songDetails.album) && (
                                    <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                      <span className="text-slate-400 text-sm">
                                        Disco:
                                      </span>
                                      <span className="text-white font-medium">
                                        {getAlbumName(songDetails.album)}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  {songDetails.duration && (
                                    <div className="flex items-center gap-3">
                                      <Clock className="w-4 h-4 text-orange-400" />
                                      <span className="text-slate-400 text-sm">
                                        Cuánto dura:
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="bg-orange-950/50 text-orange-300 border-orange-600/30">
                                        {formatDuration(songDetails.duration)}
                                      </Badge>
                                    </div>
                                  )}

                                  {songDetails.year && (
                                    <div className="flex items-center gap-3">
                                      <Calendar className="w-4 h-4 text-pink-400" />
                                      <span className="text-slate-400 text-sm">
                                        De cuándo es:
                                      </span>
                                      <span className="text-white font-medium">
                                        {songDetails.year}
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-3">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="text-slate-400 text-sm">
                                      Qué tan piola:
                                    </span>
                                    <div className="flex gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-3 h-3 ${
                                            i < 4
                                              ? 'text-yellow-400 fill-current'
                                              : 'text-slate-600'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div variants={itemVariants}>
                          <Card className="bg-slate-800/30 border-slate-700/50">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-white">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                                Qué podés hacer
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Button
                                  variant="outline"
                                  className="bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30"
                                  onClick={() =>
                                    toast.info('Dale que ya viene!')
                                  }>
                                  <Play className="w-4 h-4 mr-2" />
                                  Mandale wacho
                                </Button>

                                <Button
                                  variant="outline"
                                  className="bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
                                  onClick={() => setActiveTab('lyrics')}>
                                  <FileText className="w-4 h-4 mr-2" />
                                  Ver la letra
                                </Button>

                                <Button
                                  variant="outline"
                                  className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30"
                                  onClick={() =>
                                    toast.info('Radio viene ya, wacho!')
                                  }>
                                  <Music className="w-4 h-4 mr-2" />
                                  Radio
                                </Button>

                                <Button
                                  variant="outline"
                                  className="bg-orange-500/20 border-orange-500/50 text-orange-300 hover:bg-orange-500/30"
                                  onClick={() =>
                                    toast.info('Playlist en camino, aguantá!')
                                  }>
                                  <Users className="w-4 h-4 mr-2" />
                                  Playlist
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}>
                        <div className="p-4 bg-red-500/20 rounded-full w-fit mx-auto mb-4">
                          <AlertCircle className="w-12 h-12 text-red-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          No hay nada pa' mostrar :c
                        </h3>
                        <p className="text-slate-400">
                          Se jodió todo, no sale nada
                        </p>
                      </motion.div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="lyrics" className="h-full m-4 mt-4">
                  <ScrollArea className="h-full">
                    {lyrics ? (
                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}>
                        <Card className="bg-slate-800/30 border-slate-700/50">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                              <FileText className="w-5 h-5 text-purple-400" />
                              La letra del tema
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-slate-900/50 rounded-xl p-6 max-h-96 overflow-y-auto">
                              <div className="space-y-3 text-slate-300 text-base leading-relaxed">
                                {formatLyrics(lyrics).map((line) => (
                                  <motion.p
                                    key={line.id}
                                    className={`${
                                      line.isEmpty
                                        ? 'h-6'
                                        : 'hover:text-white transition-colors duration-200 cursor-pointer p-2 rounded hover:bg-slate-800/50'
                                    }`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: line.id * 0.02 }}>
                                    {line.text}
                                  </motion.p>
                                ))}
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-slate-800/50 border-slate-600/50 text-slate-300"
                                onClick={() => {
                                  navigator.clipboard.writeText(lyrics);
                                  toast.success('Letra copiada, wacho!');
                                }}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copiar letra
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}>
                        <div className="p-4 bg-blue-500/20 rounded-full w-fit mx-auto mb-4">
                          <FileText className="w-12 h-12 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          No hay letra, wacho
                        </h3>
                        <p className="text-slate-400">
                          Este tema no tiene letra, boludo
                        </p>
                      </motion.div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="info" className="h-full m-4 mt-4">
                  <ScrollArea className="h-full">
                    <motion.div
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}>
                      <Card className="bg-slate-800/30 border-slate-700/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Tag className="w-5 h-5 text-purple-400" />
                            Data técnica
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {songDetails?.videoId && (
                            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <ExternalLink className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-400 text-sm">
                                  Video ID:
                                </span>
                                <code className="text-slate-300 font-mono text-sm bg-slate-800 px-2 py-1 rounded">
                                  {songDetails.videoId}
                                </code>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-slate-800/50 border-slate-600/50 text-slate-300"
                                onClick={handleCopyVideoId}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-900/50 rounded-lg">
                              <div className="text-slate-400 text-sm mb-1">
                                Qué onda con esto
                              </div>
                              <div className="text-white font-medium">
                                Música pura
                              </div>
                            </div>

                            <div className="p-3 bg-slate-900/50 rounded-lg">
                              <div className="text-slate-400 text-sm mb-1">
                                De dónde sale
                              </div>
                              <div className="text-white font-medium">
                                YouTube Music
                              </div>
                            </div>

                            <div className="p-3 bg-slate-900/50 rounded-lg">
                              <div className="text-slate-400 text-sm mb-1">
                                Cómo suena
                              </div>
                              <div className="text-white font-medium">
                                Re piola
                              </div>
                            </div>

                            <div className="p-3 bg-slate-900/50 rounded-lg">
                              <div className="text-slate-400 text-sm mb-1">
                                Si anda o no
                              </div>
                              <div className="text-green-400 font-medium">
                                ✓ Va como piña
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SongModal;
