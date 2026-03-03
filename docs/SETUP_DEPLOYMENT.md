# 🚀 Virtual Tourist - Complete Setup & Deployment Guide (2026)

> **Version 2.0.0** | Everything you need to know to set up, run, and deploy

**Repository**: [devTechs001/world-tourist-virtual](https://github.com/devTechs001/world-tourist-virtual)

**Live Demo**: https://devtechs001.github.io/world-tourist-virtual/

---

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [MongoDB Setup](#mongodb-setup)
3. [Environment Configuration](#environment-configuration)
4. [Security](#security)
5. [Development](#development)
6. [Deployment](#deployment)
7. [Documentation](#documentation)
8. [Troubleshooting](#troubleshooting)

---

## 🏃 Quick Start

### One-Command Setup

```bash
# Clone repository
git clone https://github.com/yourusername/virtual-tourist.git
cd virtual-tourist

# Run complete setup (installs deps + sets up MongoDB)
npm run setup
```

### Manual Setup

```bash
# 1. Install all dependencies
npm run install:all

# 2. Setup MongoDB
npm run setup:mongodb

# 3. Start development
npm run dev
```

### Access Points

| Service | URL | Port |
|---------|-----|------|
| Client | http://localhost:5173 | 5173 |
| Server API | http://localhost:5000/api | 5000 |
| MongoDB | localhost:27017 | 27017 |

---

## 🗄️ MongoDB Setup

### Connection Fallback System

The app automatically tries:
1. **MongoDB Atlas** (Production)
2. **MongoDB Docker** (Development)
3. **MongoDB Local/Compass** (Fallback)

### Setup Options

#### Option 1: Docker (Recommended)

```bash
# Start MongoDB container
npm run docker:mongodb

# Or manually
docker run -d \
  --name virtual-tourist-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  -e MONGO_INITDB_DATABASE=virtual-tourist \
  mongo:7
```

**Connection String**: `mongodb://admin:admin123@localhost:27017/virtual-tourist`

#### Option 2: MongoDB Atlas

1. Visit [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free cluster
3. Get connection string
4. Add to `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/virtual-tourist
   USE_LOCAL_DB=false
   ```

#### Option 3: Local MongoDB

1. Install [MongoDB Compass](https://mongodb.com/products/compass)
2. Start MongoDB service
3. Connection: `mongodb://localhost:27017/virtual-tourist`

---

## 🔐 Environment Configuration

### Server (.env)

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
JWT_SECRET=your-dev-secret-key-2026-change-in-production
JWT_EXPIRE=30d

# CORS
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### Client (.env)

Create `client/.env`:

```bash
# API
VITE_API_URL=http://localhost:5000/api

# App
VITE_APP_NAME=Virtual Tourist
VITE_APP_URL=http://localhost:5173

# Features
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
```

### ⚠️ Security Warning

**NEVER commit .env files!**

```bash
# ✅ Safe to commit
.env.example

# ❌ NEVER commit
.env
.env.local
.env.production
```

The `.gitignore` is configured to block all secret files.

---

## 🛡️ Security

### What's Protected

The `.gitignore` blocks:
- ✅ All `.env` files
- ✅ Key files (`*.pem`, `*.key`, `*.crt`)
- ✅ Credential files
- ✅ Service account JSON
- ✅ AWS/Azure/GCP credentials
- ✅ Database connection strings with passwords

### Best Practices

1. **Use environment variables** in production
2. **Never hardcode secrets** in code
3. **Use GitHub Secrets** for CI/CD
4. **Rotate secrets** regularly
5. **Use secret managers** (AWS Secrets Manager, Doppler, etc.)

### Check for Accidental Commits

```bash
# Before pushing
git diff --cached | grep -i "password\|secret\|key\|token"

# Scan repository
trufflehog .
```

See [docs/SECURITY.md](docs/SECURITY.md) for complete guide.

---

## 💻 Development

### Commands

```bash
# Start both client and server
npm run dev

# Start separately
npm run server    # Backend only
npm run client    # Frontend only

# With Docker MongoDB
npm run docker:mongodb && npm run dev

# Build production
npm run build

# Run tests
npm test
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down

# Start MongoDB only
docker-compose up mongodb -d
```

---

## 🚀 Deployment

### Option 1: Netlify + Render (Recommended)

#### Frontend (Netlify)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Configuration**: `netlify.toml` (already configured)

#### Backend (Render)

1. Push to GitHub
2. Import in Render dashboard
3. Connect `render.yaml`
4. Deploy automatically

**Configuration**: `render.yaml` (already configured)

### Option 2: GitHub Pages

Frontend only, backend on Render/Railway.

```bash
# Already configured in .github/workflows/
# Just push to main branch
git push origin main
```

**Guide**: See [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md)

### Option 3: Docker (Full Stack)

```bash
# Production deployment
docker-compose -f docker-compose.yml up -d
```

### Deployment Checklist

- [ ] MongoDB configured (Atlas or other)
- [ ] Environment variables set
- [ ] Secrets NOT committed
- [ ] CORS configured for production URL
- [ ] API URL updated in client
- [ ] Build successful locally
- [ ] Domain configured (if using custom)

---

## 📚 Documentation

Complete documentation in `/docs`:

| Document | Description |
|----------|-------------|
| [SETUP.md](docs/SETUP.md) | Complete setup guide |
| [MONGODB_SETUP.md](docs/MONGODB_SETUP.md) | MongoDB configuration |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment guides |
| [FEATURES.md](docs/FEATURES.md) | Feature list |
| [COMPONENTS.md](docs/COMPONENTS.md) | Component reference |
| [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) | Project organization |
| [SECURITY.md](docs/SECURITY.md) | Security guide |
| [GITHUB_PAGES.md](docs/GITHUB_PAGES.md) | GitHub Pages guide |

---

## 🐛 Troubleshooting

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Restart container
docker restart virtual-tourist-mongodb

# Or use setup script
npm run setup:mongodb
```

### Port Already in Use

```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Build Fails

```bash
# Clean and reinstall
npm run clean
npm run install:all

# Rebuild
npm run build
```

### API Not Connecting

1. Check CORS settings match frontend URL
2. Verify `VITE_API_URL` in client/.env
3. Check backend is running on correct port

### Secrets Accidentally Committed

1. **Rotate the secret immediately**
2. Remove from history:
   ```bash
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch path/to/secret' \
     --prune-empty --tag-name-filter cat -- --all
   git push origin --force
   ```
3. Contact GitHub if public repo

---

## 📊 Project Stats

| Metric | Count |
|--------|-------|
| **New Components** | 16 |
| **Documentation Files** | 8 |
| **African Destinations** | 12 |
| **Mysterious Places** | 8 |
| **Currencies Supported** | 35+ |
| **Offline Features** | 12 |
| **Deployment Options** | 4 |

---

## 🎯 Next Steps

1. ✅ **Setup Complete**: Run `npm run setup`
2. 📖 **Read Docs**: Start with [docs/SETUP.md](docs/SETUP.md)
3. 🚀 **Deploy**: Choose deployment option
4. 🔒 **Secure**: Review [docs/SECURITY.md](docs/SECURITY.md)
5. 🎨 **Customize**: Add your content and branding

---

## 📞 Support

- **Documentation**: `/docs/` folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/virtual-tourist/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/virtual-tourist/discussions)

---

**Built with ❤️ for virtual explorers worldwide**

**Last Updated**: March 2026  
**Version**: 2.0.0
