export interface InstagramConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken?: string;
  userId?: string;
  username?: string;
}

export interface InstagramStats {
  followers: number;
  following: number;
  posts: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
}

export interface InstagramPost {
  id: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl?: string;
  likeCount: number;
  commentCount: number;
  timestamp: string;
  permalink: string;
}

export interface InstagramAnalytics {
  stats: InstagramStats;
  recentPosts: InstagramPost[];
  monthlyFollowers: Array<{ month: string; followers: number }>;
  monthlyEngagement: Array<{ month: string; engagement: number }>;
}

class InstagramService {
  private config: InstagramConfig;
  private readonly INSTAGRAM_API_BASE = 'https://graph.instagram.com/v12.0';
  private readonly OAUTH_URL = 'https://api.instagram.com/oauth/authorize';

  constructor() {
    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem('instagramConfig');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    } else {
      this.config = {
        clientId: '',
        clientSecret: '',
        redirectUri: `${window.location.origin}/instagram-callback`,
        accessToken: '',
        userId: '',
        username: ''
      };
    }
  }

  updateConfig(newConfig: Partial<InstagramConfig>) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('instagramConfig', JSON.stringify(this.config));
  }

  getConfig(): InstagramConfig {
    return this.config;
  }

  // Generate OAuth URL for Instagram login
  getOAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: 'user_profile,user_media',
      response_type: 'code',
      state: this.generateState()
    });
    
    return `${this.OAUTH_URL}?${params.toString()}`;
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Handle OAuth callback and exchange code for access token
  async handleOAuthCallback(code: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: this.config.redirectUri,
          code: code,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for access token');
      }

      const data = await response.json();
      
      this.config.accessToken = data.access_token;
      this.config.userId = data.user_id;
      
      // Get user info
      await this.fetchUserInfo();
      
      this.updateConfig(this.config);
      return true;
    } catch (error) {
      console.error('OAuth callback error:', error);
      return false;
    }
  }

  private async fetchUserInfo(): Promise<void> {
    if (!this.config.accessToken) return;

    try {
      const response = await fetch(
        `${this.INSTAGRAM_API_BASE}/me?fields=id,username&access_token=${this.config.accessToken}`
      );
      
      if (response.ok) {
        const data = await response.json();
        this.config.username = data.username;
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!(this.config.accessToken && this.config.userId);
  }

  // Get Instagram statistics
  async getStats(): Promise<InstagramStats> {
    if (!this.isAuthenticated()) {
      throw new Error('Instagram not authenticated');
    }

    try {
      // Get user profile
      const profileResponse = await fetch(
        `${this.INSTAGRAM_API_BASE}/me?fields=id,username,account_type&access_token=${this.config.accessToken}`
      );

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch Instagram profile');
      }

      const profile = await profileResponse.json();

      // Get media with engagement data
      const mediaResponse = await fetch(
        `${this.INSTAGRAM_API_BASE}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,like_count,comments_count,timestamp,permalink&access_token=${this.config.accessToken}`
      );

      if (!mediaResponse.ok) {
        throw new Error('Failed to fetch Instagram media');
      }

      const mediaData = await mediaResponse.json();
      const posts = mediaData.data || [];

      // Calculate statistics
      const totalLikes = posts.reduce((sum: number, post: any) => sum + (post.like_count || 0), 0);
      const totalComments = posts.reduce((sum: number, post: any) => sum + (post.comments_count || 0), 0);
      const totalEngagement = totalLikes + totalComments;
      const followers = 1000; // Instagram API doesn't provide follower count directly
      const engagementRate = followers > 0 ? (totalEngagement / (posts.length * followers)) * 100 : 0;

      return {
        followers,
        following: 500, // Mock data
        posts: posts.length,
        totalLikes,
        totalComments,
        engagementRate: Math.round(engagementRate * 100) / 100
      };
    } catch (error) {
      console.error('Error fetching Instagram stats:', error);
      throw error;
    }
  }

  // Get recent posts
  async getRecentPosts(limit: number = 10): Promise<InstagramPost[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Instagram not authenticated');
    }

    try {
      const response = await fetch(
        `${this.INSTAGRAM_API_BASE}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,like_count,comments_count,timestamp,permalink&limit=${limit}&access_token=${this.config.accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram posts');
      }

      const data = await response.json();
      const posts = data.data || [];

      return posts.map((post: any) => ({
        id: post.id,
        caption: post.caption || '',
        mediaType: post.media_type,
        mediaUrl: post.media_url,
        thumbnailUrl: post.thumbnail_url,
        likeCount: post.like_count || 0,
        commentCount: post.comments_count || 0,
        timestamp: post.timestamp,
        permalink: post.permalink
      }));
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      throw error;
    }
  }

  // Get analytics with monthly data
  async getAnalytics(): Promise<InstagramAnalytics> {
    const [stats, recentPosts] = await Promise.all([
      this.getStats(),
      this.getRecentPosts()
    ]);

    // Generate monthly data (mock for now)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyFollowers = months.map((month, index) => ({
      month,
      followers: Math.round(stats.followers * (0.8 + (index * 0.05)))
    }));

    const monthlyEngagement = months.map((month, index) => ({
      month,
      engagement: Math.round(stats.engagementRate * (0.9 + (index * 0.02)))
    }));

    return {
      stats,
      recentPosts,
      monthlyFollowers,
      monthlyEngagement
    };
  }

  // Logout
  logout(): void {
    this.config.accessToken = '';
    this.config.userId = '';
    this.config.username = '';
    this.updateConfig(this.config);
  }
}

export const instagramService = new InstagramService(); 