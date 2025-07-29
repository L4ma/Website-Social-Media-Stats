export interface InstagramConfig {
  accessToken?: string;
  userId?: string;
  username?: string;
  expiresAt?: number;
}

export interface InstagramUser {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
  follows_count: number;
  followers_count: number;
  profile_picture_url: string;
  biography: string;
  website: string;
}

export interface InstagramMedia {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  owner: {
    id: string;
    username: string;
  };
}

export interface InstagramAnalytics {
  user: InstagramUser;
  recentMedia: InstagramMedia[];
  dailyStats: Array<{ date: string; followers: number; engagement: number }>;
  weeklyStats: Array<{ week: string; followers: number; engagement: number }>;
}

class InstagramService {
  private config: InstagramConfig | null = null;
  private readonly CLIENT_ID = 'your_instagram_app_id'; // You'll need to create an Instagram app
  private readonly REDIRECT_URI = 'http://localhost:3000/instagram-callback';
  private readonly INSTAGRAM_API_BASE = 'https://graph.instagram.com/v12.0';

  constructor() {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('instagramConfig');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  // OAuth flow methods
  initiateOAuth(): void {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${this.CLIENT_ID}&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&scope=user_profile,user_media&response_type=code`;
    window.location.href = authUrl;
  }

  async handleOAuthCallback(code: string): Promise<boolean> {
    try {
      // In a real implementation, you'd exchange the code for an access token
      // This would typically be done on your backend server
      const response = await fetch('/api/instagram/exchange-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await response.json();
      
      this.config = {
        accessToken: tokenData.access_token,
        userId: tokenData.user_id,
        expiresAt: Date.now() + (tokenData.expires_in * 1000),
      };

      localStorage.setItem('instagramConfig', JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error('OAuth callback error:', error);
      return false;
    }
  }

  // API methods
  private async makeApiCall(endpoint: string): Promise<any> {
    if (!this.config?.accessToken) {
      throw new Error('No access token available');
    }

    const url = `${this.INSTAGRAM_API_BASE}${endpoint}?access_token=${this.config.accessToken}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }

    return response.json();
  }

  async getUserProfile(): Promise<InstagramUser> {
    const data = await this.makeApiCall('/me?fields=id,username,account_type,media_count,follows_count,followers_count,profile_picture_url,biography,website');
    return data;
  }

  async getRecentMedia(limit: number = 10): Promise<InstagramMedia[]> {
    const data = await this.makeApiCall(`/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,owner&limit=${limit}`);
    return data.data;
  }

  async getMediaInsights(mediaId: string): Promise<any> {
    const data = await this.makeApiCall(`/${mediaId}/insights?metric=impressions,reach,profile_views,follower_count`);
    return data.data;
  }

  // Simulated data for demo purposes
  async getSimulatedData(): Promise<InstagramAnalytics> {
    const user: InstagramUser = {
      id: 'demo_user_id',
      username: 'demo_instagram_user',
      account_type: 'PERSONAL',
      media_count: 156,
      follows_count: 890,
      followers_count: 67800,
      profile_picture_url: 'https://via.placeholder.com/150',
      biography: 'Digital creator sharing life, tech, and creativity',
      website: 'https://example.com',
    };

    const recentMedia: InstagramMedia[] = [
      {
        id: '1',
        caption: 'Beautiful sunset at the beach today! 🌅 #sunset #beach #photography',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/600x600',
        permalink: 'https://instagram.com/p/demo1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        like_count: 1240,
        comments_count: 89,
        owner: { id: user.id, username: user.username },
      },
      {
        id: '2',
        caption: 'New project launch! Excited to share what I\'ve been working on 🚀 #launch #tech #project',
        media_type: 'CAROUSEL_ALBUM',
        media_url: 'https://via.placeholder.com/600x600',
        permalink: 'https://instagram.com/p/demo2',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        like_count: 890,
        comments_count: 67,
        owner: { id: user.id, username: user.username },
      },
      {
        id: '3',
        caption: 'Behind the scenes of my latest video 📹 #bts #content #creator',
        media_type: 'VIDEO',
        media_url: 'https://via.placeholder.com/600x600',
        thumbnail_url: 'https://via.placeholder.com/600x600',
        permalink: 'https://instagram.com/p/demo3',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        like_count: 1567,
        comments_count: 234,
        owner: { id: user.id, username: user.username },
      },
    ];

    // Generate daily stats for the last 30 days
    const dailyStats = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayFactor = i / 30;
      const followers = Math.round(user.followers_count * (0.85 + (dayFactor * 0.15)));
      const engagement = Math.round((1240 + 890 + 1567) * (0.8 + (dayFactor * 0.2)) / 30);
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        followers,
        engagement,
      });
    }

    // Generate weekly stats for the last 12 weeks
    const weeklyStats = [];
    for (let i = 11; i >= 0; i--) {
      const weekFactor = i / 12;
      const followers = Math.round(user.followers_count * (0.8 + (weekFactor * 0.2)));
      const engagement = Math.round((1240 + 890 + 1567) * (0.75 + (weekFactor * 0.25)) / 12);
      
      weeklyStats.push({
        week: `Week ${12 - i}`,
        followers,
        engagement,
      });
    }

    return {
      user,
      recentMedia,
      dailyStats,
      weeklyStats,
    };
  }

  async getAnalytics(): Promise<InstagramAnalytics> {
    if (this.isConnected()) {
      try {
        const [user, recentMedia] = await Promise.all([
          this.getUserProfile(),
          this.getRecentMedia(),
        ]);

        // For now, return simulated daily/weekly stats
        // In a real implementation, you'd fetch historical data from Instagram's API
        const { dailyStats, weeklyStats } = await this.getSimulatedData();

        return {
          user,
          recentMedia,
          dailyStats,
          weeklyStats,
        };
      } catch (error) {
        console.error('Error fetching Instagram data:', error);
        // Fallback to simulated data
        return this.getSimulatedData();
      }
    } else {
      // Return simulated data when not connected
      return this.getSimulatedData();
    }
  }

  updateConfig(newConfig: InstagramConfig) {
    this.config = newConfig;
    localStorage.setItem('instagramConfig', JSON.stringify(newConfig));
  }

  getConfig(): InstagramConfig | null {
    return this.config;
  }

  isConnected(): boolean {
    return !!this.config?.accessToken && (this.config.expiresAt || 0) > Date.now();
  }

  disconnect(): void {
    this.config = null;
    localStorage.removeItem('instagramConfig');
  }

  // Data collection for historical tracking
  async collectDailyData(): Promise<void> {
    if (!this.isConnected()) return;

    try {
      const user = await this.getUserProfile();
      const today = new Date().toISOString().split('T')[0];
      
      const existingData = localStorage.getItem('instagram_historical_data');
      const historicalData = existingData ? JSON.parse(existingData) : { dailyStats: [] };
      
      const todayExists = historicalData.dailyStats.some((stat: any) => stat.date === today);
      
      if (!todayExists) {
        historicalData.dailyStats.push({
          date: today,
          followers: user.followers_count,
          engagement: 0, // Would need to calculate from recent posts
        });
        
        localStorage.setItem('instagram_historical_data', JSON.stringify(historicalData));
        localStorage.setItem('instagram_daily_collection', new Date().toISOString());
      }
    } catch (error) {
      console.error('Error collecting Instagram data:', error);
    }
  }
}

export const instagramService = new InstagramService(); 