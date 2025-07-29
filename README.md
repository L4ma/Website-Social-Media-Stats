# 📊 Social Media Statistics Dashboard

A modern, responsive web application for tracking and visualizing social media statistics across multiple platforms including YouTube and Instagram.

## 🚀 Quick Start

### Using GitHub Container Registry
```bash
# Pull the latest image
docker pull ghcr.io/l4ma/website-social-media-stats:latest

# Run the container
docker run -d -p 3000:80 --name social-media-stats ghcr.io/l4ma/website-social-media-stats:latest

# Access the application
open http://localhost:3000
```

### Using Docker Compose
```bash
# Create docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  social-media-stats:
    image: ghcr.io/l4ma/website-social-media-stats:latest
    container_name: social-media-stats
    ports:
      - "3000:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
EOF

# Start the application
docker compose up -d
```

### Interactive Setup
```bash
# Run the interactive setup script
chmod +x install-docker-compose.sh
./install-docker-compose.sh
```

## 📊 Features

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

## 🔧 Configuration

### YouTube Setup
1. Get your YouTube Data API v3 key from [Google Cloud Console](https://console.cloud.google.com/)
2. Find your YouTube Channel ID
3. Go to Settings → YouTube Configuration
4. Enter your API key and Channel ID
5. Save configuration

### Instagram Setup
1. Go to Settings → Instagram Configuration
2. Click "Connect Instagram" for demo mode
3. Or configure OAuth for real data access

## 📈 Data Collection

### Daily Data Collection
- **Automatic**: Collects daily statistics when configured
- **Historical**: Builds historical data over time
- **Local Storage**: Data persists in browser localStorage
- **API Quota Management**: Prevents exceeding API limits

### API Quota Management
- **YouTube**: 4 calls per day maximum (conservative)
- **Rate Limiting**: 6 hours between calls
- **Smart Caching**: Uses cached data when API limits reached
- **Demo Data**: Falls back to realistic demo data

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Local Development
```bash
# Clone the repository
git clone https://github.com/L4ma/Website-Social-Media-Stats.git
cd Website-Social-Media-Stats

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

### Docker Development
```bash
# Build development image
docker build -t social-media-stats:dev .

# Run with volume mounting
docker run -v $(pwd):/app -p 3000:3000 \
  -e NODE_ENV=development \
  social-media-stats:dev npm start
```

## 🐳 Docker Setup

### Prerequisites
- Docker Desktop installed and running
- Git repository cloned

### Quick Start
```bash
# Simple Docker run
docker run -d -p 3000:80 ghcr.io/l4ma/website-social-media-stats:latest

# With Docker Compose
docker compose up -d

# Interactive setup
./install-docker-compose.sh
```

### Production Deployment
```bash
# With resource limits
docker run -d -p 3000:80 \
  --memory=512m --cpus=1.0 \
  --name social-media-stats \
  ghcr.io/l4ma/website-social-media-stats:latest

# With custom configuration
docker run -d -p 8080:80 \
  -e NODE_ENV=production \
  ghcr.io/l4ma/website-social-media-stats:latest
```

## 📦 Available Images

### GitHub Container Registry
```bash
# Latest version
docker pull ghcr.io/l4ma/website-social-media-stats:latest

# Specific version
docker pull ghcr.io/l4ma/website-social-media-stats:v1.0.0

# Main branch
docker pull ghcr.io/l4ma/website-social-media-stats:main
```

### Image Tags
- `latest` - Latest stable release
- `main` - Latest from main branch
- `v1.0.0` - Specific version tags
- `sha-abc123` - Commit-specific builds

## 🔒 Security

### Security Features
- **Security Headers**: XSS protection and content security policy
- **Non-root Container**: Runs with minimal privileges
- **Health Checks**: Automatic monitoring
- **Resource Limits**: Configurable memory and CPU limits

### Production Security
```bash
# Run with security best practices
docker run -d -p 3000:80 \
  --security-opt no-new-privileges \
  --read-only \
  --tmpfs /tmp \
  ghcr.io/l4ma/website-social-media-stats:latest
```

## 📈 Monitoring

### Health Check
```bash
# Check if the application is running
curl http://localhost:3000/health

# Expected response: "healthy"
```

### Container Monitoring
```bash
# View container logs
docker logs social-media-stats

# Monitor resource usage
docker stats social-media-stats

# Check container status
docker ps
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Guidelines
- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** for the frontend framework
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **YouTube Data API** for YouTube integration
- **Instagram Basic Display API** for Instagram integration

## 📞 Support

### Getting Help
- **GitHub Issues**: [Report bugs or request features](https://github.com/L4ma/Website-Social-Media-Stats/issues)
- **Documentation**: Check the [Wiki](https://github.com/L4ma/Website-Social-Media-Stats/wiki)
- **Discussions**: Use [GitHub Discussions](https://github.com/L4ma/Website-Social-Media-Stats/discussions)

### Common Issues
- **API Quota Exceeded**: Wait 24 hours or check quota limits
- **Data Not Loading**: Verify API keys and channel IDs
- **Docker Issues**: Check Docker installation and permissions

---

**Built with ❤️ using React, TypeScript, and Docker**

**Maintained by**: [L4ma](https://github.com/L4ma) 