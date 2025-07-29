import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Youtube, Instagram, Database, Shield, Bell } from 'lucide-react';
import YouTubeConfig from './YouTubeConfig';
import InstagramConfigComponent from './InstagramConfigComponent';
import DataCollectionStatus from './DataCollectionStatus';
import type { InstagramConfig as InstagramConfigType } from '../services/instagramService';

type SettingsTab = 'youtube' | 'instagram' | 'status' | 'notifications' | 'privacy';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('youtube');

  const tabs = [
    { id: 'youtube', label: 'YouTube', icon: <Youtube className="w-4 h-4" /> },
    { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
    { id: 'status', label: 'Data Status', icon: <Database className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'youtube':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Youtube className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">YouTube Configuration</h3>
              </div>
              <p className="text-sm text-blue-700">
                Configure your YouTube API credentials to access real channel statistics and enable daily data collection.
              </p>
            </div>
                         <YouTubeConfig onConfigUpdate={(config) => {
               // Handle config update if needed
               console.log('YouTube config updated:', config);
             }} />
          </motion.div>
        );

      case 'instagram':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-pink-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Instagram className="w-5 h-5 text-pink-600" />
                <h3 className="text-lg font-semibold text-pink-900">Instagram Configuration</h3>
              </div>
              <p className="text-sm text-pink-700">
                Configure your Instagram OAuth credentials to access real profile data and recent posts.
              </p>
            </div>
            <InstagramConfigComponent onConfigUpdate={(config: InstagramConfigType) => {
              // Handle config update if needed
              console.log('Instagram config updated:', config);
            }} />
          </motion.div>
        );

      case 'status':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">Data Collection Status</h3>
              </div>
              <p className="text-sm text-green-700">
                Monitor data collection status for all connected platforms and manage historical data.
              </p>
            </div>
            <DataCollectionStatus />
            
            {/* Platform Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Youtube className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-gray-900">YouTube</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-medium text-green-600">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Collection:</span>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Update:</span>
                    <span className="text-sm font-medium text-gray-900">Today</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <h4 className="font-semibold text-gray-900">Instagram</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-medium text-yellow-600">Not Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Collection:</span>
                    <span className="text-sm font-medium text-gray-600">Inactive</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Update:</span>
                    <span className="text-sm font-medium text-gray-600">Never</span>
                  </div>
                </div>
              </div>


            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Notification Settings</h3>
              </div>
              <p className="text-sm text-blue-700">
                Configure notification preferences for data collection alerts and platform updates.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Notification Settings</h3>
              <p className="text-gray-600 mb-4">
                Notification preferences will be available in future updates.
              </p>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Coming Soon:</strong> Email notifications, browser alerts, and data collection reminders.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 'privacy':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">Privacy & Data</h3>
              </div>
              <p className="text-sm text-purple-700">
                Manage your data privacy settings and control how your information is stored and used.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy Settings</h3>
              <p className="text-gray-600 mb-4">
                Privacy and data management settings will be available in future updates.
              </p>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Coming Soon:</strong> Data export, account deletion, and privacy controls.
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <SettingsIcon className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your platform connections and preferences</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings; 