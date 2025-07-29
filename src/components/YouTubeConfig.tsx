import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Key, Link, Save, Eye, EyeOff } from 'lucide-react';
import { youtubeConfig } from '../config/youtube';
import { youtubeService } from '../services/youtubeService';

interface YouTubeConfigProps {
  onConfigUpdate: (config: { channelId: string; apiKey: string; channelName: string; channelUrl: string }) => void;
}

const YouTubeConfig: React.FC<YouTubeConfigProps> = ({ onConfigUpdate }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [config, setConfig] = useState(() => {
    // Try to load saved configuration from localStorage
    const savedConfig = localStorage.getItem('youtubeConfig');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      return {
        channelId: parsed.channelId || youtubeConfig.channelId,
        apiKey: parsed.apiKey || youtubeConfig.apiKey,
        channelName: parsed.channelName || youtubeConfig.channelName,
        channelUrl: parsed.channelUrl || youtubeConfig.channelUrl,
      };
    }
    return {
      channelId: youtubeConfig.channelId,
      apiKey: youtubeConfig.apiKey,
      channelName: youtubeConfig.channelName,
      channelUrl: youtubeConfig.channelUrl,
    };
  });

  const handleSave = () => {
    // Validate required fields
    if (!config.channelId || !config.apiKey || !config.channelName) {
      alert('Please fill in all required fields: Channel ID, API Key, and Channel Name');
      return;
    }

    // Update the YouTube service configuration
    youtubeService.updateConfig(config);
    
    onConfigUpdate(config);
    // Save to localStorage
    localStorage.setItem('youtubeConfig', JSON.stringify(config));
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
  };

  const handleInputChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
          <Youtube className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">YouTube Channel Configuration</h3>
          <p className="text-gray-600">Connect your YouTube channel to get real data</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Channel Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={config.channelName}
            onChange={(e) => handleInputChange('channelName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Your Channel Name"
          />
        </div>

        {/* Channel URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="url"
              value={config.channelUrl}
              onChange={(e) => handleInputChange('channelUrl', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="https://www.youtube.com/@yourchannel"
            />
          </div>
        </div>

        {/* Channel ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={config.channelId}
            onChange={(e) => handleInputChange('channelId', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="UC..." 
          />
          <p className="text-xs text-gray-500 mt-1">
            Find your Channel ID in YouTube Studio → Settings → Advanced
          </p>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Data API v3 Key <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showApiKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="AIza..."
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Google Cloud Console</a>
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">How to get your YouTube Data API key:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
            <li>2. Create a new project or select existing one</li>
            <li>3. Enable YouTube Data API v3</li>
            <li>4. Create credentials (API Key)</li>
            <li>5. Copy the API key and paste it above</li>
          </ol>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
          >
            <p className="text-green-800 font-medium">✅ Configuration saved successfully!</p>
            <p className="text-green-600 text-sm mt-1">You can now view your YouTube data in the YouTube tab.</p>
          </motion.div>
        )}

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default YouTubeConfig; 