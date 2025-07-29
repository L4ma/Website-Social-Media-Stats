#!/bin/bash

echo "🐳 Social Media Stats - Docker Setup"
echo "====================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    echo ""
    echo "📦 Installing Docker Desktop for macOS..."
    echo ""
    echo "Please follow these steps:"
    echo "1. Visit: https://www.docker.com/products/docker-desktop"
    echo "2. Download Docker Desktop for Mac"
    echo "3. Install and start Docker Desktop"
    echo "4. Run this script again"
    echo ""
    echo "Alternatively, you can install Docker via Homebrew:"
    echo "brew install --cask docker"
    echo ""
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running."
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is installed and running!"
echo ""

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t social-media-stats .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo ""
    
    # Ask user if they want to run the container
    read -p "🚀 Do you want to start the application now? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Starting the application..."
        docker-compose up -d
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Application is running!"
            echo "📱 Open your browser and go to: http://localhost:3000"
            echo ""
            echo "📋 Useful commands:"
            echo "  - View logs: docker-compose logs -f"
            echo "  - Stop app: docker-compose down"
            echo "  - Restart: docker-compose restart"
            echo ""
        else
            echo "❌ Failed to start the application."
            echo "Check the logs with: docker-compose logs"
        fi
    else
        echo ""
        echo "📋 To start the application later, run:"
        echo "  docker-compose up -d"
        echo ""
        echo "📋 To stop the application:"
        echo "  docker-compose down"
    fi
else
    echo "❌ Failed to build Docker image."
    echo "Check the error messages above."
    exit 1
fi 