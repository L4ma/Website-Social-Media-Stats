# Social Media Statistics Dashboard

A modern web application for tracking and visualizing social media statistics across multiple platforms including YouTube, Instagram, and Threads.

## 🚀 Quick Start

### Docker Compose (Recommended)
```bash
docker-compose up -d
```
Access the application at http://localhost:3000

### Development Mode
```bash
npm install
npm start
```

### Interactive Setup
```bash
chmod +x install-docker-compose.sh
./install-docker-compose.sh
```

## 🐳 Docker Setup

### Prerequisites
- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)

### Quick Commands
```bash
# Pull and run the latest image
docker pull ghcr.io/l4ma/website-social-media-stats:latest
docker run -d -p 3000:80 ghcr.io/l4ma/website-social-media-stats:latest

# Or use Docker Compose
docker-compose up -d
```

## ✨ Features

### Connected Platforms
- **YouTube**: Real-time statistics with API key or OAuth 2.0 authentication
- **Instagram**: Demo data with OAuth integration
- **Threads**: Simulated realistic data

### Data Visualization
- Interactive charts and graphs
- Time-based filtering (7d, 30d, 3m, 6m, 1y)
- Real-time data updates
- Historical data tracking

### User Experience
- Modern, responsive design
- Dark/light theme support
- Mobile-friendly interface
- Real-time notifications

### API Integration
- YouTube Data API v3
- Instagram Basic Display API
- OAuth 2.0 authentication
- Rate limiting and quota management

## 🔧 Configuration

### YouTube Setup
1. **API Key Method**: 
   - Get API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable YouTube Data API v3
   - Enter API key and channel ID in Settings

2. **OAuth 2.0 Method**:
   - Create OAuth credentials in Google Cloud Console
   - Follow the [YouTube OAuth Setup Guide](YOUTUBE_OAUTH_SETUP_GUIDE.md)
   - Use the OAuth 2.0 option in Settings

### Instagram Setup
- Currently using demo data
- OAuth integration available for future use

## 📊 Data Collection

### Automatic Collection
- Daily data collection when visiting YouTube page
- Historical data building over time
- Smart caching to respect API quotas

### Manual Collection
- "Collect Now" button in Data Status
- Force collection when needed
- Real-time status monitoring

### API Quota Management
- Conservative daily limits (4 calls/day for YouTube)
- 6-hour intervals between calls
- Intelligent fallback to cached data
- Quota exceeded notifications

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
├── services/           # API and data services
├── utils/              # Utility functions
└── config/             # Configuration files
```

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm test           # Run tests
```

### Key Services
- `youtubeService`: YouTube API integration
- `instagramService`: Instagram OAuth and data
- `dataCollectionService`: Daily data collection
- `overviewService`: Multi-platform aggregation

## 🚀 Deployment

### Docker
```bash
# Build locally
docker build -t social-media-stats .

# Run locally
docker run -d -p 3000:80 social-media-stats
```

### Production Build
```bash
npm run build
serve -s build
```

## 📈 Monitoring

### Health Checks
- Container health monitoring
- API status tracking
- Data collection status
- Error logging and alerts

### Security
- HTTPS support
- Secure headers
- OAuth 2.0 authentication
- API key management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React and TypeScript for the frontend
- Recharts for data visualization
- YouTube Data API v3
- Docker for containerization

## 💬 Support

For issues and questions:
1. Check the [GitHub Issues](https://github.com/l4ma/Website-Social-Media-Stats/issues)
2. Review the documentation
3. Check the troubleshooting guides

---

**Latest Update**: Fixed data collection timezone issue and added YouTube OAuth support (July 30, 2025) 