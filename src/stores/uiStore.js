import { create } from 'zustand';

const useUIStore = create((set, get) => ({
  // Estado de la UI
  sidebarCollapsed: false,
  currentView: 'home', // 'home', 'search', 'library', 'playlists'
  theme: 'dark',

  // Modales y overlays
  showSongModal: false,
  showSettingsModal: false,
  showCreatePlaylistModal: false,

  // Layout responsivo
  isMobile: false,
  screenWidth: window.innerWidth,

  // Navigation
  navigationHistory: ['home'],
  currentNavigationIndex: 0,

  // Actions
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setCurrentView: (view) =>
    set((state) => {
      const newHistory = state.navigationHistory.slice(
        0,
        state.currentNavigationIndex + 1
      );
      newHistory.push(view);
      return {
        currentView: view,
        navigationHistory: newHistory,
        currentNavigationIndex: newHistory.length - 1,
      };
    }),

  goBack: () =>
    set((state) => {
      if (state.currentNavigationIndex > 0) {
        const newIndex = state.currentNavigationIndex - 1;
        return {
          currentNavigationIndex: newIndex,
          currentView: state.navigationHistory[newIndex],
        };
      }
      return state;
    }),

  goForward: () =>
    set((state) => {
      if (state.currentNavigationIndex < state.navigationHistory.length - 1) {
        const newIndex = state.currentNavigationIndex + 1;
        return {
          currentNavigationIndex: newIndex,
          currentView: state.navigationHistory[newIndex],
        };
      }
      return state;
    }),

  setTheme: (theme) => set({ theme }),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),

  setShowSongModal: (show) => set({ showSongModal: show }),

  setShowSettingsModal: (show) => set({ showSettingsModal: show }),

  setShowCreatePlaylistModal: (show) => set({ showCreatePlaylistModal: show }),

  setIsMobile: (isMobile) => set({ isMobile }),

  setScreenWidth: (width) => set({ screenWidth: width, isMobile: width < 768 }),

  // Navigation helpers
  canGoBack: () => get().currentNavigationIndex > 0,

  canGoForward: () =>
    get().currentNavigationIndex < get().navigationHistory.length - 1,
}));

// Listen for window resize
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    useUIStore.getState().setScreenWidth(window.innerWidth);
  });

  // Set initial mobile state
  useUIStore.getState().setScreenWidth(window.innerWidth);
}

export default useUIStore;
