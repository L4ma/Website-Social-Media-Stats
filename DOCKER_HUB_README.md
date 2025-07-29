# Social Media Statistics Dashboard

A modern, responsive web application for tracking and visualizing social media statistics across multiple platforms including YouTube and Instagram.

## 🚀 Quick Start

### Pull and Run
```bash
# Pull the image
docker pull l4ma/social-media-stats:latest

# Run the container
docker run -d -p 3000:80 --name social-media-stats l4ma/social-media-stats:latest

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
    image: l4ma/social-media-stats:latest
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

### Environment Variables
```bash
docker run -d -p 3000:80 \
  -e NODE_ENV=production \
  l4ma/social-media-stats:latest
```

### Custom Port
```bash
docker run -d -p 8080:80 \
  l4ma/social-media-stats:latest
```

### Persistent Storage (Optional)
```bash
docker run -d -p 3000:80 \
  -v social-media-data:/app/data \
  l4ma/social-media-stats:latest
```

## 📈 Monitoring

### Health Check
```bash
# Check if the application is running
curl http://localhost:3000/health

# Expected response: "healthy"
```

### Logs
```bash
# View application logs
docker logs social-media-stats

# Follow logs in real-time
docker logs -f social-media-stats
```

### Container Status
```bash
# Check container status
docker ps

# View resource usage
docker stats social-media-stats
```

## 🛠️ Development

### Build from Source
```bash
# Clone the repository
git clone https://github.com/L4ma/Website-Social-Media-Stats.git
cd Website-Social-Media-Stats

# Build the image
docker build -t social-media-stats .

# Run the container
docker run -d -p 3000:80 social-media-stats
```

### Development Mode
```bash
# Run with volume mounting for development
docker run -v $(pwd):/app -p 3000:3000 \
  -e NODE_ENV=development \
  social-media-stats:dev npm start
```

## 🔒 Security

### Security Features
- **Security Headers**: XSS protection and content security policy
- **Non-root Container**: Runs with minimal privileges
- **Health Checks**: Automatic monitoring
- **Resource Limits**: Configurable memory and CPU limits

### Production Deployment
```bash
# Run with resource limits
docker run -d -p 3000:80 \
  --memory=512m --cpus=1.0 \
  --name social-media-stats \
  l4ma/social-media-stats:latest
```

## 📝 Usage Examples

### Basic Usage
```bash
# Simple run
docker run -d -p 3000:80 l4ma/social-media-stats:latest
```

### With Custom Configuration
```bash
# Create a custom docker-compose.yml
version: '3.8'
services:
  social-media-stats:
    image: l4ma/social-media-stats:latest
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    volumes:
      - ./config:/app/config
```

### Multi-Container Setup
```bash
# With nginx reverse proxy
version: '3.8'
services:
  social-media-stats:
    image: l4ma/social-media-stats:latest
    expose:
      - "80"
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - social-media-stats
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## 🔗 Links

- **GitHub Repository**: https://github.com/L4ma/Website-Social-Media-Stats
- **Docker Hub**: https://hub.docker.com/r/l4ma/social-media-stats
- **Documentation**: https://github.com/L4ma/Website-Social-Media-Stats/blob/main/README.md

## 🤝 Support

### Issues and Questions
- **GitHub Issues**: https://github.com/L4ma/Website-Social-Media-Stats/issues
- **Docker Hub Discussions**: Use the discussions tab on this page

### Contributing
- **Contributing Guide**: https://github.com/L4ma/Website-Social-Media-Stats/blob/main/CONTRIBUTING.md
- **Development Setup**: https://github.com/L4ma/Website-Social-Media-Stats/blob/main/DOCKER_COMPOSE_GUIDE.md

## 📊 Image Information

### Image Details
- **Base Image**: Node.js 18 Alpine
- **Web Server**: Nginx
- **Size**: ~50MB (optimized)
- **Architecture**: Multi-platform (amd64, arm64)

### Tags Available
- `latest` - Latest stable release
- `main` - Latest from main branch
- `v1.0.0` - Specific version tags
- `sha-abc123` - Commit-specific builds

## 📈 Statistics

### Docker Hub Stats
- **Downloads**: Tracked automatically
- **Stars**: Community rating
- **Pulls**: Usage statistics
- **Build Status**: Automated CI/CD

---

**Built with ❤️ using React, TypeScript, and Docker**

**Maintained by**: [L4ma](https://github.com/L4ma) 