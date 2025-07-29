import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, User, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { threadsService } from '../services/threadsService';
import type { ThreadsConfig as ThreadsConfigType } from '../services/threadsService';

interface ThreadsConfigComponentProps {
  onConfigUpdate?: (config: ThreadsConfigType) => void;
}

const ThreadsConfig: React.FC<ThreadsConfigComponentProps> = ({ onConfigUpdate }) => {
  const [config, setConfig] = useState<ThreadsConfigType>({
    username: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const savedConfig = threadsService.getConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      setIsConnected(true);
    }
  }, []);

  const handleSave = () => {
    if (!config.username.trim()) {
      alert('Please enter your Threads username');
      return;
    }

    threadsService.updateConfig(config);
    setIsConnected(true);
    setShowSuccess(true);
    
    if (onConfigUpdate) {
      onConfigUpdate(config);
    }

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDisconnect = () => {
    threadsService.updateConfig({ username: '' });
    setConfig({ username: '' });
    setIsConnected(false);
    localStorage.removeItem('threadsConfig');
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className={`rounded-lg p-4 ${isConnected ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          )}
          <div>
            <h3 className={`font-semibold ${isConnected ? 'text-green-900' : 'text-yellow-900'}`}>
              {isConnected ? 'Connected to Threads' : 'Not Connected'}
            </h3>
            <p className={`text-sm ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
              {isConnected 
                ? `Connected as @${config.username}` 
                : 'Enter your Threads username to connect your account'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Threads Configuration</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Threads Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={config.username}
                onChange={(e) => setConfig({ ...config, username: e.target.value })}
                placeholder="Enter your Threads username (without @)"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your Threads username without the @ symbol
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">About Threads Integration</p>
                <p className="text-xs text-blue-700 mt-1">
                  Currently using simulated data for demonstration. When Threads API becomes available, 
                  this will connect to your real Threads account for live statistics.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {isConnected ? 'Update Configuration' : 'Connect Account'}
            </button>
            {isConnected && (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Configuration saved successfully!
            </span>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">How to Connect Your Threads Account</h4>
        <ol className="text-sm text-gray-700 space-y-1">
          <li>1. Enter your Threads username (without the @ symbol)</li>
          <li>2. Click "Connect Account" to save your configuration</li>
          <li>3. Your Threads statistics will be available in the Threads tab</li>
          <li>4. Data will be collected daily when you visit the app</li>
        </ol>
      </div>
    </div>
  );
};

export default ThreadsConfig; 