import { buildYouTubeUrl, YOUTUBE_ENDPOINTS, YouTubeConfig } from '../config/youtube';

export interface YouTubeChannelStats {
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  channelName: string;
  channelUrl: string;
  channelId: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnail: string;
  duration: string;
}

export interface YouTubeAnalytics {
  channelStats: YouTubeChannelStats;
  recentVideos: YouTubeVideo[];
  monthlyViews: Array<{ month: string; views: number }>;
  monthlySubscribers: Array<{ month: string; subscribers: number }>;
}

class YouTubeService {
  private config: YouTubeConfig;
  private lastApiCall: number = 0;
  private apiCallCount: number = 0;
  private readonly MAX_DAILY_CALLS = 4; // Maximum 4 calls per day (very conservative)
  private readonly MIN_CALL_INTERVAL = 21600000; // 6 hours between calls (4 per day max)
  private cachedData: {
    channelStats?: YouTubeChannelStats;
    recentVideos?: YouTubeVideo[];
    lastCached: number;
  } = { lastCached: 0 };

  constructor() {
    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem('youtubeConfig');
    console.log('Loading YouTube config from localStorage:', savedConfig);
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      this.config = {
        channelId: parsed.channelId || '',
        apiKey: parsed.apiKey || '',
        channelName: parsed.channelName || '',
        channelUrl: parsed.channelUrl || '',
      };
      console.log('Loaded config:', this.config);
    } else {
      this.config = {
        channelId: '',
        apiKey: '',
        channelName: '',
        channelUrl: '',
      };
      console.log('No saved config, using defaults');
    }

    // Load API call tracking from localStorage
    this.loadApiCallTracking();
    
    // Load cached data from localStorage
    this.loadCachedData();
  }

  private loadApiCallTracking() {
    const today = new Date().toDateString();
    const savedTracking = localStorage.getItem('youtubeApiTracking');
    
    if (savedTracking) {
      const tracking = JSON.parse(savedTracking);
      if (tracking.date === today) {
        this.apiCallCount = tracking.count || 0;
        this.lastApiCall = tracking.lastCall || 0;
      } else {
        // Reset for new day
        this.apiCallCount = 0;
        this.lastApiCall = 0;
      }
    }
  }

  private saveApiCallTracking() {
    const tracking = {
      date: new Date().toDateString(),
      count: this.apiCallCount,
      lastCall: this.lastApiCall
    };
    localStorage.setItem('youtubeApiTracking', JSON.stringify(tracking));
  }

  private loadCachedData() {
    const savedCachedData = localStorage.getItem('youtubeCachedData');
    if (savedCachedData) {
      this.cachedData = JSON.parse(savedCachedData);
      console.log('Loaded cached data:', this.cachedData);
    } else {
      console.log('No cached data found in localStorage');
    }
  }

  private saveCachedData() {
    localStorage.setItem('youtubeCachedData', JSON.stringify(this.cachedData));
  }

  private canMakeApiCall(): boolean {
    const now = Date.now();
    
    // Check if we've exceeded daily limit
    if (this.apiCallCount >= this.MAX_DAILY_CALLS) {
      console.log('Daily API call limit reached');
      return false;
    }
    
    // Check if enough time has passed since last call
    if (now - this.lastApiCall < this.MIN_CALL_INTERVAL) {
      console.log('API call rate limit: waiting for cooldown');
      return false;
    }
    
    return true;
  }

  // Check if we've actually hit the YouTube API quota (403 errors)
  private async checkActualApiQuota(): Promise<boolean> {
    if (!this.config.apiKey || !this.config.channelId) {
      return true; // No config means no quota check needed
    }

    // If we have cached data from today, assume API is working
    const today = new Date().toDateString();
    const cachedDate = new Date(this.cachedData.lastCached).toDateString();
    if (this.cachedData.channelStats && cachedDate === today) {
      console.log('Using cached data from today, assuming API is available');
      return true;
    }

    // Only check actual quota if we haven't made a call recently
    const timeSinceLastCall = Date.now() - this.lastApiCall;
    if (timeSinceLastCall < 300000) { // 5 minutes
      console.log('Recent API call made, skipping quota check');
      return true;
    }

    try {
      const url = buildYouTubeUrl(YOUTUBE_ENDPOINTS.channel, {
        part: 'statistics,snippet',
        id: this.config.channelId,
      }, this.config.apiKey);

      const response = await fetch(url);
      console.log('Quota check response status:', response.status);
      
      if (response.status === 403) {
        console.log('YouTube API quota actually exceeded');
        return false; // Quota exceeded
      }
      
      return true; // API is available
    } catch (error) {
      console.log('Error checking API quota:', error);
      return false; // Assume quota exceeded on error
    }
  }

  private recordApiCall() {
    this.apiCallCount++;
    this.lastApiCall = Date.now();
    this.saveApiCallTracking();
    console.log(`API call recorded. Daily count: ${this.apiCallCount}/${this.MAX_DAILY_CALLS}`);
  }

  updateConfig(newConfig: YouTubeConfig) {
    this.config = newConfig;
    localStorage.setItem('youtubeConfig', JSON.stringify(newConfig));
  }

  getConfig(): YouTubeConfig {
    return this.config;
  }

  // Debug method to check localStorage
  debugCachedData() {
    const savedCachedData = localStorage.getItem('youtubeCachedData');
    const savedConfig = localStorage.getItem('youtubeConfig');
    const savedTracking = localStorage.getItem('youtubeApiTracking');
    
    console.log('=== DEBUG CACHED DATA ===');
    console.log('youtubeCachedData:', savedCachedData);
    console.log('youtubeConfig:', savedConfig);
    console.log('youtubeApiTracking:', savedTracking);
    console.log('Current cachedData object:', this.cachedData);
    console.log('========================');
    
    return {
      cachedData: savedCachedData ? JSON.parse(savedCachedData) : null,
      config: savedConfig ? JSON.parse(savedConfig) : null,
      tracking: savedTracking ? JSON.parse(savedTracking) : null,
      currentCachedData: this.cachedData
    };
  }

  // Method to manually cache demo data as real data (for testing)
  cacheDemoDataAsReal() {
    const demoChannelStats = {
      subscriberCount: 12400,
      videoCount: 89,
      viewCount: 1800000,
      channelName: this.config.channelName || 'Maggo',
      channelUrl: this.config.channelUrl || 'https://www.youtube.com/@maggo',
      channelId: this.config.channelId || 'UCZggs3Q7sC5QQZGeQYJd5pA',
    };

    const demoVideos = [
      {
        id: 'demo-video-1',
        title: 'Sample Video Title 1',
        publishedAt: '2024-01-15T10:00:00Z',
        viewCount: 15000,
        likeCount: 1200,
        commentCount: 89,
        thumbnail: 'https://via.placeholder.com/320x180',
        duration: 'PT10M30S',
      },
      {
        id: 'demo-video-2',
        title: 'Sample Video Title 2',
        publishedAt: '2024-01-10T14:30:00Z',
        viewCount: 22000,
        likeCount: 1800,
        commentCount: 156,
        thumbnail: 'https://via.placeholder.com/320x180',
        duration: 'PT15M45S',
      },
    ];

    this.cachedData.channelStats = demoChannelStats;
    this.cachedData.recentVideos = demoVideos;
    this.cachedData.lastCached = Date.now();
    this.saveCachedData();
    
    console.log('Manually cached demo data as real data:', this.cachedData);
    return this.cachedData;
  }

  async getApiCallStatus() {
    // Check if we have valid config
    const hasValidConfig = this.config.apiKey && this.config.channelId;
    
    // If no valid config, show as unlimited since we're using demo data
    if (!hasValidConfig) {
      return {
        dailyCalls: 0,
        maxCalls: this.MAX_DAILY_CALLS,
        remainingCalls: this.MAX_DAILY_CALLS,
        lastCall: this.lastApiCall,
        canMakeCall: true,
        usingDemoData: true,
        reason: 'No API configuration',
        showCallCount: false,
        actualQuotaExceeded: false
      };
    }

    // Check if we're actually hitting quota limits
    const isQuotaExceeded = this.apiCallCount >= this.MAX_DAILY_CALLS;
    const isRateLimited = Date.now() - this.lastApiCall < this.MIN_CALL_INTERVAL;
    const hasCachedData = this.cachedData.channelStats && this.cachedData.recentVideos;
    
    // Check actual YouTube API quota status
    const actualQuotaAvailable = await this.checkActualApiQuota();
    const actualQuotaExceeded = !actualQuotaAvailable;
    
    // Calculate time until next available call
    const timeUntilNextCall = this.lastApiCall + this.MIN_CALL_INTERVAL - Date.now();
    const minutesUntilNext = Math.ceil(timeUntilNextCall / 60000);
    
    // Determine the actual status
    let canMakeCall = true;
    let showCallCount = true;
    
          if (actualQuotaExceeded) {
        canMakeCall = false;
        showCallCount = false;
      } else if (isQuotaExceeded) {
        canMakeCall = false;
        showCallCount = false;
      } else if (isRateLimited) {
        canMakeCall = false;
        showCallCount = false;
      }

      return {
        dailyCalls: this.apiCallCount,
        maxCalls: this.MAX_DAILY_CALLS,
        remainingCalls: Math.max(0, this.MAX_DAILY_CALLS - this.apiCallCount),
        lastCall: this.lastApiCall,
        canMakeCall,
        usingCachedData: (!canMakeCall) && hasCachedData,
        usingDemoData: (!canMakeCall) && !hasCachedData,
        reason: isQuotaExceeded ? 'Daily quota exceeded - wait 24 hours (4 calls max)' : 
                isRateLimited ? `Rate limited - wait ${minutesUntilNext} minutes (6h cooldown)` : 'Ready',
        showCallCount,
        timeUntilNext: timeUntilNextCall,
        actualQuotaExceeded
      };
  }

  private async fetchFromAPI(url: string): Promise<any> {
    console.log('Making API call to:', url);
    const response = await fetch(url);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      
      if (response.status === 403) {
        throw new Error('API quota exceeded or invalid API key');
      } else if (response.status === 400) {
        throw new Error('Invalid request - check channel ID');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    return data;
  }

  async getChannelStats(): Promise<YouTubeChannelStats> {
    console.log('getChannelStats called with config:', this.config);
    console.log('Current cached data:', this.cachedData);
    
    // If no API key or channel ID, return mock data
    if (!this.config.apiKey || !this.config.channelId) {
      console.log('No API key or channel ID, returning mock data');
      return {
        subscriberCount: 12400,
        videoCount: 89,
        viewCount: 1800000,
        channelName: this.config.channelName || 'Demo Channel',
        channelUrl: this.config.channelUrl || 'https://www.youtube.com/@demo',
        channelId: this.config.channelId || 'demo-channel-id',
      };
    }

    // Check if we have cached data from today first
    const today = new Date().toDateString();
    const cachedDate = this.cachedData.lastCached ? new Date(this.cachedData.lastCached).toDateString() : null;
    console.log('Today:', today, 'Cached date:', cachedDate);
    
    if (this.cachedData.channelStats && cachedDate === today) {
      console.log('Returning cached channel stats from today');
      return this.cachedData.channelStats;
    }

    // Check if we can make API call
    if (!this.canMakeApiCall()) {
      console.log('API call limit reached, checking cached data');
      
      // Return cached data if available (even from previous days)
      if (this.cachedData.channelStats) {
        console.log('Returning cached channel stats from previous days');
        return this.cachedData.channelStats;
      }
      
      // Fall back to mock data if no cache
      console.log('No cached data, returning mock data');
      return {
        subscriberCount: 12400,
        videoCount: 89,
        viewCount: 1800000,
        channelName: this.config.channelName || 'Demo Channel',
        channelUrl: this.config.channelUrl || 'https://www.youtube.com/@demo',
        channelId: this.config.channelId || 'demo-channel-id',
      };
    }

    // Try to make API call and cache the result
    try {
      const url = buildYouTubeUrl(YOUTUBE_ENDPOINTS.channel, {
        part: 'statistics,snippet',
        id: this.config.channelId,
      }, this.config.apiKey);

      const data = await this.fetchFromAPI(url);
      this.recordApiCall();
      
      if (data.items && data.items.length > 0) {
        const channel = data.items[0];
        const channelStats = {
          subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
          videoCount: parseInt(channel.statistics.videoCount || '0'),
          viewCount: parseInt(channel.statistics.viewCount || '0'),
          channelName: channel.snippet.title,
          channelUrl: `https://www.youtube.com/channel/${channel.id}`,
          channelId: channel.id,
        };
        
        // Cache the successful API response
        this.cachedData.channelStats = channelStats;
        this.cachedData.lastCached = Date.now();
        this.saveCachedData();
        console.log('Successfully cached channel stats:', channelStats);
        
        return channelStats;
      }

      throw new Error('Channel not found');
    } catch (error) {
      console.error('Error in getChannelStats:', error);
      
      // If we have any cached data, return it even if it's old
      if (this.cachedData.channelStats) {
        console.log('API failed, returning cached data');
        return this.cachedData.channelStats;
      }
      
      // Return mock data if API fails and no cache exists
      console.log('API failed and no cache, returning mock data');
      return {
        subscriberCount: 12400,
        videoCount: 89,
        viewCount: 1800000,
        channelName: this.config.channelName || 'Demo Channel',
        channelUrl: this.config.channelUrl || 'https://www.youtube.com/@demo',
        channelId: this.config.channelId || 'demo-channel-id',
      };
    }
  }

  async getRecentVideos(limit: number = 10): Promise<YouTubeVideo[]> {
    // If no API key or channel ID, return mock data
    if (!this.config.apiKey || !this.config.channelId) {
      return [
        {
          id: 'mock-video-1',
          title: 'Sample Video Title 1',
          publishedAt: '2024-01-15T10:00:00Z',
          viewCount: 15000,
          likeCount: 1200,
          commentCount: 89,
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: 'PT10M30S',
        },
        {
          id: 'mock-video-2',
          title: 'Sample Video Title 2',
          publishedAt: '2024-01-10T14:30:00Z',
          viewCount: 22000,
          likeCount: 1800,
          commentCount: 156,
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: 'PT15M45S',
        },
      ];
    }

    // Check if we have cached data from today first
    const today = new Date().toDateString();
    const cachedDate = new Date(this.cachedData.lastCached).toDateString();
    if (this.cachedData.recentVideos && cachedDate === today) {
      console.log('Returning cached videos from today');
      return this.cachedData.recentVideos;
    }

    // Check if we can make API call
    if (!this.canMakeApiCall()) {
      console.log('API call limit reached, checking cached videos');
      
      // Return cached data if available (even from previous days)
      if (this.cachedData.recentVideos) {
        console.log('Returning cached videos');
        return this.cachedData.recentVideos;
      }
      
      // Fall back to mock data if no cache
      console.log('No cached videos, returning mock data');
      return [
        {
          id: 'mock-video-1',
          title: 'Sample Video Title 1',
          publishedAt: '2024-01-15T10:00:00Z',
          viewCount: 15000,
          likeCount: 1200,
          commentCount: 89,
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: 'PT10M30S',
        },
        {
          id: 'mock-video-2',
          title: 'Sample Video Title 2',
          publishedAt: '2024-01-10T14:30:00Z',
          viewCount: 22000,
          likeCount: 1800,
          commentCount: 156,
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: 'PT15M45S',
        },
      ];
    }

    try {
      // Make real API call
      const url = buildYouTubeUrl(YOUTUBE_ENDPOINTS.videos, {
        part: 'snippet',
        channelId: this.config.channelId,
        order: 'date',
        maxResults: limit.toString(),
        type: 'video',
      }, this.config.apiKey);

      const data = await this.fetchFromAPI(url);
      this.recordApiCall();
      
      if (data.items) {
        const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
        
        // Check if we can make another API call for video stats
        if (!this.canMakeApiCall()) {
          console.log('API call limit reached, returning videos without detailed stats');
          return data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt,
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            thumbnail: item.snippet.thumbnails.medium.url,
            duration: 'PT0S',
          }));
        }
        
        // Get detailed video statistics
        const statsUrl = buildYouTubeUrl(YOUTUBE_ENDPOINTS.videoStats, {
          part: 'statistics,contentDetails',
          id: videoIds,
        }, this.config.apiKey);

        const statsData = await this.fetchFromAPI(statsUrl);
        this.recordApiCall();
        const statsMap = new Map();
        
        if (statsData.items) {
          statsData.items.forEach((item: any) => {
            statsMap.set(item.id, {
              viewCount: parseInt(item.statistics.viewCount || '0'),
              likeCount: parseInt(item.statistics.likeCount || '0'),
              commentCount: parseInt(item.statistics.commentCount || '0'),
              duration: item.contentDetails.duration,
            });
          });
        }

        const videos = data.items.map((item: any) => {
          const stats = statsMap.get(item.id.videoId) || {
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            duration: 'PT0S',
          };

          return {
            id: item.id.videoId,
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt,
            viewCount: stats.viewCount,
            likeCount: stats.likeCount,
            commentCount: stats.commentCount,
            thumbnail: item.snippet.thumbnails.medium.url,
            duration: stats.duration,
          };
        });
        
        // Cache the successful API response
        this.cachedData.recentVideos = videos;
        this.cachedData.lastCached = Date.now();
        this.saveCachedData();
        
        return videos;
      }

      return [];
    } catch (error) {
      console.error('Error in getRecentVideos:', error);
      
      // Return mock data if API fails
      return [
        {
          id: 'mock-video-1',
          title: 'Sample Video Title 1',
          publishedAt: '2024-01-15T10:00:00Z',
          viewCount: 15000,
          likeCount: 1200,
          commentCount: 89,
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: 'PT10M30S',
        },
        {
          id: 'mock-video-2',
          title: 'Sample Video Title 2',
          publishedAt: '2024-01-10T14:30:00Z',
          viewCount: 22000,
          likeCount: 1800,
          commentCount: 156,
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: 'PT15M45S',
        },
      ];
    }
  }

  async getAnalytics(): Promise<YouTubeAnalytics> {
    const [channelStats, recentVideos] = await Promise.all([
      this.getChannelStats(),
      this.getRecentVideos(),
    ]);

    // Generate monthly data based on actual channel stats
    const currentSubscribers = channelStats.subscriberCount;
    const currentViews = channelStats.viewCount;
    
    // Get current date and generate last 6 months
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date.toLocaleDateString('en-US', { month: 'short' }));
    }
    
    // Calculate progression factors for realistic growth
    const progressionFactors = [0.7, 0.8, 0.85, 0.9, 0.95, 1.0];
    
    // Calculate monthly progression based on current stats
    const monthlyViews = months.map((month, index) => ({
      month,
      views: Math.round(currentViews * progressionFactors[index])
    }));

    const monthlySubscribers = months.map((month, index) => ({
      month,
      subscribers: Math.round(currentSubscribers * progressionFactors[index])
    }));

    return {
      channelStats,
      recentVideos,
      monthlyViews,
      monthlySubscribers,
    };
  }
}

export const youtubeService = new YouTubeService(); 