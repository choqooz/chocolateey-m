import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip.jsx';
import {
  Play,
  Pause,
  Shuffle,
  Repeat,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import VolumeControl from './VolumeControl';

const PlayerControls = ({
  isPlaying,
  isShuffled,
  repeatMode,
  togglePlayPause,
  toggleShuffle,
  toggleRepeat,
  volumeProps,
  compact = false,
}) => {
  const buttonSize = compact ? 'sm' : 'sm';
  const playButtonSize = compact ? 'default' : 'lg';
  const iconSize = compact ? 'w-3 h-3' : 'w-4 h-4';
  const playIconSize = compact ? 'w-5 h-5' : 'w-6 h-6';
  const gap = compact ? 'gap-2' : 'gap-4';

  return (
    <div className={`flex items-center justify-center ${gap}`}>
      {/* Shuffle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={buttonSize}
              variant="outline"
              className={`${
                isShuffled
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                  : 'bg-slate-800/50 border-slate-600/50 text-slate-300'
              } hover:scale-110 transition-all duration-300 ${
                compact ? 'h-8 w-8 p-0' : ''
              }`}
              onClick={toggleShuffle}>
              <Shuffle className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mandale shuffle, wacho</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Previous */}
      <Button
        size={buttonSize}
        variant="outline"
        className={`bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-110 transition-all duration-300 ${
          compact ? 'h-8 w-8 p-0' : ''
        }`}
        onClick={() => {
          // Anterior canción - funcionalidad pendiente
        }}>
        <SkipBack className={iconSize} />
      </Button>

      {/* Play/Pause */}
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          size={playButtonSize}
          className={`bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white rounded-full shadow-lg shadow-slate-900/25 ${
            compact ? 'h-10 w-10 p-0' : 'p-4'
          }`}
          onClick={togglePlayPause}>
          {isPlaying ? (
            <Pause className={playIconSize} />
          ) : (
            <Play className={playIconSize} />
          )}
        </Button>
      </motion.div>

      {/* Next */}
      <Button
        size={buttonSize}
        variant="outline"
        className={`bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-110 transition-all duration-300 ${
          compact ? 'h-8 w-8 p-0' : ''
        }`}
        onClick={() => {
          // Siguiente canción - funcionalidad pendiente
        }}>
        <SkipForward className={iconSize} />
      </Button>

      {/* Repeat */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={buttonSize}
              variant="outline"
              className={`${
                repeatMode !== 'off'
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                  : 'bg-slate-800/50 border-slate-600/50 text-slate-300'
              } hover:scale-110 transition-all duration-300 relative ${
                compact ? 'h-8 w-8 p-0' : ''
              }`}
              onClick={toggleRepeat}>
              <Repeat className={iconSize} />
              {repeatMode === 'one' && (
                <span
                  className={`absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center ${
                    compact ? 'w-3 h-3 text-[10px]' : 'w-3 h-3'
                  }`}>
                  1
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Modo repetir:{' '}
              {repeatMode === 'off'
                ? 'Nada che'
                : repeatMode === 'one'
                ? 'Solo esta, boludo'
                : 'Todo el mambo'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Volume Control */}
      <VolumeControl {...volumeProps} compact={compact} />
    </div>
  );
};

export default PlayerControls;
