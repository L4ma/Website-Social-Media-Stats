# 📊 Social Media Statistics Dashboard

A modern, responsive web application for tracking and visualizing social media statistics across multiple platforms including YouTube and Instagram.

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/L4ma/Website-Social-Media-Stats.git
cd Website-Social-Media-Stats

# Start with Docker Compose
docker compose -f docker-compose-simple.yml up -d

# Access the application
open http://localhost:3000
```

### Option 2: Development Mode

```bash
# Clone the repository
git clone https://github.com/L4ma/Website-Social-Media-Stats.git
cd Website-Social-Media-Stats

# Install dependencies
npm install

# Start development server
npm start
```

### Option 3: Interactive Setup

```bash
# Run the interactive installation script
./install-docker-compose.sh
```

## 🐳 Docker Setup

### Prerequisites

1. **Install Docker Desktop**:
   - Visit: https://www.docker.com/products/docker-desktop
   - Download and install for your platform
   - Docker Compose comes included

### Quick Commands

```bash
# Start application
docker compose -f docker-compose-simple.yml up -d

# View logs
docker compose -f docker-compose-simple.yml logs -f

# Stop application
docker compose -f docker-compose-simple.yml down

# Restart application
docker compose -f docker-compose-simple.yml restart
```

### Production Deployment

```bash
# Build production image
docker compose build

# Deploy to server
docker compose up -d

# With custom port
docker compose -f docker-compose-simple.yml up -d
```

## 📱 Features

### ✅ Connected Platforms
- **YouTube**: Channel statistics, video analytics, subscriber growth
- **Instagram**: Profile data, post engagement, follower analytics
- **Overview**: Combined statistics across all platforms

### ✅ Data Visualization
- **Interactive Charts**: Real-time data visualization with Recharts
- **Time Filters**: 7 days, 30 days, 3 months, 6 months, 1 year
- **Growth Trends**: Visual representation of platform growth

### ✅ User Experience
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Live data refresh and status monitoring
- **Mobile Responsive**: Works perfectly on all devices

### ✅ API Integration
- **YouTube Data API v3**: Real channel statistics
- **Instagram Basic Display API**: OAuth authentication
- **Local Storage**: Persistent configuration and data caching

## 🔧 Configuration

### YouTube Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable YouTube Data API v3
3. Generate an API key
4. Enter your channel ID and API key in Settings → YouTube

### Instagram Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an Instagram Basic Display app
3. Configure OAuth redirect URIs
4. Enter your app credentials in Settings → Instagram

## 📊 Data Collection

### Daily Data Collection
- Automatic daily statistics collection
- Historical data building over time
- Local storage for offline access
- API quota management and caching

### API Quota Management
- Conservative API call limits (4 calls/day for YouTube)
- Rate limiting (6 hours between calls)
- Intelligent caching and fallback to demo data
- Real-time quota status monitoring

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
├── services/           # API services
├── utils/              # Utility functions
└── App.tsx            # Main application
```

### Key Technologies
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Framer Motion** for animations
- **Lucide React** for icons

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker
docker build -t social-media-stats .
docker run -d -p 3000:80 social-media-stats

# Or use Docker Compose
docker compose up -d
```

### Production Build
```bash
# Build optimized production bundle
npm run build

# Serve with nginx or any static server
npx serve -s build
```

## 📈 Monitoring

### Health Check
```bash
# Check application health
curl http://localhost:3000/health

# Expected response: "healthy"
```

### Logs
```bash
# View application logs
docker compose logs -f

# View specific service logs
docker compose logs social-media-stats
```

## 🔒 Security

### Security Features
- **OAuth 2.0**: Secure Instagram authentication
- **API Key Management**: Secure storage of credentials
- **CORS Protection**: Cross-origin request handling
- **Security Headers**: XSS protection and content security policy

### Data Privacy
- **Local Storage**: All data stored locally in browser
- **No Server Storage**: No personal data sent to external servers
- **Revocable Access**: Easy disconnect from social platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **YouTube Data API v3** for channel statistics
- **Instagram Basic Display API** for profile data
- **Recharts** for beautiful data visualization
- **Tailwind CSS** for modern styling
- **Framer Motion** for smooth animations

## 📞 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/L4ma/Website-Social-Media-Stats/issues) page
2. Review the [Docker Compose Guide](DOCKER_COMPOSE_GUIDE.md)
3. Check the [Docker README](DOCKER_README.md)

---

**Built with ❤️ using React, TypeScript, and Docker**

**Repository**: https://github.com/L4ma/Website-Social-Media-Stats 