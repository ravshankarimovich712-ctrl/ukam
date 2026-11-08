import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ChildProfile,
  Reward,
  RedemptionRequest,
  CoinTransaction,
  Achievement,
  ParentSettings,
  Question,
  DailyMission
} from '../types';
import {
  allInitialQuestions,
  defaultRewards,
  defaultAchievements,
  calculateCoinsWithAntiAbuse,
  getUserRank
} from '../data/allQuestions';
import { sounds } from '../utils/soundEffects';

interface AppContextType {
  profile: ChildProfile;
  rewards: Reward[];
  redemptions: RedemptionRequest[];
  transactions: CoinTransaction[];
  achievements: Achievement[];
  parentSettings: ParentSettings;
  customQuestions: Question[];
  dailyMissions: DailyMission[];
  soundEnabled: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  awardCoinsForQuestion: (baseCoins: number, questionId: string, reason: string) => number;
  awardDirectCoins: (amount: number, reason: string, missionType?: 'wires' | 'math' | 'quiz') => number;
  spendCoins: (amount: number, reason: string) => boolean;
  requestRedemption: (rewardId: string) => { success: boolean; message: string };
  approveRedemption: (requestId: string) => void;
  rejectRedemption: (requestId: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  updateProfileNameAndAvatar: (name: string, avatar: string) => void;
  updateParentSettings: (settings: Partial<ParentSettings>) => void;
  addCustomQuestion: (q: Question) => void;
  deleteCustomQuestion: (id: string) => void;
  saveReward: (reward: Reward) => void;
  deleteReward: (id: string) => void;
  getAllQuestions: () => Question[];
  claimDailyBonus: () => { success: boolean; coins: number; message: string };
  recordQuestionAttempt: (questionId: string, isCorrect: boolean, category: 'math' | 'riddle' | 'quiz') => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'UKAMNI_BILIMLI_QILAMIZ_V1';

const defaultProfile: ChildProfile = {
  name: 'Azizbek',
  avatar: '🚀',
  coins: 50,
  totalSolved: 0,
  correctCount: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyCoinsToday: 0,
  solvedHistory: {}
};

const defaultSettings: ParentSettings = {
  pin: '1234',
  dailyCoinLimit: 1500,
  allowHints: true
};

const initialDailyMissions: DailyMission[] = [
  {
    id: 'm1',
    title: '5 ta matematika misolini yechish',
    targetCount: 5,
    currentCount: 0,
    rewardCoins: 25,
    completed: false,
    type: 'math'
  },
  {
    id: 'm2',
    title: 'Sim ulash o\'yinida 1 ta g\'alaba qozonish',
    targetCount: 1,
    currentCount: 0,
    rewardCoins: 30,
    completed: false,
    type: 'wires'
  },
  {
    id: 'm3',
    title: 'Qiziqarli testda 5 ta savolga javob berish',
    targetCount: 5,
    currentCount: 0,
    rewardCoins: 25,
    completed: false,
    type: 'quiz'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ChildProfile>(defaultProfile);
  const [rewards, setRewards] = useState<Reward[]>(defaultRewards);
  const [redemptions, setRedemptions] = useState<RedemptionRequest[]>([]);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [parentSettings, setParentSettings] = useState<ParentSettings>(defaultSettings);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(initialDailyMissions);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.profile) {
          const today = new Date().toISOString().split('T')[0];
          // Check streak and daily coin reset
          const lastDate = data.profile.lastActiveDate || today;
          let newStreak = data.profile.streakDays || 1;
          let dailyCoins = data.profile.dailyCoinsToday || 0;

          if (lastDate !== today) {
            dailyCoins = 0; // Reset daily counter for new day
            const d1 = new Date(lastDate);
            const d2 = new Date(today);
            const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1;
            }
          }

          setProfile({
            ...data.profile,
            streakDays: newStreak,
            dailyCoinsToday: dailyCoins,
            lastActiveDate: today
          });
        }
        if (data.rewards) setRewards(data.rewards);
        if (data.redemptions) setRedemptions(data.redemptions);
        if (data.transactions) setTransactions(data.transactions);
        if (data.achievements) setAchievements(data.achievements);
        if (data.parentSettings) setParentSettings(data.parentSettings);
        if (data.customQuestions) setCustomQuestions(data.customQuestions);
        if (data.dailyMissions) setDailyMissions(data.dailyMissions);
        if (typeof data.soundEnabled === 'boolean') {
          setSoundEnabledState(data.soundEnabled);
          sounds.setSoundEnabled(data.soundEnabled);
        }
      }
    } catch (e) {
      console.error('Storage loading error', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        profile,
        rewards,
        redemptions,
        transactions,
        achievements,
        parentSettings,
        customQuestions,
        dailyMissions,
        soundEnabled
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Storage saving error', e);
    }
  }, [
    profile,
    rewards,
    redemptions,
    transactions,
    achievements,
    parentSettings,
    customQuestions,
    dailyMissions,
    soundEnabled,
    isLoaded
  ]);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sounds.setSoundEnabled(enabled);
  };

  const checkAndUpdateAchievements = (newProfile: ChildProfile) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.unlocked) return ach;
        let shouldUnlock = false;

        if (ach.id === 'ach_first_step' && newProfile.correctCount >= 1) shouldUnlock = true;
        if (ach.id === 'ach_10_solved' && newProfile.correctCount >= 10) shouldUnlock = true;
        if (ach.id === 'ach_50_solved' && newProfile.correctCount >= 50) shouldUnlock = true;
        if (ach.id === 'ach_100_solved' && newProfile.correctCount >= 100) shouldUnlock = true;
        if (ach.id === 'ach_streak_3' && newProfile.streakDays >= 3) shouldUnlock = true;
        if (ach.id === 'ach_streak_7' && newProfile.streakDays >= 7) shouldUnlock = true;
        if (ach.id === 'ach_rich_kid' && newProfile.coins >= 1000) shouldUnlock = true;

        if (shouldUnlock) {
          sounds.playFanfare();
          return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString('uz-UZ') };
        }
        return ach;
      })
    );
  };

  const updateMissions = (type: 'math' | 'wires' | 'quiz' | 'any') => {
    setDailyMissions((prev) =>
      prev.map((m) => {
        if (m.completed) return m;
        if (m.type === type || m.type === 'any') {
          const nextCount = m.currentCount + 1;
          const isDone = nextCount >= m.targetCount;
          if (isDone) {
            // Reward bonus coins for completed mission!
            awardDirectCoins(m.rewardCoins, `Topshiriq bajarildi: ${m.title}`);
          }
          return {
            ...m,
            currentCount: nextCount,
            completed: isDone
          };
        }
        return m;
      })
    );
  };

  /**
   * Question coin award with anti-abuse diminishing returns & daily cap
   */
  const awardCoinsForQuestion = (baseCoins: number, questionId: string, reason: string): number => {
    const today = new Date().toISOString().split('T')[0];
    const solveCount = profile.solvedHistory[questionId] || 0;
    const coinsToEarn = calculateCoinsWithAntiAbuse(baseCoins, solveCount);

    if (coinsToEarn <= 0) {
      // Still update history even if 0 coins
      setProfile((prev) => ({
        ...prev,
        solvedHistory: {
          ...prev.solvedHistory,
          [questionId]: solveCount + 1
        }
      }));
      return 0;
    }

    // Daily limit check
    const currentDaily = profile.dailyCoinsToday || 0;
    const remainingDailyCap = Math.max(0, parentSettings.dailyCoinLimit - currentDaily);
    const finalCoins = Math.min(coinsToEarn, remainingDailyCap);

    if (finalCoins <= 0) {
      return 0;
    }

    const newProfile: ChildProfile = {
      ...profile,
      coins: profile.coins + finalCoins,
      dailyCoinsToday: currentDaily + finalCoins,
      lastActiveDate: today,
      solvedHistory: {
        ...profile.solvedHistory,
        [questionId]: solveCount + 1
      }
    };

    setProfile(newProfile);

    // Record transaction
    const newTx: CoinTransaction = {
      id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 6),
      amount: finalCoins,
      type: 'earn',
      reason: solveCount > 0 ? `${reason} (Qayta yechish 25%)` : reason,
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    };
    setTransactions((prev) => [newTx, ...prev.slice(0, 49)]);

    sounds.playCoin();
    checkAndUpdateAchievements(newProfile);

    return finalCoins;
  };

  /**
   * Direct coin award (Games, Test 10/10 Bonus, Daily Login)
   */
  const awardDirectCoins = (amount: number, reason: string, missionType?: 'wires' | 'math' | 'quiz'): number => {
    const today = new Date().toISOString().split('T')[0];
    const currentDaily = profile.dailyCoinsToday || 0;
    const remainingDailyCap = Math.max(0, parentSettings.dailyCoinLimit - currentDaily);
    const finalCoins = Math.min(amount, remainingDailyCap);

    if (finalCoins > 0) {
      const newProfile: ChildProfile = {
        ...profile,
        coins: profile.coins + finalCoins,
        dailyCoinsToday: currentDaily + finalCoins,
        lastActiveDate: today
      };
      setProfile(newProfile);

      const newTx: CoinTransaction = {
        id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 6),
        amount: finalCoins,
        type: 'earn',
        reason,
        timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      };
      setTransactions((prev) => [newTx, ...prev.slice(0, 49)]);

      sounds.playCoin();
      checkAndUpdateAchievements(newProfile);
    }

    if (missionType) {
      updateMissions(missionType);
    }

    return finalCoins;
  };

  /**
   * Deduct coins for hint or purchase
   */
  const spendCoins = (amount: number, reason: string): boolean => {
    if (profile.coins < amount) {
      return false;
    }

    setProfile((prev) => ({
      ...prev,
      coins: prev.coins - amount
    }));

    const newTx: CoinTransaction = {
      id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 6),
      amount,
      type: 'spend',
      reason,
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    };
    setTransactions((prev) => [newTx, ...prev.slice(0, 49)]);

    return true;
  };

  /**
   * Record question statistics
   */
  const recordQuestionAttempt = (questionId: string, isCorrect: boolean, category: 'math' | 'riddle' | 'quiz') => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        totalSolved: prev.totalSolved + 1,
        correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount
      };
      checkAndUpdateAchievements(updated);
      return updated;
    });

    if (isCorrect) {
      if (category === 'math') updateMissions('math');
      if (category === 'quiz') updateMissions('quiz');
    }
  };

  /**
   * Request reward exchange
   */
  const requestRedemption = (rewardId: string): { success: boolean; message: string } => {
    const rew = rewards.find((r) => r.id === rewardId);
    if (!rew) return { success: false, message: 'Sovg\'a topilmadi!' };

    if (profile.coins < rew.coinCost) {
      const diff = rew.coinCost - profile.coins;
      return {
        success: false,
        message: `Coin yetarli emas! Yana ${diff.toLocaleString()} ta coin to'plashingiz kerak.`
      };
    }

    const newReq: RedemptionRequest = {
      id: 'req_' + Date.now(),
      rewardId: rew.id,
      rewardTitle: rew.title,
      coinCost: rew.coinCost,
      realValueText: rew.realValueText,
      date: new Date().toLocaleDateString('uz-UZ') + ' ' + new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    setRedemptions((prev) => [newReq, ...prev]);
    return {
      success: true,
      message: 'So\'rovingiz ota-onangizga yuborildi! Ota-ona tasdiqlasa, sovg\'angiz beriladi 🎉'
    };
  };

  const approveRedemption = (requestId: string) => {
    const req = redemptions.find((r) => r.id === requestId);
    if (!req || req.status !== 'pending') return;

    // Deduct coins upon parent approval
    if (profile.coins >= req.coinCost) {
      spendCoins(req.coinCost, `Sovg'a olindi: ${req.rewardTitle}`);
      setRedemptions((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' as const } : r))
      );
      sounds.playFanfare();
    }
  };

  const rejectRedemption = (requestId: string) => {
    setRedemptions((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' as const } : r))
    );
  };

  const updateProfileNameAndAvatar = (name: string, avatar: string) => {
    setProfile((prev) => ({ ...prev, name, avatar }));
  };

  const updateParentSettings = (settings: Partial<ParentSettings>) => {
    setParentSettings((prev) => ({ ...prev, ...settings }));
  };

  const addCustomQuestion = (q: Question) => {
    setCustomQuestions((prev) => [q, ...prev]);
  };

  const deleteCustomQuestion = (id: string) => {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const saveReward = (reward: Reward) => {
    setRewards((prev) => {
      const idx = prev.findIndex((r) => r.id === reward.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = reward;
        return copy;
      }
      return [...prev, reward];
    });
  };

  const deleteReward = (id: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
  };

  const getAllQuestions = (): Question[] => {
    return [...allInitialQuestions, ...customQuestions];
  };

  const claimDailyBonus = (): { success: boolean; coins: number; message: string } => {
    const bonus = profile.streakDays >= 7 ? 100 : 10;
    awardDirectCoins(bonus, `Kunlik kirish bonusi (${profile.streakDays}-kun)`);
    return {
      success: true,
      coins: bonus,
      message: `Tabriklaymiz! Bugungi kirish uchun +${bonus} coin taqdim etildi! 🔥`
    };
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        rewards,
        redemptions,
        transactions,
        achievements,
        parentSettings,
        customQuestions,
        dailyMissions,
        soundEnabled,
        activeTab,
        setActiveTab,
        awardCoinsForQuestion,
        awardDirectCoins,
        spendCoins,
        requestRedemption,
        approveRedemption,
        rejectRedemption,
        setSoundEnabled,
        updateProfileNameAndAvatar,
        updateParentSettings,
        addCustomQuestion,
        deleteCustomQuestion,
        saveReward,
        deleteReward,
        getAllQuestions,
        claimDailyBonus,
        recordQuestionAttempt
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
