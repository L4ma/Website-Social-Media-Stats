# Instagram OAuth Setup Guide

This guide will help you set up Instagram OAuth integration for the social media statistics dashboard.

## Prerequisites

- A Facebook Developer account
- An Instagram account
- Basic understanding of OAuth 2.0

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Select "Consumer" as the app type
4. Fill in your app details:
   - App Name: "Social Media Stats Dashboard"
   - App Contact Email: Your email
   - Business Account: Skip for now

## Step 2: Add Instagram Basic Display

1. In your app dashboard, click "Add Product"
2. Find and add "Instagram Basic Display"
3. Click "Set Up" on Instagram Basic Display

## Step 3: Configure OAuth Settings

1. In the Instagram Basic Display settings, go to "Basic Display"
2. Add your OAuth Redirect URI:
   ```
   http://localhost:3000/instagram-callback
   ```
   (Replace with your actual domain in production)

3. Add the following Valid OAuth Redirect URIs:
   - `http://localhost:3000/instagram-callback`
   - `https://yourdomain.com/instagram-callback` (for production)

## Step 4: Get Your Credentials

1. In your app dashboard, go to "Settings" → "Basic"
2. Copy your **App ID** (this is your Client ID)
3. Copy your **App Secret** (this is your Client Secret)

## Step 5: Configure the Dashboard

1. Open the dashboard and go to **Settings** → **Instagram**
2. Enter your App ID and App Secret
3. The Redirect URI should be pre-filled as: `http://localhost:3000/instagram-callback`
4. Click "Save Configuration"

## Step 6: Connect Your Instagram Account

1. Click "Connect Instagram"
2. You'll be redirected to Instagram's OAuth page
3. Log in with your Instagram credentials
4. Authorize the app to access your profile data
5. You'll be redirected back to the dashboard

## What Data is Accessed?

The Instagram Basic Display API allows access to:
- ✅ Your profile information (username, account type)
- ✅ Your recent posts (up to 25 most recent)
- ✅ Post engagement data (likes, comments)
- ✅ Post metadata (caption, media type, timestamp)

## Limitations

- ❌ No access to follower count (requires Instagram Graph API)
- ❌ No access to historical data beyond recent posts
- ❌ No access to private account data
- ❌ No access to stories or reels

## Troubleshooting

### "Invalid redirect URI" error
- Make sure the redirect URI in your Facebook app matches exactly
- Check for trailing slashes or typos

### "App not approved" error
- Instagram Basic Display apps need to go through app review for production
- For development, you can add yourself as a test user

### "OAuth error" after authorization
- Check that your App ID and App Secret are correct
- Ensure your app is in "Development" mode
- Verify the redirect URI configuration

## Security Notes

- Never share your App Secret publicly
- Store credentials securely
- Use HTTPS in production
- Implement proper error handling

## Next Steps

Once connected, you can:
- View your Instagram statistics in the Instagram tab
- See your recent posts with engagement data
- Monitor follower growth trends
- Track engagement rates over time

The dashboard will automatically collect and cache your data to build historical trends. 