import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';
import { useApp } from '../../context/AppContext';
import { Sparkles, RefreshCw, CheckCircle2, Award, Zap, HelpCircle } from 'lucide-react';

interface WireItem {
  id: string;
  colorName: string;
  colorHex: string;
  label: string;
  emoji: string;
}

const WIRE_COLORS_MASTER: WireItem[] = [
  { id: 'red', colorName: 'Qizil', colorHex: '#EF4444', label: 'Qizil', emoji: '🔴' },
  { id: 'blue', colorName: 'Ko\'k', colorHex: '#3B82F6', label: 'Ko\'k', emoji: '🔵' },
  { id: 'green', colorName: 'Yashil', colorHex: '#10B981', label: 'Yashil', emoji: '🟢' },
  { id: 'yellow', colorName: 'Sariq', colorHex: '#F59E0B', label: 'Sariq', emoji: '🟡' },
  { id: 'purple', colorName: 'Binafsha', colorHex: '#8B5CF6', label: 'Binafsha', emoji: '🟣' },
  { id: 'orange', colorName: 'To\'q sariq', colorHex: '#F97316', label: 'To\'q sariq', emoji: '🟠' },
  { id: 'pink', colorName: 'Pushti', colorHex: '#EC4899', label: 'Pushti', emoji: '🌸' },
  { id: 'cyan', colorName: 'Moviy', colorHex: '#06B6D4', label: 'Moviy', emoji: '🩵' },
];

export const WireGame: React.FC = () => {
  const { awardDirectCoins } = useApp();
  const [level, setLevel] = useState<number>(1); // 1 (4 wires), 2 (6 wires), 3 (8 wires)
  const [wires, setWires] = useState<WireItem[]>([]);
  const [sockets, setSockets] = useState<WireItem[]>([]);
  const [connections, setConnections] = useState<Record<string, string>>({}); // wireId -> socketId
  const [activeDrag, setActiveDrag] = useState<{ wireId: string; currentX: number; currentY: number } | null>(null);
  const [errorWire, setErrorWire] = useState<string | null>(null);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [earnedCoins, setEarnedCoins] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPinRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightSocketRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const wireCount = level === 1 ? 4 : level === 2 ? 6 : 8;
  const levelCoins = level === 1 ? 30 : level === 2 ? 50 : 100;

  // Initialize level
  const initGame = useCallback(() => {
    const selected = WIRE_COLORS_MASTER.slice(0, wireCount);
    // Shuffle right sockets
    const shuffledSockets = [...selected].sort(() => Math.random() - 0.5);

    setWires(selected);
    setSockets(shuffledSockets);
    setConnections({});
    setActiveDrag(null);
    setErrorWire(null);
    setGameWon(false);
    setEarnedCoins(0);
  }, [wireCount]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check victory condition
  useEffect(() => {
    if (wires.length > 0 && Object.keys(connections).length === wires.length) {
      // Check if all connections match colors
      const allCorrect = wires.every((w) => connections[w.id] === w.id);
      if (allCorrect && !gameWon) {
        setGameWon(true);
        sounds.playFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        const awarded = awardDirectCoins(levelCoins, `Sim ulash o'yini (${level}-daraja)`, 'wires');
        setEarnedCoins(awarded);
      }
    }
  }, [connections, wires, gameWon, level, levelCoins, awardDirectCoins]);

  // Pointer drag events for responsive desktop and mobile touch
  const handlePointerDown = (wireId: string, e: React.PointerEvent) => {
    if (connections[wireId] || gameWon) return; // Already connected
    e.preventDefault();
    sounds.playClick();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setActiveDrag({
      wireId,
      currentX: e.clientX - rect.left,
      currentY: e.clientY - rect.top
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeDrag || !containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    setActiveDrag((prev) =>
      prev
        ? {
            ...prev,
            currentX: e.clientX - rect.left,
            currentY: e.clientY - rect.top
          }
        : null
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!activeDrag || !containerRef.current) return;
    const { wireId } = activeDrag;

    // Check which socket was hovered
    let targetSocketId: string | null = null;
    const clientX = e.clientX;
    const clientY = e.clientY;

    for (const socket of sockets) {
      const el = rightSocketRefs.current[socket.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        // Allow a generous hit area for children touch targets
        if (
          clientX >= rect.left - 20 &&
          clientX <= rect.right + 20 &&
          clientY >= rect.top - 20 &&
          clientY <= rect.bottom + 20
        ) {
          targetSocketId = socket.id;
          break;
        }
      }
    }

    if (targetSocketId) {
      if (targetSocketId === wireId) {
        // Correct match!
        sounds.playWireConnect();
        setConnections((prev) => ({ ...prev, [wireId]: targetSocketId! }));
      } else {
        // Wrong match! Spark feedback
        sounds.playWrong();
        setErrorWire(wireId);
        setTimeout(() => setErrorWire(null), 700);
      }
    }

    setActiveDrag(null);
  };

  // Helper to get coordinates of left terminal pin
  const getPinPos = (wireId: string) => {
    const el = leftPinRefs.current[wireId];
    if (!el || !containerRef.current) return { x: 50, y: 50 };
    const elRect = el.getBoundingClientRect();
    const contRect = containerRef.current.getBoundingClientRect();
    return {
      x: elRect.right - contRect.left,
      y: elRect.top - contRect.top + elRect.height / 2
    };
  };

  // Helper to get coordinates of right socket
  const getSocketPos = (socketId: string) => {
    const el = rightSocketRefs.current[socketId];
    if (!el || !containerRef.current) return { x: 300, y: 50 };
    const elRect = el.getBoundingClientRect();
    const contRect = containerRef.current.getBoundingClientRect();
    return {
      x: elRect.left - contRect.left,
      y: elRect.top - contRect.top + elRect.height / 2
    };
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-3xl shadow-xl border-4 border-amber-300">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">⚡</span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Sim Ulash O'yini</h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Rangli simlarni o'z rangidagi rozetkaga ulang. Lampochkani yoqing! 💡
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2 bg-amber-50 p-1.5 rounded-2xl border-2 border-amber-200">
          <button
            onClick={() => { setLevel(1); sounds.playClick(); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
              level === 1 ? 'bg-amber-400 text-slate-900 shadow-md scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4 ta sim (30 🪙)
          </button>
          <button
            onClick={() => { setLevel(2); sounds.playClick(); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
              level === 2 ? 'bg-amber-400 text-slate-900 shadow-md scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            6 ta sim (50 🪙)
          </button>
          <button
            onClick={() => { setLevel(3); sounds.playClick(); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
              level === 3 ? 'bg-amber-400 text-slate-900 shadow-md scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            8 ta daho (100 🪙)
          </button>
        </div>
      </div>

      {/* Main Interactive Board */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-6 md:p-8 overflow-hidden touch-none select-none min-h-[460px] border-4 border-slate-700 shadow-inner"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Dynamic SVG wires */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Completed connections */}
          {Object.entries(connections).map(([wireId, socketId]) => {
            const wire = wires.find((w) => w.id === wireId);
            if (!wire) return null;
            const start = getPinPos(wireId);
            const end = getSocketPos(socketId);
            const c1X = start.x + (end.x - start.x) * 0.5;
            const c2X = start.x + (end.x - start.x) * 0.5;
            const pathD = `M ${start.x} ${start.y} C ${c1X} ${start.y}, ${c2X} ${end.y}, ${end.x} ${end.y}`;

            return (
              <g key={wireId}>
                {/* Glow layer */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={wire.colorHex}
                  strokeWidth="12"
                  strokeOpacity="0.4"
                  strokeLinecap="round"
                />
                {/* Solid core wire */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={wire.colorHex}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Currently dragging wire */}
          {activeDrag && (
            (() => {
              const wire = wires.find((w) => w.id === activeDrag.wireId);
              if (!wire) return null;
              const start = getPinPos(wire.id);
              const endX = activeDrag.currentX;
              const endY = activeDrag.currentY;
              const c1X = start.x + (endX - start.x) * 0.5;
              const pathD = `M ${start.x} ${start.y} C ${c1X} ${start.y}, ${c1X} ${endY}, ${endX} ${endY}`;

              return (
                <g>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={wire.colorHex}
                    strokeWidth="14"
                    strokeOpacity="0.3"
                    strokeLinecap="round"
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke={wire.colorHex}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="6,4"
                  />
                  <circle cx={endX} cy={endY} r="8" fill={wire.colorHex} stroke="#ffffff" strokeWidth="3" />
                </g>
              );
            })()
          )}
        </svg>

        {/* Terminals Grid */}
        <div className="relative z-20 flex justify-between items-center h-full gap-4">
          {/* Left: Source Wires */}
          <div className="flex flex-col justify-around gap-4 w-40 md:w-48">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-1">
              Simlar (Sudrang ➡️)
            </div>
            {wires.map((w) => {
              const isConnected = !!connections[w.id];
              const isDragging = activeDrag?.wireId === w.id;
              const hasError = errorWire === w.id;

              return (
                <div
                  key={w.id}
                  ref={(el) => { leftPinRefs.current[w.id] = el; }}
                  onPointerDown={(e) => handlePointerDown(w.id, e)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl cursor-grab active:cursor-grabbing transition-all border-2 ${
                    isConnected
                      ? 'bg-slate-800/80 border-emerald-500 opacity-90'
                      : hasError
                      ? 'bg-red-950/60 border-red-500 animate-bounce'
                      : isDragging
                      ? 'bg-slate-800 border-amber-400 scale-105'
                      : 'bg-slate-800/90 border-slate-600 hover:border-slate-400 hover:scale-102'
                  }`}
                  style={{ touchAction: 'none' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{w.emoji}</span>
                    <span className="text-xs md:text-sm font-black text-white">{w.label}</span>
                  </div>
                  {/* Plug terminal handle */}
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform"
                    style={{ backgroundColor: w.colorHex }}
                  >
                    {isConnected ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Lightbulbs Display */}
          <div className="hidden sm:flex flex-col items-center justify-center gap-3 px-2">
            <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
              {Object.keys(connections).length} / {wires.length} Ulangan
            </div>
            <div className="relative p-4 rounded-3xl bg-slate-800/50 border border-slate-700 flex flex-col items-center">
              <span className={`text-5xl transition-all duration-300 ${gameWon ? 'scale-125 filter drop-shadow-[0_0_20px_#facc15]' : Object.keys(connections).length > 0 ? 'filter drop-shadow-[0_0_10px_#fbbf24]' : 'opacity-40'}`}>
                💡
              </span>
              <span className="text-xs font-bold text-amber-400 mt-2">
                {gameWon ? 'HAMMASI YONDI!' : 'Ulab yoqing'}
              </span>
            </div>
          </div>

          {/* Right: Destination Sockets */}
          <div className="flex flex-col justify-around gap-4 w-40 md:w-48">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-1">
              Rozetkalar (Ulash)
            </div>
            {sockets.map((s) => {
              const isPlugged = Object.values(connections).includes(s.id);

              return (
                <div
                  key={s.id}
                  ref={(el) => { rightSocketRefs.current[s.id] = el; }}
                  className={`flex items-center justify-between p-2.5 rounded-2xl transition-all border-2 ${
                    isPlugged
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-800/90 border-slate-600'
                  }`}
                >
                  {/* Socket hole */}
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: s.colorHex }}
                  >
                    {isPlugged ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm font-black text-white">{s.label}</span>
                    <span className="text-xl">{s.emoji}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wrong connection spark banner */}
        {errorWire && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-red-600 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-yellow-300 font-black text-sm"
          >
            <span>⚡ Qisqa tutashuv!</span>
            <span>Rangni to'g'ri tanlang!</span>
          </motion.div>
        )}
      </div>

      {/* Victory Celebration Card */}
      {gameWon && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6 p-6 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-3xl shadow-lg border-4 border-white text-center text-slate-900"
        >
          <div className="text-5xl mb-2">🎉💡🏆</div>
          <h3 className="text-2xl font-black">BARAKALLA, ELEKTRIK USTOZ!</h3>
          <p className="font-bold text-slate-800 mt-1">
            Barcha simlarni xatosiz ulab, lampochkalarni yondirdingiz!
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-md font-black text-xl text-amber-600 my-4">
            <Award className="w-6 h-6 text-amber-500" />
            +{earnedCoins > 0 ? earnedCoins : levelCoins} COIN YUTIB OLDINGIZ!
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                if (level < 3) {
                  setLevel(level + 1);
                } else {
                  initGame();
                }
                sounds.playClick();
              }}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-base shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
            >
              {level < 3 ? `Keyingi daraja (${level + 1}-daraja) ➡️` : 'Qayta o\'ynash 🔄'}
            </button>
            <button
              onClick={initGame}
              className="px-5 py-3 bg-white text-slate-800 rounded-2xl font-bold text-base shadow hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Yana sinab ko'rish
            </button>
          </div>
        </motion.div>
      )}

      {/* Bottom Info bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-600 px-2 font-bold">
        <span>💡 Maslahat: Har bir simni o'ng tarafdagi xuddi shu rangli teshikka suring.</span>
        <button
          onClick={initGame}
          className="text-amber-700 hover:text-amber-800 underline flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Qayta boshlash
        </button>
      </div>
    </div>
  );
};
