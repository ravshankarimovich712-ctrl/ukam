import React from 'react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/soundEffects';
import { Volume2, VolumeX, Coins, ShieldCheck, Flame } from 'lucide-react';

export const Navbar: React.FC<{ activeTab: string; onSelectTab: (tab: string) => void }> = ({
  activeTab,
  onSelectTab
}) => {
  const { profile, soundEnabled, setSoundEnabled } = useApp();

  const handleToggleSound = () => {
    sounds.playClick();
    setSoundEnabled(!soundEnabled);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => { sounds.playClick(); onSelectTab('home'); }}
          className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-xl shadow-md border-2 border-white">
            🤖
          </div>
          <div>
            <span className="font-black text-slate-900 text-base md:text-lg tracking-tight leading-none block">
              UKAMNI BILIMLI QILAMIZ
            </span>
            <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase block">
              Bolalar Ta'lim O'yini
            </span>
          </div>
        </button>

        {/* Zone 2: Desktop clean nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-black text-slate-600">
          <button
            onClick={() => { sounds.playClick(); onSelectTab('home'); }}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'home' ? 'text-amber-600' : 'hover:text-slate-900'
            }`}
          >
            Bosh sahifa
          </button>
          <button
            onClick={() => { sounds.playClick(); onSelectTab('math'); }}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'math' ? 'text-amber-600' : 'hover:text-slate-900'
            }`}
          >
            Matematika
          </button>
          <button
            onClick={() => { sounds.playClick(); onSelectTab('games'); }}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'games' ? 'text-amber-600' : 'hover:text-slate-900'
            }`}
          >
            Sim & O'yinlar
          </button>
          <button
            onClick={() => { sounds.playClick(); onSelectTab('riddles'); }}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'riddles' ? 'text-amber-600' : 'hover:text-slate-900'
            }`}
          >
            Topishmoqlar
          </button>
          <button
            onClick={() => { sounds.playClick(); onSelectTab('quizzes'); }}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'quizzes' ? 'text-amber-600' : 'hover:text-slate-900'
            }`}
          >
            Testlar
          </button>
        </nav>

        {/* Zone 3: Interactive primary controls (Coins, Sound, Streak) */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Streak indicator */}
          <div className="hidden sm:flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1.5 rounded-xl border border-rose-200 text-xs font-black">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{profile.streakDays}</span>
          </div>

          {/* Coin balance button (clicking leads to shop) */}
          <button
            onClick={() => { sounds.playClick(); onSelectTab('shop'); }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 active:scale-95 text-slate-950 font-black px-3 py-1.5 rounded-xl shadow-sm border border-yellow-200 text-xs md:text-sm cursor-pointer transition-all"
            title="Do'konga o'tish"
          >
            <span className="text-base animate-bounce">🪙</span>
            <span>{profile.coins.toLocaleString()}</span>
          </button>

          {/* Sound toggle button */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl transition-all border cursor-pointer ${
              soundEnabled
                ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={soundEnabled ? 'Ovozni o\'chirish' : 'Ovozni yoqish'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
