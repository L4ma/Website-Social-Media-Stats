import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Heart, MessageCircle, Image, Video, Calendar, RefreshCw, ExternalLink } from 'lucide-react';
import { instagramService, InstagramAnalytics } from '../services/instagramService';
import ChartFilters, { TimeFilter } from './ChartFilters';
import { generateTimeFilteredData } from '../utils/chartDataUtils';

const InstagramStats: React.FC = () => {
  const [analytics, setAnalytics] = useState<InstagramAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('30d');
  const [filteredFollowersData, setFilteredFollowersData] = useState<any[]>([]);
  const [filteredEngagementData, setFilteredEngagementData] = useState<any[]>([]);

  useEffect(() => {
    loadInstagramData();
  }, []);

  // Update filtered data when filter changes
  useEffect(() => {
    if (analytics) {
      const followersData = generateTimeFilteredData(
        analytics.monthlyFollowers, 
        selectedFilter, 
        analytics.stats.followers
      );
      const engagementData = generateTimeFilteredData(
        analytics.monthlyEngagement, 
        selectedFilter, 
        analytics.stats.engagementRate,
        'engagement'
      );
      setFilteredFollowersData(followersData);
      setFilteredEngagementData(engagementData);
    }
  }, [selectedFilter, analytics]);

  const loadInstagramData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await instagramService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load Instagram data. Please check your connection.');
      console.error('Instagram data loading error:', err);
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'VIDEO':
        return <Video className="w-4 h-4" />;
      case 'CAROUSEL_ALBUM':
        return <Image className="w-4 h-4" />;
      default:
        return <Image className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Instagram data...</p>
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
          onClick={loadInstagramData}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  if (!analytics) {
    return null;
  }

  const { stats, recentPosts } = analytics;

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      {!instagramService.isAuthenticated() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-yellow-900">Instagram Not Connected</h3>
              <p className="text-xs text-yellow-700">
                Connect your Instagram account in Settings to view real data.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Instagram Profile</h2>
            <p className="text-gray-600">@{stats.followers > 0 ? 'connected_user' : 'demo_user'}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadInstagramData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <div className="text-right">
              <p className="text-3xl font-bold text-pink-600">{formatNumber(stats.followers)}</p>
              <p className="text-sm text-gray-600">Followers</p>
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
              <p className="text-sm font-medium text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.followers)}</p>
            </div>
            <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
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
              <p className="text-sm font-medium text-gray-600">Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.posts}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
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
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalLikes)}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
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
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.engagementRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart Filters */}
      <div className="mb-6">
        <ChartFilters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Follower Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredFollowersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#EC4899" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredEngagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                {getMediaTypeIcon(post.mediaType)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 line-clamp-2">{post.caption || 'No caption'}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.timestamp)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{formatNumber(post.likeCount)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{formatNumber(post.commentCount)}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => window.open(post.permalink, '_blank')}
                className="flex items-center space-x-1 text-sm text-pink-600 hover:text-pink-700"
              >
                <span>View</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InstagramStats; 