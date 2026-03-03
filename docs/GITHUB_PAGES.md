# GitHub Pages Deployment Guide (2026)

Complete guide for deploying Virtual Tourist frontend to GitHub Pages.

**Repository**: [devTechs001/world-tourist-virtual](https://github.com/devTechs001/world-tourist-virtual)

**Your Site URL**: https://devtechs001.github.io/world-tourist-virtual/

---

## 📋 Prerequisites

- GitHub account
- Repository on GitHub
- Node.js installed locally
- Backend API deployed (Render, Railway, etc.)

---

## 🚀 Quick Setup

### Option 1: GitHub Actions (Recommended)

The workflow is already configured in `.github/workflows/deploy-gh-pages.yml`.

**Just push to main branch**:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

The action will:
1. Build the client
2. Deploy to GitHub Pages
3. Update the live site

### Option 2: Manual Deployment

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts
# "deploy": "gh-pages -d client/dist"

# Build and deploy
cd client
npm run build
npx gh-pages -d dist
```

---

## ⚙️ Configuration

### 1. Update Vite Config

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

### 2. Update Environment Variables

Create `client/.env.production`:

```bash
VITE_API_URL=https://your-api.onrender.com/api
VITE_APP_URL=https://yourusername.github.io/virtual-tourist-virtual/
VITE_BASE_PATH=/virtual-tourist-virtual
```

### 3. Enable GitHub Pages

1. Go to repository **Settings**
2. Click **Pages** in sidebar
3. Source: **GitHub Actions**
4. Save

---

## 📁 GitHub Actions Workflow

File: `.github/workflows/deploy-gh-pages.yml`

```yaml
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
        env:
          VITE_API_URL: https://your-api.onrender.com/api
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./client/dist
  
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

## 🔗 Custom Domain (Optional)

### 1. Add CNAME File

Create `client/public/CNAME`:

```
your-domain.com
```

### 2. Configure DNS

**For apex domain** (`your-domain.com`):
```
Type: A
Name: @
Value: 185.199.108.153
TTL: 3600
```

(Repeat for 185.199.109.153, 185.199.110.153, 185.199.111.153)

**For subdomain** (`www.your-domain.com`):
```
Type: CNAME
Name: www
Value: yourusername.github.io
TTL: 3600
```

### 3. Configure in GitHub

1. Go to **Settings** → **Pages**
2. Custom domain: `your-domain.com`
3. Check **Enforce HTTPS**
4. Save

---

## 🌐 API Integration

### CORS Configuration

Your backend must allow GitHub Pages origin:

```javascript
// server/server.js
app.use(cors({
  origin: [
    'https://yourusername.github.io',
    'http://localhost:5173'  // Development
  ],
  credentials: true
}));
```

### Environment Variables

Update GitHub Actions secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets:
   ```
   VITE_API_URL=https://your-api.onrender.com/api
   VITE_APP_URL=https://yourusername.github.io/virtual-tourist-virtual/
   ```

Update workflow:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}
    VITE_APP_URL: ${{ secrets.VITE_APP_URL }}
```

---

## 📊 Deployment URLs

| Environment | URL |
|-------------|-----|
| **Production** | `https://yourusername.github.io/virtual-tourist-virtual/` |
| **Preview** | Auto-generated on PR |
| **Custom Domain** | `https://your-domain.com/` |

---

## 🧪 Testing Before Deploy

```bash
# Preview production build locally
cd client
npm run build
npm run preview

# Check for errors
# Visit http://localhost:4173
```

---

## 🐛 Common Issues

### 404 on Refresh

**Problem**: SPA routing issue

**Solution**: Already handled in workflow with proper redirects

### API Calls Failing

**Problem**: Wrong API URL or CORS

**Solution**: 
1. Check `VITE_API_URL` in build
2. Verify CORS on backend
3. Check browser console

### Assets Not Loading

**Problem**: Incorrect base path

**Solution**: Update `vite.config.js`:
```javascript
base: '/virtual-tourist-virtual/'
```

### Build Fails

**Problem**: Missing dependencies or errors

**Solution**:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📈 Continuous Deployment

### Auto-deploy on Push

The workflow automatically deploys on push to `main`.

### Deploy on Tag

Add to workflow:

```yaml
on:
  push:
    tags:
      - 'v*'
```

### Manual Trigger

Add to workflow:

```yaml
on:
  workflow_dispatch:
```

Then trigger from **Actions** tab.

---

## 🔒 Security

### Never Commit Secrets

```bash
# ✅ Good: Use GitHub Secrets
${{ secrets.API_KEY }}

# ❌ Bad: Hardcode in workflow
api_key: actual-key-here
```

### Protected Branches

1. Go to **Settings** → **Branches**
2. Add branch protection rule for `main`
3. Require pull request reviews

---

## 📊 Monitoring

### Deployment History

1. Go to **Actions** tab
2. View deployment workflow runs
3. Check logs for errors

### GitHub Pages Traffic

1. Go to **Settings** → **Pages**
2. View traffic statistics

---

## 🎯 Production Checklist

- [ ] Backend API deployed and accessible
- [ ] CORS configured for GitHub Pages origin
- [ ] Environment variables set correctly
- [ ] Base path configured in Vite
- [ ] GitHub Pages enabled in Settings
- [ ] Workflow file present
- [ ] Secrets configured in GitHub
- [ ] Custom domain configured (optional)
- [ ] HTTPS enforced
- [ ] Test deployment successful

---

## 📚 Resources

- [GitHub Pages Documentation](https://pages.github.com/)
- [Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Last Updated**: March 2026  
**Version**: 2.0.0
