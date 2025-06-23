import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const usePlayerStore = create(
  subscribeWithSelector((set, get) => ({
    // Estado del reproductor
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 50,
    isMuted: false,
    isExpanded: false,

    // Estados de control
    isShuffled: false,
    repeatMode: 'off', // 'off', 'one', 'all'
    isLiked: false,

    // Sistema de favoritos persistente - ahora guarda canciones completas
    likedSongs: new Map(), // Map<videoId, songObject>

    // Control de volumen
    showVolumeControl: false,
    volumeControlPosition: { x: 0, y: 0 },

    // Estados de UI
    imageLoaded: false,
    persistentLyricsState: {},

    // Actions
    setCurrentSong: (song) => {
      const { likedSongs } = get();
      set({
        currentSong: song,
        imageLoaded: false,
        isLiked: song?.videoId ? likedSongs.has(song.videoId) : false,
      });
    },

    setIsPlaying: (isPlaying) => set({ isPlaying }),

    setCurrentTime: (currentTime) => set({ currentTime }),

    setDuration: (duration) => set({ duration }),

    setVolume: (volume) => set({ volume }),

    setIsMuted: (isMuted) => set({ isMuted }),

    setIsExpanded: (isExpanded) => set({ isExpanded }),

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

    toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),

    toggleRepeat: () =>
      set((state) => {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(state.repeatMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        return { repeatMode: nextMode };
      }),

    // Nuevo sistema de favoritos - guarda canciones completas
    toggleLike: (song) => {
      if (!song?.videoId) return;

      set((state) => {
        const newLikedSongs = new Map(state.likedSongs);
        const wasLiked = newLikedSongs.has(song.videoId);

        if (wasLiked) {
          newLikedSongs.delete(song.videoId);
        } else {
          // Guardar la canción completa
          newLikedSongs.set(song.videoId, song);
        }

        // Solo actualizar isLiked si es la canción actual
        const shouldUpdateIsLiked = state.currentSong?.videoId === song.videoId;

        return {
          likedSongs: newLikedSongs,
          ...(shouldUpdateIsLiked && { isLiked: !wasLiked }),
        };
      });
    },

    // Verificar si una canción está en favoritos
    isSongLiked: (videoId) => {
      if (!videoId) return false;
      const { likedSongs } = get();
      return likedSongs.has(videoId);
    },

    // Obtener todas las canciones favoritas como array
    getLikedSongsArray: () => {
      const { likedSongs } = get();
      return Array.from(likedSongs.values());
    },

    setShowVolumeControl: (show) => set({ showVolumeControl: show }),

    setVolumeControlPosition: (position) =>
      set({ volumeControlPosition: position }),

    setImageLoaded: (loaded) => set({ imageLoaded: loaded }),

    updateLyricsState: (videoId, newState) =>
      set((state) => ({
        persistentLyricsState: {
          ...state.persistentLyricsState,
          [videoId]: newState,
        },
      })),

    getLyricsState: (videoId) => get().persistentLyricsState[videoId] || {},

    closeSong: () =>
      set({
        currentSong: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        isExpanded: false,
        imageLoaded: false,
      }),

    // Computed values
    getProgressPercentage: () => {
      const { currentTime, duration } = get();
      return duration > 0 ? (currentTime / duration) * 100 : 0;
    },
  }))
);

export default usePlayerStore;
