import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { HomeSection } from './components/home/HomeSection';
import { GamesHub } from './components/games/GamesHub';
import { MathSection } from './components/math/MathSection';
import { RiddleSection } from './components/riddles/RiddleSection';
import { QuizSection } from './components/quiz/QuizSection';
import { ShopSection } from './components/shop/ShopSection';
import { ProfileSection } from './components/profile/ProfileSection';
import { sounds } from './utils/soundEffects';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  // If inside Math / Riddles / Quizzes, offer top segmented navigation for study modes
  const isStudyMode = activeTab === 'math' || activeTab === 'riddles' || activeTab === 'quizzes';

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-900 flex flex-col selection:bg-amber-300">
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 pb-24 md:pb-12">
        {/* Study Mode Segmented Switcher */}
        {isStudyMode && (
          <div className="flex items-center justify-center gap-2 mb-6 max-w-md mx-auto p-1.5 bg-amber-100/70 rounded-2xl border-2 border-amber-200">
            <button
              onClick={() => { sounds.playClick(); setActiveTab('math'); }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'math'
                  ? 'bg-amber-400 text-slate-900 shadow-sm scale-102'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              📐 Matematika
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('riddles'); }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'riddles'
                  ? 'bg-amber-400 text-slate-900 shadow-sm scale-102'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              🤔 Topishmoqlar
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('quizzes'); }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'quizzes'
                  ? 'bg-amber-400 text-slate-900 shadow-sm scale-102'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              🏆 Testlar
            </button>
          </div>
        )}

        {/* View Routing */}
        {activeTab === 'home' && <HomeSection onNavigate={setActiveTab} />}
        {activeTab === 'games' && <GamesHub />}
        {activeTab === 'math' && <MathSection />}
        {activeTab === 'riddles' && <RiddleSection />}
        {activeTab === 'quizzes' && <QuizSection />}
        {activeTab === 'shop' && <ShopSection />}
        {activeTab === 'profile' && <ProfileSection />}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-amber-200/60 py-6 text-center text-xs text-slate-600 font-bold mb-14 md:mb-0">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Ukamni Bilimli Qilamiz © 2026 · Bolalar uchun xavfsiz ta'lim maydonchasi</span>
          <div className="flex items-center gap-3 text-[11px] text-slate-600">
            <span>Reklamasiz</span>
            <span>·</span>
            <span>Offline ishlaydi</span>
            <span>·</span>
            <span>Ota-ona nazorati ostida</span>
          </div>
        </div>
      </footer>

      {/* Bottom bar for mobile */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
