import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Eye, Heart, MessageCircle, Clock, TrendingUp, Play, Calendar, RefreshCw } from 'lucide-react';
import { youtubeService, YouTubeAnalytics } from '../services/youtubeService';
import ChartFilters, { TimeFilter } from './ChartFilters';
import { generateTimeFilteredData } from '../utils/chartDataUtils';
import { dataCollectionService } from '../services/dataCollectionService';

const YouTubeStats: React.FC = () => {
  const [analytics, setAnalytics] = useState<YouTubeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('6m');
  const [filteredSubscriberData, setFilteredSubscriberData] = useState<any[]>([]);
  const [filteredViewsData, setFilteredViewsData] = useState<any[]>([]);
  const [apiStatus, setApiStatus] = useState<any>({
    dailyCalls: 0,
    maxCalls: 48,
    remainingCalls: 48,
    canMakeCall: true,
    usingDemoData: false,
    usingCachedData: false,
    reason: 'Loading...',
    showCallCount: true,
    timeUntilNext: 0,
    actualQuotaExceeded: false
  });

  useEffect(() => {
    loadYouTubeData();
    // Initialize daily data collection
    dataCollectionService.initializeDailyCollection();
  }, []);

  // Load API status
  useEffect(() => {
    const loadApiStatus = async () => {
      const status = await youtubeService.getApiCallStatus();
      setApiStatus(status);
    };
    loadApiStatus();
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

  // Update filtered data when filter changes
  useEffect(() => {
    if (analytics) {
      const subscriberData = generateTimeFilteredData(
        analytics.monthlySubscribers, 
        selectedFilter, 
        analytics.channelStats.subscriberCount
      );
      const viewsData = generateTimeFilteredData(
        analytics.monthlyViews, 
        selectedFilter, 
        analytics.channelStats.viewCount,
        'views'
      );
      setFilteredSubscriberData(subscriberData);
      setFilteredViewsData(viewsData);
    }
  }, [selectedFilter, analytics]);

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


  
  // Check if we're using demo data or cached data due to API quota
  const isUsingDemoData = analytics && 
    (analytics.channelStats.channelName === 'Demo Channel' || 
     analytics.channelStats.channelName === 'Sample Video Title 1');
  const isUsingCachedData = apiStatus.usingCachedData;

  if (!analytics) {
    return null;
  }

  const { channelStats, recentVideos } = analytics;

  return (
    <div className="space-y-8">
      {/* Data Status Notice */}
      {(isUsingDemoData || isUsingCachedData) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-lg p-4 ${
            isUsingCachedData 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              isUsingCachedData ? 'bg-green-500' : 'bg-yellow-500'
            }`}>
              <span className="text-white text-xs font-bold">
                {isUsingCachedData ? '✓' : '!'}
              </span>
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${
                isUsingCachedData ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {isUsingCachedData ? 'Cached Data Active' : 'Demo Data Active'}
              </h3>
              <p className={`text-xs ${
                isUsingCachedData ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {isUsingCachedData 
                  ? 'Showing last cached data due to API limits. Data will refresh when quota resets.'
                  : 'YouTube API quota exceeded. Showing demo data. Quota resets daily.'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}



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
            <button
              onClick={() => {
                const debug = youtubeService.debugCachedData();
                console.log('Debug data:', debug);
                alert('Check console for cached data debug info');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span>Debug Cache</span>
            </button>
            <button
              onClick={() => {
                youtubeService.cacheDemoDataAsReal();
                alert('Demo data cached as real data. Refresh the page to see the effect.');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>Cache Demo Data</span>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Growth</h3>
                      <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredSubscriberData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#FF0000" strokeWidth={3} />
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
              <BarChart data={filteredViewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF0000" />
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

            {/* API Status - Moved to end */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-4 ${
          apiStatus.actualQuotaExceeded 
            ? 'bg-red-50 border-red-200' 
            : apiStatus.canMakeCall 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-yellow-50 border-yellow-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              apiStatus.actualQuotaExceeded 
                ? 'bg-red-500' 
                : apiStatus.canMakeCall 
                  ? 'bg-blue-500' 
                  : 'bg-yellow-500'
            }`}>
              <span className="text-white text-xs font-bold">
                {apiStatus.actualQuotaExceeded ? '!' : apiStatus.canMakeCall ? 'i' : '!'}
              </span>
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${
                apiStatus.actualQuotaExceeded 
                  ? 'text-red-900' 
                  : apiStatus.canMakeCall 
                    ? 'text-blue-900' 
                    : 'text-yellow-900'
              }`}>
                {apiStatus.actualQuotaExceeded ? 'API Quota Exceeded' : 'API Status'}
              </h3>
              <p className={`text-xs ${
                apiStatus.actualQuotaExceeded 
                  ? 'text-red-700' 
                  : apiStatus.canMakeCall 
                    ? 'text-blue-700' 
                    : 'text-yellow-700'
              }`}>
                {apiStatus.showCallCount ? (
                  `Daily calls: ${apiStatus.dailyCalls}/${apiStatus.maxCalls} (${apiStatus.remainingCalls} remaining)`
                ) : (
                  apiStatus.reason
                )}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xs px-2 py-1 rounded ${
              apiStatus.canMakeCall 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {apiStatus.canMakeCall ? 'Ready' : 'Limited'}
            </div>
            {!apiStatus.canMakeCall && apiStatus.timeUntilNext && apiStatus.timeUntilNext > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {Math.ceil(apiStatus.timeUntilNext / 60000)}m remaining
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default YouTubeStats; 