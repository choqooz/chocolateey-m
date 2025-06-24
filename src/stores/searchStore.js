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
      const searchUrl = `${API_BASE_URL}/api/search?query=${encodeURIComponent(
        query
      )}&type=${type}`;

      console.log('🔍 Frontend: Iniciando búsqueda...');
      console.log('🌐 Frontend: URL de búsqueda:', searchUrl);
      console.log('📝 Frontend: Query:', query);
      console.log('🎯 Frontend: Tipo:', type);
      console.log('🔧 Frontend: API_BASE_URL:', API_BASE_URL);
      console.log(
        '🔧 Frontend: Entorno:',
        import.meta.env.PROD ? 'PRODUCCIÓN' : 'DESARROLLO'
      );

      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Frontend: Respuesta recibida:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: {
          'content-type': response.headers.get('content-type'),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Frontend: Error en respuesta:', errorText);
        throw new Error(
          `Error ${response.status}: ${response.statusText} - ${errorText}`
        );
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error(
          '❌ Frontend: Respuesta no es JSON:',
          responseText.substring(0, 200)
        );
        throw new Error(
          'La respuesta del servidor no es JSON válido. Posible problema de configuración.'
        );
      }

      const data = await response.json();

      console.log('✅ Frontend: Datos recibidos:', {
        success: data.success,
        dataLength: data.data ? data.data.length : 0,
        hasError: !!data.error,
      });

      if (data.error) {
        throw new Error(data.error);
      }

      // El servidor devuelve {success: true, data: [...]}
      set({ results: data.data || data, loading: false });
    } catch (err) {
      console.error('❌ Frontend: Error en performSearch:', err);
      set({ error: err.message, results: [], loading: false });
    }
  },
}));

export default useSearchStore;
