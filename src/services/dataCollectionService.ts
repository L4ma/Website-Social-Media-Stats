import { youtubeService } from './youtubeService';

export interface DailyStats {
  date: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  channelName: string;
}

export interface HistoricalData {
  dailyStats: DailyStats[];
  lastUpdated: string;
}

class DataCollectionService {
  private readonly STORAGE_KEY = 'youtube_historical_data';
  private readonly DAILY_COLLECTION_KEY = 'youtube_daily_collection';

  // Check if we should collect data today
  shouldCollectToday(): boolean {
    const lastCollection = localStorage.getItem(this.DAILY_COLLECTION_KEY);
    console.log('DataCollectionService: Checking if should collect today');
    console.log('DataCollectionService: Last collection date:', lastCollection);
    
    if (!lastCollection) {
      console.log('DataCollectionService: No last collection found, should collect today');
      return true;
    }

    const lastDate = new Date(lastCollection);
    const today = new Date();
    
    // Use local date strings for comparison
    const lastDateString = lastDate.toLocaleDateString('en-CA');
    const todayDateString = today.toLocaleDateString('en-CA');
    
    console.log('DataCollectionService: Last collection date object:', lastDate);
    console.log('DataCollectionService: Today date object:', today);
    console.log('DataCollectionService: Date comparison:', {
      lastDateString,
      todayDateString,
      lastDate: lastDate.getDate(),
      todayDate: today.getDate(),
      lastMonth: lastDate.getMonth(),
      todayMonth: today.getMonth(),
      lastYear: lastDate.getFullYear(),
      todayYear: today.getFullYear()
    });
    
    // Check if it's a different day using local date strings
    const shouldCollect = lastDateString !== todayDateString;
           
    console.log('DataCollectionService: Should collect today:', shouldCollect);
    return shouldCollect;
  }

  // Collect and save today's data
  async collectDailyData(): Promise<void> {
    console.log('DataCollectionService: Starting daily data collection');
    
    // Check if YouTube service is configured
    const youtubeConfig = youtubeService.getConfig();
    console.log('DataCollectionService: YouTube config:', youtubeConfig);
    
    if (!youtubeConfig || !youtubeConfig.apiKey || !youtubeConfig.channelId) {
      console.error('DataCollectionService: YouTube not properly configured');
      throw new Error('YouTube service not properly configured. Please set up your API key and channel ID first.');
    }
    
    try {
      console.log('DataCollectionService: Fetching channel stats from YouTube service');
      const channelStats = await youtubeService.getChannelStats();
      console.log('DataCollectionService: Received channel stats:', channelStats);
      
      if (!channelStats) {
        throw new Error('Failed to fetch channel stats from YouTube service');
      }
      
      const todayStats: DailyStats = {
        date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format in local timezone
        subscriberCount: channelStats.subscriberCount,
        viewCount: channelStats.viewCount,
        videoCount: channelStats.videoCount,
        channelName: channelStats.channelName,
      };
      
      console.log('DataCollectionService: Created today stats:', todayStats);

      // Get existing historical data
      const historicalData = this.getHistoricalData();
      console.log('DataCollectionService: Current historical data:', historicalData);
      
      // Add today's data if it doesn't exist
      const existingIndex = historicalData.dailyStats.findIndex(
        stat => stat.date === todayStats.date
      );
      
      console.log('DataCollectionService: Existing index for today:', existingIndex);
      
      if (existingIndex === -1) {
        console.log('DataCollectionService: Adding today\'s data to historical data');
        historicalData.dailyStats.push(todayStats);
        historicalData.lastUpdated = new Date().toISOString();
        
        // Save updated data
        console.log('DataCollectionService: Saving to localStorage...');
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historicalData));
        localStorage.setItem(this.DAILY_COLLECTION_KEY, new Date().toISOString());
        
        console.log('DataCollectionService: Daily data collected and saved:', todayStats);
        console.log('DataCollectionService: Updated historical data:', historicalData);
        console.log('DataCollectionService: localStorage keys saved:', {
          STORAGE_KEY: this.STORAGE_KEY,
          DAILY_COLLECTION_KEY: this.DAILY_COLLECTION_KEY
        });
      } else {
        console.log('DataCollectionService: Today\'s data already exists, skipping');
      }
    } catch (error) {
      console.error('DataCollectionService: Error collecting daily data:', error);
      console.error('DataCollectionService: Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error; // Re-throw to let the UI handle the error
    }
  }

  // Get historical data from localStorage
  getHistoricalData(): HistoricalData {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      dailyStats: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  // Get data for specific time periods
  getDataForPeriod(days: number): DailyStats[] {
    const historicalData = this.getHistoricalData();
    const today = new Date();
    const cutoffDate = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return historicalData.dailyStats.filter(stat => {
      const statDate = new Date(stat.date);
      return statDate >= cutoffDate;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Get monthly aggregated data
  getMonthlyData(months: number): Array<{ month: string; subscribers: number; views: number }> {
    const historicalData = this.getHistoricalData();
    const today = new Date();
    const cutoffDate = new Date(today.getFullYear(), today.getMonth() - months, 1);
    
    const monthlyData = new Map<string, { subscribers: number; views: number; count: number }>();
    
    historicalData.dailyStats.forEach(stat => {
      const statDate = new Date(stat.date);
      if (statDate >= cutoffDate) {
        const monthKey = statDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { subscribers: 0, views: 0, count: 0 });
        }
        
        const monthData = monthlyData.get(monthKey)!;
        monthData.subscribers += stat.subscriberCount;
        monthData.views += stat.viewCount;
        monthData.count += 1;
      }
    });
    
    // Calculate averages for each month
    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      subscribers: Math.round(data.subscribers / data.count),
      views: Math.round(data.views / data.count),
    })).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }

  // Initialize daily collection if needed
  async initializeDailyCollection(): Promise<void> {
    if (this.shouldCollectToday()) {
      await this.collectDailyData();
    }
  }

  // Clear historical data (for testing)
  clearHistoricalData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.DAILY_COLLECTION_KEY);
  }
}

export const dataCollectionService = new DataCollectionService(); 