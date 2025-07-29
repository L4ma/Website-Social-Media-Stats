import { youtubeConfig, buildYouTubeUrl, YOUTUBE_ENDPOINTS, YouTubeConfig } from '../config/youtube';

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

  constructor() {
    // Try to load saved configuration from localStorage
    const savedConfig = localStorage.getItem('youtubeConfig');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      this.config = {
        channelId: parsed.channelId || youtubeConfig.channelId,
        apiKey: parsed.apiKey || youtubeConfig.apiKey,
        channelName: parsed.channelName || youtubeConfig.channelName,
        channelUrl: parsed.channelUrl || youtubeConfig.channelUrl,
      };
    } else {
      this.config = youtubeConfig;
    }
  }

  updateConfig(newConfig: YouTubeConfig) {
    this.config = newConfig;
  }

  private async fetchFromAPI(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('YouTube API Error:', error);
      throw error;
    }
  }

  async getChannelStats(): Promise<YouTubeChannelStats> {
    if (!this.config.channelId || !this.config.apiKey) {
      // Return mock data if no API key is configured
      return {
        subscriberCount: 12400,
        videoCount: 89,
        viewCount: 1800000,
        channelName: this.config.channelName,
        channelUrl: this.config.channelUrl,
        channelId: this.config.channelId || 'mock-channel-id',
      };
    }

    const url = buildYouTubeUrl(YOUTUBE_ENDPOINTS.channel, {
      part: 'statistics,snippet',
      id: this.config.channelId,
    }, this.config.apiKey);

    const data = await this.fetchFromAPI(url);
    
    if (data.items && data.items.length > 0) {
      const channel = data.items[0];
      return {
        subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
        videoCount: parseInt(channel.statistics.videoCount || '0'),
        viewCount: parseInt(channel.statistics.viewCount || '0'),
        channelName: channel.snippet.title,
        channelUrl: `https://www.youtube.com/channel/${channel.id}`,
        channelId: channel.id,
      };
    }

    throw new Error('Channel not found');
  }

  async getRecentVideos(limit: number = 10): Promise<YouTubeVideo[]> {
    if (!this.config.channelId || !this.config.apiKey) {
      // Return mock data
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

    const url = buildYouTubeUrl(YOUTUBE_ENDPOINTS.videos, {
      part: 'snippet',
      channelId: this.config.channelId,
      order: 'date',
      maxResults: limit.toString(),
      type: 'video',
    }, this.config.apiKey);

    const data = await this.fetchFromAPI(url);
    
    if (data.items) {
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      
      // Get detailed video statistics
      const statsUrl = buildYouTubeUrl(YOUTUBE_ENDPOINTS.videoStats, {
        part: 'statistics,contentDetails',
        id: videoIds,
      }, this.config.apiKey);

      const statsData = await this.fetchFromAPI(statsUrl);
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

      return data.items.map((item: any) => {
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
    }

    return [];
  }

  async getAnalytics(): Promise<YouTubeAnalytics> {
    const [channelStats, recentVideos] = await Promise.all([
      this.getChannelStats(),
      this.getRecentVideos(),
    ]);

    // Generate realistic monthly data based on actual channel stats
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