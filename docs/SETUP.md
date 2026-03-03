# Virtual Tourist - Complete Setup Guide (2026)

This guide will help you set up the Virtual Tourist application for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 (v20 recommended)
- **npm** or **pnpm** (latest version)
- **Git** for version control
- **Docker** (optional, for MongoDB)
- **MongoDB Compass** (optional, for local database)

## Quick Setup (Recommended)

### Option 1: Automated Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/virtual-tourist.git
cd virtual-tourist

# Run automated setup (installs dependencies + sets up MongoDB)
npm run setup
```

### Option 2: Manual Setup

```bash
# 1. Clone and install
git clone https://github.com/yourusername/virtual-tourist.git
cd virtual-tourist
npm run install:all

# 2. Setup MongoDB (choose one method)
npm run setup:mongodb        # Interactive setup
npm run docker:mongodb       # Docker MongoDB
# Or manually configure MongoDB Atlas

# 3. Start development
npm run dev
```

## MongoDB Configuration

The application supports **automatic fallback** from MongoDB Atlas to local MongoDB:

### Connection Priority:
1. **MongoDB Atlas** (Production/Primary)
2. **MongoDB Docker** (Development)
3. **MongoDB Compass/Local** (Fallback)

### Setup Options:

#### Option A: Docker MongoDB (Recommended for Dev)

```bash
# Start MongoDB with Docker
npm run docker:mongodb

# Or using docker-compose directly
docker-compose up mongodb -d

# Connection: mongodb://admin:admin123@localhost:27017/virtual-tourist
```

#### Option B: MongoDB Atlas (Production)

1. Visit [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get connection string
4. Add to `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/virtual-tourist
   USE_LOCAL_DB=false
   ```

#### Option C: Local MongoDB (Compass)

1. Install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Start MongoDB service
3. Connection: `mongodb://localhost:27017/virtual-tourist`

## Environment Setup

### Server Environment

Create `server/.env`:

```bash
# Database (Auto-fallback configured)
MONGODB_URI_DOCKER=mongodb://admin:admin123@localhost:27017/virtual-tourist?authSource=admin
MONGODB_URI_LOCAL=mongodb://localhost:27017/virtual-tourist
USE_LOCAL_DB=true

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your-dev-secret-key-2026
```

### Client Environment

Create `client/.env`:

```bash
# API
VITE_API_URL=http://localhost:5000/api

# App
VITE_APP_NAME=Virtual Tourist
VITE_APP_URL=http://localhost:5173
```

## Running the Application

### Development Mode

```bash
# Start both client and server
npm run dev

# Or separately
npm run server    # Backend only (port 5000)
npm run client    # Frontend only (port 5173)
```

### With Docker

```bash
# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop all
npm run docker:down
```

## Access Points

| Service | URL | Port |
|---------|-----|------|
| Client (Dev) | http://localhost:5173 | 5173 |
| Server API | http://localhost:5000/api | 5000 |
| MongoDB | localhost:27017 | 27017 |

## Verify Installation

1. **Check MongoDB**: 
   ```bash
   docker ps | grep mongodb
   ```

2. **Check Server**: 
   Visit http://localhost:5000/health

3. **Check Client**: 
   Visit http://localhost:5173

## Common Issues

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Restart MongoDB container
docker restart virtual-tourist-mongodb

# Or use setup script
npm run setup:mongodb
```

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies Issues

```bash
# Clean and reinstall
npm run clean
npm run install:all
```

## Next Steps

- [View Features](FEATURES.md)
- [API Reference](API_REFERENCE.md)
- [Deployment Guide](DEPLOYMENT.md)

---

**Need Help?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or open an issue on GitHub.
