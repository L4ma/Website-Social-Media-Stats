# Social Media Statistics Dashboard

A modern, interactive dashboard for tracking your social media performance across Threads, Instagram, and YouTube platforms.

## Features

- 📊 **Real-time Analytics**: Track followers, engagement, and growth metrics
- 📈 **Interactive Charts**: Beautiful visualizations using Recharts
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Smooth Animations**: Framer Motion for delightful user experience
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🎯 **Platform-specific Views**: Detailed analytics for each platform

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Framer Motion** for animations
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Stats_SocialMedia
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Main header component
│   ├── StatsOverview.tsx       # Overview statistics cards
│   ├── PlatformStats.tsx       # Individual platform analytics
│   ├── EngagementChart.tsx     # Engagement trends chart
│   ├── GrowthChart.tsx         # Follower growth chart
│   └── AudienceChart.tsx       # Audience distribution pie chart
├── App.tsx                     # Main application component
├── index.tsx                   # Application entry point
└── index.css                   # Global styles and Tailwind imports
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Features Overview

### Dashboard Overview
- Total followers across all platforms
- Engagement metrics
- Growth trends
- Cross-platform comparison

### Platform-Specific Analytics
- **Threads**: Followers, posts, engagement, replies
- **Instagram**: Followers, posts, likes, comments
- **YouTube**: Subscribers, videos, views, watch time

### Interactive Charts
- Line charts for growth trends
- Area charts for follower distribution
- Bar charts for engagement comparison
- Pie charts for audience breakdown

## Customization

### Adding New Platforms
1. Update the platform data in `PlatformStats.tsx`
2. Add new chart configurations
3. Update the navigation tabs in `App.tsx`

### Modifying Data
- Edit the mock data in each component
- Replace with real API calls for live data
- Customize chart colors and styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 