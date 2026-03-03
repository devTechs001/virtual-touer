# Database Configuration
# MongoDB Atlas (Primary) + MongoDB Compass (Fallback)

## 🌐 MongoDB Atlas - Primary Database

### Setup Instructions

1. **Create MongoDB Atlas Account**
   - Go to https://cloud.mongodb.com
   - Sign up for free tier (M0 Sandbox - 512MB)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create"

3. **Configure Access**
   - **Database User**: Create username/password
   - **Network Access**: Add IP 0.0.0.0/0 (allow from anywhere) for development

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Connection String Format

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/virtual-tourist?retryWrites=true&w=majority
```

### Environment Variables (.env)

```env
# MongoDB Atlas (Primary)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/virtual-tourist?retryWrites=true&w=majority
MONGODB_DB_NAME=virtual-tourist

# Fallback to local MongoDB (Compass)
MONGODB_URI_LOCAL=mongodb://localhost:27017/virtual-tourist

# Use local DB if Atlas fails
USE_LOCAL_DB=false
```

---

## 🧭 MongoDB Compass - Fallback/Local Database

### Installation

1. **Download MongoDB Compass**
   - https://www.mongodb.com/products/compass
   - Available for Windows, Mac, Linux

2. **Install MongoDB Server (for local development)**
   - https://www.mongodb.com/try/download/community
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

### Connection Steps

1. **Open MongoDB Compass**
2. **Enter Connection String**
   ```
   mongodb://localhost:27017
   ```
3. **Click Connect**
4. **Create Database**
   - Click "Create Database"
   - Database Name: `virtual-tourist`
   - Collection: `users`, `tours`, `destinations`, `bookings`, etc.

### Seed Local Database

```bash
cd server
pnpm run seed:all
```

---

## 🔄 Connection Fallback Logic

The application uses this connection strategy:

```javascript
// server/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Try Atlas first (Primary)
    if (process.env.MONGODB_URI && process.env.USE_LOCAL_DB !== 'true') {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return;
    }
  } catch (error) {
    console.warn('⚠️  Atlas connection failed, trying local MongoDB...');
  }

  try {
    // Fallback to local MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI_LOCAL);
    console.log(`✅ MongoDB Local Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 📊 Database Collections

### Collections to Create

1. **users** - User accounts and profiles
2. **tours** - Virtual tour data
3. **destinations** - Destination information
4. **bookings** - Tour bookings
5. **reviews** - Tour reviews
6. **favorites** - User favorite tours
7. **comments** - Tour comments
8. **notifications** - User notifications

### Import Sample Data

```bash
# Seed all data
cd server
pnpm run seed:all

# This creates:
# - 3 users (Admin, John, Demo)
# - 54 destinations
# - 30 tours
```

---

## 🔐 Security Best Practices

### Production (.env)
```env
# NEVER commit .env to git
MONGODB_URI=mongodb+srv://user:secure-password@cluster.mongodb.net/db
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

### Development (.env.local)
```env
MONGODB_URI_LOCAL=mongodb://localhost:27017/virtual-tourist
JWT_SECRET=dev-secret-key
NODE_ENV=development
```

### .gitignore
```
# Environment variables
.env
.env.local
.env.production
.env.test

# MongoDB
*.log
mongod.lock
```

---

## 🚀 Deployment Connection Strings

### Render
```env
# In Render Dashboard > Environment Variables
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/virtual-tourist
```

### Netlify
```env
# In Netlify Site Settings > Build & Deploy > Environment
VITE_API_URL=https://your-backend.onrender.com/api
```

### Vercel
```env
# In Vercel Project Settings > Environment Variables
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/virtual-tourist
```

---

## 📈 Monitoring

### Atlas Monitoring
1. Go to Atlas Dashboard
2. Click "Metrics" to see:
   - Connections
   - Operations
   - Scan throughput
   - Cache usage

### Compass Monitoring
1. Open Compass
2. Click on database
3. View collection stats
4. Monitor indexes

---

## 🛠️ Troubleshooting

### Connection Issues

**Atlas Connection Fails:**
```bash
# Check network access
# Atlas > Network Access > Add IP 0.0.0.0/0

# Verify credentials
# Atlas > Database Access > Reset password
```

**Local MongoDB Fails:**
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Start MongoDB
docker start mongodb

# Or install locally
# https://www.mongodb.com/try/download/community
```

### Switch to Local DB

```env
# In .env
USE_LOCAL_DB=true
MONGODB_URI_LOCAL=mongodb://localhost:27017/virtual-tourist
```

---

## 📝 Quick Start

1. **Setup Atlas (Primary)**
   ```
   - Create account at cloud.mongodb.com
   - Create free cluster
   - Get connection string
   - Add to .env as MONGODB_URI
   ```

2. **Setup Compass (Fallback)**
   ```
   - Install MongoDB Compass
   - Install MongoDB locally or use Docker
   - Connect to mongodb://localhost:27017
   - Create database: virtual-tourist
   - Run: pnpm run seed:all
   ```

3. **Test Connection**
   ```bash
   cd server
   pnpm run seed:all
   # Should see: ✅ MongoDB Connected
   ```

---

## 🎯 Configuration Summary

| Environment | Database | Connection |
|-------------|----------|------------|
| Production | MongoDB Atlas | `MONGODB_URI` |
| Development | MongoDB Atlas | `MONGODB_URI` |
| Local Dev | MongoDB Compass | `MONGODB_URI_LOCAL` |
| Fallback | MongoDB Compass | Auto-switch on failure |
