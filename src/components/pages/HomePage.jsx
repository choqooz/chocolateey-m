import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HomePageSkeleton from '../loading/HomePageSkeleton';
import { Button } from '../ui/button.jsx';
import { Card, CardContent } from '../ui/card.jsx';
import {
  Play,
  Heart,
  MoreHorizontal,
  Music2,
  Headphones,
  TrendingUp,
  Clock,
  Shuffle,
} from 'lucide-react';
import usePlayerStore from '../../stores/playerStore';
import useSearchStore from '../../stores/searchStore';

const HomePage = () => {
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const performSearch = useSearchStore((state) => state.performSearch);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Datos de ejemplo para la demo
  const featuredPlaylists = [
    {
      id: 1,
      title: 'Tu Mix Diario',
      description: 'Se actualiza todos los días con música que te gusta',
      color: 'from-purple-600 to-pink-600',
      tracks: 'Mix personal',
    },
    {
      id: 2,
      title: 'Descubrir Semanal',
      description: "Tu mezcla semanal de música nueva pa' descubrir",
      color: 'from-green-600 to-emerald-600',
      tracks: '30 temas',
    },
    {
      id: 3,
      title: 'Lo Nuevo que Sale',
      description: 'Fijate en los nuevos lanzamientos',
      color: 'from-blue-600 to-cyan-600',
      tracks: '50+ temas',
    },
  ];

  const recentlyPlayed = [
    { name: 'Blinding Lights', artist: 'The Weeknd', image: '1' },
    { name: 'Levitating', artist: 'Dua Lipa', image: '2' },
    { name: 'Good 4 U', artist: 'Olivia Rodrigo', image: '3' },
    { name: 'Stay', artist: 'The Kid LAROI, Justin Bieber', image: '4' },
    { name: 'Industry Baby', artist: 'Lil Nas X, Jack Harlow', image: '5' },
    { name: 'Heat Waves', artist: 'Glass Animals', image: '6' },
  ];

  const quickSearchTerms = [
    'Cumbia',
    'Sertanejo',
    'Rock Nacional',
    'MPB',
    'Reggaeton',
    'Funk Carioca',
    'Hip Hop',
    'Electrónica',
    'Tango',
    'Bossa Nova',
    'Cuarteto',
    'Trap',
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'bom dia irmão';
    if (hour < 18) return 'boa tarde, boludo';
    return 'boa noite manitoo';
  };

  const PlaylistCard = ({ playlist }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group">
      <Card className="bg-slate-800/50 hover:bg-slate-800/70 border-slate-700/50 overflow-hidden cursor-pointer transition-all duration-300">
        <CardContent className="p-0">
          <div className={`h-40 bg-gradient-to-br ${playlist.color} relative`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-bold text-white text-lg mb-1">
                {playlist.title}
              </h3>
              <p className="text-white/80 text-sm">{playlist.tracks}</p>
            </div>
            <Button
              size="sm"
              className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Play className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4">
            <p className="text-slate-400 text-sm">{playlist.description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const QuickPlayCard = ({ song, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group">
      <Card className="bg-slate-800/30 hover:bg-slate-800/50 border-slate-700/30 overflow-hidden cursor-pointer transition-all duration-200">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div
              className={`w-16 h-16 bg-gradient-to-br ${
                index % 3 === 0
                  ? 'from-purple-500 to-pink-500'
                  : index % 3 === 1
                    ? 'from-blue-500 to-cyan-500'
                    : 'from-green-500 to-emerald-500'
              } flex items-center justify-center`}>
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 p-3">
              <h4 className="font-medium text-white text-sm truncate">
                {song.name}
              </h4>
              <p className="text-slate-400 text-xs truncate">{song.artist}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="m-2 p-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Content - Exactamente como Sidebar */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent main-scrollbar">
        <div className="p-6 space-y-4 pb-6 md:pb-24">
          {/* Greeting Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white">{greeting()}</h1>
            <p className="text-slate-400">
              dejá de escuchar los mismos temas, escuchá lo nuevo
            </p>
          </motion.div>

          {/* Quick Play Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Lo que escuchaste
              </h2>
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-white">
                Ver todo
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentlyPlayed.map((song, index) => (
                <QuickPlayCard key={index} song={song} index={index} />
              ))}
            </div>
          </section>

          {/* Featured Playlists */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Hecho pa' vos</h2>
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-white">
                Ver todo
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </section>

          {/* Quick Search */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Explorar Estilos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {quickSearchTerms.map((term, index) => (
                <motion.div
                  key={term}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => performSearch(term)}
                    className="w-full h-12 bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:from-slate-600 hover:to-slate-700 text-white">
                    {term}
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Actions Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 cursor-pointer transition-all duration-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Shuffle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Poné Todo</h3>
                    <p className="text-slate-400 text-sm">Música aleatoria</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 cursor-pointer transition-all duration-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Tendencias</h3>
                    <p className="text-slate-400 text-sm">
                      Lo que está pegando
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 cursor-pointer transition-all duration-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Favoritas</h3>
                    <p className="text-slate-400 text-sm">Tus favoritas</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 cursor-pointer transition-all duration-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Recientes</h3>
                    <p className="text-slate-400 text-sm">
                      Las últimas que oíste
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
