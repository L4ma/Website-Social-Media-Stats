# 🎯 YouTube API Setup - Step by Step Guide

## Step 1: Get Your YouTube Channel ID

### Option A: From YouTube Studio (Recommended)
1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Click on **Settings** (gear icon) in the left sidebar
3. Click on **Channel** tab
4. Scroll down to **Advanced settings**
5. Copy your **Channel ID** (starts with "UC...")

### Option B: From Your Channel URL
1. Go to your YouTube channel
2. Look at the URL: `https://www.youtube.com/channel/UC...`
3. Copy the part after `/channel/` (this is your Channel ID)

## Step 2: Get Your YouTube Data API Key

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create a New Project
- Click on the project dropdown at the top
- Click **"New Project"**
- Name it something like "YouTube Analytics Dashboard"
- Click **"Create"**

### 3. Enable YouTube Data API v3
- In the left sidebar, go to **"APIs & Services"** → **"Library"**
- Search for **"YouTube Data API v3"**
- Click on it and press **"Enable"**

### 4. Create API Credentials
- Go to **"APIs & Services"** → **"Credentials"**
- Click **"Create Credentials"** → **"API Key"**
- Copy the generated API key (starts with "AIza...")

### 5. (Optional) Restrict the API Key
- Click on the API key you just created
- Under **"Application restrictions"**, select **"HTTP referrers"**
- Add: `http://localhost:3000/*`
- Under **"API restrictions"**, select **"Restrict key"**
- Select **"YouTube Data API v3"**
- Click **"Save"**

## Step 3: Configure Your Dashboard

### 1. Open Your Dashboard
- Go to: http://localhost:3000
- Click on the **"YouTube Config"** tab (⚙️ icon)

### 2. Enter Your Details
Fill in the form with:
- **Channel Name**: Your YouTube channel name
- **Channel URL**: Your YouTube channel URL (e.g., `https://www.youtube.com/@yourchannel`)
- **Channel ID**: The Channel ID you copied (e.g., `UC...`)
- **API Key**: The API key you generated (e.g., `AIza...`)

### 3. Save Configuration
- Click **"Save Configuration"**
- You should see a success message

### 4. View Your Data
- Click on the **"YouTube"** tab
- You should now see your real YouTube data!

## 🎉 What You'll See

Once configured, your dashboard will display:
- ✅ Real subscriber count
- ✅ Total video views
- ✅ Number of videos
- ✅ Recent videos with thumbnails
- ✅ Video statistics (views, likes, comments)
- ✅ Growth charts with real data
- ✅ Monthly analytics

## 🔧 Troubleshooting

### "Failed to load YouTube data"
- ✅ Check your API key is correct
- ✅ Verify your channel ID is correct
- ✅ Ensure YouTube Data API v3 is enabled
- ✅ Check your internet connection

### "Channel not found"
- ✅ Verify your channel ID is correct
- ✅ Make sure your channel is public
- ✅ Check if the channel exists

### API Quota Issues
- YouTube Data API has daily quotas
- Free tier: 10,000 units per day
- Monitor usage in Google Cloud Console

## 📊 API Usage

Typical usage per dashboard load:
- Channel stats: 1 unit
- Recent videos: 1 unit
- Video details: 1 unit per video

## 🚀 Next Steps

After setting up YouTube:
1. Add your Instagram account
2. Add your Threads account
3. Customize the dashboard further

---

**Need help?** Check the browser console for detailed error messages! 