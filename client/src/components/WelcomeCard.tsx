import { motion } from 'framer-motion';

/**
 * 欢迎卡片组件
 * 设计风格：欢乐卡通风格
 * 显示学习统计和鼓励信息
 */

interface WelcomeCardProps {
  onStart?: () => void;
}

export default function WelcomeCard({ onStart }: WelcomeCardProps) {
  const stats = [
    { label: '字母', value: '26', emoji: '🔤' },
    { label: '单词', value: '200', emoji: '📚' },
    { label: '分类', value: '10', emoji: '🎨' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="w-full py-12 px-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        {/* 统计卡片 */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer text-center bg-gradient-to-br from-blue-100 to-blue-50"
            >
              <div className="text-6xl mb-4">{stat.emoji}</div>
              <p className="text-gray-600 text-lg mb-2">{stat.label}</p>
              <p className="text-5xl font-bold text-blue-600">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 鼓励信息 */}
        <motion.div
          variants={itemVariants}
          className="text-center bg-gradient-to-r from-pink-200 to-yellow-200 rounded-3xl p-8 md:p-12"
        >
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            🌟 每天学习一点点，英语进步一大步！
          </p>
          <p className="text-lg text-gray-700 mb-6">
            坚持学习，你就是英语小达人！加油！💪
          </p>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            🎉
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
