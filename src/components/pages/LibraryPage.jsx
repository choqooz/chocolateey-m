import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Music2, Heart, Clock, Plus } from 'lucide-react';

const LibraryPage = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Content - Exactamente como Sidebar */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <div className="p-6 space-y-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Sua biblioteca</h1>
            <p className="text-slate-400">Gerencia sua coleção de música</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 cursor-pointer transition-all duration-200">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Músicas que você curte
                  </h3>
                  <p className="text-slate-400">0 músicas</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 cursor-pointer transition-all duration-200">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Tocadas recentemente
                  </h3>
                  <p className="text-slate-400">Histórico vazio</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 cursor-pointer transition-all duration-200">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Criar playlist
                  </h3>
                  <p className="text-slate-400">Nova lista de reprodução</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center py-12">
            <div className="text-slate-400 space-y-4">
              <Music2 className="w-16 h-16 mx-auto text-slate-600" />
              <h2 className="text-xl font-semibold">Sua biblioteca tá vazia</h2>
              <p>Começa a explorar música pra encher sua biblioteca</p>
              <Button className="mt-4">Explorar música</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
