import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';
import { useApp } from '../../context/AppContext';
import { RefreshCw, Award, Star } from 'lucide-react';

interface CardItem {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJI_PAIRS = [
  { emoji: '🦁', name: 'Sher' },
  { emoji: '🐘', name: 'Fil' },
  { emoji: '🚀', name: 'Raketa' },
  { emoji: '🍎', name: 'Olma' },
  { emoji: '🚗', name: 'Mashina' },
  { emoji: '⭐', name: 'Yulduz' },
  { emoji: '🎈', name: 'Shar' },
  { emoji: '🐱', name: 'Mushuk' },
];

export const MemoryGame: React.FC = () => {
  const { awardDirectCoins } = useApp();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [won, setWon] = useState<boolean>(false);

  const initGame = () => {
    const selected = EMOJI_PAIRS.slice(0, 6); // 6 pairs = 12 cards
    const deck: CardItem[] = [];
    selected.forEach((item, idx) => {
      deck.push({ id: idx * 2, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
      deck.push({ id: idx * 2 + 1, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
    });

    // Shuffle
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedIndices([]);
    setIsProcessing(false);
    setMoves(0);
    setWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isProcessing || cards[index].isFlipped || cards[index].isMatched) return;

    sounds.playClick();
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      setMoves((m) => m + 1);
      const [idx1, idx2] = newFlipped;

      if (cards[idx1].emoji === cards[idx2].emoji) {
        // Matched!
        sounds.playSuccess();
        setTimeout(() => {
          newCards[idx1].isMatched = true;
          newCards[idx2].isMatched = true;
          setCards([...newCards]);
          setFlippedIndices([]);
          setIsProcessing(false);

          // Check if all matched
          if (newCards.every((c) => c.isMatched)) {
            setWon(true);
            sounds.playFanfare();
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            awardDirectCoins(30, 'Rasm juftlash o\'yinida g\'alaba');
          }
        }, 500);
      } else {
        // Not matched
        sounds.playWrong();
        setTimeout(() => {
          newCards[idx1].isFlipped = false;
          newCards[idx2].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 900);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 bg-white rounded-3xl shadow-xl border-4 border-emerald-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🧩</span>
            <h2 className="text-2xl font-black text-slate-800">Rasm Juftlash O'yini</h2>
          </div>
          <p className="text-sm text-slate-600 mt-0.5">Bir xil rasmlarni topib xotirangizni charxlang!</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-600">Urinishlar</div>
          <div className="text-xl font-black text-emerald-600">{moves} ta</div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(idx)}
            className={`aspect-square rounded-2xl cursor-pointer flex flex-col items-center justify-center p-2 text-3xl font-black transition-all shadow-md select-none border-3 ${
              card.isMatched
                ? 'bg-emerald-100 border-emerald-400 opacity-80'
                : card.isFlipped
                ? 'bg-amber-100 border-amber-400 scale-102'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white hover:brightness-105'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                <span>{card.emoji}</span>
                <span className="text-[11px] font-bold text-slate-700 mt-1">{card.name}</span>
              </motion.div>
            ) : (
              <span className="text-2xl opacity-60">❓</span>
            )}
          </motion.div>
        ))}
      </div>

      {won && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6 p-5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl text-center text-white shadow-lg"
        >
          <div className="text-4xl mb-1">🎉🌟</div>
          <h3 className="text-xl font-black">OFARIN! BARCHASINI TOPDINGIZ!</h3>
          <p className="text-sm font-semibold mt-1">Xotirangiz juda kuchli ekan!</p>
          <div className="inline-block bg-white text-emerald-700 font-black px-4 py-1.5 rounded-xl text-lg my-3 shadow">
            +30 COIN YUTIB OLDINGIZ!
          </div>
          <div>
            <button
              onClick={initGame}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-sm shadow hover:bg-slate-800"
            >
              Yana o'ynash 🔄
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          onClick={initGame}
          className="text-emerald-700 hover:text-emerald-800 font-bold text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Yangitdan boshlash
        </button>
      </div>
    </div>
  );
};
