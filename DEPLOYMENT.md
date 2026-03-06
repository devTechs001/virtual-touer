# Deployment Guide - Virtual Tourist (2026)

## 🌐 Complete Deployment Options

This guide covers all deployment options for Virtual Tourist:
- **Frontend**: Netlify, Render, GitHub Pages, Vercel, Docker
- **Backend**: Render, Railway, Heroku, Docker
- **Database**: MongoDB Atlas (Primary) + MongoDB Compass (Fallback)
- **Full Stack**: Docker Compose, Kubernetes

**Latest Updates:**
- ✅ All API endpoints verified and documented
- ✅ Enhanced dashboards with real-time analytics
- ✅ Package dependencies synchronized
- ✅ WebSocket support for live features
- ✅ Rate limiting and security hardening

---

## 📋 Table of Contents

1. [Quick Deploy Options](#quick-deploy-options)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [CI/CD Setup](#cicd-setup)
7. [Docker Deployment](#docker-deployment)
8. [API Endpoints Reference](#api-endpoints-reference)

---

## 🐳 Docker Deployment {#docker-deployment}

### Docker Compose (Recommended for Local/Testing)

#### Quick Start
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

#### Services Included
- **MongoDB**: Port 27017
- **Backend API**: Port 5000
- **Frontend**: Port 3000
- **Nginx**: Port 80/443 (production)

#### Environment Configuration
Create `.env` file in root:
```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin123
MONGO_INITDB_DATABASE=virtual-tourist

# Backend
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/virtual-tourist?authSource=admin
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000

# Frontend
VITE_API_URL=http://localhost:5000/api
```

### Production Docker Deployment

#### Build Images
```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build server
docker-compose build client
```

#### Deploy with Nginx (Production)
```bash
# Start with nginx profile
docker-compose --profile production up -d

# Access at http://localhost
```

#### Kubernetes Deployment (Advanced)

Create `k8s/` directory:

**mongodb-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:7
        ports:
        - containerPort: 27017
        volumeMounts:
        - name: mongodb-data
          mountPath: /data/db
      volumes:
      - name: mongodb-data
        persistentVolumeClaim:
          claimName: mongodb-pvc
```

**backend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/virtual-tourist-server:latest
        ports:
        - containerPort: 5000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongodb-uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

**frontend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/virtual-tourist-client:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

**Apply Configuration**
```bash
kubectl apply -f k8s/
kubectl get pods
kubectl get services
```

---

## 🔗 API Endpoints Reference {#api-endpoints-reference}

For complete API documentation, see [API_ENDPOINTS.md](./API_ENDPOINTS.md)

### Quick Reference

#### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Tours
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get tour by ID
- `POST /api/tours` - Create tour (Admin)
- `PUT /api/tours/:id` - Update tour (Admin)
- `DELETE /api/tours/:id` - Delete tour (Admin)

#### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination by ID
- `POST /api/destinations` - Create destination (Admin)

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

#### Social Features
- `POST /api/social/follow/:userId` - Follow user
- `GET /api/social/feed` - Get personalized feed
- `POST /api/social/comments/:tourId` - Add comment

#### Recommendations
- `GET /api/recommendations/personal` - Get personalized recommendations
- `GET /api/recommendations/trending` - Get trending tours

#### Admin
- `GET /api/admin/stats` - Get dashboard stats
- `POST /api/admin/backup` - Create backup
- `GET /api/admin/audit-logs` - Get audit logs

### Health Check
```bash
curl https://your-backend.onrender.com/api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2026-03-06T12:00:00.000Z",
  "uptime": 12345.67
}
```

---

## 🚀 Quick Deploy Options

### Option 1: Render (Full Stack)
```bash
# One-click deploy to Render
# Frontend + Backend + Database in one platform
```

### Option 2: Netlify + Render
```bash
# Frontend on Netlify (CDN)
# Backend on Render (Node.js)
# Database on MongoDB Atlas
```

### Option 3: GitHub Pages + Render
```bash
# Frontend on GitHub Pages (Free)
# Backend on Render
# Database on MongoDB Atlas
```

---

## 🎨 Frontend Deployment

### Netlify

#### Method 1: Connect Git Repository
1. Go to https://netlify.com
2. Click "New site from Git"
3. Choose GitHub repository
4. Build settings:
   - **Base directory**: `client`
   - **Build command**: `pnpm build`
   - **Publish directory**: `client/dist`
5. Deploy!

#### Method 2: Manual Deploy
```bash
cd client
pnpm build
netlify deploy --prod --dir=dist
```

#### Netlify Configuration
File: `netlify.toml`
```toml
[build]
  base = "client/"
  publish = "dist/"
  command = "pnpm build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Environment Variables (Netlify)
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=Virtual Tourist
```

---

### Render (Static Site)

1. Go to https://render.com
2. Click "New +" → "Static Site"
3. Connect repository
4. Settings:
   - **Name**: virtual-tourist-frontend
   - **Branch**: main
   - **Build Command**: `cd client && pnpm install && pnpm build`
   - **Publish Directory**: `client/dist`
5. Deploy!

---

### GitHub Pages

#### Setup
1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / folder: /docs (or use gh-pages branch)

#### Deploy with GitHub Actions
```bash
# Push to main branch
# GitHub Actions will auto-deploy
```

#### Manual Deploy
```bash
cd client
pnpm install
pnpm build

# Install gh-pages
pnpm add -D gh-pages

# Deploy
pnpm exec gh-pages -d dist
```

#### Update package.json
```json
{
  "homepage": "https://your-username.github.io/virtual-tourist-virtual",
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

#### Environment Variables
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_BASE_PATH=/virtual-tourist-virtual
```

---

### Vercel

1. Go to https://vercel.com
2. Import Git repository
3. Framework Preset: Vite
4. Root Directory: `client`
5. Deploy!

---

## ⚙️ Backend Deployment

### Render (Recommended)

#### Setup
1. Go to https://render.com
2. New +" → "Web Service"
3. Connect repository
4. Settings:
   - **Name**: virtual-tourist-backend
   - **Environment**: Node
   - **Build Command**: `cd server && pnpm install`
   - **Start Command**: `cd server && pnpm start`
5. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret
   NODE_ENV=production
   PORT=5000
   ```
6. Deploy!

#### Render Configuration
File: `render.yaml`
```yaml
services:
  - type: web
    name: virtual-tourist-backend
    env: node
    buildCommand: cd server && pnpm install
    startCommand: cd server && pnpm start
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
```

---

### Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select server directory
4. Add environment variables
5. Deploy!

---

### Heroku

```bash
# Install Heroku CLI
heroku login
heroku create virtual-tourist-backend
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your-secret"
git push heroku main
```

---

## 🗄️ Database Setup

### MongoDB Atlas (Primary)

#### Step 1: Create Account
1. Go to https://cloud.mongodb.com
2. Sign up for free
3. Create organization and project

#### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose FREE tier (M0)
3. Select region (closest to you)
4. Click "Create"

#### Step 3: Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose Password authentication
4. Create username and password
5. Set permissions: "Read and write to any database"

#### Step 4: Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

#### Step 5: Get Connection String
1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your password
5. Replace `<dbname>` with `virtual-tourist`

Example:
```
mongodb+srv://myuser:MyPassword123@cluster0.abc123.mongodb.net/virtual-tourist?retryWrites=true&w=majority
```

#### Step 6: Add to Environment
```env
MONGODB_URI=mongodb+srv://myuser:MyPassword123@cluster0.abc123.mongodb.net/virtual-tourist
```

---

### MongoDB Compass (Fallback/Local)

#### Installation
1. Download from https://www.mongodb.com/products/compass
2. Install on your system

#### Connect
1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Click "Connect"

#### Create Database
1. Click "Create Database"
2. Database Name: `virtual-tourist`
3. Create collections: `users`, `tours`, `destinations`, etc.

#### Seed Data
```bash
cd server
pnpm run seed:all
```

---

## 🔐 Environment Variables

### Server (.env)
```env
# Database (Atlas - Primary)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/virtual-tourist
MONGODB_URI_LOCAL=mongodb://localhost:27017/virtual-tourist
USE_LOCAL_DB=false

# Server
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-site.netlify.app

# Auth
JWT_SECRET=your-super-secret-key

# Optional
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
```

### Client (.env)
```env
# API
VITE_API_URL=https://your-backend.onrender.com/api

# App
VITE_APP_NAME=Virtual Tourist
VITE_APP_URL=https://your-site.netlify.app

# Features
VITE_ENABLE_PWA=true
```

---

## 🔄 CI/CD Setup

### GitHub Actions - Deploy to Netlify + Render

File: `.github/workflows/deploy.yml`
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd client && pnpm install && pnpm build
      - uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './client/dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Trigger Render Deploy
        run: |
          curl -X POST "https://api.render.com/deploy/srv-xxx" \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}"
```

---

## 📊 Deployment Checklist

### Pre-Deployment
- [ ] Test locally with production environment variables
- [ ] Run build without errors
- [ ] Test all features
- [ ] Check responsive design
- [ ] Optimize images
- [ ] Remove console.log statements
- [ ] Update .env.example

### Database
- [ ] Create MongoDB Atlas cluster
- [ ] Set up database user
- [ ] Configure network access
- [ ] Get connection string
- [ ] Test connection
- [ ] Seed initial data

### Backend
- [ ] Deploy to Render
- [ ] Set environment variables
- [ ] Test API endpoints
- [ ] Check logs for errors
- [ ] Set up health check

### Frontend
- [ ] Build for production
- [ ] Configure API URL
- [ ] Deploy to Netlify/GitHub Pages
- [ ] Test all pages
- [ ] Check PWA functionality
- [ ] Verify SEO meta tags

### Post-Deployment
- [ ] Test full user flow
- [ ] Check error handling
- [ ] Monitor performance
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS
- [ ] Set up backups

---

## 🎯 Quick Start Deployment

### 30-Minute Deploy

1. **Database (5 min)**
   ```
   - Create MongoDB Atlas account
   - Create free cluster
   - Get connection string
   ```

2. **Backend (10 min)**
   ```
   - Deploy to Render
   - Add MONGODB_URI
   - Deploy
   ```

3. **Frontend (10 min)**
   ```
   - Deploy to Netlify
   - Add VITE_API_URL
   - Deploy
   ```

4. **Test (5 min)**
   ```
   - Visit frontend URL
   - Test login
   - Browse tours
   ```

---

## 📈 Monitoring & Maintenance

### Logs
- **Render**: Dashboard → Logs
- **Netlify**: Deploys → Click deploy → View logs
- **MongoDB Atlas**: Clusters → Logs

### Performance
- Use Lighthouse for frontend performance
- Monitor MongoDB slow queries
- Check Render response times

### Backups
- MongoDB Atlas: Automatic backups (paid plans)
- Manual export: `mongodump`

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules dist
pnpm install
pnpm build
```

### Database Connection Fails
```bash
# Check connection string
# Verify network access (0.0.0.0/0)
# Check username/password
```

### API Not Responding
```bash
# Check Render logs
# Verify CORS settings
# Check environment variables
```

---

## 📚 Resources

- [Netlify Docs](https://docs.netlify.com)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas)
- [GitHub Pages Docs](https://pages.github.com)
- [Vercel Docs](https://vercel.com/docs)

---

## 🎉 You're Live!

After deployment, your app will be accessible at:
- **Frontend**: https://your-site.netlify.app
- **Backend**: https://your-app.onrender.com/api
- **Database**: MongoDB Atlas (Cloud)

Share your app with the world! 🚀
