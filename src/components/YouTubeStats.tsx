import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Eye, Heart, MessageCircle, Clock, TrendingUp, Play, Calendar, RefreshCw } from 'lucide-react';
import { youtubeService, YouTubeAnalytics } from '../services/youtubeService';

const YouTubeStats: React.FC = () => {
  const [analytics, setAnalytics] = useState<YouTubeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadYouTubeData();
  }, []);

  // Listen for configuration changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedConfig = localStorage.getItem('youtubeConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        youtubeService.updateConfig(config);
        loadYouTubeData(); // Reload data with new config
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadYouTubeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await youtubeService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load YouTube data. Please check your configuration.');
      console.error('YouTube data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDuration = (duration: string): string => {
    // Parse ISO 8601 duration format (PT10M30S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading YouTube data...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
      >
        <p className="text-red-800 mb-4">{error}</p>
        <button
          onClick={loadYouTubeData}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  if (!analytics) {
    return null;
  }

  const { channelStats, recentVideos, monthlyViews, monthlySubscribers } = analytics;

  return (
    <div className="space-y-8">
      {/* Channel Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{channelStats.channelName}</h2>
            <p className="text-gray-600">{channelStats.channelUrl}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadYouTubeData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <div className="text-right">
              <p className="text-3xl font-bold text-red-600">{formatNumber(channelStats.subscriberCount)}</p>
              <p className="text-sm text-gray-600">Subscribers</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(channelStats.subscriberCount)}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(channelStats.viewCount)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Videos</p>
              <p className="text-2xl font-bold text-gray-900">{channelStats.videoCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(Math.round(channelStats.viewCount / channelStats.videoCount))}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySubscribers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="subscribers" stroke="#FF0000" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Views</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#FF0000" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Videos</h3>
        <div className="space-y-4">
          {recentVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-20 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 line-clamp-2">{video.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(video.publishedAt)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(video.duration)}</span>
                  </span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber(video.viewCount)}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span>{formatNumber(video.likeCount)}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  <span>{formatNumber(video.commentCount)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default YouTubeStats; 