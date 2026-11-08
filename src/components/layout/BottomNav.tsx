import React from 'react';
import { sounds } from '../../utils/soundEffects';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home', label: 'Bosh sahifa', icon: '🏠', color: 'text-amber-600' },
    { id: 'games', label: 'O\'yinlar', icon: '🎮', color: 'text-emerald-600' },
    { id: 'math', label: 'Matematika', icon: '📐', color: 'text-indigo-600' },
    { id: 'shop', label: 'Do\'kon', icon: '🎁', color: 'text-rose-600' },
    { id: 'profile', label: 'Profil', icon: '👤', color: 'text-purple-600' }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-amber-200 shadow-xl px-2 py-1.5 md:hidden">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive =
            activeTab === tab.id ||
            (tab.id === 'math' && (activeTab === 'riddles' || activeTab === 'quizzes'));

          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-100 text-slate-900 font-black scale-105 shadow-xs'
                  : 'text-slate-600 font-bold hover:text-slate-900'
              }`}
            >
              <span className="text-2xl leading-none">{tab.icon}</span>
              <span className="text-[10px] mt-1 tracking-tight whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
