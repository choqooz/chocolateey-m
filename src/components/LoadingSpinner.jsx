import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoadingSpinner.css';
import { Card, CardContent } from './ui/card.jsx';
import {
  Music,
  Search,
  Radio,
  Disc3,
  Headphones,
  Sparkles,
  Zap,
  Activity,
} from 'lucide-react';

const LoadingSpinner = ({
  message = 'Procurando música...',
  variant = 'search',
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const loadingMessages = [
    'Procurando música...',
    'Explorando YouTube Music...',
    'Encontrando músicas...',
    'Preparando resultados...',
    'Quase pronto!',
  ];

  const variants = {
    search: {
      icon: Search,
      color: 'from-purple-400 to-pink-400',
      bgColor: 'from-purple-900/20 to-pink-900/20',
    },
    music: {
      icon: Music,
      color: 'from-blue-400 to-purple-400',
      bgColor: 'from-blue-900/20 to-purple-900/20',
    },
    radio: {
      icon: Radio,
      color: 'from-green-400 to-blue-400',
      bgColor: 'from-green-900/20 to-blue-900/20',
    },
    disc: {
      icon: Disc3,
      color: 'from-orange-400 to-red-400',
      bgColor: 'from-orange-900/20 to-red-900/20',
    },
  };

  const currentVariant = variants[variant] || variants.search;
  const IconComponent = currentVariant.icon;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
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
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-center">
      <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-purple-500/10 max-w-md w-full mx-4">
        <CardContent className="flex flex-col items-center justify-center py-16 px-8">
          {/* Main Loading Animation */}
          <motion.div className="relative mb-8" variants={itemVariants}>
            {/* Background Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${currentVariant.bgColor} rounded-full blur-xl scale-150 opacity-50`}
            />

            {/* Rotating Border */}
            <motion.div
              className={`w-24 h-24 rounded-full bg-gradient-to-r ${currentVariant.color} p-1`}
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                ease: 'linear',
                repeat: Infinity,
              }}>
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center relative overflow-hidden">
                {/* Inner glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${currentVariant.bgColor} opacity-30`}
                />

                {/* Main Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }}
                  className="relative z-10">
                  <IconComponent
                    className={`w-10 h-10 text-transparent bg-gradient-to-r ${currentVariant.color} bg-clip-text`}
                  />
                </motion.div>

                {/* Floating sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${20 + i * 10}%`,
                      left: `${15 + i * 12}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180],
                    }}
                    transition={{
                      delay: i * 0.3,
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop',
                    }}>
                    <Sparkles className="w-2 h-2 text-purple-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Orbit Dots */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                style={{
                  top: '50%',
                  left: '50%',
                  originX: 0.5,
                  originY: 0.5,
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  rotate: {
                    duration: 4,
                    ease: 'linear',
                    repeat: Infinity,
                  },
                  scale: {
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: i * 0.2,
                  },
                }}
                transformTemplate={({ rotate }) =>
                  `translate(-50%, -50%) translateX(60px) rotate(${rotate}deg)`
                }
              />
            ))}
          </motion.div>

          {/* Loading Message */}
          <motion.div className="text-center space-y-4" variants={itemVariants}>
            <AnimatePresence mode="wait">
              <motion.h3
                key={currentMessage}
                className="text-xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}>
                {loadingMessages[currentMessage]}
              </motion.h3>
            </AnimatePresence>

            <p className="text-slate-400 text-sm">
              Isso pode demorar uns segundos...
            </p>
          </motion.div>

          {/* Progress Dots */}
          <motion.div className="flex space-x-2 mt-6" variants={itemVariants}>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentVariant.color}`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* Wave Animation */}
          <motion.div
            className="flex items-end gap-1 mt-6"
            variants={itemVariants}>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-1 bg-gradient-to-t ${currentVariant.color} rounded-full`}
                animate={{
                  height: [4, 20, 4],
                }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            className="flex gap-4 mt-8 opacity-40"
            variants={itemVariants}>
            {[Music, Headphones, Activity, Zap].map((Icon, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: i * 0.3,
                }}>
                <Icon className="w-5 h-5 text-slate-500" />
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoadingSpinner;
