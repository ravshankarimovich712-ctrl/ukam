export type Difficulty = 'oson' | 'orta' | 'qiyin' | 'daho';

export type QuestionCategory = 'math' | 'riddle' | 'quiz';

export interface Question {
  id: string;
  category: QuestionCategory;
  subcategory?: string;
  difficulty: Difficulty;
  text: string;
  visualEmoji?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  coinCost: number;
  realValueText: string;
  icon: string;
  category: 'money' | 'gift' | 'grand';
}

export interface RedemptionRequest {
  id: string;
  rewardId: string;
  rewardTitle: string;
  coinCost: number;
  realValueText: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CoinTransaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  timestamp: string;
}

export interface DailyMission {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  rewardCoins: number;
  completed: boolean;
  type: 'math' | 'wires' | 'quiz' | 'any';
}

export interface ChildProfile {
  name: string;
  avatar: string;
  coins: number;
  totalSolved: number;
  correctCount: number;
  streakDays: number;
  lastActiveDate: string;
  dailyCoinsToday: number;
  solvedHistory: Record<string, number>; // questionId -> solveCount
}

export interface ParentSettings {
  pin: string;
  dailyCoinLimit: number;
  allowHints: boolean;
}
