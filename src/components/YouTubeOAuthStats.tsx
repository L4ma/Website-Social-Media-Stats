import React, { useState, useEffect } from 'react';
import { Youtube, Users, Eye, ThumbsUp, MessageCircle, TrendingUp } from 'lucide-react';
import { youtubeOAuthService, YouTubeOAuthAnalytics } from '../services/youtubeOAuthService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const YouTubeOAuthStats: React.FC = () => {
  const [analytics, setAnalytics] = useState<YouTubeOAuthAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('30d');

  useEffect(() => {
    if (!youtubeOAuthService.isAuthenticated()) {
      setError('Please connect your YouTube account first');
      setLoading(false);
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await youtubeOAuthService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching YouTube OAuth data:', error);
      setError('Failed to load YouTube data. Please check your connection.');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <Youtube className="w-6 h-6 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <Youtube className="w-6 h-6 text-yellow-500 mr-2" />
          <span className="text-yellow-700">No data available</span>
        </div>
      </div>
    );
  }

  const { stats, recentVideos, monthlySubscribers, monthlyViews, monthlyEngagement } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Youtube className="w-8 h-8 text-red-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{stats.channelTitle}</h1>
            <p className="text-gray-600">YouTube Channel Statistics</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {['7d', '30d', '3m', '6m', '1y'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.subscriberCount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.viewCount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Videos</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.videoCount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <ThumbsUp className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(recentVideos.reduce((sum, video) => sum + video.statistics.likeCount + video.statistics.commentCount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscribers Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySubscribers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
              <Line type="monotone" dataKey="subscribers" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Views Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">View Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
              <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyEngagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
              <Bar dataKey="engagement" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Videos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Videos</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentVideos.slice(0, 5).map((video) => (
              <div key={video.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={video.thumbnails.default}
                  alt={video.title}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {formatNumber(video.statistics.viewCount)}
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {formatNumber(video.statistics.likeCount)}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {formatNumber(video.statistics.commentCount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeOAuthStats; 