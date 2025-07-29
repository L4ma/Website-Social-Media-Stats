# Social Media Stats - Docker Setup

This document explains how to run the Social Media Statistics application using Docker.

## 🐳 Quick Start

### Option 1: Simple Docker Run

```bash
# Build the image
docker build -t social-media-stats .

# Run the container
docker run -d -p 3000:80 --name social-media-stats social-media-stats

# Access the application
open http://localhost:3000
```

### Option 2: Using Docker Compose (Recommended)

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Option 3: With Reverse Proxy (Production)

```bash
# Start with nginx proxy for SSL termination
docker-compose --profile proxy up -d

# Access via HTTPS (if SSL certificates are configured)
open https://localhost
```

## 🔧 Configuration

### Environment Variables

You can set environment variables in the `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - REACT_APP_API_URL=https://your-api.com
```

### Port Configuration

- **Default**: Application runs on port 3000
- **Custom**: Change the port mapping in `docker-compose.yml`:
  ```yaml
  ports:
    - "8080:80"  # Access on port 8080
  ```

### SSL/HTTPS Setup

1. **Generate SSL certificates**:
   ```bash
   mkdir ssl
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout ssl/key.pem -out ssl/cert.pem
   ```

2. **Uncomment SSL lines** in `nginx-proxy.conf`:
   ```nginx
   ssl_certificate /etc/nginx/ssl/cert.pem;
   ssl_certificate_key /etc/nginx/ssl/key.pem;
   ```

3. **Start with proxy**:
   ```bash
   docker-compose --profile proxy up -d
   ```

## 📊 Monitoring

### Health Check

The application includes a health check endpoint:

```bash
# Check if the application is running
curl http://localhost:3000/health

# Expected response: "healthy"
```

### Logs

```bash
# View application logs
docker-compose logs social-media-stats

# Follow logs in real-time
docker-compose logs -f social-media-stats

# View nginx logs
docker-compose logs nginx-proxy
```

### Container Status

```bash
# Check container status
docker-compose ps

# View resource usage
docker stats social-media-stats
```

## 🚀 Production Deployment

### 1. Build Production Image

```bash
# Build optimized production image
docker build -t social-media-stats:latest .

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
docker run -d -p 80:80 --name social-media-stats your-registry/social-media-stats:latest
```

## 🔒 Security Considerations

### Security Headers

The nginx configuration includes security headers:
- `X-Frame-Options`: Prevents clickjacking
- `X-XSS-Protection`: XSS protection
- `X-Content-Type-Options`: Prevents MIME sniffing
- `Content-Security-Policy`: Content security policy

### Container Security

```bash
# Run with non-root user (optional)
docker run -u 1000:1000 -p 3000:80 social-media-stats

# Limit container resources
docker run --memory=512m --cpus=1 -p 3000:80 social-media-stats
```

## 🛠️ Development

### Development Mode

For development, you can run the application directly:

```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Docker Development

```bash
# Build development image
docker build -t social-media-stats:dev --target builder .

# Run with volume mounting for hot reload
docker run -v $(pwd):/app -p 3000:3000 social-media-stats:dev npm start
```

## 📝 Troubleshooting

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
   docker-compose build --no-cache
   ```

3. **Container won't start**:
   ```bash
   # Check logs
   docker-compose logs social-media-stats
   
   # Check health
   docker-compose ps
   ```

### Debug Commands

```bash
# Enter container shell
docker exec -it social-media-stats sh

# Check nginx configuration
docker exec social-media-stats nginx -t

# View nginx logs
docker exec social-media-stats tail -f /var/log/nginx/error.log
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [React Production Build](https://create-react-app.dev/docs/production-build/)

## 🤝 Contributing

When contributing to the Docker setup:

1. Test your changes locally
2. Update the documentation
3. Ensure backward compatibility
4. Add appropriate labels and descriptions

---

**Happy containerizing! 🐳✨** 