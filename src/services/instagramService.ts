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
      console.log('Exchanging authorization code for access token...');
      
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
        const errorText = await response.text();
        console.error('OAuth exchange failed:', response.status, errorText);
        
        // Parse error response
        let errorMessage = 'Failed to exchange code for access token';
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
            if (errorData.error_description) {
              errorMessage += `: ${errorData.error_description}`;
            }
          }
        } catch (e) {
          // If we can't parse the error, use the raw text
          errorMessage = errorText;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('OAuth exchange successful, received access token');
      
      this.config.accessToken = data.access_token;
      this.config.userId = data.user_id;
      
      // Get user info
      await this.fetchUserInfo();
      
      this.updateConfig(this.config);
      return true;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error; // Re-throw to let the component handle it
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

    // For demo purposes, return realistic mock data
    // In a real implementation, this would fetch from Instagram API
    const mockStats: InstagramStats = {
      followers: 12450,
      following: 890,
      posts: 156,
      totalLikes: 89000,
      totalComments: 3400,
      engagementRate: 4.2
    };

    return mockStats;
  }

  // Get recent posts
  async getRecentPosts(limit: number = 10): Promise<InstagramPost[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Instagram not authenticated');
    }

    // For demo purposes, return realistic mock posts
    // In a real implementation, this would fetch from Instagram API
    const mockPosts: InstagramPost[] = [
      {
        id: '1',
        caption: 'Amazing sunset at the beach today! 🌅 #sunset #beach #photography',
        mediaType: 'IMAGE',
        mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        likeCount: 1240,
        commentCount: 89,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        permalink: 'https://instagram.com/p/demo1'
      },
      {
        id: '2',
        caption: 'New coffee shop discovery ☕️ The best latte I\'ve had in months!',
        mediaType: 'IMAGE',
        mediaUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
        likeCount: 890,
        commentCount: 45,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        permalink: 'https://instagram.com/p/demo2'
      },
      {
        id: '3',
        caption: 'Weekend hiking adventure 🏔️ #hiking #nature #outdoors',
        mediaType: 'VIDEO',
        mediaUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
        likeCount: 2100,
        commentCount: 156,
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        permalink: 'https://instagram.com/p/demo3'
      },
      {
        id: '4',
        caption: 'Homemade pasta night 🍝 #cooking #pasta #homemade',
        mediaType: 'IMAGE',
        mediaUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
        likeCount: 670,
        commentCount: 32,
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        permalink: 'https://instagram.com/p/demo4'
      },
      {
        id: '5',
        caption: 'City lights at night ✨ #city #night #photography',
        mediaType: 'IMAGE',
        mediaUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400',
        likeCount: 1450,
        commentCount: 78,
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        permalink: 'https://instagram.com/p/demo5'
      }
    ];

    return mockPosts.slice(0, limit);
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
      engagement: Math.round((stats.totalLikes + stats.totalComments) * (0.8 + (index * 0.05)))
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