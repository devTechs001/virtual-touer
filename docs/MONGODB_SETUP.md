# MongoDB Setup Guide (2026)

This guide explains how to configure MongoDB with automatic fallback for development and production.

## Overview

The application uses an **intelligent connection fallback** system:

```
┌─────────────────────────────────────────────────────────┐
│                  Database Connection                     │
├─────────────────────────────────────────────────────────┤
│  1. MongoDB Atlas (Primary/Production)                  │
│     ↓ (if unavailable)                                  │
│  2. MongoDB Docker (Development)                        │
│     ↓ (if unavailable)                                  │
│  3. MongoDB Local/Compass (Fallback)                    │
└─────────────────────────────────────────────────────────┘
```

## Quick Setup

### Automated Setup (Recommended)

```bash
# Interactive setup script
npm run setup:mongodb

# Windows
npm run setup:mongodb:win
```

### Manual Setup

#### Option 1: Docker MongoDB

```bash
# Start MongoDB container
docker run -d \
  --name virtual-tourist-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  -e MONGO_INITDB_DATABASE=virtual-tourist \
  mongo:7

# Or using docker-compose
npm run docker:mongodb
```

**Connection String:**
```
mongodb://admin:admin123@localhost:27017/virtual-tourist?authSource=admin
```

#### Option 2: MongoDB Atlas

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0)
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string
6. Add to `.env`:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/virtual-tourist
USE_LOCAL_DB=false
```

#### Option 3: MongoDB Compass (Local)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Install and start MongoDB service
3. Connect to: `mongodb://localhost:27017`

**Connection String:**
```
mongodb://localhost:27017/virtual-tourist
```

## Configuration

### Environment Variables

Create `server/.env`:

```bash
# ============================================
# DATABASE CONFIGURATION
# ============================================

# MongoDB Atlas (Primary - Production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/virtual-tourist

# MongoDB Docker (Development)
MONGODB_URI_DOCKER=mongodb://admin:admin123@localhost:27017/virtual-tourist?authSource=admin

# MongoDB Local/Compass (Fallback)
MONGODB_URI_LOCAL=mongodb://localhost:27017/virtual-tourist

# Force local database (set to 'true' to skip Atlas)
USE_LOCAL_DB=true

# Database Name
MONGODB_DB_NAME=virtual-tourist
```

### Connection Manager Features

The `DatabaseManager` class (`server/config/db.js`) provides:

- ✅ Automatic failover between connection options
- ✅ Connection health monitoring (every 30 seconds)
- ✅ Automatic reconnection (up to 5 attempts)
- ✅ Connection pooling (5-10 connections)
- ✅ Graceful shutdown

## Usage

### Development

```bash
# Start with Docker MongoDB
npm run docker:mongodb
npm run dev

# Or force local MongoDB
USE_LOCAL_DB=true npm run server
```

### Production

```bash
# Use MongoDB Atlas
MONGODB_URI=mongodb+srv://... npm run start
```

## Managing MongoDB

### Docker Commands

```bash
# Start container
docker start virtual-tourist-mongodb

# Stop container
docker stop virtual-tourist-mongodb

# Remove container
docker rm -f virtual-tourist-mongodb

# View logs
docker logs virtual-tourist-mongodb

# Access MongoDB shell
docker exec -it virtual-tourist-mongodb mongosh -u admin -p admin123
```

### Docker Compose Commands

```bash
# Start MongoDB only
docker-compose up mongodb -d

# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f mongodb
```

## Database Operations

### Backup

```bash
# Using mongodump (Docker)
docker exec virtual-tourist-mongodb mongodump \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  --db virtual-tourist \
  --out /backup

# Copy backup to host
docker cp virtual-tourist-mongodb:/backup ./mongodb-backup-$(date +%Y%m%d)
```

### Restore

```bash
# Copy backup to container
docker cp ./mongodb-backup virtual-tourist-mongodb:/restore

# Restore using mongorestore
docker exec virtual-tourist-mongodb mongorestore \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  --db virtual-tourist \
  /restore
```

### Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://admin:admin123@localhost:27017`
3. Select database: `virtual-tourist`
4. Browse collections and documents

## Troubleshooting

### Connection Refused

```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Check port is open
netstat -an | grep 27017

# Restart container
docker restart virtual-tourist-mongodb
```

### Authentication Failed

```bash
# Verify credentials
docker exec virtual-tourist-mongodb mongosh \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  --eval "db.adminCommand('ping')"
```

### Database Not Found

```bash
# List databases
docker exec virtual-tourist-mongodb mongosh \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  --eval "show dbs"

# Create database (by inserting a document)
docker exec virtual-tourist-mongodb mongosh \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  virtual-tourist \
  --eval "db.test.insertOne({name: 'init'})"
```

## Performance Tips

### Indexes

Create indexes for better query performance:

```javascript
// In MongoDB Compass or shell
db.tours.createIndex({ title: "text" })
db.tours.createIndex({ location: "2dsphere" })
db.users.createIndex({ email: 1 }, { unique: true })
db.bookings.createIndex({ userId: 1, createdAt: -1 })
```

### Connection Pool

Adjust pool size in `server/config/db.js`:

```javascript
{
  maxPoolSize: 10,    // Max connections
  minPoolSize: 5,     // Min connections
  maxIdleTimeMS: 30000 // Close idle after 30s
}
```

## Security

### Production Checklist

- [ ] Use MongoDB Atlas (not local)
- [ ] Enable authentication
- [ ] Use strong passwords
- [ ] Restrict IP whitelist
- [ ] Enable encryption at rest
- [ ] Use SSL/TLS connections
- [ ] Regular backups
- [ ] Monitor connection logs

### Development Notes

- Default credentials: `admin` / `admin123`
- **Change these in production!**
- Never commit `.env` files

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Compass](https://docs.mongodb.com/compass/)
- [Docker MongoDB](https://hub.docker.com/_/mongo)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

**Last Updated**: March 2026  
**Version**: 2.0.0
