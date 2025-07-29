# YouTube Channel Setup Guide

## 🎯 Getting Your YouTube Data API Key

### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing (required for API usage)

### Step 2: Enable YouTube Data API v3
1. Go to "APIs & Services" → "Library"
2. Search for "YouTube Data API v3"
3. Click on it and press "Enable"

### Step 3: Create API Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key (starts with "AIza...")

### Step 4: Get Your Channel ID
1. Go to your YouTube channel
2. Go to YouTube Studio → Settings → Advanced
3. Copy your Channel ID (starts with "UC...")

## 🔧 Configuring Your Dashboard

### Step 1: Access Configuration
1. Open your dashboard at `http://localhost:3000`
2. Click on the "YouTube Config" tab (⚙️ icon)

### Step 2: Enter Your Details
1. **Channel Name**: Your YouTube channel name
2. **Channel URL**: Your YouTube channel URL (e.g., `https://www.youtube.com/@yourchannel`)
3. **Channel ID**: Your YouTube channel ID (e.g., `UC...`)
4. **API Key**: Your YouTube Data API v3 key (e.g., `AIza...`)

### Step 3: Save Configuration
1. Click "Save Configuration"
2. Go to the "YouTube" tab to see your real data!

## 📊 What Data You'll See

Once configured, your dashboard will show:

- **Real subscriber count**
- **Total video views**
- **Number of videos**
- **Recent videos with thumbnails**
- **Video statistics (views, likes, comments)**
- **Growth charts**
- **Monthly analytics**

## 🔒 Security Notes

- Your API key is stored locally in your browser
- Never share your API key publicly
- You can restrict the API key to specific domains/IPs in Google Cloud Console

## 🚀 Next Steps

After setting up YouTube, you can:
1. Add your Instagram account
2. Add your Threads account
3. Customize the dashboard further
4. Add more analytics features

## ❓ Troubleshooting

### "Failed to load YouTube data"
- Check your API key is correct
- Verify your channel ID is correct
- Ensure YouTube Data API v3 is enabled
- Check your internet connection

### "Channel not found"
- Verify your channel ID is correct
- Make sure your channel is public
- Check if the channel exists

### API Quota Issues
- YouTube Data API has daily quotas
- Monitor usage in Google Cloud Console
- Consider upgrading if needed

## 📈 API Quotas

YouTube Data API v3 has the following quotas:
- **Free tier**: 10,000 units per day
- **Paid tier**: $5 per 1,000 units

Typical usage:
- Channel stats: 1 unit
- Video list: 1 unit
- Video details: 1 unit per video

## 🎉 You're Ready!

Once configured, your dashboard will display real-time data from your YouTube channel with beautiful charts and analytics! 