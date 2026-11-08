import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/soundEffects';
import { getUserRank } from '../../data/allQuestions';
import {
  Flame,
  Coins,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Gift,
  Award,
  PlayCircle,
  HelpCircle
} from 'lucide-react';

const MASCOT_MESSAGES = [
  "Salom, do'stim! Bugun yangi bilimlarni zabt etishga tayyormisan?",
  "Barakalla! Sen har kuni yana ham kuchliroq bo'lyapsan!",
  "Zo'rsan! Bugun vazifalarni bajarib, ko'proq coin yig'amiz!",
  "Matematika — bu ajoyib sehrli sarguzasht! Olg'a!",
  "Sim ulash o'yinida lampochkalarni yondirishga nima deysan?",
  "Har bir to'g'ri javob seni yangi sovg'alarga yaqinlashtiradi! 🎁"
];

export const HomeSection: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { profile, rewards, dailyMissions, claimDailyBonus } = useApp();
  const [mascotQuoteIndex, setMascotQuoteIndex] = useState<number>(0);
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState<boolean>(false);
  const [bonusMsg, setBonusMsg] = useState<string | null>(null);

  // Next reward calculation
  const sortedRewards = [...rewards].sort((a, b) => a.coinCost - b.coinCost);
  const nextTarget = sortedRewards.find((r) => r.coinCost > profile.coins) || sortedRewards[sortedRewards.length - 1];
  const coinsNeeded = nextTarget ? Math.max(0, nextTarget.coinCost - profile.coins) : 0;
  const progressPercent = nextTarget ? Math.min(100, Math.floor((profile.coins / nextTarget.coinCost) * 100)) : 100;

  const currentRank = getUserRank(profile.totalSolved, profile.coins);

  const handleMascotClick = () => {
    sounds.playClick();
    setMascotQuoteIndex((prev) => (prev + 1) % MASCOT_MESSAGES.length);
  };

  const handleClaimBonus = () => {
    sounds.playCoin();
    const res = claimDailyBonus();
    setDailyBonusClaimed(true);
    setBonusMsg(res.message);
    confetti({ particleCount: 60, spread: 60 });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Welcome Card with Mascot */}
      <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-200 rounded-3xl p-6 md:p-8 shadow-xl border-4 border-white relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-36 h-36 bg-amber-500/10 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Bilimdon Mascot Avatar */}
          <div
            onClick={handleMascotClick}
            className="w-36 h-36 md:w-44 md:h-44 shrink-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-sky-200 cursor-pointer transform hover:scale-105 active:scale-95 transition-all select-none animate-float relative group"
            title="Bilimdon bilan suhbatlashish uchun bosing!"
          >
            <img
              src="/src/assets/images/bilimdon_mascot_1794155519969.jpg"
              alt="Bilimdon do'stimiz"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-1 inset-x-1 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-black text-center py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Meni bosing! 💬
            </div>
          </div>

          {/* Hero Speech Bubble and Main CTAs */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-slate-800 shadow-sm">
                Salom, {profile.name}! 👋
              </span>
              <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-white" /> {profile.streakDays} kunlik seriya!
              </span>
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-sm">
                {currentRank}
              </span>
            </div>

            {/* Mascot Dialogue Bubble */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-md border-2 border-amber-200 my-3 text-slate-800 relative">
              <p className="font-extrabold text-sm md:text-base leading-snug">
                "{MASCOT_MESSAGES[mascotQuoteIndex]}"
              </p>
              <div className="text-[11px] font-bold text-amber-700 mt-1 flex items-center justify-center md:justify-start gap-1">
                <span>🤖 Bilimdon</span>
                <span className="text-slate-400">· Gapini o'zgartirish uchun robotni bosing!</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <button
                onClick={() => { sounds.playClick(); onNavigate('math'); }}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-base rounded-2xl shadow-xl flex items-center gap-2 transition-all"
              >
                <PlayCircle className="w-5 h-5 text-amber-400" />
                Matematikani Boshlash!
              </button>

              <button
                onClick={() => { sounds.playClick(); onNavigate('games'); }}
                className="px-5 py-3.5 bg-white hover:bg-amber-50 active:scale-95 text-slate-900 font-black text-base rounded-2xl shadow-md border-2 border-amber-300 flex items-center gap-2 transition-all"
              >
                <span>⚡</span> Sim Ulash O'yini
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Login Reward Banner */}
      {!dailyBonusClaimed && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-4 md:p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="text-3xl p-2 bg-white/20 rounded-2xl">🎁</div>
            <div>
              <div className="font-black text-base md:text-lg">Bugungi Kunlik Kirish Bonusi!</div>
              <p className="text-xs text-emerald-100 font-medium">
                {profile.streakDays >= 7 ? '+100 COIN (7 kunlik seriya bonusi!)' : '+10 COIN olishingiz mumkin'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClaimBonus}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-900 font-black text-sm rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Coinni Olish! 🪙
          </button>
        </div>
      )}

      {bonusMsg && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-center text-xs font-black text-emerald-900">
          {bonusMsg}
        </div>
      )}

      {/* Progress to Next Reward Bar */}
      {nextTarget && (
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-md border-3 border-amber-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-black uppercase text-amber-700 tracking-wider">Sovg'a Maqsadi</span>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mt-0.5">
                <span>{nextTarget.icon}</span> {nextTarget.realValueText}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-slate-600">
                {coinsNeeded === 0 ? 'Tayyor! Sovg\'ani oling 🎉' : `Yana ${coinsNeeded.toLocaleString()} coin qoldi`}
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 mt-2">
            <span>Hozir: {profile.coins.toLocaleString()} 🪙</span>
            <span>Kerak: {nextTarget.coinCost.toLocaleString()} 🪙</span>
          </div>
        </div>
      )}

      {/* Daily 3 Missions */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-md border-3 border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h3 className="text-lg font-black text-slate-800">Kunlik 3 ta Vazifa</h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {dailyMissions.filter((m) => m.completed).length} / 3 bajarildi
          </span>
        </div>

        <div className="space-y-3">
          {dailyMissions.map((m) => (
            <div
              key={m.id}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                m.completed
                  ? 'bg-emerald-50 border-emerald-300 opacity-90'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    m.completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {m.completed ? <CheckCircle2 className="w-5 h-5" /> : `${m.currentCount}/${m.targetCount}`}
                </div>
                <div>
                  <div className={`text-xs md:text-sm font-black ${m.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {m.title}
                  </div>
                  <div className="text-[11px] text-amber-600 font-bold">
                    Mukofot: +{m.rewardCoins} Coin 🪙
                  </div>
                </div>
              </div>

              {m.completed ? (
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl">
                  Bajarildi ✅
                </span>
              ) : (
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (m.type === 'math') onNavigate('math');
                    else if (m.type === 'wires') onNavigate('games');
                    else if (m.type === 'quiz') onNavigate('quizzes');
                    else onNavigate('math');
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Bajarish ➡️
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category Navigation Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {[
          { id: 'math', title: 'Matematika', desc: '150+ misollar', icon: '📐', bg: 'from-amber-400 to-orange-400' },
          { id: 'games', title: 'Mantiq O\'yinlari', desc: 'Sim ulash, xotira', icon: '🎮', bg: 'from-emerald-400 to-teal-500' },
          { id: 'riddles', title: 'Topishmoqlar', desc: '50+ qiziqarli topishmoq', icon: '🤔', bg: 'from-indigo-400 to-purple-500' },
          { id: 'quizzes', title: 'Qiziqarli Testlar', desc: 'Vatan, tabiat, fazo', icon: '🏆', bg: 'from-sky-400 to-blue-500' }
        ].map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { sounds.playClick(); onNavigate(item.id); }}
            className={`p-4 md:p-5 rounded-3xl bg-gradient-to-br ${item.bg} text-white shadow-lg cursor-pointer flex flex-col justify-between min-h-[120px] select-none`}
          >
            <span className="text-3xl md:text-4xl">{item.icon}</span>
            <div>
              <h4 className="font-black text-base md:text-lg leading-tight mt-2">{item.title}</h4>
              <p className="text-[11px] text-white/90 font-medium mt-0.5">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
