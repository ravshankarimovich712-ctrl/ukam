import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/soundEffects';
import { Question, Reward } from '../../types';
import {
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  Settings,
  HelpCircle,
  FileQuestion,
  Gift
} from 'lucide-react';

export const ParentPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    profile,
    parentSettings,
    redemptions,
    transactions,
    customQuestions,
    rewards,
    approveRedemption,
    rejectRedemption,
    updateParentSettings,
    addCustomQuestion,
    deleteCustomQuestion,
    saveReward,
    deleteReward
  } = useApp();

  const [enteredPin, setEnteredPin] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinError, setPinError] = useState<boolean>(false);

  // Settings form states
  const [newLimit, setNewLimit] = useState<number>(parentSettings.dailyCoinLimit);
  const [newPin, setNewPin] = useState<string>('');
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  // New question form state
  const [qCategory, setQCategory] = useState<'math' | 'riddle' | 'quiz'>('math');
  const [qDifficulty, setQDifficulty] = useState<'oson' | 'orta' | 'qiyin' | 'daho'>('orta');
  const [qText, setQText] = useState<string>('');
  const [qEmoji, setQEmoji] = useState<string>('');
  const [opt1, setOpt1] = useState<string>('');
  const [opt2, setOpt2] = useState<string>('');
  const [opt3, setOpt3] = useState<string>('');
  const [opt4, setOpt4] = useState<string>('');
  const [correctOpt, setCorrectOpt] = useState<string>('1');
  const [qExplanation, setQExplanation] = useState<string>('');
  const [qAddedSuccess, setQAddedSuccess] = useState<boolean>(false);

  // New reward form state
  const [rewTitle, setRewTitle] = useState<string>('');
  const [rewCost, setRewCost] = useState<number>(10000);
  const [rewReal, setRewReal] = useState<string>('');
  const [rewIcon, setRewIcon] = useState<string>('🎁');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === parentSettings.pin) {
      sounds.playSuccess();
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      sounds.playWrong();
      setPinError(true);
      setEnteredPin('');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    updateParentSettings({
      dailyCoinLimit: Number(newLimit) || 1500,
      pin: newPin.trim() ? newPin.trim() : parentSettings.pin
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !opt1.trim() || !opt2.trim() || !opt3.trim() || !opt4.trim()) return;

    sounds.playSuccess();
    const options = [opt1.trim(), opt2.trim(), opt3.trim(), opt4.trim()];
    const correctVal = options[parseInt(correctOpt, 10) - 1];

    const newQ: Question = {
      id: 'custom_' + Date.now(),
      category: qCategory,
      difficulty: qDifficulty,
      text: qText.trim(),
      visualEmoji: qEmoji.trim() || undefined,
      options,
      correctAnswer: correctVal,
      explanation: qExplanation.trim() || `To'g'ri javob: ${correctVal}`
    };

    addCustomQuestion(newQ);
    setQText('');
    setQEmoji('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setQExplanation('');
    setQAddedSuccess(true);
    setTimeout(() => setQAddedSuccess(false), 2500);
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewTitle.trim() || !rewReal.trim()) return;

    sounds.playSuccess();
    const newRew: Reward = {
      id: 'rew_' + Date.now(),
      title: rewTitle.trim(),
      description: 'Ota-ona tomonidan qo\'shilgan maxsus mukofot',
      coinCost: Number(rewCost) || 10000,
      realValueText: rewReal.trim(),
      icon: rewIcon.trim() || '🎁',
      category: 'gift'
    };

    saveReward(newRew);
    setRewTitle('');
    setRewReal('');
  };

  // If not authenticated, show PIN keypad
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border-4 border-amber-300 text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Ota-ona Paneli</h2>
          <p className="text-xs text-slate-600 mt-1 mb-4">
            Ushbu bo'lim faqat ota-onalar uchun. PIN-kodni kiriting (Standart kod: <strong>1234</strong>)
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              maxLength={6}
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="PIN kod..."
              autoFocus
              className="w-full text-center text-3xl font-black tracking-widest py-3 px-4 rounded-2xl border-2 border-slate-300 focus:border-amber-400 focus:outline-none bg-slate-50"
            />

            {pinError && (
              <p className="text-xs font-bold text-rose-600">Noto'g'ri PIN kod! Qayta urinib ko'ring.</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-sm shadow transition-all"
              >
                Kirish 🔓
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
              >
                Yopish
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const accuracy = profile.totalSolved > 0 ? Math.round((profile.correctCount / profile.totalSolved) * 100) : 0;
  const pendingRequests = redemptions.filter((r) => r.status === 'pending');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm overflow-y-auto p-4 md:p-6 flex justify-center">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl border-4 border-amber-300 my-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Ota-ona Boshqaruv Paneli</h2>
              <p className="text-xs text-slate-600">Bolangiz natijalarini kuzating, so'rovlarni tasdiqlang va sozlang.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs"
          >
            Chiqish ✖️
          </button>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="text-xs font-bold text-amber-800">Jami Coin</div>
            <div className="text-2xl font-black text-amber-900 mt-1">{profile.coins.toLocaleString()} 🪙</div>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="text-xs font-bold text-emerald-800">Aniqlik foizi</div>
            <div className="text-2xl font-black text-emerald-900 mt-1">{accuracy}%</div>
          </div>
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
            <div className="text-xs font-bold text-sky-800">Yechilgan savollar</div>
            <div className="text-2xl font-black text-sky-900 mt-1">{profile.totalSolved} ta</div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
            <div className="text-xs font-bold text-indigo-800">Bugungi coinlar</div>
            <div className="text-2xl font-black text-indigo-900 mt-1">
              {profile.dailyCoinsToday} / {parentSettings.dailyCoinLimit}
            </div>
          </div>
        </div>

        {/* Pending Redemption Requests (PUL VA SOVG'ALAR TASDIQLASH) */}
        <div className="bg-amber-50/70 rounded-2xl p-5 border-2 border-amber-200">
          <h3 className="text-base font-black text-slate-900 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-600" />
              Sovg'a va Pul So'rovlari ({pendingRequests.length} ta kutilmoqda)
            </span>
          </h3>

          {pendingRequests.length === 0 ? (
            <p className="text-xs text-slate-500 font-bold py-2">
              Ayni paytda tasdiqlash uchun yangi so'rovlar yo'q.
            </p>
          ) : (
            <div className="space-y-3 mt-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-4 rounded-xl border border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-black text-slate-900 text-sm">
                      {req.rewardTitle} — <span className="text-emerald-600">{req.realValueText}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Narxi: <strong>{req.coinCost.toLocaleString()} coin</strong> · Vaqti: {req.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveRedemption(req.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Tasdiqlash (Coin yechiladi)
                    </button>
                    <button
                      onClick={() => rejectRedemption(req.id)}
                      className="px-3 py-2 bg-slate-100 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl"
                    >
                      Rad etish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Custom Question Form */}
        <div className="bg-white rounded-2xl p-5 border-2 border-slate-200">
          <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-indigo-600" />
            Yangi Savol Qo'shish (O'zbek tilida)
          </h3>

          <form onSubmit={handleAddQuestion} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Bo'lim:</label>
                <select
                  value={qCategory}
                  onChange={(e) => setQCategory(e.target.value as 'math' | 'riddle' | 'quiz')}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="math">Matematika</option>
                  <option value="riddle">Topishmoq</option>
                  <option value="quiz">Qiziqarli test</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Daraja:</label>
                <select
                  value={qDifficulty}
                  onChange={(e) => setQDifficulty(e.target.value as 'oson' | 'orta' | 'qiyin' | 'daho')}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="oson">Oson (5 coin)</option>
                  <option value="orta">O'rta (10 coin)</option>
                  <option value="qiyin">Qiyin (20 coin)</option>
                  <option value="daho">Daho (40 coin)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600">Savol matni:</label>
              <input
                type="text"
                required
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Masalan: 12 + 15 = ?"
                className="w-full mt-1 p-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600">Variant 1:</label>
                <input
                  type="text"
                  required
                  value={opt1}
                  onChange={(e) => setOpt1(e.target.value)}
                  className="w-full mt-0.5 p-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600">Variant 2:</label>
                <input
                  type="text"
                  required
                  value={opt2}
                  onChange={(e) => setOpt2(e.target.value)}
                  className="w-full mt-0.5 p-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600">Variant 3:</label>
                <input
                  type="text"
                  required
                  value={opt3}
                  onChange={(e) => setOpt3(e.target.value)}
                  className="w-full mt-0.5 p-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600">Variant 4:</label>
                <input
                  type="text"
                  required
                  value={opt4}
                  onChange={(e) => setOpt4(e.target.value)}
                  className="w-full mt-0.5 p-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600">To'g'ri javob qaysi variantda?</label>
                <select
                  value={correctOpt}
                  onChange={(e) => setCorrectOpt(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="1">1-variant</option>
                  <option value="2">2-variant</option>
                  <option value="3">3-variant</option>
                  <option value="4">4-variant</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Tushuntirish (Izoh):</label>
                <input
                  type="text"
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Nima uchun bu javob to'g'ri..."
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>
            </div>

            {qAddedSuccess && (
              <div className="text-xs font-black text-emerald-600">
                Savol muvaffaqiyatli qo'shildi! ✅
              </div>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Savolni saqlash
            </button>
          </form>

          {customQuestions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="text-xs font-bold text-slate-700 mb-2">Qo'shilgan savollar ({customQuestions.length} ta):</div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {customQuestions.map((q) => (
                  <div key={q.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                    <span className="font-medium text-slate-800">{q.text}</span>
                    <button
                      onClick={() => deleteCustomQuestion(q.id)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Daily Limit & PIN Settings */}
        <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200">
          <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            Tizim Sozlamalari
          </h3>

          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600">
                Kunlik maksimal coin limiti:
              </label>
              <input
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(Number(e.target.value))}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-sm font-black"
              />
              <span className="text-[11px] text-slate-500">Bola kuniga shu miqdordan ko'p coin yig'a olmaydi.</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600">
                Yangi PIN kod (agar o'zgartirmoqchi bo'lsangiz):
              </label>
              <input
                type="password"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Yangi PIN..."
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-sm font-black"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between mt-2">
              {settingsSaved ? (
                <span className="text-xs font-bold text-emerald-600">Sozlamalar saqlandi! ✅</span>
              ) : <div />}
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs shadow"
              >
                Sozlamalarni saqlash
              </button>
            </div>
          </form>
        </div>

        {/* Transactions ledger */}
        <div className="bg-white rounded-2xl p-5 border-2 border-slate-200">
          <h3 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
            <span>📜</span> Coin Amallari Tarixi
          </h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {transactions.slice(0, 15).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                <div>
                  <span className="font-bold text-slate-800">{tx.reason}</span>
                  <span className="text-[11px] text-slate-400 ml-2">{tx.timestamp}</span>
                </div>
                <span className={`font-black ${tx.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'earn' ? `+${tx.amount}` : `-${tx.amount}`} 🪙
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
