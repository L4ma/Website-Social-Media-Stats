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
    if (!lastCollection) return true;

    const lastDate = new Date(lastCollection);
    const today = new Date();
    
    // Check if it's a different day
    return lastDate.getDate() !== today.getDate() || 
           lastDate.getMonth() !== today.getMonth() || 
           lastDate.getFullYear() !== today.getFullYear();
  }

  // Collect and save today's data
  async collectDailyData(): Promise<void> {
    try {
      const channelStats = await youtubeService.getChannelStats();
      
      const todayStats: DailyStats = {
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        subscriberCount: channelStats.subscriberCount,
        viewCount: channelStats.viewCount,
        videoCount: channelStats.videoCount,
        channelName: channelStats.channelName,
      };

      // Get existing historical data
      const historicalData = this.getHistoricalData();
      
      // Add today's data if it doesn't exist
      const existingIndex = historicalData.dailyStats.findIndex(
        stat => stat.date === todayStats.date
      );
      
      if (existingIndex === -1) {
        historicalData.dailyStats.push(todayStats);
        historicalData.lastUpdated = new Date().toISOString();
        
        // Save updated data
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historicalData));
        localStorage.setItem(this.DAILY_COLLECTION_KEY, new Date().toISOString());
        
        console.log('Daily data collected:', todayStats);
      }
    } catch (error) {
      console.error('Error collecting daily data:', error);
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