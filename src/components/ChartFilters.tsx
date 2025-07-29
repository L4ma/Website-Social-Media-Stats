import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, BarChart3 } from 'lucide-react';

export type TimeFilter = '7d' | '30d' | '3m' | '6m' | '1y';

interface ChartFiltersProps {
  selectedFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
  showDateRange?: boolean;
  customDateRange?: {
    startDate: string;
    endDate: string;
  };
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

const ChartFilters: React.FC<ChartFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  showDateRange = false,
  customDateRange,
  onDateRangeChange,
}) => {
  const filters = [
    { value: '7d', label: '7 Days', icon: <Clock className="w-4 h-4" /> },
    { value: '30d', label: '30 Days', icon: <Calendar className="w-4 h-4" /> },
    { value: '3m', label: '3 Months', icon: <TrendingUp className="w-4 h-4" /> },
    { value: '6m', label: '6 Months', icon: <BarChart3 className="w-4 h-4" /> },
    { value: '1y', label: '1 Year', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Time Period Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <motion.button
            key={filter.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(filter.value as TimeFilter)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedFilter === filter.value
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            {filter.icon}
            <span>{filter.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Custom Date Range */}
      {showDateRange && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <h4 className="font-semibold text-gray-900 mb-3">Custom Date Range</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={customDateRange?.startDate || ''}
                onChange={(e) => onDateRangeChange?.(e.target.value, customDateRange?.endDate || '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={customDateRange?.endDate || ''}
                onChange={(e) => onDateRangeChange?.(customDateRange?.startDate || '', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChartFilters; 