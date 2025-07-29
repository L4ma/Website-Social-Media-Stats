# YouTube OAuth Setup Guide

This guide will help you set up YouTube OAuth 2.0 authentication for the Social Media Statistics Dashboard.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "Social Media Stats Dashboard")
5. Click "Create"

## Step 2: Enable YouTube Data API v3

1. In your Google Cloud project, go to the [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for "YouTube Data API v3"
3. Click on "YouTube Data API v3"
4. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" and select "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: "Social Media Stats Dashboard"
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue through the remaining steps

4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: "Social Media Stats Dashboard"
   - Authorized redirect URIs: 
     - For development: `http://localhost:3000/auth/youtube/callback`
     - For production: `https://yourdomain.com/auth/youtube/callback`
   - Click "Create"

5. Note down your Client ID and Client Secret

## Step 4: Configure the Dashboard

1. In the Social Media Statistics Dashboard, go to Settings > YouTube
2. Select "OAuth 2.0" as the authentication method
3. Enter your Client ID and Client Secret
4. Set the Redirect URI to match what you configured in Google Cloud Console
5. Click "Save Configuration"
6. Click "Connect YouTube" to start the authentication process

## Step 5: Complete Authentication

1. A popup window will open with Google's OAuth consent screen
2. Sign in with your Google account
3. Grant the requested permissions (YouTube Data API v3 read access)
4. You'll be redirected back to the dashboard
5. Your YouTube account should now be connected!

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Make sure the redirect URI in the dashboard matches exactly what you configured in Google Cloud Console
   - Check for trailing slashes or protocol mismatches

2. **"Access denied" error**
   - Ensure YouTube Data API v3 is enabled in your Google Cloud project
   - Check that your OAuth consent screen is properly configured

3. **"Client ID not found" error**
   - Verify you're using the correct Client ID from Google Cloud Console
   - Make sure you're in the right Google Cloud project

### Security Notes

- Keep your Client Secret secure and never share it publicly
- Use different OAuth credentials for development and production
- Regularly review and rotate your credentials
- Monitor API usage in Google Cloud Console

## API Quotas

YouTube Data API v3 has the following quotas:
- 10,000 units per day (free tier)
- 1,000,000 units per day (paid tier)

The dashboard is configured to use API calls conservatively to stay within these limits.

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Google Cloud Console configuration
3. Ensure your redirect URI is correctly configured
4. Check that YouTube Data API v3 is enabled

For additional help, refer to the [YouTube Data API v3 documentation](https://developers.google.com/youtube/v3). 