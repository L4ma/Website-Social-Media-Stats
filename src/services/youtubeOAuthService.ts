export interface YouTubeOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface YouTubeOAuthStats {
  channelId: string;
  channelTitle: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
}

export interface YouTubeOAuthVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  statistics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
}

export interface YouTubeOAuthAnalytics {
  stats: YouTubeOAuthStats;
  recentVideos: YouTubeOAuthVideo[];
  monthlySubscribers: { month: string; subscribers: number }[];
  monthlyViews: { month: string; views: number }[];
  monthlyEngagement: { month: string; engagement: number }[];
}

class YouTubeOAuthService {
  private config: YouTubeOAuthConfig | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.loadConfig();
    this.loadTokens();
  }

  private loadConfig(): void {
    const saved = localStorage.getItem('youtubeOAuthConfig');
    if (saved) {
      this.config = JSON.parse(saved);
    }
  }

  private loadTokens(): void {
    this.accessToken = localStorage.getItem('youtubeOAuthAccessToken');
    this.refreshToken = localStorage.getItem('youtubeOAuthRefreshToken');
  }

  private saveConfig(): void {
    if (this.config) {
      localStorage.setItem('youtubeOAuthConfig', JSON.stringify(this.config));
    }
  }

  private saveTokens(): void {
    if (this.accessToken) {
      localStorage.setItem('youtubeOAuthAccessToken', this.accessToken);
    }
    if (this.refreshToken) {
      localStorage.setItem('youtubeOAuthRefreshToken', this.refreshToken);
    }
  }

  setConfig(config: YouTubeOAuthConfig): void {
    this.config = config;
    this.saveConfig();
  }

  getConfig(): YouTubeOAuthConfig | null {
    return this.config;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAuthUrl(): string {
    if (!this.config) {
      throw new Error('YouTube OAuth configuration not set');
    }

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async handleOAuthCallback(code: string): Promise<boolean> {
    if (!this.config) {
      throw new Error('YouTube OAuth configuration not set');
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.config.redirectUri,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OAuth token exchange failed: ${error}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.saveTokens();

      return true;
    } catch (error) {
      console.error('YouTube OAuth callback error:', error);
      return false;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.config || !this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.saveTokens();

      return true;
    } catch (error) {
      console.error('YouTube token refresh error:', error);
      return false;
    }
  }

  private async makeAuthenticatedRequest(url: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        return this.makeAuthenticatedRequest(url);
      } else {
        throw new Error('Authentication failed and token refresh failed');
      }
    }

    if (!response.ok) {
      throw new Error(`YouTube API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getChannelStats(): Promise<YouTubeOAuthStats> {
    const url = 'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true';
    const data = await this.makeAuthenticatedRequest(url);
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No channel found for authenticated user');
    }

    const channel = data.items[0];
    return {
      channelId: channel.id,
      channelTitle: channel.snippet.title,
      subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
      videoCount: parseInt(channel.statistics.videoCount || '0'),
      viewCount: parseInt(channel.statistics.viewCount || '0'),
      description: channel.snippet.description,
      customUrl: channel.snippet.customUrl || '',
      publishedAt: channel.snippet.publishedAt,
      thumbnails: channel.snippet.thumbnails
    };
  }

  async getRecentVideos(): Promise<YouTubeOAuthVideo[]> {
    const url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&type=video&order=date&maxResults=10';
    const data = await this.makeAuthenticatedRequest(url);
    
    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Get video statistics for each video
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`;
    const statsData = await this.makeAuthenticatedRequest(statsUrl);

    return data.items.map((item: any, index: number) => {
      const stats = statsData.items[index]?.statistics || {};
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
        statistics: {
          viewCount: parseInt(stats.viewCount || '0'),
          likeCount: parseInt(stats.likeCount || '0'),
          commentCount: parseInt(stats.commentCount || '0')
        }
      };
    });
  }

  async getAnalytics(): Promise<YouTubeOAuthAnalytics> {
    try {
      const [stats, recentVideos] = await Promise.all([
        this.getChannelStats(),
        this.getRecentVideos()
      ]);

      // Generate mock analytics data for now
      // In a real implementation, you'd fetch historical data from YouTube Analytics API
      const monthlySubscribers = this.generateMonthlyData(stats.subscriberCount, 12, 'subscribers') as { month: string; subscribers: number }[];
      const monthlyViews = this.generateMonthlyData(stats.viewCount, 12, 'views') as { month: string; views: number }[];
      const monthlyEngagement = this.generateMonthlyData(
        recentVideos.reduce((sum, video) => sum + video.statistics.likeCount + video.statistics.commentCount, 0),
        12,
        'engagement'
      ) as { month: string; engagement: number }[];

      return {
        stats,
        recentVideos,
        monthlySubscribers,
        monthlyViews,
        monthlyEngagement
      };
    } catch (error) {
      console.error('Error fetching YouTube analytics:', error);
      throw error;
    }
  }

  private generateMonthlyData(currentValue: number, months: number, type: 'subscribers' | 'views' | 'engagement'): { month: string; [key: string]: any }[] {
    const data = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      // Generate realistic progression data
      const factor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
      const value = Math.floor(currentValue * factor * (i / months + 0.1));
      data.push({ month, [type]: value });
    }
    
    return data;
  }

  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('youtubeOAuthAccessToken');
    localStorage.removeItem('youtubeOAuthRefreshToken');
  }
}

export const youtubeOAuthService = new YouTubeOAuthService(); 