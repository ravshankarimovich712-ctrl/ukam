import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';
import { useApp } from '../../context/AppContext';
import { RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export const SortingGame: React.FC = () => {
  const { awardDirectCoins } = useApp();
  const [level, setLevel] = useState<number>(1);
  const [availableItems, setAvailableItems] = useState<number[]>([]);
  const [placedItems, setPlacedItems] = useState<number[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);

  const initRound = () => {
    // Generate 4 to 5 unique random numbers depending on level
    const count = level === 1 ? 4 : 5;
    const maxVal = level === 1 ? 20 : level === 2 ? 50 : 100;
    const set = new Set<number>();

    while (set.size < count) {
      set.add(Math.floor(Math.random() * maxVal) + 1);
    }

    const nums = Array.from(set);
    // Shuffle
    nums.sort(() => Math.random() - 0.5);
    setAvailableItems(nums);
    setPlacedItems([]);
    setIsSuccess(false);
  };

  useEffect(() => {
    initRound();
  }, [level]);

  const handleSelectItem = (num: number) => {
    sounds.playClick();
    const newPlaced = [...placedItems, num];
    setPlacedItems(newPlaced);
    setAvailableItems(availableItems.filter((n) => n !== num));

    // If all items placed, check if sorted ascending
    if (newPlaced.length === (level === 1 ? 4 : 5)) {
      const isSorted = newPlaced.every((val, i, arr) => !i || arr[i - 1] <= val);

      if (isSorted) {
        sounds.playSuccess();
        setIsSuccess(true);
        setRoundsCompleted((r) => r + 1);
        awardDirectCoins(15, `Tartibga solish o'yini (${level}-daraja)`);
      } else {
        sounds.playWrong();
        // Reset after short delay so child can try again
        setTimeout(() => {
          setAvailableItems([...newPlaced].sort(() => Math.random() - 0.5));
          setPlacedItems([]);
        }, 800);
      }
    }
  };

  const handleRemovePlaced = (num: number) => {
    if (isSuccess) return;
    sounds.playClick();
    setPlacedItems(placedItems.filter((n) => n !== num));
    setAvailableItems([...availableItems, num]);
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 bg-white rounded-3xl shadow-xl border-4 border-teal-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📊</span>
            <h2 className="text-2xl font-black text-slate-800">Tartibga Sol</h2>
          </div>
          <p className="text-sm text-slate-600">Raqamlarni eng KICHIKdan eng KATTAga qarab tering!</p>
        </div>

        <div className="flex items-center gap-1.5 bg-teal-50 p-1.5 rounded-xl border border-teal-200">
          <button
            onClick={() => { setLevel(1); sounds.playClick(); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${level === 1 ? 'bg-teal-500 text-white shadow' : 'text-slate-600'}`}
          >
            1–20
          </button>
          <button
            onClick={() => { setLevel(2); sounds.playClick(); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${level === 2 ? 'bg-teal-500 text-white shadow' : 'text-slate-600'}`}
          >
            1–50
          </button>
          <button
            onClick={() => { setLevel(3); sounds.playClick(); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${level === 3 ? 'bg-teal-500 text-white shadow' : 'text-slate-600'}`}
          >
            1–100
          </button>
        </div>
      </div>

      {/* Target drop / placed slots */}
      <div className="mb-6">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Kichikdan ➡️ Kattagacha terilgan qator:</span>
          <span className="text-[11px] text-teal-700">(Noto'g'ri bo'lsa bosing)</span>
        </div>
        <div className="min-h-[80px] p-3 rounded-2xl bg-teal-50/70 border-3 border-dashed border-teal-300 flex items-center justify-center gap-3 flex-wrap">
          {placedItems.length === 0 ? (
            <span className="text-sm text-teal-600 font-bold">Pastdagi raqamlarni eng kichigidan boshlab bosing 👇</span>
          ) : (
            placedItems.map((num) => (
              <motion.button
                key={num}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRemovePlaced(num)}
                className={`w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center shadow-md border-3 transition-transform ${
                  isSuccess
                    ? 'bg-emerald-500 border-emerald-600 text-white'
                    : 'bg-white border-teal-400 text-teal-900 hover:scale-105'
                }`}
              >
                {num}
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Available numbers */}
      <div className="mb-6">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tanlash uchun raqamlar:</div>
        <div className="flex items-center justify-center gap-3 flex-wrap min-h-[64px]">
          {availableItems.map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleSelectItem(num)}
              className="w-14 h-14 rounded-2xl font-black text-2xl bg-amber-400 border-3 border-amber-500 text-slate-900 shadow-md flex items-center justify-center hover:bg-amber-300 transition-colors"
            >
              {num}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Success banner */}
      {isSuccess && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-center mb-4"
        >
          <div className="text-2xl mb-1">🎉👏</div>
          <div className="text-emerald-900 font-black text-lg">Ajoyib! To'g'ri joylashtirdingiz!</div>
          <div className="text-emerald-800 text-sm font-bold mt-0.5">+15 COIN hisobingizga qo'shildi!</div>
          <button
            onClick={initRound}
            className="mt-3 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow transition-all"
          >
            Yana bitta misol ➡️
          </button>
        </motion.div>
      )}

      <div className="flex justify-between items-center text-xs text-slate-600 pt-2 border-t border-slate-100">
        <span>To'g'ri topilganlar: <strong>{roundsCompleted} ta</strong></span>
        <button
          onClick={initRound}
          className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Yangi raqamlar
        </button>
      </div>
    </div>
  );
};
