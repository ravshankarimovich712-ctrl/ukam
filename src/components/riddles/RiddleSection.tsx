import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/soundEffects';
import { Question } from '../../types';
import { getBaseCoinsForDifficulty } from '../../data/allQuestions';
import {
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Award,
  Sparkles
} from 'lucide-react';

export const RiddleSection: React.FC = () => {
  const { getAllQuestions, awardCoinsForQuestion, spendCoins, recordQuestionAttempt, profile } = useApp();

  const riddleList = getAllQuestions().filter((q) => q.category === 'riddle');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  const currentRiddle: Question | undefined = riddleList[currentIdx];

  useEffect(() => {
    if (currentRiddle) {
      setShuffledOptions([...currentRiddle.options].sort(() => Math.random() - 0.5));
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
      setHintMessage(null);
    }
  }, [currentRiddle]);

  const handleUseHint = () => {
    if (showHint || !currentRiddle?.hint) return;

    if (profile.coins < 10) {
      setHintMessage('Maslahat olish uchun kamida 10 ta coin kerak!');
      sounds.playWrong();
      return;
    }

    const ok = spendCoins(10, 'Topishmoq uchun maslahat olindi');
    if (ok) {
      sounds.playClick();
      setShowHint(true);
      setHintMessage(null);
    }
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentRiddle) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentRiddle.correctAnswer;
    recordQuestionAttempt(currentRiddle.id, isCorrect, 'riddle');

    if (isCorrect) {
      sounds.playSuccess();
      const base = getBaseCoinsForDifficulty(currentRiddle.difficulty);
      const earned = awardCoinsForQuestion(base, currentRiddle.id, `Topishmoq to'g'ri topildi`);
      if (earned > 0) {
        confetti({ particleCount: 50, spread: 60 });
      }
    } else {
      sounds.playWrong();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIdx < riddleList.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      setCurrentIdx(0);
      sounds.playFanfare();
      confetti({ particleCount: 80, spread: 70 });
    }
  };

  if (!currentRiddle) {
    return <div className="text-center p-8">Topishmoqlar topilmadi.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-amber-300 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🤔</span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                {currentIdx + 1} / {riddleList.length} - topishmoq
              </span>
            </div>
          </div>

          {/* Hint button */}
          <button
            onClick={handleUseHint}
            disabled={showHint || isAnswered}
            className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              showHint
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 active:scale-95'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            {showHint ? 'Maslahat ochiq' : 'Maslahat (10 🪙)'}
          </button>
        </div>

        {hintMessage && (
          <div className="text-xs text-rose-600 font-bold mb-2 text-right">
            {hintMessage}
          </div>
        )}

        {/* Visual Emoji badge */}
        {currentRiddle.visualEmoji && (
          <div className="flex justify-center mb-3">
            <span className="text-5xl p-3 bg-amber-50 rounded-3xl border-2 border-amber-200 shadow-sm animate-float">
              {currentRiddle.visualEmoji}
            </span>
          </div>
        )}

        {/* Riddle question text */}
        <div className="p-5 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 rounded-2xl border-2 border-amber-200 mb-6 text-center shadow-inner">
          <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-relaxed">
            "{currentRiddle.text}"
          </h3>
        </div>

        {/* Hint Callout */}
        {showHint && currentRiddle.hint && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 bg-yellow-100/80 rounded-2xl border-2 border-yellow-300 flex items-center gap-2.5 text-xs md:text-sm font-bold text-amber-900"
          >
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Maslahat: {currentRiddle.hint}</span>
          </motion.div>
        )}

        {/* 4 Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {shuffledOptions.map((opt) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === currentRiddle.correctAnswer;

            let btnStyle = 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-amber-50 hover:border-amber-400';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-102';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500 border-rose-600 text-white';
              } else {
                btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-40';
              }
            }

            return (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectOption(opt)}
                disabled={isAnswered}
                className={`py-3.5 px-4 rounded-2xl font-black text-base md:text-lg border-3 transition-all flex items-center justify-center select-none shadow-sm ${btnStyle}`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border-2 mb-4 flex items-start gap-3 ${
                selectedOption === currentRiddle.correctAnswer
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              {selectedOption === currentRiddle.correctAnswer ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-black text-base">
                  {selectedOption === currentRiddle.correctAnswer ? 'Juda topqirsiz! Barakalla! 🎉' : 'Buning javobi bunday edi:'}
                </div>
                <p className="text-sm font-semibold mt-0.5 text-slate-700">
                  {currentRiddle.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next riddle button */}
        {isAnswered && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              Keyingi topishmoq <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
