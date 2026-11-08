import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';
import { useApp } from '../../context/AppContext';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw, Trophy } from 'lucide-react';

// 0: empty path, 1: wall, 2: coin bonus, 3: goal
const MAZE_LEVELS = [
  {
    grid: [
      [0, 0, 1, 0, 3],
      [1, 0, 1, 0, 1],
      [0, 0, 0, 2, 0],
      [0, 1, 1, 1, 0],
      [2, 0, 0, 0, 0],
    ],
    start: { x: 0, y: 0 },
    reward: 25
  },
  {
    grid: [
      [0, 1, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 0],
      [0, 0, 2, 0, 1, 0],
      [1, 1, 1, 0, 0, 2],
      [0, 0, 0, 1, 1, 0],
      [2, 1, 0, 0, 0, 3],
    ],
    start: { x: 0, y: 0 },
    reward: 40
  },
  {
    grid: [
      [0, 0, 0, 1, 0, 0, 3],
      [1, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 2, 1, 0],
      [0, 1, 1, 1, 0, 0, 0],
      [0, 2, 0, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 2, 0],
      [0, 0, 0, 1, 0, 0, 0],
    ],
    start: { x: 0, y: 6 },
    reward: 60
  }
];

export const MazeGame: React.FC = () => {
  const { awardDirectCoins } = useApp();
  const [levelIdx, setLevelIdx] = useState<number>(0);
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>(MAZE_LEVELS[0].start);
  const [collectedCoins, setCollectedCoins] = useState<Set<string>>(new Set());
  const [hasWon, setHasWon] = useState<boolean>(false);

  const level = MAZE_LEVELS[levelIdx];
  const grid = level.grid;
  const numRows = grid.length;
  const numCols = grid[0].length;

  const initLevel = (idx: number) => {
    setLevelIdx(idx);
    setPlayerPos(MAZE_LEVELS[idx].start);
    setCollectedCoins(new Set());
    setHasWon(false);
  };

  const movePlayer = (dx: number, dy: number) => {
    if (hasWon) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Check bounds
    if (newX < 0 || newX >= numCols || newY < 0 || newY >= numRows) {
      sounds.playWrong();
      return;
    }

    // Check wall
    if (grid[newY][newX] === 1) {
      sounds.playWrong();
      return;
    }

    // Valid move!
    sounds.playClick();
    setPlayerPos({ x: newX, y: newY });

    // Check coin tile
    const key = `${newX},${newY}`;
    if (grid[newY][newX] === 2 && !collectedCoins.has(key)) {
      sounds.playCoin();
      setCollectedCoins(new Set(collectedCoins).add(key));
      awardDirectCoins(5, 'Labirintda bonus coin olindi');
    }

    // Check goal
    if (grid[newY][newX] === 3 && !hasWon) {
      setHasWon(true);
      sounds.playFanfare();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      awardDirectCoins(level.reward, `Labirint (${levelIdx + 1}-daraja) muvaffaqiyatli yakunlandi`);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') movePlayer(0, -1);
      if (e.key === 'ArrowDown') movePlayer(0, 1);
      if (e.key === 'ArrowLeft') movePlayer(-1, 0);
      if (e.key === 'ArrowRight') movePlayer(1, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, hasWon, levelIdx, collectedCoins]);

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 bg-white rounded-3xl shadow-xl border-4 border-amber-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌀</span>
            <h2 className="text-2xl font-black text-slate-800">Labirint Sarguzashti</h2>
          </div>
          <p className="text-sm text-slate-600">Bilimdonni yulduzgacha yetkazib, yo'ldagi coinlarni yig'ing!</p>
        </div>

        <div className="flex gap-1 bg-amber-50 p-1.5 rounded-xl border border-amber-200">
          {[1, 2, 3].map((lvl, idx) => (
            <button
              key={lvl}
              onClick={() => { sounds.playClick(); initLevel(idx); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                levelIdx === idx ? 'bg-amber-400 text-slate-900 shadow' : 'text-slate-600'
              }`}
            >
              {lvl}-bosqich
            </button>
          ))}
        </div>
      </div>

      {/* Grid container */}
      <div className="flex justify-center my-4">
        <div
          className="grid gap-1.5 p-3 bg-slate-900 rounded-3xl border-4 border-slate-700 shadow-inner select-none"
          style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer = playerPos.x === x && playerPos.y === y;
              const isCoin = cell === 2 && !collectedCoins.has(`${x},${y}`);
              const isGoal = cell === 3;
              const isWall = cell === 1;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl transition-all relative ${
                    isWall
                      ? 'bg-slate-700 shadow-inner border border-slate-600'
                      : 'bg-slate-800/80 border border-slate-700/50'
                  }`}
                >
                  {isWall && <span className="text-xs opacity-20">🧱</span>}
                  {isGoal && !isPlayer && <span className="animate-pulse">🌟</span>}
                  {isCoin && !isPlayer && <span className="text-lg animate-bounce">🪙</span>}
                  {isPlayer && (
                    <motion.div
                      layoutId="player"
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-lg text-xl"
                    >
                      🤖
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Touch Directional Controls */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <button
          onClick={() => movePlayer(0, -1)}
          className="w-14 h-12 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-black shadow-md flex items-center justify-center"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => movePlayer(-1, 0)}
            className="w-14 h-12 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-black shadow-md flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => movePlayer(0, 1)}
            className="w-14 h-12 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-black shadow-md flex items-center justify-center"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            onClick={() => movePlayer(1, 0)}
            className="w-14 h-12 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-black shadow-md flex items-center justify-center"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Victory modal */}
      {hasWon && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6 p-5 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl text-center text-slate-900 shadow-lg"
        >
          <div className="text-3xl mb-1">🎉🏆</div>
          <h3 className="text-xl font-black">TABRIKLAYMIZ! MARRAGA YETDINGIZ!</h3>
          <div className="inline-block bg-white text-amber-700 font-black px-4 py-1.5 rounded-xl text-base my-2 shadow">
            +{level.reward} COIN QO'SHILDI!
          </div>
          <div className="mt-2">
            <button
              onClick={() => {
                if (levelIdx < MAZE_LEVELS.length - 1) {
                  initLevel(levelIdx + 1);
                } else {
                  initLevel(0);
                }
                sounds.playClick();
              }}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-sm shadow hover:bg-slate-800"
            >
              {levelIdx < MAZE_LEVELS.length - 1 ? 'Keyingi bosqich ➡️' : 'Qayta o\'ynash 🔄'}
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-4 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-2">
        <span>Klaviatura strelkalari bilan ham boshqarsa bo'ladi ⌨️</span>
        <button
          onClick={() => initLevel(levelIdx)}
          className="text-amber-700 font-bold flex items-center gap-1 hover:text-amber-800"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Qayta urinish
        </button>
      </div>
    </div>
  );
};
