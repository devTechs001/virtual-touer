# Deployment Guide (2026)

Complete guide for deploying Virtual Tourist to various platforms.

## Overview

| Platform | Use Case | Cost | Setup Time |
|----------|----------|------|------------|
| **Netlify** | Frontend (SPA) | Free | 5 min |
| **Render** | Backend API | Free | 10 min |
| **GitHub Pages** | Frontend (Static) | Free | 10 min |
| **Docker** | Full Stack | Free | 15 min |
| **VPS** | Full Control | $5+/mo | 30 min |

---

## Option 1: Netlify + Render (Recommended)

### Frontend on Netlify

#### Method A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd client
npm run build
netlify deploy --prod --dir=dist

# Or configure via netlify.toml
netlify init
netlify deploy --prod
```

#### Method B: Netlify UI (Git Integration)

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub repository
5. Build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
6. Add environment variables:
   ```
   VITE_API_URL=https://your-api.onrender.com/api
   VITE_APP_NAME=Virtual Tourist
   ```
7. Deploy!

#### Method C: netlify.toml (Already configured)

```toml
# netlify.toml is already configured
# Just run:
netlify deploy --prod
```

### Backend on Render

#### Deploy via Render UI

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Click "New +" → "Web Service"
4. Connect repository
5. Configure:
   - **Name**: virtual-tourist-api
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   PORT=5000
   ```
7. Deploy!

#### Deploy via render.yaml (Infrastructure as Code)

```bash
# render.yaml is already configured
# Just run:
render up

# Or via UI
# Import render.yaml in Render dashboard
```

### Connect Frontend to Backend

Update `client/.env` or Netlify environment variables:

```bash
VITE_API_URL=https://virtual-tourist-api.onrender.com/api
```

---

## Option 2: GitHub Pages (Frontend Only)

### Setup

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Save

2. **Configure for GitHub Pages**

   Update `client/vite.config.js`:
   ```javascript
   base: '/virtual-tourist-virtual/'
   ```

3. **Deploy Workflow**
   
   The GitHub Actions workflow (`.github/workflows/deploy-gh-pages.yml`) is already configured.
   
   Just push to main branch:
   ```bash
   git push origin main
   ```

4. **Access Your Site**
   ```
   https://yourusername.github.io/virtual-tourist-virtual/
   ```

### Environment Variables for GitHub Pages

Create `client/.env.production`:

```bash
VITE_API_URL=https://virtual-tourist-api.onrender.com/api
VITE_APP_URL=https://yourusername.github.io/virtual-tourist-virtual/
VITE_BASE_PATH=/virtual-tourist-virtual
```

---

## Option 3: Docker (Full Stack)

### Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

### Production

#### Build Images

```bash
docker-compose -f docker-compose.yml build
```

#### Deploy with Docker Compose

```bash
# On your server
git clone https://github.com/yourusername/virtual-tourist.git
cd virtual-tourist

# Create .env files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit .env files with production values

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

#### Deploy to VPS

```bash
# SSH to server
ssh user@your-server.com

# Clone and setup
git clone https://github.com/yourusername/virtual-tourist.git
cd virtual-tourist

# Install Docker if needed
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Start services
docker-compose up -d
```

---

## Option 4: VPS Manual Deployment

### Prerequisites

- Ubuntu 20.04+ server
- Domain name (optional)
- SSL certificate (Let's Encrypt)

### Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Deploy Backend

```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/virtual-tourist.git
cd virtual-tourist/server

# Install dependencies
npm install

# Create .env file
nano .env

# Create systemd service
sudo nano /etc/systemd/system/virtual-tourist-api.service
```

**Systemd Service** (`/etc/systemd/system/virtual-tourist-api.service`):

```ini
[Unit]
Description=Virtual Tourist API
After=network.target mongod.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/virtual-tourist/server
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable virtual-tourist-api
sudo systemctl start virtual-tourist-api
sudo systemctl status virtual-tourist-api
```

### Deploy Frontend

```bash
# Build frontend
cd /var/www/virtual-tourist/client
npm install
npm run build

# Copy to Nginx
sudo cp -r dist/* /var/www/html/

# Or configure Nginx to serve from build directory
```

### Configure Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

---

## Environment Variables Reference

### Production Server (.env)

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/virtual-tourist
USE_LOCAL_DB=false

# Server
PORT=5000
NODE_ENV=production

# Authentication
JWT_SECRET=generate-strong-random-string-here
JWT_EXPIRE=30d

# CORS
CLIENT_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com

# Rate Limiting (stricter for production)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Production Client (.env)

```bash
# API
VITE_API_URL=https://your-api-domain.com/api

# App
VITE_APP_NAME=Virtual Tourist
VITE_APP_URL=https://your-domain.com

# Features
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
```

---

## CI/CD Pipeline

### GitHub Actions (Already Configured)

```yaml
# .github/workflows/deploy-gh-pages.yml
# Automatically deploys on push to main
```

### Manual Deployment Script

```bash
#!/bin/bash
# scripts/deploy.sh

echo "🚀 Deploying Virtual Tourist..."

# Build client
cd client
npm install
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Deploy server to Render
# (via Git integration or render-cli)

echo "✅ Deployment complete!"
```

---

## Monitoring

### Health Checks

```bash
# API Health
curl https://your-api.com/health

# Expected response:
# {"status":"OK","timestamp":"2026-03-03T...","uptime":123.45}
```

### Logs

```bash
# Netlify logs
netlify logs

# Render logs
# View in Render dashboard

# Docker logs
docker-compose logs -f

# Systemd logs
sudo journalctl -u virtual-tourist-api -f
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
npm run clean
npm install

# Rebuild
npm run build
```

### API Not Connecting

```bash
# Check CORS settings
# Ensure CLIENT_URL matches frontend URL

# Check API URL in client/.env
# Must be full URL with https
```

### Database Connection Issues

```bash
# Check MongoDB URI format
# mongodb+srv:// for Atlas
# mongodb:// for local

# Verify IP whitelist in Atlas
```

---

**Last Updated**: March 2026  
**Version**: 2.0.0
