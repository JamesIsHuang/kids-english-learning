import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLearningProgress } from '@/hooks/useLearningProgress';

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
  const [learnedLetters, setLearnedLetters] = useState<Set<string>>(new Set());
  const { recordAlphabetLearning } = useLearningProgress();

  const alphabet = wordsData.alphabet as any[];

  // 从LocalStorage加载已学字母
  useEffect(() => {
    try {
      const saved = localStorage.getItem('learned_alphabets');
      if (saved) {
        setLearnedLetters(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Failed to load learned alphabets:', error);
    }
  }, []);

  const playPronunciation = (letter: string, pronunciation: string) => {
    setPlayingAudio(letter);
    const utterance = new SpeechSynthesisUtterance(pronunciation);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.lang = 'en-US';
    utterance.onend = () => setPlayingAudio(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleLetterClick = (letter: string, pronunciation: string) => {
    setSelectedLetter(letter);
    playPronunciation(letter, pronunciation);

    if (!learnedLetters.has(letter)) {
      const newLearned = new Set(learnedLetters);
      newLearned.add(letter);
      setLearnedLetters(newLearned);
      recordAlphabetLearning(1);
      try {
        localStorage.setItem('learned_alphabets', JSON.stringify(Array.from(newLearned)));
      } catch (error) {
        console.error('Failed to save learned alphabets:', error);
      }
    }
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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
            🔤 字母表 Alphabet
          </h2>
          <p className="text-lg text-gray-600">
            点击字母卡片听发音，学习英文字母！
          </p>
          <p className="text-sm text-green-600 font-bold mt-2">
            已学: {learnedLetters.size}/26 个字母
          </p>
        </div>

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
              onClick={() => handleLetterClick(item.letter, item.pronunciation)}
              className="cursor-pointer relative"
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
                  ${learnedLetters.has(item.letter) ? 'ring-2 ring-green-300' : ''}
                `}
              >
                {learnedLetters.has(item.letter) && (
                  <div className="absolute top-2 right-2 text-xl">✓</div>
                )}
                <div className="flex gap-2 items-center justify-center mb-2">
                  <div className="text-4xl font-bold">{item.letter}</div>
                  <div className="text-3xl font-bold opacity-75">{item.letter.toLowerCase()}</div>
                </div>
                <div className="text-xs opacity-90 mb-2">{item.pronunciation}</div>
                <Volume2 size={20} className="mx-auto opacity-75" />
              </div>
            </motion.div>
          ))}
        </motion.div>

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
