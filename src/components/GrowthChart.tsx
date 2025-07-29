import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { overviewService } from '../services/overviewService';
import ChartFilters, { TimeFilter } from './ChartFilters';
import { generateMultiPlatformData } from '../utils/chartDataUtils';

const GrowthChart: React.FC = () => {
  const [data, setData] = useState<any[]>([
    { month: 'Jan', threads: 42000, instagram: 62000, youtube: 10000 },
    { month: 'Feb', threads: 43500, instagram: 63500, youtube: 10800 },
    { month: 'Mar', threads: 44800, instagram: 65200, youtube: 11500 },
    { month: 'Apr', threads: 45200, instagram: 67800, youtube: 12400 },
    { month: 'May', threads: 46800, instagram: 69500, youtube: 13200 },
    { month: 'Jun', threads: 48500, instagram: 71200, youtube: 14100 },
  ]);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('6m');
  const [youtubeValue, setYoutubeValue] = useState(14100);

  useEffect(() => {
    const loadData = async () => {
      try {
        const overviewData = await overviewService.getOverviewData();
        setData(overviewData.growthData);
        // Extract YouTube subscriber value for filtering
        const youtubeSubscribers = overviewData.growthData[overviewData.growthData.length - 1]?.youtube || 14100;
        setYoutubeValue(youtubeSubscribers);
      } catch (error) {
        console.error('Error loading growth data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Regenerate data when filter changes
    const filteredData = generateMultiPlatformData(selectedFilter, youtubeValue);
    setData(filteredData);
  }, [selectedFilter, youtubeValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Follower Growth</h3>
          <p className="text-gray-600">Monthly follower growth across platforms</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">125.4K</p>
          <p className="text-sm text-green-600">+12.5% this month</p>
        </div>
      </div>

      {/* Chart Filters */}
      <div className="mb-6">
        <ChartFilters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Area 
            type="monotone" 
            dataKey="threads" 
            stackId="1"
            stroke="#000000" 
            fill="#000000" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="instagram" 
            stackId="1"
            stroke="#E4405F" 
            fill="#E4405F" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="youtube" 
            stackId="1"
            stroke="#FF0000" 
            fill="#FF0000" 
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">48.5K</p>
          <p className="text-sm text-gray-600">Threads Followers</p>
          <p className="text-xs text-green-600 mt-1">+8.7% growth</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">71.2K</p>
          <p className="text-sm text-gray-600">Instagram Followers</p>
          <p className="text-xs text-green-600 mt-1">+15.2% growth</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">14.1K</p>
          <p className="text-sm text-gray-600">YouTube Subscribers</p>
          <p className="text-xs text-green-600 mt-1">+23.1% growth</p>
        </div>
      </div>
    </motion.div>
  );
};

export default GrowthChart; 