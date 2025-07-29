import { TimeFilter } from '../components/ChartFilters';
import { dataCollectionService } from '../services/dataCollectionService';

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MultiPlatformDataPoint {
  date: string;
  threads: number;
  instagram: number;
  youtube: number;
}

export const generateTimeFilteredData = (
  baseData: any[],
  filter: TimeFilter,
  currentValue: number,
  dataType: 'subscribers' | 'views' | 'followers' | 'engagement' = 'subscribers'
): any[] => {
  const now = new Date();
  let dataPoints: any[] = [];

  // Try to get real historical data first
  // const historicalData = dataCollectionService.getHistoricalData(); // Unused variable removed
  
  switch (filter) {
    case '7d':
      // Try to use real 7-day data
      const weekData = dataCollectionService.getDataForPeriod(7);
      if (weekData.length > 0) {
        // Use real historical data
        dataPoints = weekData.map(stat => ({
          date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: dataType === 'subscribers' ? stat.subscriberCount : stat.viewCount,
          fullDate: stat.date,
        }));
      } else {
        // Fallback to generated data
        for (let i = 0; i <= 6; i++) {
          const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
          dataPoints.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: Math.round(currentValue * (0.85 + (i * 0.025))),
            fullDate: date.toISOString().split('T')[0],
          });
        }
      }
      break;

    case '30d':
      // Try to use real 30-day data
      const monthData = dataCollectionService.getDataForPeriod(30);
      if (monthData.length > 0) {
        // Group by weeks
        const weeklyData = new Map<string, { subscribers: number; views: number; count: number }>();
        monthData.forEach(stat => {
          const weekStart = new Date(stat.date);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekKey = weekStart.toISOString().split('T')[0];
          
          if (!weeklyData.has(weekKey)) {
            weeklyData.set(weekKey, { subscribers: 0, views: 0, count: 0 });
          }
          weeklyData.get(weekKey)!.subscribers += stat.subscriberCount;
          weeklyData.get(weekKey)!.views += stat.viewCount;
          weeklyData.get(weekKey)!.count += 1;
        });
        
        dataPoints = Array.from(weeklyData.entries()).map(([weekKey, data], index) => ({
          date: `Week ${index + 1}`,
          value: Math.round((dataType === 'subscribers' ? data.subscribers : data.views) / data.count),
          fullDate: weekKey,
        }));
      } else {
        // Fallback to generated data
        for (let i = 0; i <= 4; i++) {
          const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((4 - i) * 7));
          dataPoints.push({
            date: `Week ${i + 1}`,
            value: Math.round(currentValue * (0.75 + (i * 0.05))),
            fullDate: date.toISOString().split('T')[0],
          });
        }
      }
      break;

    case '3m':
      // Try to use real 3-month data
      const threeMonthData = dataCollectionService.getMonthlyData(3);
      if (threeMonthData.length > 0) {
        dataPoints = threeMonthData.map(stat => ({
          date: stat.month,
          value: stat.subscribers,
          fullDate: stat.month,
        }));
      } else {
        // Fallback to generated data
        for (let i = 0; i <= 2; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1);
          dataPoints.push({
            date: date.toLocaleDateString('en-US', { month: 'short' }),
            value: Math.round(currentValue * (0.8 + (i * 0.1))),
            fullDate: date.toISOString().split('T')[0],
          });
        }
      }
      break;

    case '6m':
      // Try to use real 6-month data
      const sixMonthData = dataCollectionService.getMonthlyData(6);
      if (sixMonthData.length > 0) {
        dataPoints = sixMonthData.map(stat => ({
          date: stat.month,
          value: stat.subscribers,
          fullDate: stat.month,
        }));
      } else {
        // Fallback to generated data
        for (let i = 0; i <= 5; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          dataPoints.push({
            date: date.toLocaleDateString('en-US', { month: 'short' }),
            value: Math.round(currentValue * (0.7 + (i * 0.06))),
            fullDate: date.toISOString().split('T')[0],
          });
        }
      }
      break;

    case '1y':
      // Try to use real 12-month data
      const yearData = dataCollectionService.getMonthlyData(12);
      if (yearData.length > 0) {
        // Group by quarters
        const quarterlyData = new Map<string, { subscribers: number; count: number }>();
        yearData.forEach(stat => {
          const month = new Date(stat.month);
          const quarter = Math.floor(month.getMonth() / 3) + 1;
          const quarterKey = `Q${quarter}`;
          
          if (!quarterlyData.has(quarterKey)) {
            quarterlyData.set(quarterKey, { subscribers: 0, count: 0 });
          }
          quarterlyData.get(quarterKey)!.subscribers += stat.subscribers;
          quarterlyData.get(quarterKey)!.count += 1;
        });
        
        dataPoints = Array.from(quarterlyData.entries()).map(([quarter, data]) => ({
          date: quarter,
          value: Math.round(data.subscribers / data.count),
          fullDate: quarter,
        }));
      } else {
        // Fallback to generated data
        for (let i = 0; i <= 3; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - ((3 - i) * 3), 1);
          dataPoints.push({
            date: `Q${i + 1}`,
            value: Math.round(currentValue * (0.6 + (i * 0.1))),
            fullDate: date.toISOString().split('T')[0],
          });
        }
      }
      break;

    default:
      // Default to 6 months if no valid filter
      for (let i = 0; i <= 5; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        dataPoints.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          value: Math.round(currentValue * (0.7 + (i * 0.06))),
          fullDate: date.toISOString().split('T')[0],
        });
      }
      break;
  }

  return dataPoints;
};

export const generateMultiPlatformData = (
  filter: TimeFilter,
  youtubeValue: number,
  threadsValue: number = 48500,
  instagramValue: number = 12450
): MultiPlatformDataPoint[] => {
  const now = new Date();
  let dataPoints: MultiPlatformDataPoint[] = [];

  switch (filter) {
    case '7d':
      // Last 7 days - start from 7 days ago and grow to current
      for (let i = 0; i <= 6; i++) {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
        dataPoints.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          threads: Math.round(threadsValue * (0.85 + (i * 0.025))),
          instagram: Math.round(instagramValue * (0.85 + (i * 0.025))),
          youtube: Math.round(youtubeValue * (0.85 + (i * 0.025))),
        });
      }
      break;

    case '30d':
      // Last 30 days (weekly averages) - start from 4 weeks ago and grow to current
      for (let i = 0; i <= 4; i++) {
        dataPoints.push({
          date: `Week ${i + 1}`,
          threads: Math.round(threadsValue * (0.75 + (i * 0.05))),
          instagram: Math.round(instagramValue * (0.75 + (i * 0.05))),
          youtube: Math.round(youtubeValue * (0.75 + (i * 0.05))),
        });
      }
      break;

    case '3m':
      // Last 3 months - start from 3 months ago and grow to current
      for (let i = 0; i <= 2; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1);
        dataPoints.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          threads: Math.round(threadsValue * (0.8 + (i * 0.1))),
          instagram: Math.round(instagramValue * (0.8 + (i * 0.1))),
          youtube: Math.round(youtubeValue * (0.8 + (i * 0.1))),
        });
      }
      break;

    case '6m':
      // Last 6 months - start from 6 months ago and grow to current
      for (let i = 0; i <= 5; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        dataPoints.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          threads: Math.round(threadsValue * (0.7 + (i * 0.06))),
          instagram: Math.round(instagramValue * (0.7 + (i * 0.06))),
          youtube: Math.round(youtubeValue * (0.7 + (i * 0.06))),
        });
      }
      break;

    case '1y':
      // Last 12 months (quarterly) - start from 1 year ago and grow to current
      for (let i = 0; i <= 3; i++) {
        dataPoints.push({
          date: `Q${i + 1}`,
          threads: Math.round(threadsValue * (0.6 + (i * 0.1))),
          instagram: Math.round(instagramValue * (0.6 + (i * 0.1))),
          youtube: Math.round(youtubeValue * (0.6 + (i * 0.1))),
        });
      }
      break;

    default:
      // Default to 6 months if no valid filter
      for (let i = 0; i <= 5; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        dataPoints.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          threads: Math.round(threadsValue * (0.7 + (i * 0.06))),
          instagram: Math.round(instagramValue * (0.7 + (i * 0.06))),
          youtube: Math.round(youtubeValue * (0.7 + (i * 0.06))),
        });
      }
      break;
  }

  return dataPoints;
}; 