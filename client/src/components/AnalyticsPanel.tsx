import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DailyStats {
  date: string;
  uniqueIPs: number;
  totalClicks: number;
  totalViews: number;
}

interface AnalyticsData {
  [date: string]: DailyStats;
}

/**
 * 访问统计面板
 * 显示每天不同IP的点击次数和访问统计
 */
export default function AnalyticsPanel() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({});
  const [chartData, setChartData] = useState<DailyStats[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalUniqueIPs: 0,
    totalClicks: 0,
    totalViews: 0,
  });

  // 从LocalStorage加载访问统计数据
  useEffect(() => {
    const loadAnalytics = () => {
      try {
        const stored = localStorage.getItem('analytics_data');
        if (stored) {
          const data: AnalyticsData = JSON.parse(stored);
          setAnalyticsData(data);

          // 转换为图表数据
          const chartDataArray = Object.values(data).sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setChartData(chartDataArray);

          // 计算总统计
          const totalUniqueIPs = new Set(
            Object.values(data).flatMap(stat => stat.uniqueIPs)
          ).size;
          const totalClicks = Object.values(data).reduce((sum, stat) => sum + stat.totalClicks, 0);
          const totalViews = Object.values(data).reduce((sum, stat) => sum + stat.totalViews, 0);

          setTotalStats({
            totalUniqueIPs: Object.keys(data).length, // 访问过的不同日期
            totalClicks,
            totalViews,
          });
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    };

    loadAnalytics();

    // 每10秒刷新一次数据
    const interval = setInterval(loadAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  // 记录访问
  useEffect(() => {
    const recordVisit = () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const clientId = localStorage.getItem('client_id') || 
                        `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('client_id', clientId);

        const stored = localStorage.getItem('analytics_data') || '{}';
        const data: AnalyticsData = JSON.parse(stored);

        if (!data[today]) {
          data[today] = {
            date: today,
            uniqueIPs: 1,
            totalClicks: 0,
            totalViews: 1,
          };
        } else {
          data[today].totalViews += 1;
        }

        localStorage.setItem('analytics_data', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to record visit:', error);
      }
    };

    recordVisit();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <h2 className="text-4xl font-bold text-center mb-12 text-blue-600">
        📊 访问统计面板
      </h2>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-5xl font-bold mb-2">{totalStats.totalUniqueIPs}</div>
          <div className="text-lg opacity-90">访问天数</div>
          <div className="text-sm opacity-75 mt-2">不同日期的访问次数</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-5xl font-bold mb-2">{totalStats.totalClicks}</div>
          <div className="text-lg opacity-90">总点击数</div>
          <div className="text-sm opacity-75 mt-2">用户交互次数</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-green-400 to-green-600 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-5xl font-bold mb-2">{totalStats.totalViews}</div>
          <div className="text-lg opacity-90">总访问数</div>
          <div className="text-sm opacity-75 mt-2">页面加载次数</div>
        </motion.div>
      </div>

      {/* 图表区域 */}
      {chartData.length > 0 ? (
        <div className="space-y-8">
          {/* 访问趋势图 */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800">📈 访问趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalViews"
                  stroke="#3b82f6"
                  name="总访问数"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="totalClicks"
                  stroke="#f97316"
                  name="总点击数"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 每日统计图 */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800">📊 每日统计</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalViews" fill="#3b82f6" name="访问数" />
                <Bar dataKey="totalClicks" fill="#f97316" name="点击数" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 详细数据表 */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 shadow-lg overflow-x-auto"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800">📋 详细数据</h3>
            <table className="w-full text-center">
              <thead>
                <tr className="border-b-2 border-blue-300">
                  <th className="py-3 px-4 font-bold text-gray-700">日期</th>
                  <th className="py-3 px-4 font-bold text-gray-700">访问数</th>
                  <th className="py-3 px-4 font-bold text-gray-700">点击数</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((stat, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-800">{stat.date}</td>
                    <td className="py-3 px-4 text-blue-600 font-bold">{stat.totalViews}</td>
                    <td className="py-3 px-4 text-orange-600 font-bold">{stat.totalClicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-12 shadow-lg text-center"
        >
          <div className="text-6xl mb-4">📭</div>
          <p className="text-2xl text-gray-600 mb-4">暂无数据</p>
          <p className="text-gray-500">访问网站并进行学习操作后，统计数据将显示在这里</p>
        </motion.div>
      )}

      {/* 说明信息 */}
      <motion.div
        variants={itemVariants}
        className="mt-12 bg-blue-50 rounded-3xl p-8 border-2 border-blue-200"
      >
        <h4 className="text-xl font-bold text-blue-600 mb-4">📌 说明</h4>
        <ul className="text-gray-700 space-y-2">
          <li>✓ 本面板使用浏览器LocalStorage记录访问数据</li>
          <li>✓ 每次访问页面时自动记录一次访问</li>
          <li>✓ 每个浏览器会被分配一个唯一的客户端ID</li>
          <li>✓ 数据仅保存在本地浏览器中</li>
          <li>✓ 清除浏览器数据会清除统计信息</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
