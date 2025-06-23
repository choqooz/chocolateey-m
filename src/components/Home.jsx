import React from 'react';
import { motion } from 'framer-motion';
import SearchInput from './SearchInput';
import { Music2, Sparkles } from 'lucide-react';

const Home = ({ onSearch }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-32">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}>
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <div className="relative">
            <Music2 className="w-16 h-16 text-white/90" />
            <Sparkles className="w-6 h-6 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          Music Player
        </motion.h1>

        <motion.p
          className="text-slate-400 text-lg md:text-xl max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}>
          Descubre y reproduce tu música favorita
        </motion.p>
      </motion.div>

      <SearchInput onSearch={onSearch} />

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}>
        <p className="text-slate-500 text-sm">
          Presiona Enter o haz clic en buscar para comenzar
        </p>
      </motion.div>
    </div>
  );
};

export default Home;
