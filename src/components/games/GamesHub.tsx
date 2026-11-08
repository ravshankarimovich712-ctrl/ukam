import React, { useState } from 'react';
import { WireGame } from './WireGame';
import { MemoryGame } from './MemoryGame';
import { SequenceGame } from './SequenceGame';
import { SortingGame } from './SortingGame';
import { MazeGame } from './MazeGame';
import { ShapesGame } from './ShapesGame';
import { Zap, Puzzle, ArrowRightLeft, Layers, Compass, Palette } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

type GameType = 'wires' | 'memory' | 'sequence' | 'sorting' | 'maze' | 'shapes';

export const GamesHub: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('wires');

  const games = [
    {
      id: 'wires' as GameType,
      title: 'Sim Ulash',
      desc: 'Lampochkani yoqing!',
      reward: '30-100 🪙',
      icon: '⚡',
      color: 'from-amber-400 to-orange-500',
      badge: 'Bosh o\'yin'
    },
    {
      id: 'memory' as GameType,
      title: 'Rasm Juftlash',
      desc: 'Xotira charxlash',
      reward: '30 🪙',
      icon: '🧩',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'sequence' as GameType,
      title: 'Ketma-ketlik',
      desc: 'Mantiqiy qatorlar',
      reward: '10 🪙',
      icon: '🔢',
      color: 'from-indigo-400 to-blue-500'
    },
    {
      id: 'sorting' as GameType,
      title: 'Tartibga Sol',
      desc: 'Kichikdan kattaga',
      reward: '15 🪙',
      icon: '📊',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'maze' as GameType,
      title: 'Labirint',
      desc: 'Yulduzgacha yo\'l',
      reward: '25-60 🪙',
      icon: '🌀',
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'shapes' as GameType,
      title: 'Shakllar',
      desc: 'Rang va geometriya',
      reward: '10 🪙',
      icon: '🎨',
      color: 'from-rose-400 to-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Horizontal Game Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {games.map((g) => {
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                sounds.playClick();
                setActiveGame(g.id);
              }}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl whitespace-nowrap transition-all border-2 shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r ' + g.color + ' text-white border-white shadow-lg scale-102 font-black'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 font-bold'
              }`}
            >
              <span className="text-xl">{g.icon}</span>
              <div className="text-left">
                <div className="text-sm leading-none">{g.title}</div>
                <div className={`text-[11px] mt-0.5 ${isActive ? 'text-white/90' : 'text-slate-600'}`}>{g.reward}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render active game */}
      <div>
        {activeGame === 'wires' && <WireGame />}
        {activeGame === 'memory' && <MemoryGame />}
        {activeGame === 'sequence' && <SequenceGame />}
        {activeGame === 'sorting' && <SortingGame />}
        {activeGame === 'maze' && <MazeGame />}
        {activeGame === 'shapes' && <ShapesGame />}
      </div>
    </div>
  );
};
