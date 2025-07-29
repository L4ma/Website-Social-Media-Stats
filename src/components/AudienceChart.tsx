import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { overviewService } from '../services/overviewService';

const AudienceChart: React.FC = () => {
  const [data, setData] = useState([
    { name: 'Instagram', value: 71200, color: '#E4405F' },
    { name: 'Threads', value: 48500, color: '#000000' },
    { name: 'YouTube', value: 14100, color: '#FF0000' },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const overviewData = await overviewService.getOverviewData();
        setData(overviewData.audienceData);
      } catch (error) {
        console.error('Error loading audience data:', error);
      }
    };

    loadData();
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-gray-600">{data.value.toLocaleString()} followers</p>
          <p className="text-sm text-gray-500">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Audience Distribution</h3>
          <p className="text-gray-600">Follower distribution across platforms</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Followers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.value.toLocaleString()} followers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{percentage}%</p>
                  <p className="text-xs text-gray-500">of total</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">56.8%</p>
          <p className="text-sm text-gray-600">Instagram Share</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">38.7%</p>
          <p className="text-sm text-gray-600">Threads Share</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">11.3%</p>
          <p className="text-sm text-gray-600">YouTube Share</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AudienceChart; 