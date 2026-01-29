import { useState, useMemo, useEffect } from 'react';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningProgress } from '@/hooks/useLearningProgress';

/**
 * 单词学习组件
 * 设计风格：欢乐卡通风格
 * - 200个日常单词分类学习
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
  // Fruits (20个)
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
  { id: 11, english: 'Pineapple', chinese: '菠萝', pronunciation: 'PY-nap-ul', category: 'Fruits' },
  { id: 12, english: 'Blueberry', chinese: '蓝莓', pronunciation: 'BLOO-ber-ee', category: 'Fruits' },
  { id: 13, english: 'Raspberry', chinese: '树莓', pronunciation: 'RAZ-ber-ee', category: 'Fruits' },
  { id: 14, english: 'Kiwi', chinese: '猕猴桃', pronunciation: 'KEE-wee', category: 'Fruits' },
  { id: 15, english: 'Coconut', chinese: '椰子', pronunciation: 'KO-ko-nut', category: 'Fruits' },
  { id: 16, english: 'Cherry', chinese: '樱桃', pronunciation: 'CHER-ee', category: 'Fruits' },
  { id: 17, english: 'Papaya', chinese: '木瓜', pronunciation: 'puh-PY-uh', category: 'Fruits' },
  { id: 18, english: 'Plum', chinese: '李子', pronunciation: 'PLUM', category: 'Fruits' },
  { id: 19, english: 'Lime', chinese: '青柠', pronunciation: 'LYM', category: 'Fruits' },
  { id: 20, english: 'Avocado', chinese: '牛油果', pronunciation: 'av-uh-KAH-do', category: 'Fruits' },

  // Vegetables (20个)
  { id: 21, english: 'Carrot', chinese: '胡萝卜', pronunciation: 'KAR-ut', category: 'Vegetables' },
  { id: 22, english: 'Tomato', chinese: '番茄', pronunciation: 'tuh-MAH-to', category: 'Vegetables' },
  { id: 23, english: 'Potato', chinese: '土豆', pronunciation: 'puh-TAY-to', category: 'Vegetables' },
  { id: 24, english: 'Broccoli', chinese: '西兰花', pronunciation: 'BROK-uh-lee', category: 'Vegetables' },
  { id: 25, english: 'Cabbage', chinese: '卷心菜', pronunciation: 'KAB-ij', category: 'Vegetables' },
  { id: 26, english: 'Cucumber', chinese: '黄瓜', pronunciation: 'KYO-kum-ber', category: 'Vegetables' },
  { id: 27, english: 'Lettuce', chinese: '生菜', pronunciation: 'LET-us', category: 'Vegetables' },
  { id: 28, english: 'Onion', chinese: '洋葱', pronunciation: 'UN-yun', category: 'Vegetables' },
  { id: 29, english: 'Pepper', chinese: '辣椒', pronunciation: 'PEP-er', category: 'Vegetables' },
  { id: 30, english: 'Corn', chinese: '玉米', pronunciation: 'KORN', category: 'Vegetables' },
  { id: 31, english: 'Spinach', chinese: '菠菜', pronunciation: 'SPIN-ij', category: 'Vegetables' },
  { id: 32, english: 'Pumpkin', chinese: '南瓜', pronunciation: 'PUM-kin', category: 'Vegetables' },
  { id: 33, english: 'Eggplant', chinese: '茄子', pronunciation: 'EG-plant', category: 'Vegetables' },
  { id: 34, english: 'Garlic', chinese: '大蒜', pronunciation: 'GAR-lik', category: 'Vegetables' },
  { id: 35, english: 'Mushroom', chinese: '蘑菇', pronunciation: 'MUSH-room', category: 'Vegetables' },
  { id: 36, english: 'Celery', chinese: '芹菜', pronunciation: 'SEL-uh-ree', category: 'Vegetables' },
  { id: 37, english: 'Radish', chinese: '萝卜', pronunciation: 'RAD-ish', category: 'Vegetables' },
  { id: 38, english: 'Zucchini', chinese: '西葫芦', pronunciation: 'zoo-KEE-nee', category: 'Vegetables' },
  { id: 39, english: 'Asparagus', chinese: '芦笋', pronunciation: 'uh-SPAR-uh-gus', category: 'Vegetables' },
  { id: 40, english: 'Beet', chinese: '甜菜', pronunciation: 'BEET', category: 'Vegetables' },

  // Food (25个)
  { id: 41, english: 'Bread', chinese: '面包', pronunciation: 'BRED', category: 'Food' },
  { id: 42, english: 'Rice', chinese: '米饭', pronunciation: 'RYS', category: 'Food' },
  { id: 43, english: 'Milk', chinese: '牛奶', pronunciation: 'MILK', category: 'Food' },
  { id: 44, english: 'Cheese', chinese: '奶酪', pronunciation: 'CHEEZ', category: 'Food' },
  { id: 45, english: 'Egg', chinese: '鸡蛋', pronunciation: 'EG', category: 'Food' },
  { id: 46, english: 'Chicken', chinese: '鸡肉', pronunciation: 'CHIK-un', category: 'Food' },
  { id: 47, english: 'Fish', chinese: '鱼', pronunciation: 'FISH', category: 'Food' },
  { id: 48, english: 'Meat', chinese: '肉', pronunciation: 'MEET', category: 'Food' },
  { id: 49, english: 'Soup', chinese: '汤', pronunciation: 'SOOP', category: 'Food' },
  { id: 50, english: 'Noodle', chinese: '面条', pronunciation: 'NOO-dul', category: 'Food' },
  { id: 51, english: 'Pizza', chinese: '披萨', pronunciation: 'PEET-suh', category: 'Food' },
  { id: 52, english: 'Hamburger', chinese: '汉堡', pronunciation: 'HAM-ber-ger', category: 'Food' },
  { id: 53, english: 'Sandwich', chinese: '三明治', pronunciation: 'SAN-wich', category: 'Food' },
  { id: 54, english: 'Salad', chinese: '沙拉', pronunciation: 'SAL-ud', category: 'Food' },
  { id: 55, english: 'Butter', chinese: '黄油', pronunciation: 'BUT-er', category: 'Food' },
  { id: 56, english: 'Honey', chinese: '蜂蜜', pronunciation: 'HUN-ee', category: 'Food' },
  { id: 57, english: 'Sugar', chinese: '糖', pronunciation: 'SHOO-ger', category: 'Food' },
  { id: 58, english: 'Salt', chinese: '盐', pronunciation: 'SAWLT', category: 'Food' },
  { id: 59, english: 'Oil', chinese: '油', pronunciation: 'OYL', category: 'Food' },
  { id: 60, english: 'Water', chinese: '水', pronunciation: 'WO-ter', category: 'Food' },
  { id: 61, english: 'Juice', chinese: '果汁', pronunciation: 'JOOS', category: 'Food' },
  { id: 62, english: 'Tea', chinese: '茶', pronunciation: 'TEE', category: 'Food' },
  { id: 63, english: 'Coffee', chinese: '咖啡', pronunciation: 'KO-fee', category: 'Food' },
  { id: 64, english: 'Cake', chinese: '蛋糕', pronunciation: 'KAYK', category: 'Food' },
  { id: 65, english: 'Cookie', chinese: '饼干', pronunciation: 'KOO-kee', category: 'Food' },

  // Animals (25个)
  { id: 66, english: 'Cat', chinese: '猫', pronunciation: 'KAT', category: 'Animals' },
  { id: 67, english: 'Dog', chinese: '狗', pronunciation: 'DOG', category: 'Animals' },
  { id: 68, english: 'Bird', chinese: '鸟', pronunciation: 'BERD', category: 'Animals' },
  { id: 69, english: 'Elephant', chinese: '大象', pronunciation: 'EL-uh-funt', category: 'Animals' },
  { id: 70, english: 'Lion', chinese: '狮子', pronunciation: 'LY-un', category: 'Animals' },
  { id: 71, english: 'Tiger', chinese: '老虎', pronunciation: 'TY-ger', category: 'Animals' },
  { id: 72, english: 'Monkey', chinese: '猴子', pronunciation: 'MUN-kee', category: 'Animals' },
  { id: 73, english: 'Rabbit', chinese: '兔子', pronunciation: 'RAB-it', category: 'Animals' },
  { id: 74, english: 'Bear', chinese: '熊', pronunciation: 'BAIR', category: 'Animals' },
  { id: 75, english: 'Panda', chinese: '熊猫', pronunciation: 'PAN-duh', category: 'Animals' },
  { id: 76, english: 'Zebra', chinese: '斑马', pronunciation: 'ZEB-ruh', category: 'Animals' },
  { id: 77, english: 'Giraffe', chinese: '长颈鹿', pronunciation: 'juh-RAF', category: 'Animals' },
  { id: 78, english: 'Penguin', chinese: '企鹅', pronunciation: 'PEN-gwin', category: 'Animals' },
  { id: 79, english: 'Dolphin', chinese: '海豚', pronunciation: 'DOL-fin', category: 'Animals' },
  { id: 80, english: 'Whale', chinese: '鲸鱼', pronunciation: 'WAYL', category: 'Animals' },
  { id: 81, english: 'Butterfly', chinese: '蝴蝶', pronunciation: 'BUT-er-fly', category: 'Animals' },
  { id: 82, english: 'Bee', chinese: '蜜蜂', pronunciation: 'BEE', category: 'Animals' },
  { id: 83, english: 'Spider', chinese: '蜘蛛', pronunciation: 'SPY-der', category: 'Animals' },
  { id: 84, english: 'Snake', chinese: '蛇', pronunciation: 'SNAYK', category: 'Animals' },
  { id: 85, english: 'Frog', chinese: '青蛙', pronunciation: 'FROG', category: 'Animals' },
  { id: 86, english: 'Turtle', chinese: '乌龟', pronunciation: 'TER-tul', category: 'Animals' },
  { id: 87, english: 'Cow', chinese: '牛', pronunciation: 'KOW', category: 'Animals' },
  { id: 88, english: 'Pig', chinese: '猪', pronunciation: 'PIG', category: 'Animals' },
  { id: 89, english: 'Horse', chinese: '马', pronunciation: 'HORS', category: 'Animals' },
  { id: 90, english: 'Sheep', chinese: '羊', pronunciation: 'SHEEP', category: 'Animals' },

  // Places (20个)
  { id: 91, english: 'House', chinese: '房子', pronunciation: 'HOUS', category: 'Places' },
  { id: 92, english: 'School', chinese: '学校', pronunciation: 'SKOOL', category: 'Places' },
  { id: 93, english: 'Park', chinese: '公园', pronunciation: 'PARK', category: 'Places' },
  { id: 94, english: 'Beach', chinese: '海滩', pronunciation: 'BEECH', category: 'Places' },
  { id: 95, english: 'Mountain', chinese: '山', pronunciation: 'MOUN-tin', category: 'Places' },
  { id: 96, english: 'River', chinese: '河', pronunciation: 'RIV-er', category: 'Places' },
  { id: 97, english: 'Forest', chinese: '森林', pronunciation: 'FOR-ist', category: 'Places' },
  { id: 98, english: 'City', chinese: '城市', pronunciation: 'SIT-ee', category: 'Places' },
  { id: 99, english: 'Hospital', chinese: '医院', pronunciation: 'HOS-pit-ul', category: 'Places' },
  { id: 100, english: 'Library', chinese: '图书馆', pronunciation: 'LY-brer-ee', category: 'Places' },
  { id: 101, english: 'Market', chinese: '市场', pronunciation: 'MAR-kit', category: 'Places' },
  { id: 102, english: 'Restaurant', chinese: '餐厅', pronunciation: 'RES-tuh-ront', category: 'Places' },
  { id: 103, english: 'Zoo', chinese: '动物园', pronunciation: 'ZOO', category: 'Places' },
  { id: 104, english: 'Museum', chinese: '博物馆', pronunciation: 'myoo-ZEE-um', category: 'Places' },
  { id: 105, english: 'Cinema', chinese: '电影院', pronunciation: 'SIN-uh-muh', category: 'Places' },
  { id: 106, english: 'Garden', chinese: '花园', pronunciation: 'GAR-dn', category: 'Places' },
  { id: 107, english: 'Kitchen', chinese: '厨房', pronunciation: 'KICH-un', category: 'Places' },
  { id: 108, english: 'Bedroom', chinese: '卧室', pronunciation: 'BED-room', category: 'Places' },
  { id: 109, english: 'Bathroom', chinese: '浴室', pronunciation: 'BATH-room', category: 'Places' },
  { id: 110, english: 'Office', chinese: '办公室', pronunciation: 'AW-fis', category: 'Places' },

  // Colors (15个)
  { id: 111, english: 'Red', chinese: '红色', pronunciation: 'RED', category: 'Colors' },
  { id: 112, english: 'Blue', chinese: '蓝色', pronunciation: 'BLOO', category: 'Colors' },
  { id: 113, english: 'Yellow', chinese: '黄色', pronunciation: 'YEL-o', category: 'Colors' },
  { id: 114, english: 'Green', chinese: '绿色', pronunciation: 'GREEN', category: 'Colors' },
  { id: 115, english: 'Purple', chinese: '紫色', pronunciation: 'PER-pul', category: 'Colors' },
  { id: 116, english: 'Orange', chinese: '橙色', pronunciation: 'OR-inj', category: 'Colors' },
  { id: 117, english: 'Pink', chinese: '粉红色', pronunciation: 'PINGK', category: 'Colors' },
  { id: 118, english: 'Black', chinese: '黑色', pronunciation: 'BLACK', category: 'Colors' },
  { id: 119, english: 'White', chinese: '白色', pronunciation: 'HWYT', category: 'Colors' },
  { id: 120, english: 'Brown', chinese: '棕色', pronunciation: 'BROWN', category: 'Colors' },
  { id: 121, english: 'Gray', chinese: '灰色', pronunciation: 'GRAY', category: 'Colors' },
  { id: 122, english: 'Silver', chinese: '银色', pronunciation: 'SIL-ver', category: 'Colors' },
  { id: 123, english: 'Gold', chinese: '金色', pronunciation: 'GOLD', category: 'Colors' },
  { id: 124, english: 'Turquoise', chinese: '绿松石色', pronunciation: 'TER-kwoiz', category: 'Colors' },
  { id: 125, english: 'Violet', chinese: '紫罗兰色', pronunciation: 'VY-uh-lit', category: 'Colors' },

  // Numbers (20个)
  { id: 126, english: 'One', chinese: '一', pronunciation: 'WUN', category: 'Numbers' },
  { id: 127, english: 'Two', chinese: '二', pronunciation: 'TOO', category: 'Numbers' },
  { id: 128, english: 'Three', chinese: '三', pronunciation: 'THREE', category: 'Numbers' },
  { id: 129, english: 'Four', chinese: '四', pronunciation: 'FOR', category: 'Numbers' },
  { id: 130, english: 'Five', chinese: '五', pronunciation: 'FYV', category: 'Numbers' },
  { id: 131, english: 'Six', chinese: '六', pronunciation: 'SIKS', category: 'Numbers' },
  { id: 132, english: 'Seven', chinese: '七', pronunciation: 'SEV-un', category: 'Numbers' },
  { id: 133, english: 'Eight', chinese: '八', pronunciation: 'AYT', category: 'Numbers' },
  { id: 134, english: 'Nine', chinese: '九', pronunciation: 'NYN', category: 'Numbers' },
  { id: 135, english: 'Ten', chinese: '十', pronunciation: 'TEN', category: 'Numbers' },
  { id: 136, english: 'Eleven', chinese: '十一', pronunciation: 'ih-LEV-un', category: 'Numbers' },
  { id: 137, english: 'Twelve', chinese: '十二', pronunciation: 'TWELV', category: 'Numbers' },
  { id: 138, english: 'Twenty', chinese: '二十', pronunciation: 'TWEN-tee', category: 'Numbers' },
  { id: 139, english: 'Thirty', chinese: '三十', pronunciation: 'THER-tee', category: 'Numbers' },
  { id: 140, english: 'Forty', chinese: '四十', pronunciation: 'FOR-tee', category: 'Numbers' },
  { id: 141, english: 'Fifty', chinese: '五十', pronunciation: 'FIF-tee', category: 'Numbers' },
  { id: 142, english: 'Hundred', chinese: '一百', pronunciation: 'HUN-dred', category: 'Numbers' },
  { id: 143, english: 'First', chinese: '第一', pronunciation: 'FERST', category: 'Numbers' },
  { id: 144, english: 'Second', chinese: '第二', pronunciation: 'SEK-und', category: 'Numbers' },
  { id: 145, english: 'Third', chinese: '第三', pronunciation: 'THERD', category: 'Numbers' },

  // Body (15个)
  { id: 146, english: 'Head', chinese: '头', pronunciation: 'HED', category: 'Body' },
  { id: 147, english: 'Eye', chinese: '眼睛', pronunciation: 'Y', category: 'Body' },
  { id: 148, english: 'Nose', chinese: '鼻子', pronunciation: 'NOZ', category: 'Body' },
  { id: 149, english: 'Mouth', chinese: '嘴', pronunciation: 'MOUTH', category: 'Body' },
  { id: 150, english: 'Ear', chinese: '耳朵', pronunciation: 'EER', category: 'Body' },
  { id: 151, english: 'Hand', chinese: '手', pronunciation: 'HAND', category: 'Body' },
  { id: 152, english: 'Foot', chinese: '脚', pronunciation: 'FOOT', category: 'Body' },
  { id: 153, english: 'Arm', chinese: '胳膊', pronunciation: 'ARM', category: 'Body' },
  { id: 154, english: 'Leg', chinese: '腿', pronunciation: 'LEG', category: 'Body' },
  { id: 155, english: 'Tooth', chinese: '牙齿', pronunciation: 'TOOTH', category: 'Body' },
  { id: 156, english: 'Hair', chinese: '头发', pronunciation: 'HAIR', category: 'Body' },
  { id: 157, english: 'Heart', chinese: '心脏', pronunciation: 'HART', category: 'Body' },
  { id: 158, english: 'Finger', chinese: '手指', pronunciation: 'FING-ger', category: 'Body' },
  { id: 159, english: 'Toe', chinese: '脚趾', pronunciation: 'TOE', category: 'Body' },
  { id: 160, english: 'Skin', chinese: '皮肤', pronunciation: 'SKIN', category: 'Body' },

  // Nature (15个)
  { id: 161, english: 'Sun', chinese: '太阳', pronunciation: 'SUN', category: 'Nature' },
  { id: 162, english: 'Moon', chinese: '月亮', pronunciation: 'MOON', category: 'Nature' },
  { id: 163, english: 'Star', chinese: '星星', pronunciation: 'STAR', category: 'Nature' },
  { id: 164, english: 'Cloud', chinese: '云', pronunciation: 'KLOUD', category: 'Nature' },
  { id: 165, english: 'Rain', chinese: '雨', pronunciation: 'RAYN', category: 'Nature' },
  { id: 166, english: 'Snow', chinese: '雪', pronunciation: 'SNO', category: 'Nature' },
  { id: 167, english: 'Wind', chinese: '风', pronunciation: 'WIND', category: 'Nature' },
  { id: 168, english: 'Tree', chinese: '树', pronunciation: 'TREE', category: 'Nature' },
  { id: 169, english: 'Flower', chinese: '花', pronunciation: 'FLOW-er', category: 'Nature' },
  { id: 170, english: 'Grass', chinese: '草', pronunciation: 'GRAS', category: 'Nature' },
  { id: 171, english: 'Rock', chinese: '石头', pronunciation: 'ROK', category: 'Nature' },
  { id: 172, english: 'Ocean', chinese: '大海', pronunciation: 'O-shun', category: 'Nature' },
  { id: 173, english: 'Lake', chinese: '湖', pronunciation: 'LAYK', category: 'Nature' },
  { id: 174, english: 'Lightning', chinese: '闪电', pronunciation: 'LYT-ning', category: 'Nature' },
  { id: 175, english: 'Rainbow', chinese: '彩虹', pronunciation: 'RAYN-bo', category: 'Nature' },

  // Objects (25个)
  { id: 176, english: 'Toy', chinese: '玩具', pronunciation: 'TOY', category: 'Objects' },
  { id: 177, english: 'Ball', chinese: '球', pronunciation: 'BAWL', category: 'Objects' },
  { id: 178, english: 'Book', chinese: '书', pronunciation: 'BOOK', category: 'Objects' },
  { id: 179, english: 'Pen', chinese: '笔', pronunciation: 'PEN', category: 'Objects' },
  { id: 180, english: 'Pencil', chinese: '铅笔', pronunciation: 'PEN-sul', category: 'Objects' },
  { id: 181, english: 'Chair', chinese: '椅子', pronunciation: 'CHAIR', category: 'Objects' },
  { id: 182, english: 'Table', chinese: '桌子', pronunciation: 'TAY-bul', category: 'Objects' },
  { id: 183, english: 'Door', chinese: '门', pronunciation: 'DOR', category: 'Objects' },
  { id: 184, english: 'Window', chinese: '窗户', pronunciation: 'WIN-do', category: 'Objects' },
  { id: 185, english: 'Clock', chinese: '钟', pronunciation: 'KLOK', category: 'Objects' },
  { id: 186, english: 'Car', chinese: '汽车', pronunciation: 'KAR', category: 'Objects' },
  { id: 187, english: 'Bicycle', chinese: '自行车', pronunciation: 'BY-sik-ul', category: 'Objects' },
  { id: 188, english: 'Airplane', chinese: '飞机', pronunciation: 'AIR-playn', category: 'Objects' },
  { id: 189, english: 'Train', chinese: '火车', pronunciation: 'TRAYN', category: 'Objects' },
  { id: 190, english: 'Ship', chinese: '船', pronunciation: 'SHIP', category: 'Objects' },
  { id: 191, english: 'Computer', chinese: '电脑', pronunciation: 'kum-PYOO-ter', category: 'Objects' },
  { id: 192, english: 'Phone', chinese: '电话', pronunciation: 'FON', category: 'Objects' },
  { id: 193, english: 'Television', chinese: '电视', pronunciation: 'TEL-uh-vizh-un', category: 'Objects' },
  { id: 194, english: 'Camera', chinese: '相机', pronunciation: 'KAM-er-uh', category: 'Objects' },
  { id: 195, english: 'Backpack', chinese: '背包', pronunciation: 'BAK-pak', category: 'Objects' },
  { id: 196, english: 'Shoe', chinese: '鞋', pronunciation: 'SHOO', category: 'Objects' },
  { id: 197, english: 'Hat', chinese: '帽子', pronunciation: 'HAT', category: 'Objects' },
  { id: 198, english: 'Glasses', chinese: '眼镜', pronunciation: 'GLAS-iz', category: 'Objects' },
  { id: 199, english: 'Watch', chinese: '手表', pronunciation: 'WOCH', category: 'Objects' },
  { id: 200, english: 'Umbrella', chinese: '雨伞', pronunciation: 'um-BREL-uh', category: 'Objects' },
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
  const [learnedWords, setLearnedWords] = useState<Set<number>>(new Set());
  const { recordWordLearning } = useLearningProgress();

  // 从LocalStorage加载已学单词
  useEffect(() => {
    try {
      const saved = localStorage.getItem('learned_words');
      if (saved) {
        setLearnedWords(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Failed to load learned words:', error);
    }
  }, []);

  const categories = ['All', ...Object.keys(categoryEmojis)];

  const filteredWords = useMemo(() => {
    if (selectedCategory === 'All') return wordsData;
    return wordsData.filter((word: any) => word.category === selectedCategory);
  }, [selectedCategory]);

  const currentWord = filteredWords[currentIndex];

  const playPronunciation = (word: string) => {
    setPlayingId(currentWord.id);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.onend = () => setPlayingId(null);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const goNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      recordWordView();
      setCurrentIndex(currentIndex + 1);
      setFlipped({});
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      recordWordView();
      setCurrentIndex(currentIndex - 1);
      setFlipped({});
    }
  };

  // 记录单词学习
  const recordWordView = () => {
    if (!learnedWords.has(currentWord.id)) {
      const newLearned = new Set(learnedWords);
      newLearned.add(currentWord.id);
      setLearnedWords(newLearned);
      recordWordLearning(1);
      try {
        localStorage.setItem('learned_words', JSON.stringify(Array.from(newLearned)));
      } catch (error) {
        console.error('Failed to save learned words:', error);
      }
    }
  };

  const toggleFlip = (id: number) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (filteredWords.length === 0) {
    return <div className="text-center py-12">没有找到该分类的单词</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 分类选择 */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setFlipped({});
              }}
              className={`px-4 py-2 rounded-full font-bold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white scale-110 shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {cat === 'All' ? '📚 全部' : `${categoryEmojis[cat]} ${cat}`}
            </button>
          ))}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-col items-center">
        {/* 单词卡片 */}
        <div className="mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={() => toggleFlip(currentWord.id)}
              className="cursor-pointer"
            >
              <motion.div
                animate={{ rotateY: flipped[currentWord.id] ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ perspective: 1000 }}
                className="w-96 h-96"
              >
                <motion.div
                  animate={{ rotateY: flipped[currentWord.id] ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped[currentWord.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                  className="w-full h-full"
                >
                  {/* 正面 - 英文 */}
                  <motion.div
                    style={{ backfaceVisibility: 'hidden' }}
                    className="absolute w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-white"
                  >
                    <div className="text-7xl font-bold mb-4">{currentWord.english}</div>
                    <div className="text-2xl opacity-80">{currentWord.pronunciation}</div>
                    <div className="text-sm mt-8 opacity-60">点击翻转查看中文</div>
                  </motion.div>

                  {/* 背面 - 中文 */}
                  <motion.div
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className="absolute w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-white"
                  >
                    <div className="text-7xl font-bold mb-4">{currentWord.chinese}</div>
                    <div className="text-2xl opacity-80">{currentWord.english}</div>
                    <div className="text-sm mt-8 opacity-60">点击翻转查看英文</div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 发音按钮 */}
        <button
          onClick={() => playPronunciation(currentWord.english)}
          className={`mb-12 px-8 py-4 rounded-full font-bold text-white text-lg transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg ${playingId === currentWord.id ? 'animate-pulse' : ''}`}
        >
          <Volume2 className="inline mr-3" size={28} />
          听发音 Listen
        </button>

        {/* 进度显示 */}
        <div className="mb-8 text-center">
          <p className="text-sm text-green-600 font-bold">
            已学: {learnedWords.size}/{wordsData.length} 个单词
          </p>
        </div>

        {/* 进度条 */}
        <div className="w-full max-w-2xl mb-8">
          <div className="bg-gray-300 rounded-full h-3 overflow-hidden shadow-md">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"
              animate={{ width: `${((currentIndex + 1) / filteredWords.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-3 text-sm font-semibold text-gray-700">
            <span>{currentIndex + 1}</span>
            <span>{filteredWords.length}</span>
          </div>
        </div>

        {/* 导航和进度信息 */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="p-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="text-center min-w-32">
            <p className="text-3xl font-bold text-blue-600">{currentIndex + 1}</p>
            <p className="text-sm text-gray-600 mt-1">{selectedCategory}</p>
          </div>
          <button
            onClick={goNext}
            disabled={currentIndex === filteredWords.length - 1}
            className="p-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
