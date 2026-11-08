import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';
import { useApp } from '../../context/AppContext';
import { RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

interface ShapeQuiz {
  question: string;
  targetEmoji: string;
  options: { label: string; emoji: string }[];
  correct: string;
  explanation: string;
}

const SHAPES_DATA: ShapeQuiz[] = [
  {
    question: 'Qaysi shakl UCHBURCHAK?',
    targetEmoji: '🔺',
    options: [
      { label: 'Uchburchak', emoji: '🔺' },
      { label: 'Kvadrat', emoji: '🟥' },
      { label: 'Doira', emoji: '🔴' },
      { label: 'Yulduz', emoji: '⭐' }
    ],
    correct: '🔺',
    explanation: 'Uchburchakning 3 ta tomoni va 3 ta burchagi bo\'ladi.'
  },
  {
    question: 'Qaysi shakl SARIQ DOIRA?',
    targetEmoji: '🟡',
    options: [
      { label: 'Qizil doira', emoji: '🔴' },
      { label: 'Sariq doira', emoji: '🟡' },
      { label: 'Yashil kvadrat', emoji: '🟩' },
      { label: 'Moviy romb', emoji: '🔷' }
    ],
    correct: '🟡',
    explanation: 'Doira burchaksiz silliq shakl, sariq rangda!'
  },
  {
    question: 'Qaysi shakl KO\'K KVADRAT?',
    targetEmoji: '🟦',
    options: [
      { label: 'Ko\'k doira', emoji: '🔵' },
      { label: 'Yashil kvadrat', emoji: '🟩' },
      { label: 'Ko\'k kvadrat', emoji: '🟦' },
      { label: 'Binafsha yurak', emoji: '💜' }
    ],
    correct: '🟦',
    explanation: 'Kvadratning to\'rtta tomoni ham o\'zaro teng bo\'ladi.'
  },
  {
    question: 'Qaysi shakl YULDUZCHA?',
    targetEmoji: '⭐',
    options: [
      { label: 'Yulduzcha', emoji: '⭐' },
      { label: 'Oy', emoji: '🌙' },
      { label: 'Quyosh', emoji: '☀️' },
      { label: 'Yurakcha', emoji: '❤️' }
    ],
    correct: '⭐',
    explanation: 'Besh qirrali porloq oltin yulduzcha!'
  },
  {
    question: 'Qaysi shakl YAShIL YURAKCHA?',
    targetEmoji: '💚',
    options: [
      { label: 'Qizil yurak', emoji: '❤️' },
      { label: 'Sariq yurak', emoji: '💛' },
      { label: 'Yashil yurak', emoji: '💚' },
      { label: 'Moviy yurak', emoji: '💙' }
    ],
    correct: '💚',
    explanation: 'Yashil rangli chiroyli mehr ramzi bo\'lgan yurakcha.'
  }
];

export const ShapesGame: React.FC = () => {
  const { awardDirectCoins } = useApp();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const quiz = SHAPES_DATA[currentIdx];

  const handleSelect = (emoji: string) => {
    if (isAnswered) return;
    setSelected(emoji);
    setIsAnswered(true);

    if (emoji === quiz.correct) {
      sounds.playSuccess();
      awardDirectCoins(10, `Shakl va ranglar to'g'ri topildi (${currentIdx + 1}-savol)`);
    } else {
      sounds.playWrong();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIdx < SHAPES_DATA.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      sounds.playFanfare();
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelected(null);
    setIsAnswered(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 bg-white rounded-3xl shadow-xl border-4 border-rose-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎨</span>
            <h2 className="text-2xl font-black text-slate-800">Shakl va Ranglar</h2>
          </div>
          <p className="text-sm text-slate-600">Shakllarni va ularning yorqin ranglarini to'g'ri aniqlang!</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-600">Savol</div>
          <div className="text-lg font-black text-rose-600">
            {currentIdx + 1} / {SHAPES_DATA.length}
          </div>
        </div>
      </div>

      {/* Main question box */}
      <div className="p-6 bg-rose-50 rounded-2xl border-2 border-rose-200 text-center mb-6">
        <h3 className="text-xl font-black text-slate-800">{quiz.question}</h3>
      </div>

      {/* Shapes grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {quiz.options.map((opt) => {
          let style = 'bg-slate-50 border-slate-200 hover:bg-rose-50 hover:border-rose-300';
          if (isAnswered) {
            if (opt.emoji === quiz.correct) {
              style = 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-102';
            } else if (opt.emoji === selected) {
              style = 'bg-red-500 border-red-600 text-white';
            } else {
              style = 'bg-slate-100 border-slate-200 opacity-40';
            }
          }

          return (
            <motion.button
              key={opt.emoji}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(opt.emoji)}
              disabled={isAnswered}
              className={`p-5 rounded-2xl border-3 flex flex-col items-center justify-center gap-2 transition-all shadow-sm ${style}`}
            >
              <span className="text-5xl">{opt.emoji}</span>
              <span className={`text-sm font-bold ${isAnswered && (opt.emoji === quiz.correct || opt.emoji === selected) ? 'text-white' : 'text-slate-700'}`}>
                {opt.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border-2 mb-4 ${
            selected === quiz.correct ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="font-black text-base">
            {selected === quiz.correct ? 'To\'g\'ri javob! (+10 🪙)' : 'Xato tanlandi!'}
          </div>
          <p className="text-sm mt-0.5">{quiz.explanation}</p>
        </motion.div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={handleRestart}
          className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Boshidan boshlash
        </button>

        {isAnswered && (
          <button
            onClick={currentIdx < SHAPES_DATA.length - 1 ? handleNext : handleRestart}
            className="px-6 py-2.5 bg-rose-500 text-white rounded-xl font-black text-sm shadow hover:bg-rose-600 flex items-center gap-2"
          >
            {currentIdx < SHAPES_DATA.length - 1 ? (
              <>Keyingisi <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Qayta o'ynash 🔄</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
