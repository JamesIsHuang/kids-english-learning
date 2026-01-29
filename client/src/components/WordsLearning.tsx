import { useState, useMemo } from 'react';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 单词学习组件
 * 设计风格：欢乐卡通风格
 * - 100个日常单词分类学习
 * - 卡片翻转动画展示英文和中文
 * - 点击发音按钮可以听单词发音
 * - 支持按分类筛选
 */

interface Word {
  id: number;
  english: string;
  chinese: string;
  pronunciation: string;
  category: string;
}

const wordsData: Word[] = [
  { id: 1, english: 'Apple', chinese: '苹果', pronunciation: 'AP-ul', category: 'Fruits' },
  { id: 2, english: 'Banana', chinese: '香蕉', pronunciation: 'buh-NAN-uh', category: 'Fruits' },
  { id: 3, english: 'Orange', chinese: '橙子', pronunciation: 'OR-inj', category: 'Fruits' },
  { id: 4, english: 'Strawberry', chinese: '草莓', pronunciation: 'STRAW-ber-ee', category: 'Fruits' },
  { id: 5, english: 'Watermelon', chinese: '西瓜', pronunciation: 'WO-ter-mel-un', category: 'Fruits' },
  { id: 6, english: 'Grape', chinese: '葡萄', pronunciation: 'GRAYP', category: 'Fruits' },
  { id: 7, english: 'Lemon', chinese: '柠檬', pronunciation: 'LEM-un', category: 'Fruits' },
  { id: 8, english: 'Mango', chinese: '芒果', pronunciation: 'MANG-go', category: 'Fruits' },
  { id: 9, english: 'Pear', chinese: '梨', pronunciation: 'PAIR', category: 'Fruits' },
  { id: 10, english: 'Peach', chinese: '桃子', pronunciation: 'PEECH', category: 'Fruits' },
  { id: 11, english: 'Carrot', chinese: '胡萝卜', pronunciation: 'KAR-ut', category: 'Vegetables' },
  { id: 12, english: 'Tomato', chinese: '番茄', pronunciation: 'tuh-MAH-to', category: 'Vegetables' },
  { id: 13, english: 'Potato', chinese: '土豆', pronunciation: 'puh-TAY-to', category: 'Vegetables' },
  { id: 14, english: 'Broccoli', chinese: '西兰花', pronunciation: 'BROK-uh-lee', category: 'Vegetables' },
  { id: 15, english: 'Cabbage', chinese: '卷心菜', pronunciation: 'KAB-ij', category: 'Vegetables' },
  { id: 16, english: 'Cucumber', chinese: '黄瓜', pronunciation: 'KYO-kum-ber', category: 'Vegetables' },
  { id: 17, english: 'Lettuce', chinese: '生菜', pronunciation: 'LET-us', category: 'Vegetables' },
  { id: 18, english: 'Onion', chinese: '洋葱', pronunciation: 'UN-yun', category: 'Vegetables' },
  { id: 19, english: 'Pepper', chinese: '辣椒', pronunciation: 'PEP-er', category: 'Vegetables' },
  { id: 20, english: 'Corn', chinese: '玉米', pronunciation: 'KORN', category: 'Vegetables' },
  { id: 21, english: 'Bread', chinese: '面包', pronunciation: 'BRED', category: 'Food' },
  { id: 22, english: 'Rice', chinese: '米饭', pronunciation: 'RYS', category: 'Food' },
  { id: 23, english: 'Milk', chinese: '牛奶', pronunciation: 'MILK', category: 'Food' },
  { id: 24, english: 'Cheese', chinese: '奶酪', pronunciation: 'CHEEZ', category: 'Food' },
  { id: 25, english: 'Egg', chinese: '鸡蛋', pronunciation: 'EG', category: 'Food' },
  { id: 26, english: 'Chicken', chinese: '鸡肉', pronunciation: 'CHIK-un', category: 'Food' },
  { id: 27, english: 'Fish', chinese: '鱼', pronunciation: 'FISH', category: 'Food' },
  { id: 28, english: 'Meat', chinese: '肉', pronunciation: 'MEET', category: 'Food' },
  { id: 29, english: 'Soup', chinese: '汤', pronunciation: 'SOOP', category: 'Food' },
  { id: 30, english: 'Noodle', chinese: '面条', pronunciation: 'NOO-dul', category: 'Food' },
  { id: 31, english: 'Cat', chinese: '猫', pronunciation: 'KAT', category: 'Animals' },
  { id: 32, english: 'Dog', chinese: '狗', pronunciation: 'DOG', category: 'Animals' },
  { id: 33, english: 'Bird', chinese: '鸟', pronunciation: 'BERD', category: 'Animals' },
  { id: 34, english: 'Fish', chinese: '鱼', pronunciation: 'FISH', category: 'Animals' },
  { id: 35, english: 'Elephant', chinese: '大象', pronunciation: 'EL-uh-funt', category: 'Animals' },
  { id: 36, english: 'Lion', chinese: '狮子', pronunciation: 'LY-un', category: 'Animals' },
  { id: 37, english: 'Tiger', chinese: '老虎', pronunciation: 'TY-ger', category: 'Animals' },
  { id: 38, english: 'Monkey', chinese: '猴子', pronunciation: 'MUN-kee', category: 'Animals' },
  { id: 39, english: 'Rabbit', chinese: '兔子', pronunciation: 'RAB-it', category: 'Animals' },
  { id: 40, english: 'Bear', chinese: '熊', pronunciation: 'BAIR', category: 'Animals' },
  { id: 41, english: 'House', chinese: '房子', pronunciation: 'HOUS', category: 'Places' },
  { id: 42, english: 'School', chinese: '学校', pronunciation: 'SKOOL', category: 'Places' },
  { id: 43, english: 'Park', chinese: '公园', pronunciation: 'PARK', category: 'Places' },
  { id: 44, english: 'Beach', chinese: '海滩', pronunciation: 'BEECH', category: 'Places' },
  { id: 45, english: 'Mountain', chinese: '山', pronunciation: 'MOUN-tin', category: 'Places' },
  { id: 46, english: 'River', chinese: '河', pronunciation: 'RIV-er', category: 'Places' },
  { id: 47, english: 'Forest', chinese: '森林', pronunciation: 'FOR-ist', category: 'Places' },
  { id: 48, english: 'City', chinese: '城市', pronunciation: 'SIT-ee', category: 'Places' },
  { id: 49, english: 'Hospital', chinese: '医院', pronunciation: 'HOS-pit-ul', category: 'Places' },
  { id: 50, english: 'Library', chinese: '图书馆', pronunciation: 'LY-brer-ee', category: 'Places' },
  { id: 51, english: 'Red', chinese: '红色', pronunciation: 'RED', category: 'Colors' },
  { id: 52, english: 'Blue', chinese: '蓝色', pronunciation: 'BLOO', category: 'Colors' },
  { id: 53, english: 'Yellow', chinese: '黄色', pronunciation: 'YEL-o', category: 'Colors' },
  { id: 54, english: 'Green', chinese: '绿色', pronunciation: 'GREEN', category: 'Colors' },
  { id: 55, english: 'Purple', chinese: '紫色', pronunciation: 'PER-pul', category: 'Colors' },
  { id: 56, english: 'Orange', chinese: '橙色', pronunciation: 'OR-inj', category: 'Colors' },
  { id: 57, english: 'Pink', chinese: '粉红色', pronunciation: 'PINGK', category: 'Colors' },
  { id: 58, english: 'Black', chinese: '黑色', pronunciation: 'BLACK', category: 'Colors' },
  { id: 59, english: 'White', chinese: '白色', pronunciation: 'HWYT', category: 'Colors' },
  { id: 60, english: 'Brown', chinese: '棕色', pronunciation: 'BROWN', category: 'Colors' },
  { id: 61, english: 'One', chinese: '一', pronunciation: 'WUN', category: 'Numbers' },
  { id: 62, english: 'Two', chinese: '二', pronunciation: 'TOO', category: 'Numbers' },
  { id: 63, english: 'Three', chinese: '三', pronunciation: 'THREE', category: 'Numbers' },
  { id: 64, english: 'Four', chinese: '四', pronunciation: 'FOR', category: 'Numbers' },
  { id: 65, english: 'Five', chinese: '五', pronunciation: 'FYV', category: 'Numbers' },
  { id: 66, english: 'Six', chinese: '六', pronunciation: 'SIKS', category: 'Numbers' },
  { id: 67, english: 'Seven', chinese: '七', pronunciation: 'SEV-un', category: 'Numbers' },
  { id: 68, english: 'Eight', chinese: '八', pronunciation: 'AYT', category: 'Numbers' },
  { id: 69, english: 'Nine', chinese: '九', pronunciation: 'NYN', category: 'Numbers' },
  { id: 70, english: 'Ten', chinese: '十', pronunciation: 'TEN', category: 'Numbers' },
  { id: 71, english: 'Head', chinese: '头', pronunciation: 'HED', category: 'Body' },
  { id: 72, english: 'Eye', chinese: '眼睛', pronunciation: 'Y', category: 'Body' },
  { id: 73, english: 'Nose', chinese: '鼻子', pronunciation: 'NOZ', category: 'Body' },
  { id: 74, english: 'Mouth', chinese: '嘴', pronunciation: 'MOUTH', category: 'Body' },
  { id: 75, english: 'Ear', chinese: '耳朵', pronunciation: 'EER', category: 'Body' },
  { id: 76, english: 'Hand', chinese: '手', pronunciation: 'HAND', category: 'Body' },
  { id: 77, english: 'Foot', chinese: '脚', pronunciation: 'FOOT', category: 'Body' },
  { id: 78, english: 'Arm', chinese: '胳膊', pronunciation: 'ARM', category: 'Body' },
  { id: 79, english: 'Leg', chinese: '腿', pronunciation: 'LEG', category: 'Body' },
  { id: 80, english: 'Tooth', chinese: '牙齿', pronunciation: 'TOOTH', category: 'Body' },
  { id: 81, english: 'Sun', chinese: '太阳', pronunciation: 'SUN', category: 'Nature' },
  { id: 82, english: 'Moon', chinese: '月亮', pronunciation: 'MOON', category: 'Nature' },
  { id: 83, english: 'Star', chinese: '星星', pronunciation: 'STAR', category: 'Nature' },
  { id: 84, english: 'Cloud', chinese: '云', pronunciation: 'KLOUD', category: 'Nature' },
  { id: 85, english: 'Rain', chinese: '雨', pronunciation: 'RAYN', category: 'Nature' },
  { id: 86, english: 'Snow', chinese: '雪', pronunciation: 'SNO', category: 'Nature' },
  { id: 87, english: 'Wind', chinese: '风', pronunciation: 'WIND', category: 'Nature' },
  { id: 88, english: 'Tree', chinese: '树', pronunciation: 'TREE', category: 'Nature' },
  { id: 89, english: 'Flower', chinese: '花', pronunciation: 'FLOW-er', category: 'Nature' },
  { id: 90, english: 'Grass', chinese: '草', pronunciation: 'GRAS', category: 'Nature' },
  { id: 91, english: 'Toy', chinese: '玩具', pronunciation: 'TOY', category: 'Objects' },
  { id: 92, english: 'Ball', chinese: '球', pronunciation: 'BAWL', category: 'Objects' },
  { id: 93, english: 'Book', chinese: '书', pronunciation: 'BOOK', category: 'Objects' },
  { id: 94, english: 'Pen', chinese: '笔', pronunciation: 'PEN', category: 'Objects' },
  { id: 95, english: 'Pencil', chinese: '铅笔', pronunciation: 'PEN-sul', category: 'Objects' },
  { id: 96, english: 'Chair', chinese: '椅子', pronunciation: 'CHAIR', category: 'Objects' },
  { id: 97, english: 'Table', chinese: '桌子', pronunciation: 'TAY-bul', category: 'Objects' },
  { id: 98, english: 'Door', chinese: '门', pronunciation: 'DOR', category: 'Objects' },
  { id: 99, english: 'Window', chinese: '窗户', pronunciation: 'WIN-do', category: 'Objects' },
  { id: 100, english: 'Clock', chinese: '钟', pronunciation: 'KLOK', category: 'Objects' },
];

const categoryEmojis: Record<string, string> = {
  Fruits: '🍎',
  Vegetables: '🥕',
  Food: '🍽️',
  Animals: '🐶',
  Places: '🏠',
  Colors: '🎨',
  Numbers: '🔢',
  Body: '👋',
  Nature: '🌳',
  Objects: '🎁',
};

export default function WordsLearning() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [playingId, setPlayingId] = useState<number | null>(null);

  const categories = ['All', ...Object.keys(categoryEmojis)];

  const filteredWords = useMemo(() => {
    if (selectedCategory === 'All') return wordsData;
    return wordsData.filter((word: any) => word.category === selectedCategory);
  }, [selectedCategory]);

  const currentWord = filteredWords[currentIndex];

  const playPronunciation = (word: string) => {
    setPlayingId(currentWord.id);
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.lang = 'en-US';
    utterance.onend = () => setPlayingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const goNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped({});
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped({});
    }
  };

  return (
    <div className="w-full py-12 px-4 bg-gradient-to-b from-pink-50 to-yellow-50">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
            📚 单词学习 Vocabulary
          </h2>
          <p className="text-lg text-gray-600">
            点击卡片翻转，学习100个日常单词！
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentIndex(0);
                setFlipped({});
              }}
              className={`
                px-4 py-2 rounded-full font-bold transition-all duration-300
                ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white scale-110 shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-blue-300 hover:scale-105'
                }
              `}
            >
              {categoryEmojis[category as keyof typeof categoryEmojis] || '📌'} {category}
            </button>
          ))}
        </div>

        {/* 单词卡片 */}
        {currentWord && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <motion.div
              onClick={() => setFlipped({ ...flipped, [currentWord.id]: !flipped[currentWord.id] })}
              animate={{ rotateY: flipped[currentWord.id] ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              className="h-64 cursor-pointer perspective"
            >
              <div
                className={`
                  w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center
                  shadow-2xl text-white font-bold text-center
                  ${!flipped[currentWord.id] ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600'}
                `}
              >
                {!flipped[currentWord.id] ? (
                  <div>
                    <p className="text-lg opacity-75 mb-4">英文 English</p>
                    <p className="text-6xl font-bold mb-6">{currentWord.english}</p>
                    <p className="text-lg opacity-75">{currentWord.pronunciation}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg opacity-75 mb-4">中文 Chinese</p>
                    <p className="text-6xl font-bold">{currentWord.chinese}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 发音按钮 */}
        <div className="flex justify-center mb-8">          <button
            onClick={() => playPronunciation(currentWord.english)}
            className={`px-6 py-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-110 active:scale-95 bg-blue-500 hover:bg-blue-600 text-lg px-8 py-4 ${playingId === currentWord.id ? 'animate-pulse' : ''}`}
          >            <Volume2 className="inline mr-2" size={24} />
            听发音 Listen
          </button>
        </div>

        {/* 进度和导航 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-110 active:scale-95 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {currentIndex + 1} / {filteredWords.length}
            </p>
            <p className="text-gray-600">{selectedCategory}</p>
          </div>
          <button
            onClick={goNext}
            disabled={currentIndex === filteredWords.length - 1}
            className="px-6 py-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-110 active:scale-95 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-orange-500"
            animate={{ width: `${((currentIndex + 1) / filteredWords.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

