import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

const TrendingPage = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Content - Exactamente como Sidebar */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <div className="p-6 space-y-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-white">
              Tendencias da Hora
            </h1>
            <p className="text-slate-400">Descobre o que tá bombando agora</p>
          </motion.div>

          <div className="text-center py-12">
            <div className="text-slate-400 space-y-4">
              <TrendingUp className="w-16 h-16 mx-auto text-slate-600" />
              <h2 className="text-xl font-semibold">Em Breve</h2>
              <p>As tendências musicais vão estar disponíveis logo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingPage
