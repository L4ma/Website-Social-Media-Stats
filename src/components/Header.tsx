import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-lg border-b border-gray-200"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Social Media Stats</h1>
                <p className="text-sm text-gray-600">Track your digital presence</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Live Analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Multi-Platform</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 