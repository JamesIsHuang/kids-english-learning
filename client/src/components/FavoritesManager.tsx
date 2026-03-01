import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Trash2, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoritesManager() {
  const { favorites, removeFavorite, clearAllFavorites, isFavorite } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // 获取所有分类
  const categories = ['All', ...Array.from(new Set(favorites.map(fav => fav.category)))];

  // 过滤收藏的单词
  const filteredFavorites = selectedCategory === 'All'
    ? favorites
    : favorites.filter(fav => fav.category === selectedCategory);

  // 播放发音
  const playPronunciation = (word: string, id: string) => {
    setPlayingId(id);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.onend = () => setPlayingId(null);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">还没有收藏任何单词</h2>
        <p className="text-gray-600">在学习单词时点击❤️按钮来收藏不熟悉的单词吧！</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* 标题 */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-2">❤️ 我的收藏夹</h2>
        <p className="text-gray-600">
          已收藏 <span className="font-bold text-orange-600">{favorites.length}</span> 个单词
        </p>
      </div>

      {/* 分类过滤 */}
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-bold transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {category === 'All' ? '全部' : category}
            <span className="ml-2 text-sm">
              ({category === 'All' ? favorites.length : favorites.filter(f => f.category === category).length})
            </span>
          </button>
        ))}
      </div>

      {/* 单词卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence>
          {filteredFavorites.map((word, index) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-lg text-white"
            >
              {/* 单词内容 */}
              <div className="mb-4">
                <h3 className="text-3xl font-bold mb-2">{word.english}</h3>
                <p className="text-sm opacity-80 mb-2">{word.pronunciation}</p>
                <p className="text-lg font-semibold text-orange-200">{word.chinese}</p>
              </div>

              {/* 分类标签 */}
              {word.category && (
                <div className="mb-4 inline-block bg-yellow-300 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  {word.category}
                </div>
              )}

              {/* 按钮组 */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => playPronunciation(word.english, word.id)}
                  className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ${
                    playingId === word.id
                      ? 'bg-yellow-300 text-blue-600 animate-pulse'
                      : 'bg-white text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <Volume2 className="mr-2" size={18} />
                  听发音
                </button>
                <button
                  onClick={() => removeFavorite(word.id)}
                  className="px-4 py-2 rounded-lg font-bold bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                  <Trash2 className="mr-2" size={18} />
                  删除
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 清空按钮 */}
      {favorites.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => {
              if (window.confirm('确定要清空所有收藏吗？')) {
                clearAllFavorites();
              }
            }}
            className="px-6 py-3 rounded-full font-bold bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          >
            🗑️ 清空所有收藏
          </button>
        </div>
      )}
    </div>
  );
}
