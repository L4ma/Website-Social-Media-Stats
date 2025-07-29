import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Database, RefreshCw, Info } from 'lucide-react';
import { dataCollectionService, HistoricalData } from '../services/dataCollectionService';

const DataCollectionStatus: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [lastCollection, setLastCollection] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = dataCollectionService.getHistoricalData();
    setHistoricalData(data);
    
    const lastCollectionDate = localStorage.getItem('youtube_daily_collection');
    setLastCollection(lastCollectionDate);
  };

  const handleManualCollection = async () => {
    setIsCollecting(true);
    try {
      await dataCollectionService.collectDailyData();
      loadData();
    } catch (error) {
      console.error('Error collecting data:', error);
    } finally {
      setIsCollecting(false);
    }
  };

  const shouldCollectToday = dataCollectionService.shouldCollectToday();
  const dataPointsCount = historicalData?.dailyStats.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Collection Status</h3>
        </div>
        <button
          onClick={handleManualCollection}
          disabled={isCollecting}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isCollecting ? 'animate-spin' : ''}`} />
          <span>{isCollecting ? 'Collecting...' : 'Collect Now'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Data Points</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{dataPointsCount}</p>
          <p className="text-xs text-blue-700">Historical records</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Last Collection</span>
          </div>
          <p className="text-sm font-bold text-green-900">
            {lastCollection ? new Date(lastCollection).toLocaleDateString() : 'Never'}
          </p>
          <p className="text-xs text-green-700">
            {shouldCollectToday ? 'Ready to collect' : 'Already collected today'}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Status</span>
          </div>
          <p className="text-sm font-bold text-purple-900">
            {shouldCollectToday ? 'Ready' : 'Up to date'}
          </p>
          <p className="text-xs text-purple-700">
            {shouldCollectToday ? 'Can collect today\'s data' : 'Today\'s data collected'}
          </p>
        </div>
      </div>

      {dataPointsCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-900">No Historical Data</p>
              <p className="text-xs text-yellow-700">
                Start collecting daily data to build up historical charts. Data will be collected automatically when you visit this page daily.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {dataPointsCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Historical Data Available</p>
              <p className="text-xs text-green-700">
                Charts will show real historical data where available. Missing periods will show zero or estimated data.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DataCollectionStatus; 