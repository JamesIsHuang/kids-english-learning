import { useState, useEffect } from 'react';

export interface FavoriteWord {
  id: string;
  english: string;
  chinese: string;
  pronunciation: string;
  category: string;
  addedAt: number;
}

const FAVORITES_KEY = 'english_learning_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始化：从LocalStorage加载收藏数据
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // 保存收藏数据到LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  // 添加收藏
  const addFavorite = (word: Omit<FavoriteWord, 'addedAt'>) => {
    setFavorites(prev => {
      // 检查是否已经收藏
      if (prev.some(fav => fav.id === word.id)) {
        return prev;
      }
      return [...prev, { ...word, addedAt: Date.now() }];
    });
  };

  // 移除收藏
  const removeFavorite = (wordId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== wordId));
  };

  // 检查是否已收藏
  const isFavorite = (wordId: string) => {
    return favorites.some(fav => fav.id === wordId);
  };

  // 获取指定分类的收藏单词
  const getFavoritesByCategory = (category: string) => {
    return favorites.filter(fav => fav.category === category);
  };

  // 清空所有收藏
  const clearAllFavorites = () => {
    setFavorites([]);
  };

  // 切换收藏状态
  const toggleFavorite = (word: Omit<FavoriteWord, 'addedAt'>) => {
    if (isFavorite(word.id)) {
      removeFavorite(word.id);
    } else {
      addFavorite(word);
    }
  };

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoritesByCategory,
    clearAllFavorites,
    toggleFavorite,
  };
}
