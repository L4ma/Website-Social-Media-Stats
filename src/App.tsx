import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import PlatformStats from './components/PlatformStats';
import EngagementChart from './components/EngagementChart';
import GrowthChart from './components/GrowthChart';
import AudienceChart from './components/AudienceChart';
import YouTubeStats from './components/YouTubeStats';
import YouTubeConfig from './components/YouTubeConfig';
import { youtubeService } from './services/youtubeService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'threads' | 'instagram' | 'youtube' | 'youtube-config'>('overview');


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'threads', label: 'Threads', icon: '🧵' },
            { id: 'instagram', label: 'Instagram', icon: '📸' },
            { id: 'youtube', label: 'YouTube', icon: '📺' },
            { id: 'youtube-config', label: 'YouTube Config', icon: '⚙️' },
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
          
          {activeTab === 'threads' && (
            <PlatformStats platform="threads" />
          )}
          
          {activeTab === 'instagram' && (
            <PlatformStats platform="instagram" />
          )}
          
          {activeTab === 'youtube' && (
            <YouTubeStats />
          )}
          
          {activeTab === 'youtube-config' && (
            <YouTubeConfig onConfigUpdate={(config) => {
              console.log('YouTube config updated:', config);
              // Update the YouTube service configuration
              youtubeService.updateConfig(config);
            }} />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default App; 