import { Question, Reward, Achievement, Difficulty } from '../types';
import { mathQuestions } from './mathQuestions';
import { riddleQuestions } from './riddleQuestions';
import { quizQuestions } from './quizQuestions';

export const allInitialQuestions: Question[] = [
  ...mathQuestions,
  ...riddleQuestions,
  ...quizQuestions
];

export const defaultRewards: Reward[] = [
  {
    id: 'rew_1',
    title: '5 000 so\'m naqd pul',
    description: 'Haqiqiy muzqaymoq yoki shirinlik uchun cho\'ntak puli!',
    coinCost: 10000,
    realValueText: '5 000 so\'m 💵',
    icon: '💵',
    category: 'money'
  },
  {
    id: 'rew_2',
    title: '10 000 so\'m naqd pul',
    description: 'Katta muzqaymoq yoki sevimli sharbat uchun pul!',
    coinCost: 25000,
    realValueText: '10 000 so\'m 💵',
    icon: '💰',
    category: 'money'
  },
  {
    id: 'rew_3',
    title: 'Katta sovg\'a (O\'yinchoq / Kitob)',
    description: 'Ota-ona bilan kelishilgan ajoyib konstruktor, lego yoki qiziqarli kitob!',
    coinCost: 50000,
    realValueText: 'O\'yinchoq yoki Kitob 🎁',
    icon: '🎁',
    category: 'gift'
  },
  {
    id: 'rew_4',
    title: 'Super Sovg\'a (Velosiped / Planshet)',
    description: 'Haqiqiy daho o\'quvchi uchun orzudagi eng katta mukofot!',
    coinCost: 100000,
    realValueText: 'Super Sovg\'a 🏆',
    icon: '🏆',
    category: 'grand'
  }
];

export const defaultAchievements: Achievement[] = [
  {
    id: 'ach_first_step',
    title: 'Birinchi qadam!',
    description: 'Ilk to\'g\'ri javobingizni berdingiz',
    icon: '🌱',
    unlocked: false
  },
  {
    id: 'ach_10_solved',
    title: 'Bilimga intiluvchi',
    description: '10 ta savolga to\'g\'ri javob berdingiz',
    icon: '⭐',
    unlocked: false
  },
  {
    id: 'ach_50_solved',
    title: 'Kichik professor',
    description: '50 ta savol va masalani yechdingiz',
    icon: '🎖️',
    unlocked: false
  },
  {
    id: 'ach_100_solved',
    title: '100 ta yulduz!',
    description: '100 ta savolni zabt etdingiz',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'ach_streak_3',
    title: 'Uch kunlik seriya 🔥',
    description: '3 kun ketma-ket saytga kirib bilim oldingiz',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'ach_streak_7',
    title: 'Hafta qahramoni 🌟',
    description: '7 kun ketma-ket to\'xtovsiz o\'qidingiz',
    icon: '👑',
    unlocked: false
  },
  {
    id: 'ach_wire_master',
    title: 'Simlar ustasi ⚡',
    description: 'Sim ulash o\'yinida g\'olib bo\'ldingiz',
    icon: '💡',
    unlocked: false
  },
  {
    id: 'ach_rich_kid',
    title: 'Coin boyi 💰',
    description: '1 000 ta coin to\'pladingiz',
    icon: '💎',
    unlocked: false
  }
];

export function getBaseCoinsForDifficulty(diff: Difficulty): number {
  switch (diff) {
    case 'oson': return 5;
    case 'orta': return 10;
    case 'qiyin': return 20;
    case 'daho': return 40;
    default: return 5;
  }
}

export function calculateCoinsWithAntiAbuse(baseCoins: number, solveCount: number): number {
  if (solveCount === 0) {
    return baseCoins; // 1-marta: 100%
  } else if (solveCount === 1) {
    return Math.max(1, Math.floor(baseCoins * 0.25)); // 2-marta: 25%
  } else {
    return 0; // 3-marta va undan keyin: 0 coin
  }
}

export function getUserRank(totalSolved: number, coins: number): string {
  if (coins >= 50000 || totalSolved >= 300) return 'Akademik 🎓';
  if (coins >= 20000 || totalSolved >= 150) return 'Daho 🧠';
  if (coins >= 5000 || totalSolved >= 70) return 'Ziyoli 🌟';
  if (coins >= 1000 || totalSolved >= 25) return 'Bilimdon 🚀';
  return 'Yangi o\'quvchi 🌱';
}
