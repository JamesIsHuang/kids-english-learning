import { motion } from 'framer-motion';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { RotateCcw } from 'lucide-react';

/**
 * 学习统计面板组件
 * 设计风格：欢乐卡通风格
 * 显示：
 * - 学习统计数据
 * - 已解锁的成就徽章
 * - 学习进度条
 */

export default function LearningStats() {
  const { stats, unlockedAchievements, resetAllData } = useLearningProgress();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      } as any,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 } as any,
    },
  };

  const statBoxVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
    hover: { scale: 1.05 },
  };

  // 计算学习进度百分比
  const wordProgress = Math.round((stats.totalWordsLearned / 200) * 100);
  const alphabetProgress = Math.round((stats.totalAlphabetLearned / 26) * 100);

  return (
    <div className="w-full py-12 px-4 bg-gradient-to-b from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
            📊 学习统计
          </h2>
          <p className="text-lg text-gray-600">
            查看您的学习进度和已解锁的成就
          </p>
        </motion.div>

        {/* 统计数据卡片 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 字母学习进度 */}
          <motion.div
            variants={statBoxVariants}
            whileHover="hover"
            className="bg-white rounded-3xl p-6 shadow-lg"
          >
            <div className="text-4xl mb-3">🔤</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">字母学习</h3>
            <div className="text-3xl font-bold text-blue-600 mb-3">
              {stats.totalAlphabetLearned}/26
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${alphabetProgress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{alphabetProgress}% 完成</p>
          </motion.div>

          {/* 单词学习进度 */}
          <motion.div
            variants={statBoxVariants}
            whileHover="hover"
            className="bg-white rounded-3xl p-6 shadow-lg"
          >
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">单词学习</h3>
            <div className="text-3xl font-bold text-orange-600 mb-3">
              {stats.totalWordsLearned}/200
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${wordProgress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{wordProgress}% 完成</p>
          </motion.div>

          {/* 连续学习天数 */}
          <motion.div
            variants={statBoxVariants}
            whileHover="hover"
            className="bg-white rounded-3xl p-6 shadow-lg"
          >
            <div className="text-4xl mb-3">🔥</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">连续学习</h3>
            <div className="text-3xl font-bold text-red-600 mb-3">
              {stats.consecutiveDays}
            </div>
            <p className="text-sm text-gray-600">天</p>
            {stats.consecutiveDays > 0 && (
              <p className="text-xs text-green-600 mt-2 font-bold">
                ✨ 坚持就是胜利！
              </p>
            )}
          </motion.div>

          {/* 累计学习时间 */}
          <motion.div
            variants={statBoxVariants}
            whileHover="hover"
            className="bg-white rounded-3xl p-6 shadow-lg"
          >
            <div className="text-4xl mb-3">⏱️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">学习时间</h3>
            <div className="text-3xl font-bold text-purple-600 mb-3">
              {Math.floor(stats.totalLearningTime / 60)}h {stats.totalLearningTime % 60}m
            </div>
            <p className="text-sm text-gray-600">累计时长</p>
          </motion.div>
        </motion.div>

        {/* 成就徽章部分 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-8 shadow-lg mb-8"
        >
          <h3 className="text-3xl font-bold text-purple-600 mb-6 flex items-center gap-2">
            🏆 已解锁的成就 ({unlockedAchievements.length})
          </h3>

          {unlockedAchievements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">
                还没有解锁成就，继续学习吧！💪
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {unlockedAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="text-5xl mb-2">{achievement.icon}</div>
                  <p className="text-center text-sm font-bold text-gray-800 mb-1">
                    {achievement.name}
                  </p>
                  <p className="text-center text-xs text-gray-600">
                    {achievement.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* 重置按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <button
            onClick={() => {
              if (window.confirm('确定要重置所有学习数据吗？此操作无法撤销。')) {
                resetAllData();
                window.location.reload();
              }
            }}
            className="px-6 py-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-110 active:scale-95 bg-red-500 hover:bg-red-600 inline-flex items-center gap-2"
          >
            <RotateCcw size={20} />
            重置数据
          </button>
        </motion.div>
      </div>
    </div>
  );
}
