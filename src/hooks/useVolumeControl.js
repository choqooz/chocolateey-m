import { useState, useEffect } from 'react';

const useVolumeControl = (playerRef) => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [volumeControlPosition, setVolumeControlPosition] = useState({
    x: 0,
    y: 0,
  });

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const updateVolume = (newVolume) => {
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
      setVolume(newVolume);
    }
  };

  const handleVolumeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const controlHeight = 80;

    // Asegurar que las coordenadas están dentro de la ventana
    const x = Math.max(
      10,
      Math.min(rect.left + rect.width / 2, window.innerWidth - 110)
    );
    let y = rect.top - 10;

    // Si no hay espacio arriba, ponerlo abajo
    if (y - controlHeight < 10) {
      y = rect.bottom + 10;
    }

    setVolumeControlPosition({ x, y });
    setShowVolumeControl(!showVolumeControl);
  };

  const handleVolumeSliderClick = (e, directVolume = null) => {
    // Validar que el evento tenga preventDefault antes de usarlo
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }

    let newVolume;

    if (directVolume !== null) {
      // Si se pasa un volumen directo (desde botones preset)
      newVolume = directVolume;
    } else if (e && e.clientX !== undefined) {
      // Si es un click/drag normal y tiene clientX
      const rect = e.currentTarget?.getBoundingClientRect();
      if (rect) {
        const clickX = e.clientX - rect.left;
        newVolume = Math.round((clickX / rect.width) * 100);
      } else {
        return;
      }
    } else {
      return;
    }

    const clampedVolume = Math.max(0, Math.min(100, newVolume));
    updateVolume(clampedVolume);
  };

  // Set initial volume cuando el player está listo
  useEffect(() => {
    if (playerRef.current) {
      try {
        playerRef.current.setVolume(volume);
      } catch (error) {
        console.log('Player not ready for volume control yet');
      }
    }
  }, [volume, playerRef]);

  // Cerrar el control de volumen cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showVolumeControl && !event.target.closest('[data-volume-control]')) {
        setShowVolumeControl(false);
      }
    };

    if (showVolumeControl) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showVolumeControl]);

  return {
    volume,
    isMuted,
    showVolumeControl,
    volumeControlPosition,
    setShowVolumeControl,
    toggleMute,
    updateVolume,
    handleVolumeClick,
    handleVolumeSliderClick,
  };
};

export default useVolumeControl;
