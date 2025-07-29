export interface ThreadsConfig {
  username: string;
  userId?: string;
  accessToken?: string;
}

export interface ThreadsStats {
  followers: number;
  following: number;
  posts: number;
  likes: number;
  replies: number;
  reposts: number;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
}

export interface ThreadsPost {
  id: string;
  text: string;
  likes: number;
  replies: number;
  reposts: number;
  timestamp: string;
  isRepost: boolean;
  originalPost?: {
    author: string;
    text: string;
  };
}

export interface ThreadsAnalytics {
  stats: ThreadsStats;
  recentPosts: ThreadsPost[];
  dailyStats: Array<{ date: string; followers: number; engagement: number }>;
  weeklyStats: Array<{ week: string; followers: number; engagement: number }>;
}

class ThreadsService {
  private config: ThreadsConfig | null = null;

  constructor() {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('threadsConfig');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  updateConfig(newConfig: ThreadsConfig) {
    this.config = newConfig;
    localStorage.setItem('threadsConfig', JSON.stringify(newConfig));
  }

  getConfig(): ThreadsConfig | null {
    return this.config;
  }

  // Simulate API call to get Threads stats
  async getStats(): Promise<ThreadsStats> {
    if (!this.config?.username) {
      // Return mock data for demo purposes
      return {
        followers: 48500,
        following: 1200,
        posts: 156,
        likes: 125000,
        replies: 8900,
        reposts: 3400,
        username: 'demo_user',
        displayName: 'Demo User',
        bio: 'Digital creator sharing thoughts on tech and life',
        profileImage: 'https://via.placeholder.com/150',
      };
    }

    // In the future, this would make a real API call
    // For now, simulate realistic data based on username
    const baseFollowers = 48500;
    const usernameHash = this.config.username.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return {
      followers: baseFollowers + (usernameHash % 10000),
      following: 1200 + (usernameHash % 500),
      posts: 156 + (usernameHash % 50),
      likes: 125000 + (usernameHash % 25000),
      replies: 8900 + (usernameHash % 2000),
      reposts: 3400 + (usernameHash % 1000),
      username: this.config.username,
      displayName: this.config.username.charAt(0).toUpperCase() + this.config.username.slice(1),
      bio: 'Digital creator sharing thoughts on tech and life',
      profileImage: 'https://via.placeholder.com/150',
    };
  }

  // Simulate getting recent posts
  async getRecentPosts(limit: number = 10): Promise<ThreadsPost[]> {
    const mockPosts: ThreadsPost[] = [
      {
        id: '1',
        text: 'Just launched my new project! 🚀 Excited to share what I\'ve been working on. #tech #launch',
        likes: 1240,
        replies: 89,
        reposts: 156,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRepost: false,
      },
      {
        id: '2',
        text: 'The future of social media is here. Threads is changing how we connect online. What do you think?',
        likes: 890,
        replies: 67,
        reposts: 234,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        isRepost: false,
      },
      {
        id: '3',
        text: 'Reposted by @tech_insider',
        likes: 567,
        replies: 23,
        reposts: 89,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        isRepost: true,
        originalPost: {
          author: '@tech_insider',
          text: 'Breaking: New AI developments that will change everything we know about technology.',
        },
      },
      {
        id: '4',
        text: 'Building in public is the best way to grow. Sharing my journey, wins, and lessons learned.',
        likes: 2100,
        replies: 145,
        reposts: 312,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRepost: false,
      },
      {
        id: '5',
        text: 'Threads vs Twitter - the battle for microblogging supremacy continues. Thoughts?',
        likes: 1567,
        replies: 234,
        reposts: 445,
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        isRepost: false,
      },
    ];

    return mockPosts.slice(0, limit);
  }

  // Generate daily stats for the last 30 days
  async getDailyStats(days: number = 30): Promise<Array<{ date: string; followers: number; engagement: number }>> {
    const stats = await this.getStats();
    const dailyStats = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate realistic daily progression
      const dayFactor = i / days;
      const followers = Math.round(stats.followers * (0.85 + (dayFactor * 0.15)));
      const engagement = Math.round((stats.likes + stats.replies + stats.reposts) * (0.8 + (dayFactor * 0.2)) / 30);
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        followers,
        engagement,
      });
    }
    
    return dailyStats;
  }

  // Generate weekly stats for the last 12 weeks
  async getWeeklyStats(weeks: number = 12): Promise<Array<{ week: string; followers: number; engagement: number }>> {
    const stats = await this.getStats();
    const weeklyStats = [];
    
    for (let i = weeks - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      
      // Simulate realistic weekly progression
      const weekFactor = i / weeks;
      const followers = Math.round(stats.followers * (0.8 + (weekFactor * 0.2)));
      const engagement = Math.round((stats.likes + stats.replies + stats.reposts) * (0.75 + (weekFactor * 0.25)) / 12);
      
      weeklyStats.push({
        week: `Week ${weeks - i}`,
        followers,
        engagement,
      });
    }
    
    return weeklyStats;
  }

  // Get comprehensive analytics
  async getAnalytics(): Promise<ThreadsAnalytics> {
    const [stats, recentPosts, dailyStats, weeklyStats] = await Promise.all([
      this.getStats(),
      this.getRecentPosts(),
      this.getDailyStats(),
      this.getWeeklyStats(),
    ]);

    return {
      stats,
      recentPosts,
      dailyStats,
      weeklyStats,
    };
  }

  // Check if Threads is connected
  isConnected(): boolean {
    return !!this.config?.username;
  }

  // Simulate data collection for historical tracking
  async collectDailyData(): Promise<void> {
    if (!this.isConnected()) return;

    const stats = await this.getStats();
    const today = new Date().toISOString().split('T')[0];
    
    // Store daily data in localStorage (similar to YouTube service)
    const existingData = localStorage.getItem('threads_historical_data');
    const historicalData = existingData ? JSON.parse(existingData) : { dailyStats: [] };
    
    // Check if today's data already exists
    const todayExists = historicalData.dailyStats.some((stat: any) => stat.date === today);
    
    if (!todayExists) {
      historicalData.dailyStats.push({
        date: today,
        followers: stats.followers,
        engagement: stats.likes + stats.replies + stats.reposts,
      });
      
      localStorage.setItem('threads_historical_data', JSON.stringify(historicalData));
      localStorage.setItem('threads_daily_collection', new Date().toISOString());
    }
  }
}

export const threadsService = new ThreadsService(); 