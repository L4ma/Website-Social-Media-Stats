import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Eye, TrendingUp, Youtube, Instagram, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { youtubeService } from '../services/youtubeService';
import { instagramService } from '../services/instagramService';

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
  const [connectedPlatforms, setConnectedPlatforms] = useState<{
    youtube: boolean;
    instagram: boolean;
  }>({
    youtube: false,
    instagram: false,
  });
  const [totalStats, setTotalStats] = useState({
    followers: 0,
    engagement: 0,
    views: 0,
    posts: 0,
  });

  useEffect(() => {
    // Check which platforms are connected
    const youtubeConnected = !!(youtubeService.getConfig().apiKey && youtubeService.getConfig().channelId);
    const instagramConnected = instagramService.isAuthenticated();
    
    setConnectedPlatforms({
      youtube: youtubeConnected,
      instagram: instagramConnected,
    });

    // Calculate total stats from connected platforms
    let totalFollowers = 0;
    let totalEngagement = 0;
    let totalViews = 0;
    let totalPosts = 0;

    if (youtubeConnected) {
      // Add YouTube stats (demo data for now)
      totalFollowers += 12400; // YouTube subscribers
      totalViews += 1800000; // YouTube views
      totalPosts += 89; // YouTube videos
    }

    if (instagramConnected) {
      // Add Instagram stats (demo data for now)
      totalFollowers += 12450; // Instagram followers
      totalEngagement += 89000 + 3400; // Instagram likes + comments
      totalPosts += 156; // Instagram posts
    }

    setTotalStats({
      followers: totalFollowers,
      engagement: totalEngagement,
      views: totalViews,
      posts: totalPosts,
    });
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const stats = [
    {
      title: 'Total Followers',
      value: formatNumber(totalStats.followers),
      change: '+12.5%',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-blue-500',
      delay: 0.1,
    },
    {
      title: 'Total Engagement',
      value: formatNumber(totalStats.engagement),
      change: '+8.3%',
      icon: <Heart className="w-6 h-6 text-white" />,
      color: 'bg-red-500',
      delay: 0.2,
    },
    {
      title: 'Total Views',
      value: formatNumber(totalStats.views),
      change: '+15.7%',
      icon: <Eye className="w-6 h-6 text-white" />,
      color: 'bg-green-500',
      delay: 0.3,
    },
    {
      title: 'Total Posts',
      value: totalStats.posts.toString(),
      change: '+5.2%',
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'bg-purple-500',
      delay: 0.4,
    },
  ];

  const platforms = [
    {
      name: 'YouTube',
      icon: <Youtube className="w-5 h-5" />,
      connected: connectedPlatforms.youtube,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      stats: {
        followers: '12.4K',
        views: '1.8M',
        posts: '89',
      },
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      connected: connectedPlatforms.instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      stats: {
        followers: '12.5K',
        engagement: '92.4K',
        posts: '156',
      },
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Platform Overview</h2>
        <p className="text-gray-600">Your social media performance across all platforms</p>
      </motion.div>
      
      {/* Connected Platforms Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Connected Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`border rounded-xl p-6 ${platform.bgColor} ${platform.borderColor}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`${platform.color}`}>
                    {platform.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{platform.name}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  {platform.connected ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-gray-500">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Not Connected</span>
                    </div>
                  )}
                </div>
              </div>
              
              {platform.connected ? (
                <div className="space-y-3">
                  {Object.entries(platform.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => window.location.href = `#${platform.name.toLowerCase()}`}
                    className="w-full mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>View Details</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">
                    Connect your {platform.name} account to see your statistics
                  </p>
                  <button
                    onClick={() => window.location.href = '#settings'}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Connect {platform.name}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Overall Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Overall Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StatsOverview; 