import { useState } from 'react';
import { motion } from 'framer-motion';
import AlphabetLearning from '@/components/AlphabetLearning';
import WordsLearning from '@/components/WordsLearning';
import WelcomeCard from '@/components/WelcomeCard';

/**
 * 主页面
 * 设计风格：欢乐卡通风格
 * 包含：
 * - 英雄横幅
 * - 导航菜单
 * - 字母学习模块
 * - 单词学习模块
 * - 页脚
 */

export default function Home() {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'words'>('alphabet');

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎓</span>
            <h1 className="text-2xl font-bold text-blue-600">Kids English</h1>
          </div>
          <div className="hidden md:flex gap-6">
            <button
              onClick={() => setActiveTab('alphabet')}
              className={`font-bold text-lg transition-all duration-300 pb-2 ${
                activeTab === 'alphabet'
                  ? 'text-blue-600 border-b-4 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              🔤 字母表
            </button>
            <button
              onClick={() => setActiveTab('words')}
              className={`font-bold text-lg transition-all duration-300 pb-2 ${
                activeTab === 'words'
                  ? 'text-orange-600 border-b-4 border-orange-600'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              📚 单词
            </button>
          </div>
        </div>
      </nav>

      {/* 英雄横幅 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 py-12 md:py-20">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/hero-banner.png"
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              🌈 欢迎来到英语学习世界！
            </h2>
            <p className="text-xl md:text-2xl text-white mb-8 opacity-90">
              通过有趣的互动游戏学习英文字母和日常单词
            </p>
            <button
              onClick={() => setActiveTab('alphabet')}
              className="px-6 py-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-110 active:scale-95 bg-blue-500 hover:bg-blue-600 text-lg px-8 py-4 hover:scale-110 transition-transform"
            >
              🚀 开始学习
            </button>
          </motion.div>
        </div>
      </section>

      {/* 欢迎卡片 */}
      <WelcomeCard />

      {/* 内容区域 */}
      <section className="py-8">
        {activeTab === 'alphabet' && (
          <motion.div
            key="alphabet"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AlphabetLearning />
          </motion.div>
        )}
        {activeTab === 'words' && (
          <motion.div
            key="words"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <WordsLearning />
          </motion.div>
        )}
      </section>

      {/* 特色功能 */}
      <section className="py-16 bg-gradient-to-b from-yellow-50 to-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-green-600 mb-12">
            ✨ 学习特色
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎵',
                title: '真实发音',
                description: '点击按钮听标准美式英语发音，帮助孩子学习正确的发音。',
              },
              {
                icon: '🎨',
                title: '彩虹卡片',
                description: '色彩鲜艳的学习卡片，吸引孩子注意力，提高学习兴趣。',
              },
              {
                icon: '📊',
                title: '进度追踪',
                description: '实时显示学习进度，鼓励孩子坚持学习，建立学习习惯。',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h4 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-blue-600 text-white py-8 text-center">
        <p className="text-lg mb-2">🎓 Kids English Learning - 儿童英语学习平台</p>
        <p className="opacity-75">让孩子在快乐中学习英语 | Learn English with Fun!</p>
      </footer>
    </div>
  );
}

