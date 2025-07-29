import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { instagramService } from '../services/instagramService';
import type { InstagramConfig } from '../services/instagramService';

interface InstagramConfigComponentProps {
  onConfigUpdate: (config: InstagramConfig) => void;
}

const InstagramConfigComponent: React.FC<InstagramConfigComponentProps> = ({ onConfigUpdate }) => {
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



  const handleDirectLogin = () => {
    setLoading(true);
    
    // For demo purposes, we'll simulate a successful login
    // In a real implementation, this would redirect to Instagram OAuth
    setTimeout(() => {
      // Simulate successful connection
      const demoConfig = {
        ...config,
        accessToken: 'demo_access_token_' + Date.now(),
        userId: 'demo_user_id',
        username: 'demo_instagram_user'
      };
      
      instagramService.updateConfig(demoConfig);
      setConfig(demoConfig);
      setIsConnected(true);
      setLoading(false);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      
      console.log('Demo Instagram connection successful!');
    }, 2000);
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
      console.log('Processing OAuth callback with code:', code.substring(0, 10) + '...');
      
      const success = await instagramService.handleOAuthCallback(code);
      if (success) {
        const updatedConfig = instagramService.getConfig();
        setConfig(updatedConfig);
        setIsConnected(true);
        
        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        
        console.log('Instagram connected successfully!');
      } else {
        alert('Failed to connect Instagram. Please check your app credentials and try again.');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('invalid_grant')) {
          alert('Authorization code expired. Please try connecting again.');
        } else if (error.message.includes('invalid_client')) {
          alert('Invalid app credentials. Please check your App ID and App Secret.');
        } else if (error.message.includes('redirect_uri_mismatch')) {
          alert('Redirect URI mismatch. Please check your app configuration.');
        } else {
          alert(`Error connecting Instagram: ${error.message}`);
        }
      } else {
        alert('Error connecting Instagram. Please try again.');
      }
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

      {/* Simple Instagram Login */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold">Connect Instagram</h3>
          <p className="text-sm opacity-90">
            Log in with your Instagram account to access your profile data and recent posts
          </p>
          
          <button
            onClick={handleDirectLogin}
            disabled={loading}
            className="w-full bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Login with Instagram</span>
              </>
            )}
          </button>
          
          <p className="text-xs opacity-75">
            You'll be redirected to Instagram to authorize access to your public profile data
          </p>
        </div>
      </div>

      {/* Demo Mode Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-yellow-900">Demo Mode</h3>
            <p className="text-xs text-yellow-700">
              Currently in demo mode. Click "Login with Instagram" to simulate a connection and see how the interface works.
            </p>
          </div>
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
                <p className="text-xs text-green-600 mt-1">
                  Access token valid • Ready to fetch data
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.open('https://instagram.com/accounts/manage_access/', '_blank')}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Manage Access
              </button>
              <button
                onClick={handleDisconnect}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Not Connected Status */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-yellow-900">Not Connected</h3>
              <p className="text-xs text-yellow-700">
                Enter your Instagram App credentials and click "Connect Instagram" to authenticate.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Actions */}
      {isConnected && (
        <div className="flex space-x-3">
          <button
            onClick={() => window.open('https://instagram.com', '_blank')}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Instagram Profile
          </button>
          <button
            onClick={handleDisconnect}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default InstagramConfigComponent; 