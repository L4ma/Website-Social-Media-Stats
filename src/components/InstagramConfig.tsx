import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Key, User, Link, AlertCircle, CheckCircle } from 'lucide-react';
import { instagramService } from '../services/instagramService';
import type { InstagramConfig } from '../services/instagramService';

interface InstagramConfigProps {
  onConfigUpdate: (config: InstagramConfig) => void;
}

const InstagramConfig: React.FC<InstagramConfigProps> = ({ onConfigUpdate }) => {
  const [config, setConfig] = useState<InstagramConfig>({
    clientId: '',
    clientSecret: '',
    redirectUri: `${window.location.origin}/instagram-callback`,
    accessToken: '',
    userId: '',
    username: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedConfig = instagramService.getConfig();
    setConfig(savedConfig);
    setIsConnected(instagramService.isAuthenticated());
  }, []);

  const handleSave = () => {
    instagramService.updateConfig(config);
    onConfigUpdate(config);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleConnect = () => {
    if (!config.clientId || !config.clientSecret) {
      alert('Please enter your Instagram App credentials first');
      return;
    }
    
    const oauthUrl = instagramService.getOAuthUrl();
    window.open(oauthUrl, '_blank', 'width=600,height=600');
  };

  const handleDisconnect = () => {
    instagramService.logout();
    setConfig({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
      accessToken: '',
      userId: '',
      username: ''
    });
    setIsConnected(false);
  };

  const handleOAuthCallback = async (code: string) => {
    setLoading(true);
    try {
      const success = await instagramService.handleOAuthCallback(code);
      if (success) {
        const updatedConfig = instagramService.getConfig();
        setConfig(updatedConfig);
        setIsConnected(true);
        alert('Instagram connected successfully!');
      } else {
        alert('Failed to connect Instagram. Please try again.');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      alert('Error connecting Instagram. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Check for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      handleOAuthCallback(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Configuration saved successfully!</span>
          </div>
        </motion.div>
      )}

      {/* App Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-900">Instagram App Setup</h3>
        </div>
        <p className="text-xs text-blue-700 mb-3">
          To connect Instagram, you need to create an Instagram Basic Display app:
        </p>
        <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
          <li>Go to <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="underline">Facebook Developers</a></li>
          <li>Create a new app → Instagram Basic Display</li>
          <li>Add Instagram Basic Display product</li>
          <li>Configure OAuth Redirect URIs: <code className="bg-blue-100 px-1 rounded">{config.redirectUri}</code></li>
          <li>Copy your App ID and App Secret below</li>
        </ol>
      </div>

      {/* App Credentials */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Key className="w-4 h-4 inline mr-1" />
            Instagram App ID
          </label>
          <input
            type="text"
            value={config.clientId}
            onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Enter your Instagram App ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Key className="w-4 h-4 inline mr-1" />
            Instagram App Secret
          </label>
          <input
            type="password"
            value={config.clientSecret}
            onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Enter your Instagram App Secret"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Link className="w-4 h-4 inline mr-1" />
            Redirect URI
          </label>
          <input
            type="text"
            value={config.redirectUri}
            onChange={(e) => setConfig({ ...config, redirectUri: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="OAuth redirect URI"
          />
        </div>
      </div>

      {/* Connection Status */}
      {isConnected && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="text-sm font-semibold text-green-900">Connected to Instagram</h3>
                <p className="text-xs text-green-700">
                  {config.username ? `@${config.username}` : 'User authenticated'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Save Configuration
        </button>
        
        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={!config.clientId || !config.clientSecret || loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Connect Instagram'}
          </button>
        ) : (
          <button
            onClick={() => window.open('https://instagram.com', '_blank')}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default InstagramConfig; 