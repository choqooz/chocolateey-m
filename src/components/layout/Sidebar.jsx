import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button.jsx';
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Download,
  Clock,
  Music2,
  Headphones,
  TrendingUp,
  Radio,
  Mic2,
  ChevronRight,
  Menu,
} from 'lucide-react';
import useUIStore from '../../stores/uiStore';
import usePlayerStore from '../../stores/playerStore';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const isLiked = usePlayerStore((state) => state.isLiked);

  const navigationItems = [
    { id: 'home', label: 'Casa', icon: Home, path: '/' },
    { id: 'search', label: 'Buscar', icon: Search, path: '/search' },
    { id: 'library', label: 'Mi biblioteca', icon: Library, path: '/library' },
  ];

  const quickAccessItems = [
    {
      id: 'create-playlist',
      label: 'Crear lista',
      icon: Plus,
      path: '/create-playlist',
    },
    {
      id: 'liked-songs',
      label: 'Me gustan',
      icon: Heart,
      path: '/liked-songs',
    },
    { id: 'downloaded', label: 'Bajadas', icon: Download, path: '/downloaded' },
    {
      id: 'recently-played',
      label: 'Lo que escuché',
      icon: Clock,
      path: '/recently-played',
    },
  ];

  const discoverItems = [
    {
      id: 'trending',
      label: 'Lo que pega',
      icon: TrendingUp,
      path: '/trending',
    },
    { id: 'radio', label: 'Radio', icon: Radio, path: '/radio' },
    { id: 'podcasts', label: 'Podcasts', icon: Mic2, path: '/podcasts' },
    {
      id: 'new-releases',
      label: 'Lo nuevo',
      icon: Music2,
      path: '/new-releases',
    },
  ];

  const NavItem = ({ item, isActive, showLabel = true }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full">
      <Button
        variant="ghost"
        onClick={() => navigate(item.path)}
        className={`w-full justify-start gap-4 h-12 px-4 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-slate-800 text-white shadow-lg'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
        } ${!showLabel ? 'px-0 justify-center' : ''}`}>
        <item.icon
          className={`${showLabel ? 'w-5 h-5' : 'w-6 h-6'} flex-shrink-0`}
        />
        {showLabel && (
          <span className="font-medium truncate">{item.label}</span>
        )}
        {showLabel && item.id === 'liked-songs' && isLiked && (
          <div className="w-2 h-2 bg-green-500 rounded-full ml-auto flex-shrink-0" />
        )}
      </Button>
    </motion.div>
  );

  const SectionTitle = ({ title, showLabel = true }) => {
    if (!showLabel) return null;
    return (
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">
        {title}
      </h3>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-800">
            <Menu className="w-5 h-5" />
          </Button>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => navigate('/')}>
              <img
                src="/rhcp.png"
                alt="chocolateey logo"
                className="w-6 h-6 rounded-full"
              />
              <span className="font-bold text-lg">chocolateey</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto main-scrollbar">
        <div className="p-4 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={location.pathname === item.path}
                showLabel={!sidebarCollapsed}
              />
            ))}
          </div>

          {/* Quick Access */}
          <div className="space-y-2">
            <SectionTitle title="Acceso rápido" showLabel={!sidebarCollapsed} />
            {quickAccessItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={location.pathname === item.path}
                showLabel={!sidebarCollapsed}
              />
            ))}
          </div>

          {/* Discover */}
          <div className="space-y-2">
            <SectionTitle title="Descubrir" showLabel={!sidebarCollapsed} />
            {discoverItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={location.pathname === item.path}
                showLabel={!sidebarCollapsed}
              />
            ))}
          </div>

          {/* Made for you - Only show when expanded */}
          {!sidebarCollapsed && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-4">
                <SectionTitle title="para você macaco" showLabel={true} />
                <Button variant="ghost" size="sm" className="p-1">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                {['Mi Mix 1', 'Mi Mix 2', 'Descubrir Semanal'].map(
                  (playlist, index) => (
                    <Button
                      key={playlist}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-10 px-4 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg">
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                          index === 0
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                            : index === 1
                              ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                              : 'bg-gradient-to-br from-green-500 to-emerald-500'
                        }`}>
                        {index + 1}
                      </div>
                      <span className="truncate text-sm">{playlist}</span>
                    </Button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Only show when expanded */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 text-center">
            <div className="flex items-center gap-2 justify-center">
              <span>made with 💕</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <p clas>by</p>
              <span className="font-bold text-white">chocolate</span>
              <img
                src="/rhcp2.png"
                alt="chocolateey"
                className="w-4 h-4 rounded-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
