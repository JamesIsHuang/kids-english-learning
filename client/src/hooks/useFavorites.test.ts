import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from './useFavorites';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useFavorites Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it('should add a word to favorites', () => {
    const { result } = renderHook(() => useFavorites());

    const testWord = {
      id: 'apple-1',
      english: 'Apple',
      chinese: '苹果',
      pronunciation: 'AP-ul',
      category: 'Fruits',
    };

    act(() => {
      result.current.addFavorite(testWord);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].id).toEqual(testWord.id);
    expect(result.current.favorites[0].english).toEqual(testWord.english);
    expect(result.current.favorites[0].chinese).toEqual(testWord.chinese);
    expect(result.current.favorites[0].addedAt).toBeDefined();
  });

  it('should remove a word from favorites', () => {
    const { result } = renderHook(() => useFavorites());

    const testWord = {
      id: 'apple-1',
      english: 'Apple',
      chinese: '苹果',
      pronunciation: 'AP-ul',
      category: 'Fruits',
    };

    act(() => {
      result.current.addFavorite(testWord);
    });

    expect(result.current.favorites).toHaveLength(1);

    act(() => {
      result.current.removeFavorite('apple-1');
    });

    expect(result.current.favorites).toHaveLength(0);
  });

  it('should check if a word is favorited', () => {
    const { result } = renderHook(() => useFavorites());

    const testWord = {
      id: 'apple-1',
      english: 'Apple',
      chinese: '苹果',
      pronunciation: 'AP-ul',
      category: 'Fruits',
    };

    act(() => {
      result.current.addFavorite(testWord);
    });

    expect(result.current.isFavorite('apple-1')).toBe(true);
    expect(result.current.isFavorite('banana-1')).toBe(false);
  });

  it('should clear all favorites', () => {
    const { result } = renderHook(() => useFavorites());

    const testWords = [
      {
        id: 'apple-1',
        english: 'Apple',
        chinese: '苹果',
        pronunciation: 'AP-ul',
        category: 'Fruits',
      },
      {
        id: 'banana-1',
        english: 'Banana',
        chinese: '香蕉',
        pronunciation: 'buh-NAN-uh',
        category: 'Fruits',
      },
    ];

    act(() => {
      testWords.forEach(word => result.current.addFavorite(word));
    });

    expect(result.current.favorites).toHaveLength(2);

    act(() => {
      result.current.clearAllFavorites();
    });

    expect(result.current.favorites).toHaveLength(0);
  });

  it('should persist favorites to localStorage', () => {
    const { result: result1 } = renderHook(() => useFavorites());

    const testWord = {
      id: 'apple-1',
      english: 'Apple',
      chinese: '苹果',
      pronunciation: 'AP-ul',
      category: 'Fruits',
    };

    act(() => {
      result1.current.addFavorite(testWord);
    });

    // Create a new hook instance to verify persistence
    const { result: result2 } = renderHook(() => useFavorites());

    expect(result2.current.favorites).toHaveLength(1);
    expect(result2.current.favorites[0].id).toEqual(testWord.id);
    expect(result2.current.favorites[0].english).toEqual(testWord.english);
    expect(result2.current.favorites[0].addedAt).toBeDefined();
  });

  it('should not add duplicate favorites', () => {
    const { result } = renderHook(() => useFavorites());

    const testWord = {
      id: 'apple-1',
      english: 'Apple',
      chinese: '苹果',
      pronunciation: 'AP-ul',
      category: 'Fruits',
    };

    act(() => {
      result.current.addFavorite(testWord);
    });

    act(() => {
      result.current.addFavorite(testWord);
    });

    expect(result.current.favorites).toHaveLength(1);
  });

  it('should toggle favorite status', () => {
    const { result } = renderHook(() => useFavorites());

    const testWord = {
      id: 'apple-1',
      english: 'Apple',
      chinese: '苹果',
      pronunciation: 'AP-ul',
      category: 'Fruits',
    };

    // First toggle - add to favorites
    act(() => {
      result.current.toggleFavorite(testWord);
    });

    expect(result.current.isFavorite('apple-1')).toBe(true);
    expect(result.current.favorites).toHaveLength(1);

    // Second toggle - remove from favorites
    act(() => {
      result.current.toggleFavorite(testWord);
    });

    expect(result.current.isFavorite('apple-1')).toBe(false);
    expect(result.current.favorites).toHaveLength(0);
  });
});
