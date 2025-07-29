import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Users, Heart, MessageSquare, Calendar, RefreshCw, Image, Video, Album } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { instagramService, InstagramAnalytics } from '../services/instagramService';
import ChartFilters from './ChartFilters';
import { generateTimeFilteredData } from '../utils/chartDataUtils';

const InstagramStats: React.FC = () => {
  const [analytics, setAnalytics] = useState<InstagramAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('30d');
  const [filteredFollowerData, setFilteredFollowerData] = useState<any[]>([]);
  const [filteredEngagementData, setFilteredEngagementData] = useState<any[]>([]);

  useEffect(() => {
    loadData();
    instagramService.collectDailyData();
  }, []);

  useEffect(() => {
    if (analytics) {
      const followerData = generateTimeFilteredData(analytics.dailyStats, selectedFilter, analytics.user.followers_count, 'followers');
      const engagementData = generateTimeFilteredData(analytics.dailyStats, selectedFilter, analytics.user.followers_count, 'engagement');
      
      setFilteredFollowerData(followerData);
      setFilteredEngagementData(engagementData);
    }
  }, [analytics, selectedFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await instagramService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading Instagram data:', error);
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
      month: 'short',
      day: 'numeric',
    });
  };

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'IMAGE':
        return <Image className="w-4 h-4" />;
      case 'VIDEO':
        return <Video className="w-4 h-4" />;
      case 'CAROUSEL_ALBUM':
        return <Album className="w-4 h-4" />;
      default:
        return <Image className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load Instagram data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Instagram className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">@{analytics.user.username}</h2>
            <p className="text-gray-600">{analytics.user.biography}</p>
            {analytics.user.website && (
              <a 
                href={analytics.user.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 text-sm"
              >
                {analytics.user.website}
              </a>
            )}
          </div>
          <button
            onClick={loadData}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Key Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Users className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Followers</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.user.followers_count)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Following</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.user.follows_count)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Image className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Posts</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.user.media_count)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Engagement</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.recentMedia.length > 0 
                  ? Math.round(analytics.recentMedia.reduce((sum, post) => sum + post.like_count + post.comments_count, 0) / analytics.recentMedia.length)
                  : 0
                }
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follower Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Follower Growth</h3>
            <ChartFilters selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredFollowerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Engagement Rate</h3>
            <ChartFilters selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredEngagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
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
          {analytics.recentMedia.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getMediaTypeIcon(post.media_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">@{post.owner.username}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{formatDate(post.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.caption}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{formatNumber(post.like_count)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{formatNumber(post.comments_count)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.media_type}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 text-sm"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InstagramStats; 