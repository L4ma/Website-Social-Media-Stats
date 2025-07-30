import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import Footer from './components/Footer';
import { getVersion } from './utils/version';

import EngagementChart from './components/EngagementChart';
import GrowthChart from './components/GrowthChart';
import AudienceChart from './components/AudienceChart';
import YouTubeStats from './components/YouTubeStats';
import InstagramStats from './components/InstagramStats';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'youtube' | 'instagram' | 'settings'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'youtube', label: 'YouTube', icon: '📺' },
            { id: 'instagram', label: 'Instagram', icon: '📷' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {activeTab === 'overview' && (
            <>
              <StatsOverview />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EngagementChart />
                <GrowthChart />
              </div>
              <AudienceChart />
            </>
          )}
          
          {activeTab === 'youtube' && (
            <YouTubeStats />
          )}
          
          {activeTab === 'instagram' && (
            <InstagramStats />
          )}
          
          {activeTab === 'settings' && (
            <Settings />
          )}
        </motion.div>
      </main>
      
      <Footer version={getVersion()} />
    </div>
  );
};

export default App; 