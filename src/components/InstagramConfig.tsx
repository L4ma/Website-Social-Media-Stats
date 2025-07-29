import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, CheckCircle, AlertCircle, Info, ExternalLink, Lock } from 'lucide-react';
import { instagramService } from '../services/instagramService';
import type { InstagramConfig as InstagramConfigType } from '../services/instagramService';

interface InstagramConfigComponentProps {
  onConfigUpdate?: (config: InstagramConfigType) => void;
}

const InstagramConfig: React.FC<InstagramConfigComponentProps> = ({ onConfigUpdate }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsConnected(instagramService.isConnected());
  }, []);

  const handleOAuthLogin = () => {
    setIsConnecting(true);
    instagramService.initiateOAuth();
  };

  const handleDisconnect = () => {
    instagramService.disconnect();
    setIsConnected(false);
    setShowSuccess(false);
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
              {isConnected ? 'Connected to Instagram' : 'Not Connected'}
            </h3>
            <p className={`text-sm ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
              {isConnected 
                ? 'Your Instagram account is connected via OAuth' 
                : 'Connect your Instagram account to access real data'
              }
            </p>
          </div>
        </div>
      </div>

      {/* OAuth Connection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Instagram className="w-5 h-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Instagram OAuth Connection</h3>
        </div>

        <div className="space-y-4">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">OAuth Authentication</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Connect your Instagram account securely using OAuth. This allows us to access your public profile data and recent posts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Lock className="w-4 h-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Security & Privacy</p>
                    <ul className="text-xs text-gray-700 mt-1 space-y-1">
                      <li>• We only access your public profile data</li>
                      <li>• No passwords are stored</li>
                      <li>• You can revoke access anytime</li>
                      <li>• Data is stored locally in your browser</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleOAuthLogin}
                disabled={isConnecting}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                <Instagram className="w-5 h-5" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Instagram Account'}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Successfully Connected</p>
                    <p className="text-xs text-green-700">
                      Your Instagram account is now connected. You can access your data in the Instagram tab.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleDisconnect}
                  className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Disconnect Account
                </button>
                <button
                  onClick={() => window.open('https://www.instagram.com/accounts/manage_access/', '_blank')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Manage Access
                </button>
              </div>
            </div>
          )}
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
              Instagram account connected successfully!
            </span>
          </div>
        </motion.div>
      )}

      {/* Setup Instructions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">How to Connect Your Instagram Account</h4>
        <ol className="text-sm text-gray-700 space-y-1">
          <li>1. Click "Connect Instagram Account" above</li>
          <li>2. You'll be redirected to Instagram's OAuth page</li>
          <li>3. Log in to your Instagram account and authorize access</li>
          <li>4. You'll be redirected back to this app</li>
          <li>5. Your Instagram data will be available in the Instagram tab</li>
        </ol>
      </div>

      {/* Demo Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Demo Mode</p>
            <p className="text-xs text-yellow-700 mt-1">
              Currently in demo mode. To enable real Instagram OAuth, you'll need to:
              <br />• Create an Instagram app in Meta for Developers
              <br />• Configure the OAuth redirect URI
              <br />• Set up a backend server to handle token exchange
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramConfig; 