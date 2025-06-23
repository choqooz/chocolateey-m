import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import LibraryPage from '../pages/LibraryPage';
import TrendingPage from '../pages/TrendingPage';
import LikedSongsPage from '../pages/LikedSongsPage';
import SongModal from '../SongModal';
import useSearchStore from '../../stores/searchStore';

// Componente para páginas "próximamente"
const ComingSoonPage = ({ title }) => (
  <div className="h-full flex flex-col">
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
      <div className="p-8 pb-24">
        <h2 className="text-2xl font-bold">{title} - Próximamente</h2>
      </div>
    </div>
  </div>
);

const MainContent = () => {
  const selectedSong = useSearchStore((state) => state.selectedSong);
  const setSelectedSong = useSearchStore((state) => state.setSelectedSong);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  };

  return (
    <div className="h-full bg-gradient-to-b from-slate-900/50 to-slate-950">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/radio" element={<ComingSoonPage title="Radio" />} />
        <Route path="/podcasts" element={<ComingSoonPage title="Podcasts" />} />
        <Route
          path="/new-releases"
          element={<ComingSoonPage title="Nuevos Lanzamientos" />}
        />
        <Route path="/liked-songs" element={<LikedSongsPage />} />
        <Route
          path="/recently-played"
          element={<ComingSoonPage title="Tocadas Recientemente" />}
        />
        <Route
          path="/downloaded"
          element={<ComingSoonPage title="Descargadas" />}
        />
        <Route
          path="/create-playlist"
          element={<ComingSoonPage title="Crear Playlist" />}
        />
      </Routes>

      {/* Song Modal */}
      <AnimatePresence>
        {selectedSong && (
          <SongModal
            song={selectedSong}
            onClose={() => setSelectedSong(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainContent;
