#!/bin/bash

echo "🧪 Testing Social Media Stats Docker Image"
echo "=========================================="

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"

# Build the image locally
echo "🔨 Building Docker image locally..."
docker build -t social-media-stats:test .

if [ $? -eq 0 ]; then
    echo "✅ Image built successfully!"
else
    echo "❌ Failed to build image!"
    exit 1
fi

# Test the image
echo "🧪 Testing the image..."
docker run --rm -d --name test-container -p 3001:80 social-media-stats:test

if [ $? -eq 0 ]; then
    echo "✅ Container started successfully!"
    
    # Wait for container to be ready
    echo "⏳ Waiting for container to be ready..."
    sleep 10
    
    # Test health endpoint
    if curl -f http://localhost:3001/health &> /dev/null; then
        echo "✅ Health check passed!"
        echo "🌐 Application is running at: http://localhost:3001"
        echo ""
        echo "📋 Test commands:"
        echo "  View logs: docker logs test-container"
        echo "  Stop test: docker stop test-container"
        echo "  Remove test: docker rm test-container"
        echo ""
        echo "🎉 Ready to push to GitHub!"
        echo "   Run: git add . && git commit -m 'feat: ready for release' && git push origin main"
    else
        echo "❌ Health check failed!"
        docker logs test-container
        docker stop test-container
        exit 1
    fi
else
    echo "❌ Failed to start container!"
    exit 1
fi 