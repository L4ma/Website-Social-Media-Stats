#!/bin/bash

echo "🐳 Social Media Stats - Docker Compose Setup"
echo "============================================="

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
    echo "Docker Desktop includes Docker Compose automatically!"
    echo ""
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running."
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available."
    echo "Please make sure Docker Desktop is fully installed and running."
    exit 1
fi

echo "✅ Docker and Docker Compose are ready!"
echo ""

# Show available options
echo "🚀 Choose an option:"
echo "1. Start with simple setup (recommended)"
echo "2. Start with full setup (includes nginx proxy)"
echo "3. Build only (don't start)"
echo "4. Stop existing containers"
echo "5. View logs"
echo "6. Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "🔨 Building and starting with simple setup..."
        docker compose -f docker-compose-simple.yml up -d --build
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Application is running!"
            echo "📱 Open your browser and go to: http://localhost:3000"
            echo ""
            echo "📋 Useful commands:"
            echo "  - View logs: docker compose -f docker-compose-simple.yml logs -f"
            echo "  - Stop app: docker compose -f docker-compose-simple.yml down"
            echo "  - Restart: docker compose -f docker-compose-simple.yml restart"
            echo ""
        else
            echo "❌ Failed to start the application."
            echo "Check the logs with: docker compose -f docker-compose-simple.yml logs"
        fi
        ;;
    2)
        echo "🔨 Building and starting with full setup..."
        docker compose up -d --build
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Application is running!"
            echo "📱 Open your browser and go to: http://localhost:3000"
            echo ""
            echo "📋 Useful commands:"
            echo "  - View logs: docker compose logs -f"
            echo "  - Stop app: docker compose down"
            echo "  - Restart: docker compose restart"
            echo ""
        else
            echo "❌ Failed to start the application."
            echo "Check the logs with: docker compose logs"
        fi
        ;;
    3)
        echo "🔨 Building Docker image only..."
        docker compose -f docker-compose-simple.yml build
        
        if [ $? -eq 0 ]; then
            echo "✅ Docker image built successfully!"
            echo ""
            echo "📋 To start the application later:"
            echo "  docker compose -f docker-compose-simple.yml up -d"
        else
            echo "❌ Failed to build Docker image."
        fi
        ;;
    4)
        echo "🛑 Stopping containers..."
        docker compose -f docker-compose-simple.yml down
        docker compose down
        echo "✅ Containers stopped!"
        ;;
    5)
        echo "📋 Showing logs..."
        echo ""
        echo "Simple setup logs:"
        docker compose -f docker-compose-simple.yml logs --tail=20
        echo ""
        echo "Full setup logs:"
        docker compose logs --tail=20
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac 