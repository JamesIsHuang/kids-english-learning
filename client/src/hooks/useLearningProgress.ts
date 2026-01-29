import { useState, useEffect, useCallback } from 'react';

export interface LearningRecord {
  date: string;
  alphabetLearned: number;
  wordsLearned: number;
  totalLearningTime: number; // 分钟
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: LearningStats) => boolean;
  unlockedDate?: string;
}

export interface LearningStats {
  totalAlphabetLearned: number;
  totalWordsLearned: number;
  totalLearningTime: number;
  consecutiveDays: number;
  lastLearningDate: string;
  totalDaysLearned: number;
}

const STORAGE_KEY = 'kids_english_learning_data';
const ACHIEVEMENTS_KEY = 'kids_english_achievements';

// 定义所有成就
export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_letter',
    name: '字母初学者',
    description: '学习第一个字母',
    icon: '🔤',
    condition: (stats) => stats.totalAlphabetLearned >= 1,
  },
  {
    id: 'alphabet_master',
    name: '字母大师',
    description: '学完所有26个字母',
    icon: '🎓',
    condition: (stats) => stats.totalAlphabetLearned >= 26,
  },
  {
    id: 'first_word',
    name: '单词初学者',
    description: '学习第一个单词',
    icon: '📚',
    condition: (stats) => stats.totalWordsLearned >= 1,
  },
  {
    id: 'word_collector_10',
    name: '词汇收集者',
    description: '学习10个单词',
    icon: '📖',
    condition: (stats) => stats.totalWordsLearned >= 10,
  },
  {
    id: 'word_collector_50',
    name: '词汇大使',
    description: '学习50个单词',
    icon: '🌟',
    condition: (stats) => stats.totalWordsLearned >= 50,
  },
  {
    id: 'word_collector_100',
    name: '词汇专家',
    description: '学习100个单词',
    icon: '👑',
    condition: (stats) => stats.totalWordsLearned >= 100,
  },
  {
    id: 'word_collector_200',
    name: '词汇王者',
    description: '学习所有200个单词',
    icon: '🏆',
    condition: (stats) => stats.totalWordsLearned >= 200,
  },
  {
    id: 'learning_streak_3',
    name: '坚持学习者',
    description: '连续学习3天',
    icon: '🔥',
    condition: (stats) => stats.consecutiveDays >= 3,
  },
  {
    id: 'learning_streak_7',
    name: '学习达人',
    description: '连续学习7天',
    icon: '⚡',
    condition: (stats) => stats.consecutiveDays >= 7,
  },
  {
    id: 'learning_time_1h',
    name: '时间投入者',
    description: '累计学习1小时',
    icon: '⏱️',
    condition: (stats) => stats.totalLearningTime >= 60,
  },
  {
    id: 'learning_time_5h',
    name: '学习狂人',
    description: '累计学习5小时',
    icon: '💪',
    condition: (stats) => stats.totalLearningTime >= 300,
  },
];

export function useLearningProgress() {
  const [stats, setStats] = useState<LearningStats>({
    totalAlphabetLearned: 0,
    totalWordsLearned: 0,
    totalLearningTime: 0,
    consecutiveDays: 0,
    lastLearningDate: '',
    totalDaysLearned: 0,
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  // 初始化数据
  useEffect(() => {
    loadLearningData();
    loadUnlockedAchievements();
  }, []);

  // 从LocalStorage加载数据
  const loadLearningData = useCallback(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setStats(parsed);
      }
    } catch (error) {
      console.error('Failed to load learning data:', error);
    }
  }, []);

  // 从LocalStorage加载已解锁的成就
  const loadUnlockedAchievements = useCallback(() => {
    try {
      const data = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (data) {
        setUnlockedAchievements(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  }, []);

  // 保存学习数据
  const saveStats = useCallback((newStats: LearningStats) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      setStats(newStats);
    } catch (error) {
      console.error('Failed to save learning data:', error);
    }
  }, []);

  // 记录学习字母
  const recordAlphabetLearning = useCallback((count: number = 1) => {
    const newStats = { ...stats, totalAlphabetLearned: stats.totalAlphabetLearned + count };
    updateLearningStats(newStats);
  }, [stats]);

  // 记录学习单词
  const recordWordLearning = useCallback((count: number = 1) => {
    const newStats = { ...stats, totalWordsLearned: stats.totalWordsLearned + count };
    updateLearningStats(newStats);
  }, [stats]);

  // 更新学习时间
  const recordLearningTime = useCallback((minutes: number) => {
    const newStats = { ...stats, totalLearningTime: stats.totalLearningTime + minutes };
    updateLearningStats(newStats);
  }, [stats]);

  // 更新学习统计
  const updateLearningStats = useCallback((newStats: LearningStats) => {
    const today = new Date().toISOString().split('T')[0];
    
    // 计算连续学习天数
    if (stats.lastLearningDate) {
      const lastDate = new Date(stats.lastLearningDate);
      const currentDate = new Date(today);
      const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // 连续学习
        newStats.consecutiveDays = stats.consecutiveDays + 1;
      } else if (daysDiff > 1) {
        // 中断了，重新开始
        newStats.consecutiveDays = 1;
      }
    } else {
      newStats.consecutiveDays = 1;
    }

    newStats.lastLearningDate = today;
    newStats.totalDaysLearned = stats.totalDaysLearned + (stats.lastLearningDate !== today ? 1 : 0);

    saveStats(newStats);
    checkAchievements(newStats);
  }, [stats, saveStats]);

  // 检查新解锁的成就
  const checkAchievements = useCallback((currentStats: LearningStats) => {
    const newlyUnlocked: string[] = [];

    ALL_ACHIEVEMENTS.forEach((achievement) => {
      if (!unlockedAchievements.includes(achievement.id) && achievement.condition(currentStats)) {
        newlyUnlocked.push(achievement.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      const updated = [...unlockedAchievements, ...newlyUnlocked];
      setUnlockedAchievements(updated);
      try {
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save achievements:', error);
      }
    }
  }, [unlockedAchievements]);

  // 获取已解锁的成就对象
  const getUnlockedAchievementObjects = useCallback(() => {
    return ALL_ACHIEVEMENTS.filter((a) => unlockedAchievements.includes(a.id));
  }, [unlockedAchievements]);

  // 重置所有数据（仅用于测试）
  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACHIEVEMENTS_KEY);
    setStats({
      totalAlphabetLearned: 0,
      totalWordsLearned: 0,
      totalLearningTime: 0,
      consecutiveDays: 0,
      lastLearningDate: '',
      totalDaysLearned: 0,
    });
    setUnlockedAchievements([]);
  }, []);

  return {
    stats,
    unlockedAchievements: getUnlockedAchievementObjects(),
    recordAlphabetLearning,
    recordWordLearning,
    recordLearningTime,
    resetAllData,
  };
}
