import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button.jsx';
import { Volume2, VolumeX, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip.jsx';

const VolumeControl = ({
  volume,
  isMuted,
  showVolumeControl,
  volumeControlPosition,
  setShowVolumeControl,
  toggleMute,
  handleVolumeClick,
  handleVolumeSliderClick,
  compact = false,
}) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const buttonSize = compact ? 'sm' : 'sm';
  const iconSize = compact ? 'w-3 h-3' : 'w-4 h-4';

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateVolume(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateVolume(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateVolume = (e) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = Math.max(0, Math.min(100, (x / width) * 100));

    // Crear un evento sintético para mantener compatibilidad
    const syntheticEvent = {
      target: sliderRef.current,
      clientX: e.clientX,
      currentTarget: sliderRef.current,
    };

    handleVolumeSliderClick(syntheticEvent, newVolume);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <>
      {/* Volume Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-volume-control
              size={buttonSize}
              variant="outline"
              className={`${
                showVolumeControl
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : 'bg-slate-800/50 border-slate-600/50 text-slate-300'
              } hover:scale-110 transition-all duration-300 ${
                compact ? 'h-8 w-8 p-0' : ''
              }`}
              onClick={handleVolumeClick}>
              {isMuted ? (
                <VolumeX className={iconSize} />
              ) : (
                <Volume2 className={iconSize} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Control de volumen ({volume}%)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Volume Control Popup */}
      <AnimatePresence>
        {showVolumeControl && (
          <motion.div
            data-volume-control
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed z-[9999] flex flex-col gap-4 p-4 bg-slate-800/95 backdrop-blur-lg rounded-xl border border-slate-700/50 shadow-2xl min-w-[280px]"
            style={{
              left: Math.max(
                10,
                Math.min(volumeControlPosition.x - 140, window.innerWidth - 300)
              ),
              top: volumeControlPosition.y - 120,
            }}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleMute}
                  className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200">
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <span className="text-white font-medium">Volumen</span>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowVolumeControl(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">0%</span>
                <span className="text-white font-medium text-lg">
                  {Math.round(volume)}%
                </span>
                <span className="text-slate-400">100%</span>
              </div>

              <div
                ref={sliderRef}
                className="relative h-8 bg-slate-700 rounded-full cursor-pointer group hover:bg-slate-600 transition-colors duration-200"
                onMouseDown={handleMouseDown}
                onClick={updateVolume}>
                {/* Track */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-150"
                    style={{ width: `${volume}%` }}></div>
                </div>

                {/* Thumb */}
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-blue-500 transition-all duration-150 group-hover:scale-110"
                  style={{
                    left: `calc(${volume}% - 12px)`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                  }}>
                  <div className="absolute inset-1 bg-blue-500 rounded-full"></div>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-1 -bottom-1 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>

              {/* Quick volume presets */}
              <div className="flex justify-between">
                {[25, 50, 75, 100].map((preset) => (
                  <Button
                    key={preset}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleVolumeSliderClick(null, preset)}
                    className="text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 h-6 px-2">
                    {preset}%
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VolumeControl;
