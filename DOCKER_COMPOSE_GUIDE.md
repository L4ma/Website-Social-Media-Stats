# 🐳 Docker Compose Quick Guide

## 📦 Installation

### 1. Install Docker Desktop
```bash
# Visit: https://www.docker.com/products/docker-desktop
# Download and install Docker Desktop for Mac
# Docker Compose comes included!
```

### 2. Verify Installation
```bash
docker --version
docker compose version
```

## 🚀 Quick Start

### Option 1: Interactive Script (Recommended)
```bash
./install-docker-compose.sh
```

### Option 2: Simple Setup
```bash
# Start the application
docker compose -f docker-compose-simple.yml up -d

# View logs
docker compose -f docker-compose-simple.yml logs -f

# Stop the application
docker compose -f docker-compose-simple.yml down
```

### Option 3: Full Setup (with nginx proxy)
```bash
# Start the application
docker compose up -d

# View logs
docker compose logs -f

# Stop the application
docker compose down
```

## 📋 Common Commands

### Basic Operations
```bash
# Start application
docker compose up -d

# Stop application
docker compose down

# Restart application
docker compose restart

# View logs
docker compose logs -f

# Check status
docker compose ps
```

### Building
```bash
# Build image
docker compose build

# Build and start
docker compose up -d --build

# Force rebuild
docker compose build --no-cache
```

### Debugging
```bash
# View container logs
docker compose logs social-media-stats

# Enter container shell
docker compose exec social-media-stats sh

# Check container health
docker compose ps
```

## 🔧 Configuration

### Port Configuration
Edit `docker-compose.yml` or `docker-compose-simple.yml`:
```yaml
ports:
  - "8080:80"  # Change 3000 to any port you want
```

### Environment Variables
```yaml
environment:
  - NODE_ENV=production
  - REACT_APP_API_URL=https://your-api.com
```

### Resource Limits
```yaml
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '1.0'
```

## 📊 Monitoring

### Health Check
```bash
# Check if app is healthy
curl http://localhost:3000/health

# Expected response: "healthy"
```

### Container Status
```bash
# View running containers
docker compose ps

# View resource usage
docker stats social-media-stats
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Change port in docker-compose.yml
   ports:
     - "3001:80"
   ```

2. **Build fails**:
   ```bash
   # Clean build
   docker compose build --no-cache
   ```

3. **Container won't start**:
   ```bash
   # Check logs
   docker compose logs social-media-stats
   
   # Check health
   docker compose ps
   ```

### Debug Commands
```bash
# View detailed logs
docker compose logs --tail=50 social-media-stats

# Enter container for debugging
docker compose exec social-media-stats sh

# Check nginx configuration
docker compose exec social-media-stats nginx -t
```

## 🚀 Production Deployment

### 1. Build Production Image
```bash
# Build optimized image
docker compose build

# Tag for registry
docker tag social-media-stats:latest your-registry/social-media-stats:latest
```

### 2. Deploy to Registry
```bash
# Push to Docker Hub
docker push your-registry/social-media-stats:latest

# Or push to private registry
docker push your-private-registry.com/social-media-stats:latest
```

### 3. Deploy to Server
```bash
# Pull and run on production server
docker pull your-registry/social-media-stats:latest
docker compose up -d
```

## 📁 File Structure

```
Stats_SocialMedia/
├── docker-compose.yml              # Full setup with nginx proxy
├── docker-compose-simple.yml       # Simple setup (recommended)
├── Dockerfile                      # Multi-stage build
├── nginx.conf                      # Nginx configuration
├── .dockerignore                   # Excluded files
├── install-docker-compose.sh       # Installation script
└── DOCKER_COMPOSE_GUIDE.md        # This guide
```

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start application |
| `docker compose down` | Stop application |
| `docker compose logs -f` | Follow logs |
| `docker compose ps` | Check status |
| `docker compose restart` | Restart application |
| `docker compose build` | Build image |
| `docker compose exec social-media-stats sh` | Enter container |

## 🔗 Useful Links

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Happy containerizing with Docker Compose! 🐳✨** 