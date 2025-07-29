# Contributing to Social Media Stats

Thank you for your interest in contributing to the Social Media Statistics Dashboard! This document provides guidelines for contributing to the project.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional, for testing)

### Development Setup
```bash
# Clone the repository
git clone https://github.com/L4ma/Website-Social-Media-Stats.git
cd Website-Social-Media-Stats

# Install dependencies
npm install

# Start development server
npm start
```

### Docker Development
```bash
# Build and run with Docker
docker compose -f docker-compose-simple.yml up -d

# Or use the interactive script
./install-docker-compose.sh
```

## 📋 Contribution Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build/tooling changes

### Pull Request Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Update documentation if needed
7. Submit a pull request

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Docker Testing
```bash
# Test Docker build
docker build -t social-media-stats-test .

# Test Docker Compose
docker compose -f docker-compose-simple.yml up -d
docker compose -f docker-compose-simple.yml logs
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── StatsOverview.tsx
│   ├── YouTubeStats.tsx
│   ├── InstagramStats.tsx
│   └── Settings.tsx
├── services/           # API services
│   ├── youtubeService.ts
│   ├── instagramService.ts
│   └── dataCollectionService.ts
├── utils/              # Utility functions
│   └── chartDataUtils.ts
└── App.tsx            # Main application
```

## 🔧 Development Workflow

### Adding New Features
1. Create a new branch from `main`
2. Implement the feature
3. Add tests
4. Update documentation
5. Submit PR

### Bug Fixes
1. Create a new branch from `main`
2. Fix the bug
3. Add regression tests
4. Update documentation if needed
5. Submit PR

### Platform Integration
1. Create service file in `src/services/`
2. Add configuration component in `src/components/`
3. Add stats component in `src/components/`
4. Update overview component
5. Add to navigation in `App.tsx`

## 🐳 Docker Development

### Local Docker Development
```bash
# Build development image
docker build -t social-media-stats:dev --target builder .

# Run with volume mounting
docker run -v $(pwd):/app -p 3000:3000 social-media-stats:dev npm start
```

### Production Testing
```bash
# Build production image
docker build -t social-media-stats:prod .

# Test production build
docker run -d -p 3000:80 social-media-stats:prod

# Test health check
curl http://localhost:3000/health
```

## 📚 Documentation

### Updating Documentation
- Update README.md for major changes
- Update component documentation
- Update API documentation
- Update Docker documentation

### Documentation Standards
- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep documentation up to date

## 🚨 Reporting Issues

### Before Reporting
- Check existing issues
- Test with latest version
- Try Docker setup if applicable
- Check browser console for errors

### Issue Template
Use the provided issue templates:
- Bug Report: `.github/ISSUE_TEMPLATE/bug_report.md`
- Feature Request: `.github/ISSUE_TEMPLATE/feature_request.md`

## 🤝 Community Guidelines

### Be Respectful
- Be kind and respectful to others
- Use inclusive language
- Welcome newcomers
- Give constructive feedback

### Communication
- Use GitHub Issues for bugs and features
- Use GitHub Discussions for questions
- Be clear and specific in communications
- Provide context and examples

## 📈 Performance Guidelines

### Code Performance
- Optimize bundle size
- Use React.memo for expensive components
- Implement proper loading states
- Cache API responses appropriately

### Docker Performance
- Use multi-stage builds
- Optimize Dockerfile layers
- Use .dockerignore effectively
- Minimize image size

## 🔒 Security Guidelines

### Code Security
- Never commit API keys or secrets
- Use environment variables for configuration
- Validate user inputs
- Follow OWASP guidelines

### Docker Security
- Use non-root users when possible
- Scan images for vulnerabilities
- Keep base images updated
- Use specific image tags

## 📝 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🎉**

For questions or support, please open an issue or start a discussion. 