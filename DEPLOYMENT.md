# Deployment Guide

## 🌐 Complete Deployment Options

This guide covers all deployment options for Virtual Tourist:
- **Frontend**: Netlify, Render, GitHub Pages, Vercel
- **Backend**: Render, Railway, Heroku
- **Database**: MongoDB Atlas (Primary) + MongoDB Compass (Fallback)

---

## 📋 Table of Contents

1. [Quick Deploy Options](#quick-deploy-options)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [CI/CD Setup](#cicd-setup)

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
