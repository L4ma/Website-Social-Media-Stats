import React, { useState, useEffect } from 'react';
import { Instagram, Key, Link, AlertCircle, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { instagramOAuthService } from '../services/instagramOAuthService';
import type { InstagramOAuthConfig } from '../services/instagramOAuthService';

const InstagramOAuthConfigComponent: React.FC = () => {
  const [config, setConfig] = useState<InstagramOAuthConfig>({
    clientId: '',
    clientSecret: '',
    redirectUri: `${window.location.origin}/instagram-callback`
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const savedConfig = instagramOAuthService.getConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    }
    setIsAuthenticated(instagramOAuthService.isAuthenticated());
  }, []);

  useEffect(() => {
    // Check for OAuth callback in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      handleOAuthCallback(code);
    }
  }, []);

  const handleInputChange = (field: keyof InstagramOAuthConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    try {
      instagramOAuthService.setConfig(config);
      setSuccess('Configuration saved successfully!');
      setError(null);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError('Failed to save configuration');
      setSuccess(null);
    }
  };

  const handleConnect = () => {
    if (!config.clientId || !config.clientSecret) {
      setError('Please enter your Instagram app credentials first');
      return;
    }

    try {
      const authUrl = instagramOAuthService.getAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to generate OAuth URL. Please check your configuration.');
    }
  };

  const handleOAuthCallback = async (code: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const success = await instagramOAuthService.handleOAuthCallback(code);
      if (success) {
        setIsAuthenticated(true);
        setSuccess('Instagram connected successfully!');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setError('Failed to connect Instagram. Please try again.');
      }
    } catch (err) {
      setError('OAuth callback failed. Please check your app credentials.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = () => {
    instagramOAuthService.logout();
    setIsAuthenticated(false);
    setSuccess('Disconnected from Instagram');
    setTimeout(() => setSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <Instagram className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Instagram OAuth Setup</h3>
        </div>
        <p className="text-pink-100">
          Connect your Instagram account to access your statistics and analytics.
        </p>
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">📋 Setup Instructions</h4>
        <div className="space-y-3 text-sm text-blue-800">
          <p>1. Create an Instagram Basic Display app at <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
            developers.facebook.com <ExternalLink className="w-3 h-3 ml-1" />
          </a></p>
          <p>2. Add your redirect URI: <code className="bg-blue-100 px-2 py-1 rounded">{config.redirectUri}</code></p>
          <p>3. Enter your app credentials below</p>
          <p>4. Click "Connect Instagram" to authorize</p>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">App Configuration</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client ID
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={config.clientId}
                onChange={(e) => handleInputChange('clientId', e.target.value)}
                placeholder="Enter your Instagram app Client ID"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Secret
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                value={config.clientSecret}
                onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                placeholder="Enter your Instagram app Client Secret"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Redirect URI
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={config.redirectUri}
                onChange={(e) => handleInputChange('redirectUri', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50"
                readOnly
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This URL must be added to your Instagram app's redirect URIs
            </p>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h4>
        
        {isAuthenticated ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium">Connected to Instagram</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">Not connected</span>
            </div>
            <button
              onClick={handleConnect}
              disabled={isConnecting || !config.clientId || !config.clientSecret}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? 'Connecting...' : 'Connect Instagram'}
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramOAuthConfigComponent; 