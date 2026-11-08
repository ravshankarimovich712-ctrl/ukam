import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';
import { useApp } from '../../context/AppContext';
import { Award, ArrowRight, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';

interface SequenceItem {
  id: string;
  type: 'numbers' | 'patterns';
  sequence: string[];
  options: string[];
  correctAnswer: string;
  ruleExplanation: string;
}

const SEQUENCES_DATA: SequenceItem[] = [
  {
    id: 's1',
    type: 'numbers',
    sequence: ['2', '4', '6', '8', '❓'],
    options: ['9', '10', '11', '12'],
    correctAnswer: '10',
    ruleExplanation: 'Har safar 2 tadan qo\'shilib bormoqda (+2).'
  },
  {
    id: 's2',
    type: 'numbers',
    sequence: ['5', '10', '15', '20', '❓'],
    options: ['22', '25', '30', '35'],
    correctAnswer: '25',
    ruleExplanation: 'Har safar 5 tadan oshib bormoqda (+5).'
  },
  {
    id: 's3',
    type: 'patterns',
    sequence: ['🍎', '🍌', '🍎', '🍌', '❓'],
    options: ['🍎', '🍌', '🍇', '🍉'],
    correctAnswer: '🍎',
    ruleExplanation: 'Olma va banan navbatma-navbat takrorlanmoqda.'
  },
  {
    id: 's4',
    type: 'numbers',
    sequence: ['1', '3', '5', '7', '❓'],
    options: ['8', '9', '10', '11'],
    correctAnswer: '9',
    ruleExplanation: 'Toq sonlar qatori: 1, 3, 5, 7, 9 (+2).'
  },
  {
    id: 's5',
    type: 'numbers',
    sequence: ['10', '20', '30', '40', '❓'],
    options: ['45', '50', '60', '70'],
    correctAnswer: '50',
    ruleExplanation: 'O\'ntaliklar ketma-ketligi: 10, 20, 30, 40, 50.'
  },
  {
    id: 's6',
    type: 'patterns',
    sequence: ['⭐', '⭐', '🌙', '⭐', '⭐', '❓'],
    options: ['🌙', '⭐', '☀️', '☁️'],
    correctAnswer: '🌙',
    ruleExplanation: 'Ikkita yulduz, bitta oy qoidasi bo\'yicha ketyapti.'
  },
  {
    id: 's7',
    type: 'numbers',
    sequence: ['100', '90', '80', '70', '❓'],
    options: ['65', '60', '50', '75'],
    correctAnswer: '60',
    ruleExplanation: 'Har qadamda 10 tadan kamayib bormoqda (-10).'
  },
  {
    id: 's8',
    type: 'numbers',
    sequence: ['3', '6', '9', '12', '❓'],
    options: ['13', '14', '15', '16'],
    correctAnswer: '15',
    ruleExplanation: 'Uchtadan ko\'payib bormoqda: 3, 6, 9, 12, 15.'
  },
  {
    id: 's9',
    type: 'patterns',
    sequence: ['🔴', '🔵', '🟢', '🔴', '🔵', '❓'],
    options: ['🟢', '🔴', '🔵', '🟡'],
    correctAnswer: '🟢',
    ruleExplanation: 'Qizil, ko\'k, yashil ranglar tartibi takrorlanyapti.'
  },
  {
    id: 's10',
    type: 'numbers',
    sequence: ['1', '2', '4', '8', '❓'],
    options: ['10', '12', '16', '20'],
    correctAnswer: '16',
    ruleExplanation: 'Har safar 2 barobarga ko\'paymoqda (1×2=2, 2×2=4, 4×2=8, 8×2=16).'
  }
];

export const SequenceGame: React.FC = () => {
  const { awardDirectCoins } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const current = SEQUENCES_DATA[currentIndex];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === current.correctAnswer) {
      sounds.playSuccess();
      setScore((s) => s + 1);
      awardDirectCoins(10, `Ketma-ketlik topildi (${currentIndex + 1}-savol)`);
    } else {
      sounds.playWrong();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex < SEQUENCES_DATA.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed all!
      sounds.playFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
  };

  const isCompleted = currentIndex === SEQUENCES_DATA.length - 1 && isAnswered;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-3xl shadow-xl border-4 border-indigo-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🔢</span>
            <h2 className="text-2xl font-black text-slate-800">Ketma-ketlikni Davom Ettir</h2>
          </div>
          <p className="text-sm text-slate-600">Qonuniyatni toping va so'roq belgisi o'rnidagi elementni tanlang!</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-600">Savol</div>
          <div className="text-lg font-black text-indigo-600">
            {currentIndex + 1} / {SEQUENCES_DATA.length}
          </div>
        </div>
      </div>

      {/* Sequence visual cards */}
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 mb-6">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 select-none">
          {current.sequence.map((item, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black shadow-md border-3 transition-transform ${
                  item === '❓'
                    ? 'bg-amber-400 border-amber-500 text-slate-900 animate-pulse scale-105'
                    : 'bg-white border-indigo-300 text-indigo-900'
                }`}
              >
                {item === '❓' && isAnswered && selectedOption === current.correctAnswer ? current.correctAnswer : item}
              </div>
              {idx < current.sequence.length - 1 && (
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {current.options.map((option) => {
          let btnStyle = 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-indigo-50 hover:border-indigo-400';

          if (isAnswered) {
            if (option === current.correctAnswer) {
              btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-105';
            } else if (option === selectedOption) {
              btnStyle = 'bg-red-500 border-red-600 text-white';
            } else {
              btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-50';
            }
          }

          return (
            <motion.button
              key={option}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              className={`py-4 px-3 rounded-2xl font-black text-2xl border-3 transition-all flex items-center justify-center shadow-sm ${btnStyle}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation feedback */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border-2 mb-4 flex items-start gap-3 ${
            selectedOption === current.correctAnswer
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          {selectedOption === current.correctAnswer ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-black text-base">
              {selectedOption === current.correctAnswer ? 'To\'ppa-to\'g\'ri! (+10 🪙)' : 'Noto\'g\'ri bo\'ldi!'}
            </div>
            <p className="text-sm mt-0.5 font-medium">{current.ruleExplanation}</p>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleRestart}
          className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Boshidan boshlash
        </button>

        {isAnswered && (
          <button
            onClick={currentIndex < SEQUENCES_DATA.length - 1 ? handleNext : handleRestart}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm shadow hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            {currentIndex < SEQUENCES_DATA.length - 1 ? (
              <>Keyingisi <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Hammasi tugadi! Qayta o'ynash 🔄</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
