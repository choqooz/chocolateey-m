import { create } from 'zustand';

// Función para obtener la URL base del API
const getApiBaseUrl = () => {
  // En producción, usar rutas relativas (mismo dominio)
  if (import.meta.env.PROD) {
    return ''; // URLs relativas como /api/search
  }

  // En desarrollo, usar la IP del host actual si no es localhost
  if (import.meta.env.DEV) {
    const hostname = window.location.hostname;
    // Si estamos accediendo por IP (no localhost), usar esa IP para el API
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:3001`;
    }
    // Por defecto en desarrollo, usar localhost
    return 'http://localhost:3001';
  }

  // Fallback (no debería llegar aquí)
  return '';
};

const API_BASE_URL = getApiBaseUrl();

const useSearchStore = create((set, get) => ({
  // Estado de búsqueda
  searchQuery: '',
  searchType: 'songs',
  results: [],
  loading: false,
  error: null,
  selectedSong: null,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  setSearchType: (type) => set({ searchType: type }),

  setResults: (results) => set({ results }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setSelectedSong: (song) => set({ selectedSong: song }),

  clearError: () => set({ error: null }),

  clearResults: () => set({ results: [], searchQuery: '' }),

  // Async actions
  performSearch: async (query, type = 'songs') => {
    if (!query.trim()) return;

    set({ loading: true, error: null, searchQuery: query, searchType: type });

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search?query=${encodeURIComponent(
          query
        )}&type=${type}`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // El servidor devuelve {success: true, data: [...]}
      set({ results: data.data || data, loading: false });
    } catch (err) {
      set({ error: err.message, results: [], loading: false });
    }
  },
}));

export default useSearchStore;
