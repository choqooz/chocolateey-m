import React from 'react';
import { motion } from 'framer-motion';
import ResultsSection from '../ResultsSection';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import SearchResultsSkeleton from '../loading/SearchResultsSkeleton';
import useSearchStore from '../../stores/searchStore';
import usePlayerStore from '../../stores/playerStore';

const SearchPage = () => {
  const {
    searchQuery,
    searchType,
    results,
    loading,
    error,
    performSearch,
    setSelectedSong,
  } = useSearchStore();

  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);

  const handleSongSelect = (song) => {
    setCurrentSong(song);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Content - Exactamente como Sidebar */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent main-scrollbar">
        <div className="p-6 space-y-6 pb-6 md:pb-24">
          {/* Search Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 text-center">
            {searchQuery && (
              <>
                <p className="text-slate-400">Resultados para</p>
                <strong>"{searchQuery}"</strong>
              </>
            )}
          </motion.div>

          {/* Content */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SearchResultsSkeleton />
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}>
              <ErrorMessage message={error} />
            </motion.div>
          )}

          {!loading && !error && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <ResultsSection
                results={results}
                searchType={searchType}
                searchQuery={searchQuery}
                onSongSelect={handleSongSelect}
              />
            </motion.div>
          )}

          {!loading && !error && results.length === 0 && searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12">
              <div className="text-slate-400 space-y-2">
                <p className="text-lg">
                  Não encontrei nada para "{searchQuery}"
                </p>
                <p className="text-sm">Tenta com outras palavras, mano</p>
              </div>
            </motion.div>
          )}

          {!loading && !error && results.length === 0 && !searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12">
              <div className="text-slate-400 space-y-4">
                <h2 className="text-xl font-semibold">
                  Encontra sua música favorita
                </h2>
                <p>
                  Usa a barra de busca de cima pra procurar suas músicas,
                  artistas, álbuns e muito mais!
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
