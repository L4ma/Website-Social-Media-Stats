#!/bin/bash

echo "🐳 Social Media Stats - Docker Compose Setup"
echo "=============================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    echo "Docker Compose comes included with Docker Desktop."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running."
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not available."
    echo "Please ensure Docker Desktop is fully installed."
    exit 1
fi

echo "✅ Docker and Docker Compose are ready!"

# Function to test the image
test_image() {
    echo "🧪 Testing Docker image..."
    if docker pull ghcr.io/l4ma/website-social-media-stats:latest; then
        echo "✅ Image pulled successfully!"
        if docker run --rm ghcr.io/l4ma/website-social-media-stats:latest wget --quiet --tries=1 --spider http://localhost/health; then
            echo "✅ Image test passed!"
            return 0
        else
            echo "❌ Image test failed!"
            return 1
        fi
    else
        echo "❌ Failed to pull image!"
        return 1
    fi
}

echo ""
echo "🚀 Choose an option:"
echo "1. Start with simple setup (recommended)"
echo "2. Start with full setup (includes nginx proxy)"
echo "3. Build only (don't start)"
echo "4. Stop existing containers"
echo "5. View logs"
echo "6. Test image"
echo "7. Exit"

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo "🚀 Starting with simple setup..."
        echo "📦 Pulling image from GitHub Container Registry..."
        
        if test_image; then
            echo "🔄 Starting containers..."
            docker compose -f docker-compose-simple.yml up -d --build
            
            if [ $? -eq 0 ]; then
                echo "✅ Application started successfully!"
                echo "🌐 Access your application at: http://localhost:3000"
                echo ""
                echo "📋 Useful commands:"
                echo "  View logs: docker compose -f docker-compose-simple.yml logs -f"
                echo "  Stop app:  docker compose -f docker-compose-simple.yml down"
                echo "  Restart:   docker compose -f docker-compose-simple.yml restart"
            else
                echo "❌ Failed to start containers!"
            fi
        else
            echo "❌ Cannot start without a working image!"
        fi
        ;;
    2)
        echo "🚀 Starting with full setup (nginx proxy)..."
        echo "📦 Pulling image from GitHub Container Registry..."
        
        if test_image; then
            echo "🔄 Starting containers with nginx proxy..."
            docker compose up -d --build
            
            if [ $? -eq 0 ]; then
                echo "✅ Application started successfully!"
                echo "🌐 Access your application at: http://localhost:3000"
                echo "🔒 Nginx proxy is also running"
                echo ""
                echo "📋 Useful commands:"
                echo "  View logs: docker compose logs -f"
                echo "  Stop app:  docker compose down"
                echo "  Restart:   docker compose restart"
            else
                echo "❌ Failed to start containers!"
            fi
        else
            echo "❌ Cannot start without a working image!"
        fi
        ;;
    3)
        echo "🔨 Building only..."
        docker compose -f docker-compose-simple.yml build
        echo "✅ Build completed!"
        ;;
    4)
        echo "🛑 Stopping existing containers..."
        docker compose -f docker-compose-simple.yml down 2>/dev/null
        docker compose down 2>/dev/null
        echo "✅ Containers stopped!"
        ;;
    5)
        echo "📋 Viewing logs..."
        echo "Choose log source:"
        echo "1. Simple setup logs"
        echo "2. Full setup logs"
        read -p "Enter choice (1-2): " log_choice
        
        case $log_choice in
            1) docker compose -f docker-compose-simple.yml logs -f ;;
            2) docker compose logs -f ;;
            *) echo "Invalid choice!" ;;
        esac
        ;;
    6)
        echo "🧪 Testing Docker image..."
        test_image
        ;;
    7)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "📚 For more information, check:"
echo "  - README.md"
echo "  - DOCKER_COMPOSE_GUIDE.md"
echo "  - GitHub: https://github.com/L4ma/Website-Social-Media-Stats" 