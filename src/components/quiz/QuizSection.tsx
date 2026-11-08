import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/soundEffects';
import { Question } from '../../types';
import { getBaseCoinsForDifficulty } from '../../data/allQuestions';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Award,
  ArrowRight,
  Sparkles,
  Compass
} from 'lucide-react';

export const QuizSection: React.FC = () => {
  const { getAllQuestions, awardCoinsForQuestion, awardDirectCoins, recordQuestionAttempt } = useApp();

  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');
  const [quizState, setQuizState] = useState<'intro' | 'active' | 'summary'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [bonusEarned, setBonusEarned] = useState<number>(0);

  const allQuizQuestions = useMemo(() => {
    return getAllQuestions().filter((q) => q.category === 'quiz');
  }, [getAllQuestions]);

  const subcategories = [
    { id: 'all', title: 'Aralash test', emoji: '🌟', count: allQuizQuestions.length },
    { id: 'vatan', title: 'O\'zbekiston va Vatanimiz', emoji: '🇺🇿', count: allQuizQuestions.filter(q => q.subcategory === 'vatan').length },
    { id: 'tabiat', title: 'Tabiat va Hayvonlar', emoji: '🌿', count: allQuizQuestions.filter(q => q.subcategory === 'tabiat').length },
    { id: 'kosmos', title: 'Kosmos va Sayyoralar', emoji: '🚀', count: allQuizQuestions.filter(q => q.subcategory === 'kosmos').length },
    { id: 'mantiq', title: 'Mantiq va Zukkolik', emoji: '💡', count: allQuizQuestions.filter(q => q.subcategory === 'mantiq').length },
  ];

  const startQuiz = (subcatId: string) => {
    sounds.playClick();
    setSelectedSubcat(subcatId);

    let pool = allQuizQuestions;
    if (subcatId !== 'all') {
      pool = allQuizQuestions.filter((q) => q.subcategory === subcatId);
    }

    // Pick 10 random questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    setTestQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setBonusEarned(0);
    setQuizState('active');
  };

  const currentQ: Question | undefined = testQuestions[currentQuestionIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;
    setUserAnswers((prev) => ({ ...prev, [currentQuestionIndex]: opt }));
    recordQuestionAttempt(currentQ.id, isCorrect, 'quiz');

    if (isCorrect) {
      sounds.playSuccess();
      setScore((s) => s + 1);
      const base = getBaseCoinsForDifficulty(currentQ.difficulty);
      awardCoinsForQuestion(base, currentQ.id, `Test savoli (${currentQ.subcategory || 'quiz'})`);
    } else {
      sounds.playWrong();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Finished 10 questions!
      setQuizState('summary');
      sounds.playFanfare();

      // Check for 10/10 bonus (+50 coins)
      const finalScore = score + (selectedOption === currentQ?.correctAnswer ? 0 : 0);
      if (score === 10 || (score === 9 && selectedOption === currentQ?.correctAnswer)) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        const bonus = awardDirectCoins(50, 'Testda 10/10 natija uchun SUPER BONUS!');
        setBonusEarned(bonus);
      } else {
        confetti({ particleCount: 50, spread: 60 });
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {quizState === 'intro' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-sky-300">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-5xl">🏆</span>
            <h2 className="text-3xl font-black text-slate-800 mt-2">Qiziqarli Bilimdon Testlari</h2>
            <p className="text-sm md:text-base text-slate-600 mt-2">
              Har bir testda 10 ta qiziqarli savol bo'ladi. Agar 10/10 to'g'ri topsangiz, qo'shimcha <strong>+50 COIN</strong> bonus olasiz! 🎁
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subcategories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startQuiz(cat.id)}
                className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 border-2 border-sky-200 text-left transition-all shadow-sm flex items-start gap-3.5"
              >
                <span className="text-4xl p-2 bg-white rounded-2xl shadow-sm">{cat.emoji}</span>
                <div>
                  <h3 className="font-black text-lg text-slate-800">{cat.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">10 ta savol · Har bir to'g'ri javobga coin</p>
                  <span className="inline-block mt-2 text-xs font-bold text-sky-700 bg-sky-200/70 px-2.5 py-0.5 rounded-full">
                    Boshlash ➡️
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {quizState === 'active' && currentQ && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-sky-300 relative">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-sky-700 bg-sky-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {currentQuestionIndex + 1} / 10 - savol
            </span>
            <div className="text-sm font-black text-slate-700">
              To'g'ri javoblar: <span className="text-emerald-600">{score}</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}
            />
          </div>

          {/* Question card */}
          {currentQ.visualEmoji && (
            <div className="flex justify-center mb-4">
              <span className="text-4xl p-2 bg-sky-50 rounded-2xl border border-sky-200">
                {currentQ.visualEmoji}
              </span>
            </div>
          )}

          <h3 className="text-xl md:text-2xl font-black text-slate-800 text-center mb-6 leading-relaxed">
            {currentQ.text}
          </h3>

          {/* 4 Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentQ.options.map((option) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQ.correctAnswer;

              let btnClass = 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-sky-50 hover:border-sky-300';
              if (isAnswered) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-102';
                } else if (isSelected) {
                  btnClass = 'bg-rose-500 border-rose-600 text-white';
                } else {
                  btnClass = 'bg-slate-100 border-slate-200 text-slate-400 opacity-40';
                }
              }

              return (
                <motion.button
                  key={option}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl font-black text-base md:text-lg border-3 transition-all text-left flex items-center justify-between select-none shadow-sm ${btnClass}`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white shrink-0 ml-2" />}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border-2 mb-4 flex items-start gap-3 ${
                selectedOption === currentQ.correctAnswer
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              {selectedOption === currentQ.correctAnswer ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-black text-base">
                  {selectedOption === currentQ.correctAnswer ? 'Ofarin! To\'g\'ri topdingiz!' : 'To\'g\'ri javob:'}
                </div>
                <p className="text-sm font-semibold mt-0.5 text-slate-700">
                  {currentQ.explanation}
                </p>
              </div>
            </motion.div>
          )}

          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-7 py-3 bg-sky-500 hover:bg-sky-600 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center gap-2"
              >
                {currentQuestionIndex < 9 ? 'Keyingi savol' : 'Natijani ko\'rish'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Summary Scoreboard */}
      {quizState === 'summary' && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-sky-300 text-center"
        >
          <div className="text-6xl mb-2">{score >= 8 ? '🎉🏆' : '👏'}</div>
          <h3 className="text-3xl font-black text-slate-800">
            {score === 10 ? 'MUKAMMAL NATIJA: 10/10!' : score >= 7 ? 'Ajoyib natija!' : 'Yaxshi harakat!'}
          </h3>
          <p className="text-slate-600 font-bold mt-1">
            Siz 10 ta savoldan {score} tasiga to'g'ri javob berdingiz.
          </p>

          {bonusEarned > 0 && (
            <div className="my-5 p-4 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl text-slate-900 font-black text-xl shadow-lg inline-flex items-center gap-2 border-2 border-white">
              <Award className="w-6 h-6 text-amber-700" />
              +50 COIN 10/10 TEST BONUSA QO'SHILDI! 🎁
            </div>
          )}

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => startQuiz(selectedSubcat)}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-2xl shadow transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Yana topshirish
            </button>
            <button
              onClick={() => setQuizState('intro')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-2xl transition-all"
            >
              Boshqa bo'lim tanlash
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
