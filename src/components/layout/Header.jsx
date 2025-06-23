import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
  Settings,
  Bell,
  Download,
  X,
  LogOut,
  UserIcon,
  Heart,
  Clock,
} from 'lucide-react';
import SearchInput from '../SearchInput';
import useUIStore from '../../stores/uiStore';
import useSearchStore from '../../stores/searchStore';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, isMobile } = useUIStore();
  const { performSearch, results, searchQuery } = useSearchStore();
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Refs for search inputs
  const mobileSearchRef = useRef(null);
  const headerSearchRef = useRef(null);

  const getViewTitle = () => {
    switch (location.pathname) {
      case '/':
        return '¿que escuchamos?';
      case '/search':
        return ''; // No mostrar título en búsqueda
      case '/library':
        return 'Mis temas';
      case '/trending':
        return 'Lo que está sonando';
      case '/radio':
        return 'Radio';
      case '/podcasts':
        return 'Podcasts';
      case '/new-releases':
        return 'Lo nuevo que salió';
      case '/liked-songs':
        return 'Mis favoritas';
      case '/recently-played':
        return 'Lo que escuché';
      case '/downloaded':
        return 'Bajadas';
      case '/create-playlist':
        return 'Crear Playlist';
      default:
        return 'chocolateey';
    }
  };

  const handleSearch = (query) => {
    performSearch(query);
    navigate('/search');
    setShowSearch(false);
    setSearchFocused(false);
  };

  const handleOpenMobileSearch = () => {
    setShowSearch(true);
    setSearchFocused(true);
    // Focus the input after the animation
    setTimeout(() => {
      if (mobileSearchRef.current) {
        mobileSearchRef.current.focus();
      }
    }, 150);
  };

  // Detectar si estamos en la página de búsqueda con resultados
  const showSearchInHeader =
    location.pathname === '/search' && results.length > 0 && isMobile;

  // Decidir si mostrar el título (no en búsqueda, no cuando search está focused en home)
  const shouldShowTitle =
    !showSearchInHeader &&
    getViewTitle() &&
    !(location.pathname === '/' && searchFocused && isMobile);

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-lg border-b border-slate-800/50 flex items-center justify-between px-4 gap-4">
      {/* Left Section - Navigation */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button - SIEMPRE VISIBLE en móvil */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-800">
            <Menu className="w-5 h-5" />
          </Button>
        )}

        {/* Navigation buttons - Using browser navigation */}
        {!showSearchInHeader && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="p-2 hover:bg-slate-800">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.forward()}
              className="p-2 hover:bg-slate-800">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Page title */}
        {shouldShowTitle && (
          <motion.h1
            key={location.pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-xl font-bold text-white">
            {getViewTitle()}
          </motion.h1>
        )}
      </div>

      {/* Center Section - Search */}
      {/* Desktop Search - SIEMPRE VISIBLE */}
      {!isMobile && (
        <div className="flex-1 max-w-md">
          <SearchInput
            ref={headerSearchRef}
            onSearch={handleSearch}
            placeholder="Escribí nomás que sale wachooooo"
          />
        </div>
      )}

      {/* Mobile Search when there are results */}
      {showSearchInHeader && (
        <div className="flex-1">
          <SearchInput
            ref={headerSearchRef}
            onSearch={handleSearch}
            placeholder="Escribí nomás que sale wachooooo"
            defaultValue={searchQuery}
          />
        </div>
      )}

      {/* Mobile Search Toggle (when no results) */}
      {isMobile && !showSearchInHeader && (
        <>
          {!showSearch ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenMobileSearch}
              className="p-2 hover:bg-slate-800">
              <Search className="w-5 h-5" />
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex items-center gap-2">
              <div className="flex-1">
                <SearchInput
                  ref={mobileSearchRef}
                  onSearch={handleSearch}
                  placeholder="Escribí nomás que sale wachooooo"
                  autoFocus={true}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSearch(false);
                  setSearchFocused(false);
                }}
                className="p-2 hover:bg-slate-800">
                <X className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </>
      )}

      {/* Right Section - User controls */}
      {!showSearch && (
        <div className="flex items-center gap-2">
          {/* Desktop: Show all buttons */}
          {!isMobile && (
            <>
              {/* Download indicator */}
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-slate-800 relative">
                <Download className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-slate-800 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* Settings */}
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-slate-800">
                <Settings className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* User profile with dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="p-1 hover:bg-slate-800 rounded-full">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </Button>

            {/* Mobile User Dropdown */}
            {showUserDropdown && isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-slate-800/95 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-xl z-[9999]">
                <div className="p-2">
                  <div className="flex items-center gap-3 p-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Usuario</p>
                      <p className="text-slate-400 text-sm">Gratis</p>
                    </div>
                  </div>

                  <hr className="border-slate-700 mb-2" />

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:bg-slate-700"
                    onClick={() => {
                      navigate('/liked-songs');
                      setShowUserDropdown(false);
                    }}>
                    <Heart className="w-4 h-4" />
                    Mis favoritas
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:bg-slate-700"
                    onClick={() => {
                      navigate('/recently-played');
                      setShowUserDropdown(false);
                    }}>
                    <Clock className="w-4 h-4" />
                    Lo que escuché
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:bg-slate-700"
                    onClick={() => {
                      navigate('/downloaded');
                      setShowUserDropdown(false);
                    }}>
                    <Download className="w-4 h-4" />
                    Bajadas
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:bg-slate-700">
                    <Bell className="w-4 h-4" />
                    Notificaciones
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:bg-slate-700">
                    <Settings className="w-4 h-4" />
                    Configuración
                  </Button>

                  <hr className="border-slate-700 my-2" />

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-400 hover:bg-slate-700">
                    <LogOut className="w-4 h-4" />
                    Salir
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Desktop User Dropdown (simple) */}
            {showUserDropdown && !isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-40 bg-slate-800/95 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-xl z-[9999]">
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:bg-slate-700">
                    <UserIcon className="w-4 h-4" />
                    Perfil
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-400 hover:bg-slate-700">
                    <LogOut className="w-4 h-4" />
                    Salir
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;
