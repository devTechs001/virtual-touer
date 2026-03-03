# GitHub Pages Configuration Guide (2026)

Complete configuration for deploying Virtual Tourist to GitHub Pages.

**Repository**: [devTechs001/world-tourist-virtual](https://github.com/devTechs001/world-tourist-virtual)

**Live URL**: https://devtechs001.github.io/world-tourist-virtual/

---

## 📁 Configuration Files

This project includes the following GitHub Pages configuration files:

### 1. GitHub Actions Workflow
**File**: `.github/workflows/deploy-gh-pages.yml`

Automatically builds and deploys on push to `main` branch.

### 2. Pages Configuration
**File**: `.github/pages-config.yml`

Additional settings and documentation for GitHub Pages.

### 3. Pages Marker
**File**: `.github/pages.yml`

Marker file for GitHub Pages recognition.

### 4. CNAME Template
**File**: `client/public/CNAME.example`

Template for custom domain configuration.

### 5. Setup Script
**File**: `scripts/setup-gh-pages.sh`

Automated setup script for GitHub Pages.

---

## 🚀 Quick Setup

### Automated Setup (Recommended)

```bash
# Run setup script
npm run setup:gh-pages

# Commit changes
git add .
git commit -m "Setup GitHub Pages"

# Push to deploy
git push origin main
```

### Manual Setup

#### Step 1: Update Vite Config

Edit `client/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/virtual-tourist-virtual/',  // Your repo name
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

#### Step 2: Create Production Environment

Create `client/.env.production`:

```bash
# Backend API URL
VITE_API_URL=https://your-api.onrender.com/api

# App URL
VITE_APP_URL=https://yourusername.github.io/virtual-tourist-virtual/

# Base path
VITE_BASE_PATH=/virtual-tourist-virtual

# Features
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
```

#### Step 3: Enable GitHub Pages

1. Go to repository **Settings**
2. Click **Pages** in sidebar
3. Source: **GitHub Actions**
4. Save

#### Step 4: Deploy

```bash
# Push to trigger deployment
git push origin main

# Or deploy manually
npm run deploy:gh-pages
```

---

## 📊 Deployment Workflow

The GitHub Actions workflow:

1. **Triggers**: Push to `main` branch
2. **Builds**: Client application with Vite
3. **Uploads**: Build artifacts to GitHub
4. **Deploys**: To GitHub Pages
5. **Reports**: Deployment status

### Workflow File

```yaml
# .github/workflows/deploy-gh-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
    paths:
      - 'client/**'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./client
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 🌐 Custom Domain

### Setup Custom Domain

#### Step 1: Create CNAME File

Create `client/public/CNAME` (not `.example`):

```
your-domain.com
```

Or for subdomain:

```
www.your-domain.com
```

#### Step 2: Configure DNS

**For apex domain** (`your-domain.com`):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |

**For subdomain** (`www.your-domain.com`):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | yourusername.github.io | 3600 |

#### Step 3: Configure in GitHub

1. Go to **Settings** → **Pages**
2. Custom domain: `your-domain.com`
3. Check **Enforce HTTPS**
4. Save

---

## 🔐 Security

### Environment Variables

Never commit sensitive data! Use GitHub Secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets:
   ```
   VITE_API_URL=https://your-api.onrender.com/api
   ```

3. Update workflow to use secrets:
   ```yaml
   - name: Build
     run: npm run build
     env:
       VITE_API_URL: ${{ secrets.VITE_API_URL }}
   ```

### .gitignore

The `.gitignore` blocks:
- `.env` files
- `CNAME` (use `CNAME.example`)
- Build artifacts
- Secrets and credentials

---

## 🧪 Testing

### Test Build Locally

```bash
cd client
npm run build
npm run preview

# Visit http://localhost:4173
```

### Test Deployment

1. Create a pull request
2. Check Actions tab for build status
3. Review deployment preview

---

## 🐛 Troubleshooting

### 404 on Page Refresh

**Problem**: SPA routing issue

**Solution**: Already handled by workflow configuration

### Assets Not Loading

**Problem**: Incorrect base path

**Solution**:
```javascript
// vite.config.js
base: '/virtual-tourist-virtual/'  // Must match repo name
```

### API Calls Failing

**Problem**: Wrong API URL or CORS

**Solution**:
1. Check `VITE_API_URL` in `.env.production`
2. Verify CORS on backend allows GitHub Pages origin
3. Check browser console for errors

### Build Fails

**Problem**: Dependencies or configuration error

**Solution**:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Not Triggering

**Problem**: Workflow not running

**Solution**:
1. Check Actions is enabled
2. Verify workflow file syntax
3. Check push is to `main` branch

---

## 📊 Deployment URLs

| Environment | URL |
|-------------|-----|
| **Production** | `https://yourusername.github.io/virtual-tourist-virtual/` |
| **Custom Domain** | `https://your-domain.com/` |
| **Preview** | Auto-generated on PR |

---

## 🎯 Deployment Checklist

Before deploying:

- [ ] Update `vite.config.js` with base path
- [ ] Create `client/.env.production`
- [ ] Set `VITE_API_URL` to production API
- [ ] Test build locally
- [ ] Commit all changes
- [ ] Push to `main` branch
- [ ] Enable GitHub Pages in Settings
- [ ] Monitor Actions tab
- [ ] Verify deployment URL
- [ ] Test live site

For custom domain:

- [ ] Create `client/public/CNAME`
- [ ] Configure DNS records
- [ ] Add domain in GitHub Settings
- [ ] Enable HTTPS
- [ ] Test custom domain URL

---

## 📈 Continuous Deployment

### Auto-deploy on Push

Workflow automatically deploys on push to `main`.

### Manual Trigger

Add to workflow:

```yaml
on:
  workflow_dispatch:
```

Then trigger from **Actions** tab.

### Deploy on Tag

```yaml
on:
  push:
    tags:
      - 'v*'
```

---

## 🔗 Integration with Backend

### CORS Configuration

Your backend must allow GitHub Pages:

```javascript
// server/server.js
app.use(cors({
  origin: [
    'https://yourusername.github.io',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

### API Deployment

Deploy backend separately:
- **Render**: `render.yaml` configured
- **Railway**: One-click deploy
- **VPS**: Manual deployment

Update `VITE_API_URL` in `.env.production` with backend URL.

---

## 📚 Resources

- [GitHub Pages Docs](https://pages.github.com/)
- [Actions Docs](https://docs.github.com/en/actions)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## 🎯 Quick Commands

```bash
# Setup GitHub Pages
npm run setup:gh-pages

# Deploy manually
npm run deploy:gh-pages

# Test production build
npm run build:prod && npm run preview --prefix client
```

---

**Last Updated**: March 2026  
**Version**: 2.0.0
