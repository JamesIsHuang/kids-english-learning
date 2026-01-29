import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

const wordsData = {
  alphabet: [
    { letter: 'A', pronunciation: 'ay', example: 'Apple' },
    { letter: 'B', pronunciation: 'bee', example: 'Ball' },
    { letter: 'C', pronunciation: 'see', example: 'Cat' },
    { letter: 'D', pronunciation: 'dee', example: 'Dog' },
    { letter: 'E', pronunciation: 'ee', example: 'Egg' },
    { letter: 'F', pronunciation: 'ef', example: 'Fish' },
    { letter: 'G', pronunciation: 'jee', example: 'Girl' },
    { letter: 'H', pronunciation: 'aitch', example: 'House' },
    { letter: 'I', pronunciation: 'eye', example: 'Ice' },
    { letter: 'J', pronunciation: 'jay', example: 'Jellyfish' },
    { letter: 'K', pronunciation: 'kay', example: 'Kite' },
    { letter: 'L', pronunciation: 'el', example: 'Lion' },
    { letter: 'M', pronunciation: 'em', example: 'Monkey' },
    { letter: 'N', pronunciation: 'en', example: 'Nest' },
    { letter: 'O', pronunciation: 'oh', example: 'Orange' },
    { letter: 'P', pronunciation: 'pee', example: 'Pig' },
    { letter: 'Q', pronunciation: 'kyoo', example: 'Queen' },
    { letter: 'R', pronunciation: 'ar', example: 'Rabbit' },
    { letter: 'S', pronunciation: 'ess', example: 'Sun' },
    { letter: 'T', pronunciation: 'tee', example: 'Tiger' },
    { letter: 'U', pronunciation: 'yoo', example: 'Umbrella' },
    { letter: 'V', pronunciation: 'vee', example: 'Violin' },
    { letter: 'W', pronunciation: 'double-you', example: 'Whale' },
    { letter: 'X', pronunciation: 'eks', example: 'Xylophone' },
    { letter: 'Y', pronunciation: 'why', example: 'Yo-yo' },
    { letter: 'Z', pronunciation: 'zee', example: 'Zebra' },
  ],
};

/**
 * 字母学习组件
 * 设计风格：欢乐卡通风格
 * - 26个字母卡片，每个字母配有对应的单词示例
 * - 点击卡片可以听发音
 * - 彩虹色的字母，增加视觉趣味性
 */

const colors = [
  'bg-blue-500',
  'bg-orange-500',
  'bg-green-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-purple-500',
];

export default function AlphabetLearning() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const alphabet = wordsData.alphabet as any[];

  const playPronunciation = (letter: string, pronunciation: string) => {
    setPlayingAudio(letter);
    // 使用Web Speech API进行发音
    const utterance = new SpeechSynthesisUtterance(pronunciation);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.lang = 'en-US';
    utterance.onend = () => setPlayingAudio(null);
    window.speechSynthesis.speak(utterance);
  };

  const getColorClass = (index: number) => colors[index % colors.length];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1,
        } as any,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="w-full py-12 px-4 bg-gradient-to-b from-blue-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
            🔤 字母表 Alphabet
          </h2>
          <p className="text-lg text-gray-600">
            点击字母卡片听发音，学习英文字母！
          </p>
        </div>

        {/* 字母网格 */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {alphabet.map((item: any, index: number) => (
            <motion.div
              key={item.letter}
              variants={itemVariants}
              onClick={() => {
                setSelectedLetter(item.letter);
                playPronunciation(item.letter, item.pronunciation);
              }}
              className="cursor-pointer"
            >
              <div
                className={`
                  rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer
                  flex flex-col items-center justify-center aspect-square text-center
                  ${getColorClass(index)}
                  text-white
                  min-h-24
                  transition-all duration-300
                  ${selectedLetter === item.letter ? 'ring-4 ring-yellow-300 scale-110' : ''}
                  ${playingAudio === item.letter ? 'animate-pulse' : ''}
                `}
              >
                <div className="text-5xl font-bold mb-2">{item.letter}</div>
                <div className="text-xs opacity-90 mb-2">{item.pronunciation}</div>
                <Volume2 size={20} className="mx-auto opacity-75" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 示例单词显示 */}
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <div className="inline-block bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-gray-600 mb-2">示例单词 Example:</p>
              <p className="text-4xl font-bold text-blue-600 mb-4">
                {alphabet.find((a: any) => a.letter === selectedLetter)?.example}
              </p>
              <button
                onClick={() => {
                  const example = alphabet.find((a: any) => a.letter === selectedLetter)?.example;
                  if (example) playPronunciation(example, example);
                }}
                className="px-6 py-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-110 active:scale-95 bg-blue-500 hover:bg-blue-600"
              >
                <Volume2 className="inline mr-2" size={20} />
                听发音
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
