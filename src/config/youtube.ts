export interface YouTubeConfig {
  channelId: string;
  apiKey: string;
  channelName: string;
  channelUrl: string;
}

// Replace these with your actual YouTube channel information
export const youtubeConfig: YouTubeConfig = {
  channelId: '', // Your YouTube channel ID (e.g., 'UC...')
  apiKey: '', // Your YouTube Data API v3 key
  channelName: 'Your Channel Name',
  channelUrl: 'https://www.youtube.com/@yourchannel',
};

// YouTube Data API v3 endpoints
export const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export const YOUTUBE_ENDPOINTS = {
  channel: `${YOUTUBE_API_BASE}/channels`,
  videos: `${YOUTUBE_API_BASE}/search`,
  videoStats: `${YOUTUBE_API_BASE}/videos`,
  playlists: `${YOUTUBE_API_BASE}/playlists`,
};

// Helper function to build API URLs
export const buildYouTubeUrl = (endpoint: string, params: Record<string, string>, apiKey?: string) => {
  const searchParams = new URLSearchParams({
    ...params,
    key: apiKey || youtubeConfig.apiKey,
  });
  return `${endpoint}?${searchParams.toString()}`;
}; 