import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Heart, Eye, MessageCircle, Share2, TrendingUp } from 'lucide-react';

interface PlatformStatsProps {
  platform: 'threads' | 'instagram' | 'youtube';
}

const PlatformStats: React.FC<PlatformStatsProps> = ({ platform }) => {
  const platformData = {
    threads: {
      name: 'Threads',
      color: '#000000',
      icon: '🧵',
      stats: [
        { title: 'Followers', value: '45.2K', change: '+8.7%', icon: <Users className="w-5 h-5" /> },
        { title: 'Posts', value: '234', change: '+12.3%', icon: <MessageCircle className="w-5 h-5" /> },
        { title: 'Engagement', value: '15.6K', change: '+5.4%', icon: <Heart className="w-5 h-5" /> },
        { title: 'Replies', value: '8.9K', change: '+9.1%', icon: <Share2 className="w-5 h-5" /> },
      ],
      chartData: [
        { month: 'Jan', followers: 42000, engagement: 12000, posts: 180 },
        { month: 'Feb', followers: 43500, engagement: 13500, posts: 195 },
        { month: 'Mar', followers: 44800, engagement: 14200, posts: 210 },
        { month: 'Apr', followers: 45200, engagement: 15600, posts: 234 },
      ],
    },
    instagram: {
      name: 'Instagram',
      color: '#E4405F',
      icon: '📸',
      stats: [
        { title: 'Followers', value: '67.8K', change: '+15.2%', icon: <Users className="w-5 h-5" /> },
        { title: 'Posts', value: '456', change: '+8.9%', icon: <MessageCircle className="w-5 h-5" /> },
        { title: 'Likes', value: '42.3K', change: '+12.7%', icon: <Heart className="w-5 h-5" /> },
        { title: 'Comments', value: '12.1K', change: '+6.8%', icon: <Share2 className="w-5 h-5" /> },
      ],
      chartData: [
        { month: 'Jan', followers: 62000, engagement: 35000, posts: 420 },
        { month: 'Feb', followers: 63500, engagement: 37000, posts: 435 },
        { month: 'Mar', followers: 65200, engagement: 39000, posts: 445 },
        { month: 'Apr', followers: 67800, engagement: 42300, posts: 456 },
      ],
    },
    youtube: {
      name: 'YouTube',
      color: '#FF0000',
      icon: '📺',
      stats: [
        { title: 'Subscribers', value: '12.4K', change: '+23.1%', icon: <Users className="w-5 h-5" /> },
        { title: 'Videos', value: '89', change: '+18.5%', icon: <MessageCircle className="w-5 h-5" /> },
        { title: 'Views', value: '1.8M', change: '+34.2%', icon: <Eye className="w-5 h-5" /> },
        { title: 'Watch Time', value: '45.2K', change: '+28.7%', icon: <TrendingUp className="w-5 h-5" /> },
      ],
      chartData: [
        { month: 'Jan', subscribers: 10000, views: 1500000, videos: 75 },
        { month: 'Feb', subscribers: 10800, views: 1600000, videos: 78 },
        { month: 'Mar', subscribers: 11500, views: 1700000, videos: 82 },
        { month: 'Apr', subscribers: 12400, views: 1800000, videos: 89 },
      ],
    },
  };

  const data = platformData[platform];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-4xl">{data.icon}</span>
          <h2 className="text-3xl font-bold text-gray-900">{data.name} Statistics</h2>
        </div>
        <p className="text-gray-600">Detailed analytics for your {data.name} performance</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm font-medium mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: data.color }}>
                {React.cloneElement(stat.icon, { className: 'w-5 h-5 text-white' })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="followers" stroke={data.color} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="engagement" fill={data.color} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default PlatformStats; 