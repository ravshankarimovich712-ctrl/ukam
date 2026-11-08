import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/soundEffects';
import { getUserRank } from '../../data/allQuestions';
import { ParentPanel } from '../parent/ParentPanel';
import {
  Trophy,
  Flame,
  Award,
  Lock,
  Edit2,
  Check,
  Star,
  Sparkles
} from 'lucide-react';

const AVATARS = ['🚀', '🦁', '🤖', '🐯', '🐼', '🦄', '⚽', '👑', '🦊', '🦉'];

export const ProfileSection: React.FC = () => {
  const { profile, achievements, updateProfileNameAndAvatar } = useApp();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(profile.name);
  const [tempAvatar, setTempAvatar] = useState<string>(profile.avatar);
  const [showParentModal, setShowParentModal] = useState<boolean>(false);

  const currentRank = getUserRank(profile.totalSolved, profile.coins);
  const accuracy = profile.totalSolved > 0 ? Math.round((profile.correctCount / profile.totalSolved) * 100) : 0;

  const handleSaveProfile = () => {
    sounds.playSuccess();
    updateProfileNameAndAvatar(tempName.trim() || 'Bilimdon Bola', tempAvatar);
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-amber-300 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar display */}
          <div className="relative group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center text-5xl md:text-6xl shadow-lg border-4 border-white select-none">
              {profile.avatar}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            {!isEditing ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800">{profile.name}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="inline-block mt-1 font-black text-xs uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                    {currentRank}
                  </div>
                </div>

                {/* Parent Panel lock button */}
                <button
                  onClick={() => setShowParentModal(true)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Ota-ona paneli</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Ismingizni yozing..."
                  className="w-full py-2 px-3 rounded-xl border-2 border-amber-300 font-black text-lg focus:outline-none"
                />
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      onClick={() => setTempAvatar(av)}
                      className={`text-2xl p-1.5 rounded-xl border-2 transition-transform ${
                        tempAvatar === av ? 'bg-amber-100 border-amber-400 scale-110' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Saqlash
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stat Bar */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100">
              <div className="text-center p-2 rounded-xl bg-amber-50">
                <div className="text-[11px] font-bold text-amber-800">Jami Coin</div>
                <div className="text-lg md:text-xl font-black text-amber-900">{profile.coins.toLocaleString()} 🪙</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-rose-50">
                <div className="text-[11px] font-bold text-rose-800">Kunlik seriya</div>
                <div className="text-lg md:text-xl font-black text-rose-900 flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
                  {profile.streakDays} kun
                </div>
              </div>
              <div className="text-center p-2 rounded-xl bg-emerald-50">
                <div className="text-[11px] font-bold text-emerald-800">Aniqlik</div>
                <div className="text-lg md:text-xl font-black text-emerald-900">{accuracy}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-slate-200">
          <h3 className="font-black text-slate-800 text-base mb-3 flex items-center gap-2">
            <span>📊</span> Batafsil statistika
          </h3>
          <div className="space-y-2.5 text-xs font-bold text-slate-700">
            <div className="flex justify-between p-2 rounded-xl bg-slate-50">
              <span>Yechilgan savollar:</span>
              <span className="text-slate-900 font-black">{profile.totalSolved} ta</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50">
              <span>To'g'ri javoblar:</span>
              <span className="text-emerald-600 font-black">{profile.correctCount} ta</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50">
              <span>Noto'g'ri javoblar:</span>
              <span className="text-rose-600 font-black">{profile.totalSolved - profile.correctCount} ta</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50">
              <span>Bugungi yig'ilgan coin:</span>
              <span className="text-amber-600 font-black">+{profile.dailyCoinsToday} coin</span>
            </div>
          </div>
        </div>

        {/* Motivational Bilimdon quote */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-2">🤖💬</div>
            <h4 className="text-lg font-black leading-tight">Bilimdon aytadi:</h4>
            <p className="text-xs md:text-sm mt-2 text-indigo-100 font-medium leading-relaxed">
              "Sen ajoyib natija ko'rsatyapsan, {profile.name}! Har kuni matematika va mantiq bilan shug'ullansang, eng zo'r olim yoki daho muhandis bo'lasan!"
            </p>
          </div>
          <div className="mt-4 text-[11px] font-bold text-indigo-200">
            Bilim olish — eng katta boylik! 🌟
          </div>
        </div>
      </div>

      {/* Achievements / Medals */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-black text-slate-800">Yutuqlar va Medallar</h3>
          </div>
          <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} ochilgan
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border-2 text-center transition-all ${
                ach.unlocked
                  ? 'bg-amber-50 border-amber-300 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
              }`}
            >
              <div className="text-3xl mb-1">{ach.icon}</div>
              <div className="text-xs font-black text-slate-800">{ach.title}</div>
              <div className="text-[10px] text-slate-600 mt-0.5 leading-tight">{ach.description}</div>
              {ach.unlocked && (
                <div className="mt-1.5 text-[9px] font-bold text-emerald-700 bg-emerald-100 py-0.5 px-1.5 rounded-full inline-block">
                  Ochildi ✅
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Parent Panel Modal */}
      {showParentModal && <ParentPanel onClose={() => setShowParentModal(false)} />}
    </div>
  );
};
