import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/soundEffects';
import { Question, Difficulty } from '../../types';
import { getBaseCoinsForDifficulty } from '../../data/allQuestions';
import {
  Sparkles,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Award,
  Zap,
  ArrowRight,
  Flame
} from 'lucide-react';

export const MathSection: React.FC = () => {
  const { getAllQuestions, awardCoinsForQuestion, recordQuestionAttempt, profile } = useApp();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('oson');
  const [selectedOperation, setSelectedOperation] = useState<string>('all'); // 'all' | 'qoshish' | 'ayirish' | 'kopaytirish' | 'bolish' | 'rasmli' | 'soz_masala'
  const [isSpeedMode, setIsSpeedMode] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [shake, setShake] = useState<boolean>(false);

  // Filter math questions from all available questions
  const mathQuestionsList = useMemo(() => {
    const all = getAllQuestions().filter((q) => q.category === 'math');
    return all.filter((q) => {
      const matchDiff = q.difficulty === selectedDifficulty;
      const matchOp =
        selectedOperation === 'all' ||
        q.subcategory === selectedOperation ||
        (selectedOperation === 'rasmli' && q.subcategory === 'rasmli') ||
        (selectedOperation === 'soz_masala' && q.subcategory === 'soz_masala');
      return matchDiff && matchOp;
    });
  }, [getAllQuestions, selectedDifficulty, selectedOperation]);

  const currentQ: Question | undefined = mathQuestionsList[currentQuestionIndex];

  // Shuffle options whenever the current question changes
  useEffect(() => {
    if (currentQ) {
      setShuffledOptions([...currentQ.options].sort(() => Math.random() - 0.5));
      setSelectedOption(null);
      setIsAnswered(false);
      setEarnedCoins(0);
    }
  }, [currentQ]);

  // Speed timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeedMode && timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            sounds.playWrong();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSpeedMode, timerActive, timeLeft]);

  const startSpeedMode = () => {
    setIsSpeedMode(true);
    setTimeLeft(30);
    setTimerActive(true);
    setCurrentQuestionIndex(0);
    sounds.playClick();
  };

  const stopSpeedMode = () => {
    setIsSpeedMode(false);
    setTimerActive(false);
    setTimeLeft(30);
    sounds.playClick();
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    recordQuestionAttempt(currentQ.id, isCorrect, 'math');

    if (isCorrect) {
      sounds.playSuccess();
      const base = getBaseCoinsForDifficulty(currentQ.difficulty);
      const earned = awardCoinsForQuestion(base, currentQ.id, `Matematika misoli (${currentQ.difficulty})`);
      setEarnedCoins(earned);

      if (earned > 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } else {
      sounds.playWrong();
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentQuestionIndex < mathQuestionsList.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      // Loop back or celebrate
      setCurrentQuestionIndex(0);
      sounds.playFanfare();
      confetti({ particleCount: 70, spread: 70 });
    }
  };

  const solveCount = currentQ ? profile.solvedHistory[currentQ.id] || 0 : 0;
  const baseReward = currentQ ? getBaseCoinsForDifficulty(currentQ.difficulty) : 5;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Category & Filters Header */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-xl border-4 border-amber-300">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">📐</span>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Matematika Bo'limi</h2>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">
              Hisoblang, qiziqarli masalalarni yeching va coinlar to'plang!
            </p>
          </div>

          {/* Speed Mode Toggle */}
          <button
            onClick={isSpeedMode ? stopSpeedMode : startSpeedMode}
            className={`px-4 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 ${
              isSpeedMode
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border-2 border-amber-300'
            }`}
          >
            <Timer className="w-5 h-5" />
            {isSpeedMode ? `Tezkor: ${timeLeft}s qoldi` : 'Tez hisoblash (30s) ⚡'}
          </button>
        </div>

        {/* Difficulty Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1">Daraja:</span>
          {(['oson', 'orta', 'qiyin', 'daho'] as Difficulty[]).map((d) => {
            const labels: Record<Difficulty, { name: string; coin: string; color: string }> = {
              oson: { name: 'Oson', coin: '5 🪙', color: 'bg-emerald-500' },
              orta: { name: 'O\'rta', coin: '10 🪙', color: 'bg-blue-500' },
              qiyin: { name: 'Qiyin', coin: '20 🪙', color: 'bg-amber-500' },
              daho: { name: 'Daho', coin: '40 🪙', color: 'bg-purple-600' }
            };

            const isSel = selectedDifficulty === d;
            return (
              <button
                key={d}
                onClick={() => {
                  setSelectedDifficulty(d);
                  setCurrentQuestionIndex(0);
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 border-2 ${
                  isSel
                    ? `${labels[d].color} text-white border-white shadow-md scale-105`
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{labels[d].name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSel ? 'bg-black/20' : 'bg-slate-200'}`}>
                  {labels[d].coin}
                </span>
              </button>
            );
          })}
        </div>

        {/* Operations Subcategory Selector */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="text-xs font-bold text-slate-500 mr-1">Turi:</span>
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'rasmli', label: '🍎 Rasmli' },
            { id: 'qoshish', label: '➕ Qo\'shish' },
            { id: 'ayirish', label: '➖ Ayirish' },
            { id: 'kopaytirish', label: '✖️ Ko\'paytirish' },
            { id: 'bolish', label: '➗ Bo\'lish' },
            { id: 'soz_masala', label: '📖 So\'z masalalari' }
          ].map((op) => (
            <button
              key={op.id}
              onClick={() => {
                setSelectedOperation(op.id);
                setCurrentQuestionIndex(0);
                sounds.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedOperation === op.id
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      {currentQ ? (
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-indigo-200 relative overflow-hidden"
        >
          {/* Top Info Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-700">
                {currentQuestionIndex + 1} / {mathQuestionsList.length} - misol
              </span>
              {solveCount > 0 && (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {solveCount}-marta yechilgan (Coin 25%)
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 text-sm">
              <Award className="w-4 h-4 text-amber-500" />
              <span>+{baseReward} Coin</span>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-4 leading-relaxed">
            {currentQ.text}
          </h3>

          {/* Visual Formula / Emoji Representation */}
          {currentQ.visualEmoji && (
            <div className="my-5 p-5 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl border-2 border-amber-200 text-center select-none shadow-inner">
              <div className="text-2xl md:text-4xl font-black tracking-wider text-slate-800">
                {currentQ.visualEmoji}
              </div>
            </div>
          )}

          {/* 4 Answer Options */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 my-6">
            {shuffledOptions.map((option) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQ.correctAnswer;

              let btnClass = 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-indigo-50 hover:border-indigo-400';

              if (isAnswered) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-102';
                } else if (isSelected) {
                  btnClass = 'bg-rose-500 border-rose-600 text-white';
                } else {
                  btnClass = 'bg-slate-100 border-slate-200 text-slate-400 opacity-40';
                }
              }

              return (
                <motion.button
                  key={option}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`p-4 md:p-5 rounded-2xl font-black text-xl md:text-2xl border-3 transition-all flex items-center justify-center shadow-sm select-none ${btnClass}`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation Box */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 md:p-5 rounded-2xl border-2 mb-4 flex items-start gap-3 ${
                  selectedOption === currentQ.correctAnswer
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                {selectedOption === currentQ.correctAnswer ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-black text-lg">
                    {selectedOption === currentQ.correctAnswer
                      ? `Barakalla! To'g'ri topdingiz! ${earnedCoins > 0 ? `(+${earnedCoins} 🪙)` : ''}`
                      : 'Kichik xatolik bo\'ldi! Keling, birga ko\'ramiz:'}
                  </div>
                  <p className="text-sm md:text-base font-semibold mt-1 text-slate-700">
                    {currentQ.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end mt-2">
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-base rounded-2xl shadow-lg transition-all flex items-center gap-2"
              >
                Keyingi misolga o'tish <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center border-4 border-slate-200">
          <p className="text-slate-600 font-bold">Ushbu bo'limda misollar topilmadi.</p>
          <button
            onClick={() => { setSelectedOperation('all'); setSelectedDifficulty('oson'); }}
            className="mt-3 px-4 py-2 bg-amber-400 rounded-xl font-bold text-sm"
          >
            Barcha misollarni ko'rsatish
          </button>
        </div>
      )}
    </div>
  );
};
