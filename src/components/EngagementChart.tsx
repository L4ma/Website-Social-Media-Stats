import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { overviewService } from '../services/overviewService';
import ChartFilters, { TimeFilter } from './ChartFilters';
import { generateMultiPlatformData } from '../utils/chartDataUtils';

const EngagementChart: React.FC = () => {
  const [data, setData] = useState<any[]>([
    { month: 'Jan', threads: 12000, instagram: 35000, youtube: 45000 },
    { month: 'Feb', threads: 13500, instagram: 37000, youtube: 52000 },
    { month: 'Mar', threads: 14200, instagram: 39000, youtube: 58000 },
    { month: 'Apr', threads: 15600, instagram: 42300, youtube: 65000 },
    { month: 'May', threads: 16800, instagram: 45100, youtube: 72000 },
    { month: 'Jun', threads: 18200, instagram: 48500, youtube: 81000 },
  ]);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('6m');
  const [youtubeValue, setYoutubeValue] = useState(81000);

  useEffect(() => {
    const loadData = async () => {
      try {
        const overviewData = await overviewService.getOverviewData();
        setData(overviewData.engagementData);
        // Extract YouTube engagement value for filtering
        const youtubeEngagement = overviewData.engagementData[overviewData.engagementData.length - 1]?.youtube || 81000;
        setYoutubeValue(youtubeEngagement);
      } catch (error) {
        console.error('Error loading engagement data:', error);
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
          <h3 className="text-xl font-bold text-gray-900">Engagement Trends</h3>
          <p className="text-gray-600">Cross-platform engagement comparison</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <span className="text-sm text-gray-600">Threads</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Instagram</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-sm text-gray-600">YouTube</span>
          </div>
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
        <LineChart data={data}>
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
          <Legend />
          <Line 
            type="monotone" 
            dataKey="threads" 
            stroke="#000000" 
            strokeWidth={3}
            dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="instagram" 
            stroke="#E4405F" 
            strokeWidth={3}
            dot={{ fill: '#E4405F', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#E4405F', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="youtube" 
            stroke="#FF0000" 
            strokeWidth={3}
            dot={{ fill: '#FF0000', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#FF0000', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">15.6K</p>
          <p className="text-sm text-gray-600">Threads Engagement</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">42.3K</p>
          <p className="text-sm text-gray-600">Instagram Engagement</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">81K</p>
          <p className="text-sm text-gray-600">YouTube Engagement</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EngagementChart; 