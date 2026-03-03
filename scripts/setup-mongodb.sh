#!/bin/bash

# MongoDB Setup Script for Development
# This script helps you set up MongoDB for local development

set -e

echo "========================================"
echo "  MongoDB Setup for Virtual Tourist"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
check_docker() {
    if command -v docker &> /dev/null; then
        echo -e "${GREEN}✓${NC} Docker is installed"
        return 0
    else
        echo -e "${YELLOW}✗${NC} Docker is not installed"
        return 1
    fi
}

# Check if Docker Compose is installed
check_docker_compose() {
    if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
        echo -e "${GREEN}✓${NC} Docker Compose is installed"
        return 0
    else
        echo -e "${YELLOW}✗${NC} Docker Compose is not installed"
        return 1
    fi
}

# Check if MongoDB is running locally
check_mongodb_local() {
    if command -v mongosh &> /dev/null; then
        if mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
            echo -e "${GREEN}✓${NC} MongoDB is running locally"
            return 0
        fi
    fi
    echo -e "${YELLOW}✗${NC} MongoDB is not running locally"
    return 1
}

# Setup MongoDB with Docker
setup_docker_mongodb() {
    echo ""
    echo -e "${BLUE}Setting up MongoDB with Docker...${NC}"
    echo ""

    # Check if container already exists
    if docker ps -a --format '{{.Names}}' | grep -q "virtual-tourist-mongodb"; then
        echo -e "${YELLOW}!${NC} MongoDB container already exists"
        read -p "Do you want to remove and recreate it? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker rm -f virtual-tourist-mongodb
        else
            echo "Starting existing container..."
            docker start virtual-tourist-mongodb
            return 0
        fi
    fi

    # Create and start MongoDB container
    echo "Creating MongoDB container..."
    docker run -d \
        --name virtual-tourist-mongodb \
        -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
        -e MONGO_INITDB_DATABASE=virtual-tourist \
        -v virtual-tourist-mongodb-data:/data/db \
        mongo:7

    echo ""
    echo -e "${GREEN}✓${NC} MongoDB container started!"
    echo ""
    echo "Connection details:"
    echo "  URI: mongodb://admin:admin123@localhost:27017/virtual-tourist"
    echo "  Host: localhost"
    echo "  Port: 27017"
    echo "  Database: virtual-tourist"
    echo "  Username: admin"
    echo "  Password: admin123"
    echo ""
}

# Create .env file
create_env_file() {
    echo -e "${BLUE}Creating .env file...${NC}"
    
    if [ -f "server/.env" ]; then
        echo -e "${YELLOW}!${NC} server/.env already exists, creating backup..."
        cp server/.env server/.env.backup.$(date +%Y%m%d_%H%M%S)
    fi

    cat > server/.env << 'EOF'
# ============================================
# DATABASE CONFIGURATION - 2026
# ============================================

# MongoDB Local (Docker) - Primary for Development
MONGODB_URI_DOCKER=mongodb://admin:admin123@localhost:27017/virtual-tourist?authSource=admin

# MongoDB Local (Compass/Standalone) - Fallback
MONGODB_URI_LOCAL=mongodb://localhost:27017/virtual-tourist

# MongoDB Atlas (Production) - Add your Atlas URI here
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/virtual-tourist

# Force local database (set to 'true' to skip Atlas)
USE_LOCAL_DB=true

# Database Name
MONGODB_DB_NAME=virtual-tourist

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# ============================================
# AUTHENTICATION
# ============================================
JWT_SECRET=virtual-tourist-dev-secret-key-2026-change-in-production
JWT_EXPIRE=30d
COOKIE_EXPIRE=30

# ============================================
# CORS
# ============================================
CORS_ORIGIN=http://localhost:5173

# ============================================
# RATE LIMITING (Development - Relaxed)
# ============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=debug
EOF

    echo -e "${GREEN}✓${NC} server/.env created"
    echo ""
}

# Create client .env file
create_client_env() {
    echo -e "${BLUE}Creating client .env file...${NC}"
    
    if [ -f "client/.env" ]; then
        echo -e "${YELLOW}!${NC} client/.env already exists, creating backup..."
        cp client/.env client/.env.backup.$(date +%Y%m%d_%H%M%S)
    fi

    cat > client/.env << 'EOF'
# ============================================
# API CONFIGURATION - 2026
# ============================================
VITE_API_URL=http://localhost:5000/api

# ============================================
# APP CONFIGURATION
# ============================================
VITE_APP_NAME=Virtual Tourist
VITE_APP_DESCRIPTION=Explore the world with 360° virtual tours
VITE_APP_URL=http://localhost:5173

# ============================================
# FEATURE FLAGS
# ============================================
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
EOF

    echo -e "${GREEN}✓${NC} client/.env created"
    echo ""
}

# Wait for MongoDB to be ready
wait_for_mongodb() {
    echo -e "${BLUE}Waiting for MongoDB to be ready...${NC}"
    
    for i in {1..30}; do
        if docker exec virtual-tourist-mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
            echo -e "${GREEN}✓${NC} MongoDB is ready!"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    
    echo ""
    echo -e "${RED}✗${NC} MongoDB did not start in time"
    return 1
}

# Show connection info
show_connection_info() {
    echo ""
    echo "========================================"
    echo "  MongoDB Connection Information"
    echo "========================================"
    echo ""
    echo -e "${GREEN}✓${NC} MongoDB is ready to use!"
    echo ""
    echo "Connection Strings:"
    echo "  Docker:  mongodb://admin:admin123@localhost:27017/virtual-tourist"
    echo "  Local:   mongodb://localhost:27017/virtual-tourist"
    echo ""
    echo "MongoDB Compass:"
    echo "  Connection String: mongodb://admin:admin123@localhost:27017"
    echo ""
    echo "Commands:"
    echo "  Start:   docker start virtual-tourist-mongodb"
    echo "  Stop:    docker stop virtual-tourist-mongodb"
    echo "  Remove:  docker rm -f virtual-tourist-mongodb"
    echo ""
    echo "Using Docker Compose:"
    echo "  Start:   docker-compose up mongodb"
    echo "  Stop:    docker-compose down"
    echo ""
    echo "========================================"
    echo ""
}

# Main setup function
main() {
    echo "Checking prerequisites..."
    echo ""
    
    check_docker
    check_docker_compose
    
    echo ""
    
    # Ask for setup method
    echo "Select setup method:"
    echo "  1) Docker MongoDB (Recommended)"
    echo "  2) Local MongoDB (Compass)"
    echo "  3) MongoDB Atlas (Cloud)"
    echo ""
    read -p "Enter choice (1-3): " setup_choice
    
    case $setup_choice in
        1)
            setup_docker_mongodb
            wait_for_mongodb
            create_env_file
            create_client_env
            show_connection_info
            ;;
        2)
            if check_mongodb_local; then
                create_env_file
                create_client_env
                echo ""
                echo -e "${GREEN}✓${NC} Local MongoDB configured!"
                echo ""
                echo "Connection: mongodb://localhost:27017/virtual-tourist"
            else
                echo ""
                echo -e "${YELLOW}!${NC} Local MongoDB is not running"
                echo ""
                echo "Please install and start MongoDB first:"
                echo "  1. Install MongoDB: https://www.mongodb.com/try/download/community"
                echo "  2. Or use Docker: Select option 1"
                echo ""
                exit 1
            fi
            ;;
        3)
            echo ""
            echo "To use MongoDB Atlas:"
            echo "  1. Visit https://cloud.mongodb.com"
            echo "  2. Create a free cluster"
            echo "  3. Get connection string"
            echo "  4. Add to server/.env: MONGODB_URI=your-connection-string"
            echo ""
            create_env_file
            create_client_env
            echo ""
            echo -e "${YELLOW}!${NC} Remember to add your Atlas URI to server/.env"
            ;;
        *)
            echo -e "${RED}✗${NC} Invalid choice"
            exit 1
            ;;
    esac
    
    echo -e "${GREEN}✓${NC} Setup complete!"
    echo ""
    echo "Next steps:"
    echo "  1. cd server && npm run dev"
    echo "  2. cd client && npm run dev"
    echo ""
}

# Run main function
main
