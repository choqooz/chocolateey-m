import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import MainContent from './MainContent'
import AudioPlayer from '../AudioPlayer'
import usePlayerStore from '../../stores/playerStore'
import useUIStore from '../../stores/uiStore'
import { useEffect } from 'react'

const MainLayout = () => {
  const currentSong = usePlayerStore((state) => state.currentSong)
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)
  const isMobile = useUIStore((state) => state.isMobile)

  // Actualizar título de la tab del navegador cuando cambia la canción
  useEffect(() => {
    if (currentSong) {
      const artistName =
        typeof currentSong.artist === 'string'
          ? currentSong.artist
          : currentSong.artist?.name || 'Artista desconhecido'
      document.title = `${currentSong.name} - ${artistName} | chocolateey`
    } else {
      document.title = 'chocolateey - 営たッ'
    }
  }, [currentSong])

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      {/* Main App Container */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        {!isMobile && (
          <motion.div
            initial={false}
            animate={{
              width: sidebarCollapsed ? 80 : 280,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-slate-900 border-r border-slate-800 flex-shrink-0"
          >
            <Sidebar />
          </motion.div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <Header />

          {/* Content */}
          <div className="flex-1 min-h-0">
            <MainContent />
          </div>
        </div>
      </div>

      {/* Audio Player - Flotante */}
      {currentSong && <AudioPlayer />}

      {/* Mobile sidebar overlay */}
      {isMobile && !sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => useUIStore.getState().setSidebarCollapsed(true)}
        >
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-80 h-full bg-slate-900 border-r border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default MainLayout
