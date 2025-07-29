import React, { useState, useEffect } from 'react';
import { Youtube, Key, Link, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { youtubeOAuthService } from '../services/youtubeOAuthService';
import type { YouTubeOAuthConfig } from '../services/youtubeOAuthService';

const YouTubeOAuthConfigComponent: React.FC = () => {
  const [config, setConfig] = useState<YouTubeOAuthConfig>({
    clientId: '',
    clientSecret: '',
    redirectUri: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const savedConfig = youtubeOAuthService.getConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    }
    setIsAuthenticated(youtubeOAuthService.isAuthenticated());
  }, []);

  const handleInputChange = (field: keyof YouTubeOAuthConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSave = () => {
    if (!config.clientId || !config.clientSecret || !config.redirectUri) {
      setError('Please fill in all fields');
      return;
    }

    youtubeOAuthService.setConfig(config);
    setSuccess('Configuration saved successfully!');
    setError(null);
  };

  const handleConnect = () => {
    if (!config.clientId || !config.clientSecret || !config.redirectUri) {
      setError('Please save your configuration first');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const authUrl = youtubeOAuthService.getAuthUrl();
      window.open(authUrl, '_blank', 'width=600,height=700');
      setSuccess('Please complete the authentication in the popup window');
    } catch (error) {
      setError('Failed to start authentication process');
      console.error('YouTube OAuth error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = () => {
    youtubeOAuthService.logout();
    setIsAuthenticated(false);
    setSuccess('Logged out successfully');
    setError(null);
  };

  const handleOAuthCallback = async (code: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      const success = await youtubeOAuthService.handleOAuthCallback(code);
      if (success) {
        setIsAuthenticated(true);
        setSuccess('YouTube account connected successfully!');
      } else {
        setError('Failed to connect YouTube account');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
      console.error('YouTube OAuth callback error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Check for OAuth callback in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (code) {
      handleOAuthCallback(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      setError('Authentication was cancelled or failed');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Youtube className="w-8 h-8 text-red-600 mr-3" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">YouTube OAuth Setup</h2>
          <p className="text-gray-600">Connect your YouTube account using OAuth 2.0</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <XCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {isAuthenticated ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700 font-medium">YouTube account connected</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client ID
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={config.clientId}
                onChange={(e) => handleInputChange('clientId', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your YouTube OAuth Client ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Secret
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={config.clientSecret}
                onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your YouTube OAuth Client Secret"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Redirect URI
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={config.redirectUri}
                onChange={(e) => handleInputChange('redirectUri', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="http://localhost:3000/auth/youtube/callback"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Configuration
            </button>
            <button
              onClick={handleConnect}
              disabled={isConnecting || !config.clientId || !config.clientSecret || !config.redirectUri}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? 'Connecting...' : 'Connect YouTube'}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Setup Instructions</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Create a Google Cloud Project and enable YouTube Data API v3</li>
              <li>Create OAuth 2.0 credentials in Google Cloud Console</li>
              <li>Add your redirect URI to the authorized redirect URIs</li>
              <li>Enter your Client ID and Client Secret above</li>
              <li>Click "Connect YouTube" to authenticate</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeOAuthConfigComponent; 