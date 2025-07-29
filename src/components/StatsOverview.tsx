import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Eye, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className={`text-sm font-medium mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </p>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const StatsOverview: React.FC = () => {
  const stats = [
    {
      title: 'Total Followers',
      value: '125.4K',
      change: '+12.5%',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-blue-500',
      delay: 0.1,
    },
    {
      title: 'Total Engagement',
      value: '89.2K',
      change: '+8.3%',
      icon: <Heart className="w-6 h-6 text-white" />,
      color: 'bg-red-500',
      delay: 0.2,
    },
    {
      title: 'Total Views',
      value: '2.1M',
      change: '+15.7%',
      icon: <Eye className="w-6 h-6 text-white" />,
      color: 'bg-green-500',
      delay: 0.3,
    },
    {
      title: 'Growth Rate',
      value: '23.4%',
      change: '+5.2%',
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'bg-purple-500',
      delay: 0.4,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Platform Overview</h2>
        <p className="text-gray-600">Your social media performance across all platforms</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default StatsOverview; 