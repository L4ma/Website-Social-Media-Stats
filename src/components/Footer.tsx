import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  version?: string;
}

const Footer: React.FC<FooterProps> = ({ version = '1.0.0' }) => {
  return (
    <footer className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-gray-200">
        <span>Made with</span>
        <Heart className="w-4 h-4 text-red-500 fill-current" />
        <span>by</span>
        <span className="font-semibold text-gray-800">L4ma</span>
        <span className="text-gray-400">v{version}</span>
      </div>
    </footer>
  );
};

export default Footer; 