import { describe, it, expect } from 'vitest';
import { generateWords } from './generateWords';

describe('generateWords', () => {
  it('应该生成单词数组', () => {
    const words = generateWords();
    expect(Array.isArray(words)).toBe(true);
  });

  it('应该生成至少240个单词', () => {
    const words = generateWords();
    expect(words.length).toBeGreaterThanOrEqual(240);
  });

  it('每个单词应该有必需的字段', () => {
    const words = generateWords();
    words.forEach((word) => {
      expect(word).toHaveProperty('id');
      expect(word).toHaveProperty('english');
      expect(word).toHaveProperty('chinese');
      expect(word).toHaveProperty('pronunciation');
      expect(word).toHaveProperty('category');
    });
  });

  it('所有单词ID应该是唯一的', () => {
    const words = generateWords();
    const ids = words.map((w) => w.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('所有单词ID应该是连续的', () => {
    const words = generateWords();
    for (let i = 0; i < words.length; i++) {
      expect(words[i].id).toBe(i + 1);
    }
  });

  it('单词应该分布在多个分类中', () => {
    const words = generateWords();
    const categories = new Set(words.map((w) => w.category));
    expect(categories.size).toBeGreaterThanOrEqual(8);
  });

  it('每个分类应该至少有5个单词', () => {
    const words = generateWords();
    const categoryCounts: Record<string, number> = {};

    words.forEach((word) => {
      categoryCounts[word.category] = (categoryCounts[word.category] || 0) + 1;
    });

    Object.values(categoryCounts).forEach((count) => {
      expect(count).toBeGreaterThanOrEqual(5);
    });
  });

  it('单词数据不应该为空', () => {
    const words = generateWords();
    words.forEach((word) => {
      expect(word.english.length).toBeGreaterThan(0);
      expect(word.chinese.length).toBeGreaterThan(0);
      expect(word.pronunciation.length).toBeGreaterThan(0);
      expect(word.category.length).toBeGreaterThan(0);
    });
  });

  it('应该包含常见的分类', () => {
    const words = generateWords();
    const categories = new Set(words.map((w) => w.category));
    expect(categories.has('Fruits')).toBe(true);
    expect(categories.has('Vegetables')).toBe(true);
    expect(categories.has('Food')).toBe(true);
    expect(categories.has('Animals')).toBe(true);
    expect(categories.has('Colors')).toBe(true);
    expect(categories.has('Numbers')).toBe(true);
  });
});
