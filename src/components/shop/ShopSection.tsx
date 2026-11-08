import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/soundEffects';
import { Reward, RedemptionRequest } from '../../types';
import {
  Sparkles,
  Gift,
  Coins,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';

export const ShopSection: React.FC = () => {
  const { profile, rewards, redemptions, requestRedemption } = useApp();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Find next achievable reward
  const sortedRewards = [...rewards].sort((a, b) => a.coinCost - b.coinCost);
  const nextTarget = sortedRewards.find((r) => r.coinCost > profile.coins) || sortedRewards[sortedRewards.length - 1];
  const coinsNeededForNext = nextTarget ? Math.max(0, nextTarget.coinCost - profile.coins) : 0;
  const progressPercent = nextTarget ? Math.min(100, Math.floor((profile.coins / nextTarget.coinCost) * 100)) : 100;

  const handleExchange = (reward: Reward) => {
    sounds.playClick();
    const res = requestRedemption(reward.id);
    if (res.success) {
      sounds.playSuccess();
      setFeedback({ type: 'success', message: res.message });
    } else {
      sounds.playWrong();
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Visual Chest Hero Header */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-3xl p-6 md:p-8 shadow-xl border-4 border-white flex flex-col md:flex-row items-center gap-6">
        <div className="w-36 h-36 md:w-44 md:h-44 shrink-0 rounded-2xl overflow-hidden shadow-lg border-4 border-white/80 bg-amber-200">
          <img
            src="/src/assets/images/treasure_gift_chest_1794155520673.jpg"
            alt="Sovg'alar sandig'i"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur px-3.5 py-1 rounded-full text-xs font-black text-amber-800 mb-2">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>Sizning hisobingiz: {profile.coins.toLocaleString()} COIN</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
            Sovg'alar va Haqiqiy Mukofotlar Do'koni
          </h2>
          <p className="text-sm font-bold text-slate-800 mt-1">
            Yig'gan coinlaringizni haqiqiy pul va ajoyib sovg'alarga almashtiring!
          </p>

          {/* Progress Bar to next reward */}
          {nextTarget && (
            <div className="mt-4 bg-white/80 rounded-2xl p-3 border border-white/60">
              <div className="flex justify-between items-center text-xs font-black text-slate-800 mb-1.5">
                <span>Keyingi mukofot: {nextTarget.realValueText}</span>
                <span>{coinsNeededForNext === 0 ? 'Tayyor!' : `Yana ${coinsNeededForNext.toLocaleString()} coin qoldi`}</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="text-sm font-black">{feedback.message}</div>
        </motion.div>
      )}

      {/* Reward Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((rew) => {
          const canAfford = profile.coins >= rew.coinCost;
          const pendingReq = redemptions.find((r) => r.rewardId === rew.id && r.status === 'pending');

          return (
            <div
              key={rew.id}
              className={`bg-white rounded-3xl p-5 shadow-lg border-3 transition-all flex flex-col justify-between ${
                canAfford ? 'border-amber-300 hover:shadow-xl hover:scale-101' : 'border-slate-200 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-4xl p-2 rounded-2xl bg-amber-50 border border-amber-200">{rew.icon}</span>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-xl font-black text-sm bg-amber-400 text-slate-900 shadow-sm">
                      {rew.coinCost.toLocaleString()} COIN
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900">{rew.title}</h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">{rew.description}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {rew.realValueText}
                </span>

                {pendingReq ? (
                  <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-2 rounded-xl flex items-center gap-1.5">
                    <Clock className="w-4 h-4 animate-spin" /> Ota-ona tasdig'i kutilmoqda
                  </span>
                ) : (
                  <button
                    onClick={() => handleExchange(rew)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                      canAfford
                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Almashtirish <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Redemption History & Parent confirmation note */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-200">
        <h3 className="text-base font-black text-slate-800 mb-3 flex items-center gap-2">
          <span>📋</span> So'nggi so'rovlar holati
        </h3>

        {redemptions.length === 0 ? (
          <p className="text-xs text-slate-500 font-bold">Hozircha hech qanday sovg'a so'rovi yuborilmagan.</p>
        ) : (
          <div className="space-y-2">
            {redemptions.slice(0, 5).map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div>
                  <div className="font-black text-slate-800">{req.rewardTitle} ({req.coinCost.toLocaleString()} coin)</div>
                  <div className="text-[11px] text-slate-500">{req.date}</div>
                </div>

                <div>
                  {req.status === 'pending' && (
                    <span className="px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Kutilmoqda
                    </span>
                  )}
                  {req.status === 'approved' && (
                    <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Bajarildi ✅
                    </span>
                  )}
                  {req.status === 'rejected' && (
                    <span className="px-2.5 py-1 rounded-full font-bold bg-rose-100 text-rose-800">
                      Rad etildi ❌
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-3 rounded-2xl bg-sky-50 border border-sky-200 text-[11px] font-bold text-sky-800 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <span>
            Eslatma: Bola "Almashtirish" tugmasini bosganda, so'rov darhol ota-onaga yuboriladi. Ota-ona panelidan tasdiqlangandan so'ng haqiqiy sovg'a yoki pul taqdim etiladi!
          </span>
        </div>
      </div>
    </div>
  );
};
