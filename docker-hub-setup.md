# 🐳 Docker Hub Setup Guide

This guide will help you set up automatic Docker image publishing to Docker Hub for your social media statistics application.

## 📋 Prerequisites

### 1. Docker Hub Account
- Create account at: https://hub.docker.com/
- Username: `l4ma` (or your preferred username)

### 2. GitHub Repository Secrets
Add these secrets to your GitHub repository:

1. Go to your repository: https://github.com/L4ma/Website-Social-Media-Stats
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

```
DOCKER_USERNAME=l4ma
DOCKER_PASSWORD=your-dockerhub-password-or-access-token
```

## 🚀 Quick Setup

### Step 1: Create Docker Hub Repository
1. Go to https://hub.docker.com/
2. Click **Create Repository**
3. Repository name: `social-media-stats`
4. Description: `Social Media Statistics Dashboard`
5. Visibility: **Public**
6. Click **Create**

### Step 2: Add Repository Description
Copy the content from `DOCKER_HUB_README.md` and paste it in the repository description on Docker Hub.

### Step 3: Enable GitHub Actions
1. Go to your GitHub repository
2. Click **Actions** tab
3. Enable workflows if prompted
4. The Docker publishing will start automatically on pushes to main branch

## 📊 Docker Hub Features

### ✅ Automatic Publishing
- **On Push to Main**: Publishes `latest` tag
- **On Tags**: Publishes version tags (v1.0.0, v1.1.0, etc.)
- **On PRs**: Publishes branch-specific tags

### ✅ Image Tags Available
```bash
# Latest stable
docker pull l4ma/social-media-stats:latest

# Specific version
docker pull l4ma/social-media-stats:v1.0.0

# Branch builds
docker pull l4ma/social-media-stats:main

# Commit-specific
docker pull l4ma/social-media-stats:sha-abc123
```

### ✅ Usage Examples for Users
```bash
# Simple run
docker run -d -p 3000:80 l4ma/social-media-stats:latest

# With custom port
docker run -d -p 8080:80 l4ma/social-media-stats:latest

# With Docker Compose
docker compose up -d
```

## 🔧 Configuration

### GitHub Actions Workflow
The workflow in `.github/workflows/docker-publish.yml` will:

1. **Build** the Docker image
2. **Test** the image functionality
3. **Push** to Docker Hub with appropriate tags
4. **Verify** the published image

### Docker Hub Repository Settings
1. **Description**: Copy from `DOCKER_HUB_README.md`
2. **Full Description**: Add detailed usage instructions
3. **Tags**: Automatic from GitHub Actions
4. **Builds**: Automatic from GitHub repository

## 📈 Monitoring

### Docker Hub Statistics
- **Downloads**: Tracked automatically
- **Stars**: Community rating
- **Pulls**: Usage statistics
- **Build Status**: Automated CI/CD

### GitHub Actions Status
- **Build Status**: Check Actions tab
- **Publish Status**: Automatic on main branch
- **Test Results**: Health check verification

## 🛠️ Manual Publishing

### Build and Push Manually
```bash
# Login to Docker Hub
docker login

# Build the image
docker build -t l4ma/social-media-stats:latest .

# Push to Docker Hub
docker push l4ma/social-media-stats:latest

# Tag and push specific version
docker tag l4ma/social-media-stats:latest l4ma/social-media-stats:v1.0.0
docker push l4ma/social-media-stats:v1.0.0
```

### Test Published Image
```bash
# Pull and test
docker pull l4ma/social-media-stats:latest
docker run --rm l4ma/social-media-stats:latest wget --quiet --tries=1 --spider http://localhost/health

# Run locally
docker run -d -p 3000:80 l4ma/social-media-stats:latest
curl http://localhost:3000/health
```

## 📝 Repository Management

### Docker Hub Repository Settings
1. **General Settings**:
   - Repository name: `social-media-stats`
   - Description: Copy from `DOCKER_HUB_README.md`
   - Visibility: Public

2. **Build Settings**:
   - Source: GitHub
   - Repository: `L4ma/Website-Social-Media-Stats`
   - Branch: `main`
   - Dockerfile path: `./Dockerfile`

3. **Collaborators** (optional):
   - Add team members for maintenance
   - Set appropriate permissions

### GitHub Repository Settings
1. **Secrets**:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

2. **Actions**:
   - Enable GitHub Actions
   - Allow actions to create and approve pull requests

## 🔒 Security

### Access Token (Recommended)
Instead of using your Docker Hub password:

1. Go to Docker Hub → Account Settings → Security
2. Click **New Access Token**
3. Name: `github-actions`
4. Permissions: Read & Write
5. Copy the token and use it as `DOCKER_PASSWORD`

### Repository Security
- **Public Repository**: Anyone can pull images
- **Private Repository**: Requires authentication
- **Rate Limits**: Docker Hub has pull rate limits for free accounts

## 📊 Analytics

### Docker Hub Analytics
- **Pull Statistics**: Track usage
- **Geographic Data**: Where images are pulled from
- **Version Usage**: Which tags are most popular

### GitHub Analytics
- **Repository Views**: Track repository popularity
- **Clone Statistics**: Development activity
- **Star History**: Community engagement

## 🚀 Next Steps

### 1. First Publication
```bash
# Push to main branch to trigger first publish
git add .
git commit -m "feat: initial Docker Hub setup"
git push origin main
```

### 2. Verify Publication
1. Check GitHub Actions: https://github.com/L4ma/Website-Social-Media-Stats/actions
2. Check Docker Hub: https://hub.docker.com/r/l4ma/social-media-stats
3. Test the published image locally

### 3. Community Engagement
- **Documentation**: Keep README updated
- **Issues**: Respond to user questions
- **Stars**: Encourage community engagement
- **Discussions**: Use Docker Hub discussions

## 📞 Support

### For Users
- **Docker Hub**: Use the discussions tab
- **GitHub Issues**: Technical support
- **Documentation**: README and guides

### For Maintainers
- **GitHub Actions**: Monitor build status
- **Docker Hub**: Manage repository settings
- **Analytics**: Track usage and engagement

---

**Your Docker Hub repository is ready for automatic publishing! 🐳✨**

Once you push to the main branch, your Docker image will be automatically published and available for users worldwide. 