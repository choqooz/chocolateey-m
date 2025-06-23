import { useState } from 'react';
import { toast } from 'sonner';
import usePlayerStore from '../stores/playerStore';

const usePlayerControls = (song) => {
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'one', 'all'
  const [isSharing, setIsSharing] = useState(false);

  // Usar el sistema de favoritos del store - suscripción reactiva
  const toggleLikeInStore = usePlayerStore((state) => state.toggleLike);
  const likedSongs = usePlayerStore((state) => state.likedSongs);
  const isLiked = song?.videoId ? likedSongs.has(song.videoId) : false;

  const toggleLike = () => {
    if (song?.videoId) {
      console.log(
        '🔥 AudioPlayer Like clicked for:',
        song.videoId,
        'Current liked state:',
        isLiked
      );
      toggleLikeInStore(song); // Pasar la canción completa
      toast.success(
        isLiked ? '💔 Removido de favoritos' : '❤️ ¡Agregado a favoritos!',
        {
          description: song.name,
        }
      );
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const handleShare = async () => {
    if (!song?.videoId) return;

    setIsSharing(true);

    try {
      const url = `https://music.youtube.com/watch?v=${song.videoId}`;
      const shareData = {
        title: song.name,
        text: `Escucha ${song.name} por ${song.artist?.name || song.artist}`,
        url: url,
      };

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        toast.success('🚀 ¡Compartido exitosamente!');
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('📋 ¡Enlace copiado al portapapeles!', {
          description: 'Ya podés pegarlo donde quieras',
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('❌ Error al compartir', {
          description: 'Intentá de nuevo',
        });
      }
    } finally {
      // Delay para mostrar la animación
      setTimeout(() => setIsSharing(false), 1000);
    }
  };

  return {
    isLiked,
    isShuffled,
    repeatMode,
    isSharing,
    toggleLike,
    toggleShuffle,
    toggleRepeat,
    handleShare,
  };
};

export default usePlayerControls;
