#!/bin/bash

# GitHub Pages Setup Script for Virtual Tourist (2026)
# Repository: devTechs001/world-tourist-virtual
# This script configures your project for GitHub Pages deployment

set -e

echo "========================================"
echo "  GitHub Pages Setup"
echo "  Repository: devTechs001/world-tourist-virtual"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Repository info
REPO_NAME="world-tourist-virtual"
GITHUB_USERNAME="devTechs001"

echo -e "${GREEN}✓${NC} Repository: $REPO_NAME"
echo -e "${GREEN}✓${NC} Username: $GITHUB_USERNAME"
echo ""

# Step 1: Update vite.config.js
echo -e "${BLUE}Step 1: Updating Vite configuration...${NC}"

if [ -f "client/vite.config.js" ]; then
    # Backup existing config
    cp client/vite.config.js client/vite.config.js.backup
    
    # Check if base is already configured
    if grep -q "base:" client/vite.config.js; then
        echo -e "${YELLOW}!${NC} Base path already configured in vite.config.js"
    else
        # Add base path after plugins line
        sed -i.bak 's/plugins: \[react()\]/base: '\''\/'"$REPO_NAME"'\/'\'',\n  plugins: [react()]/' client/vite.config.js
        rm client/vite.config.js.bak
        echo -e "${GREEN}✓${NC} Added base path: /$REPO_NAME/"
    fi
else
    echo -e "${RED}✗${NC} client/vite.config.js not found"
fi

echo ""

# Step 2: Create .env.production
echo -e "${BLUE}Step 2: Creating production environment file...${NC}"

if [ -f "client/.env.production" ]; then
    echo -e "${YELLOW}!${NC} client/.env.production already exists"
    read -p "Do you want to update it? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping .env.production update"
    else
        cat > client/.env.production << EOF
# Production Environment Variables for GitHub Pages
# ============================================

# Backend API URL (Update with your deployed API)
VITE_API_URL=https://your-api.onrender.com/api

# App URL
VITE_APP_URL=https://${GITHUB_USERNAME:-yourusername}.github.io/$REPO_NAME

# Base path (must match vite.config.js)
VITE_BASE_PATH=/$REPO_NAME

# Features
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
EOF
        echo -e "${GREEN}✓${NC} Updated client/.env.production"
    fi
else
    cat > client/.env.production << EOF
# Production Environment Variables for GitHub Pages
# ============================================

# Backend API URL (Update with your deployed API)
VITE_API_URL=https://your-api.onrender.com/api

# App URL
VITE_APP_URL=https://${GITHUB_USERNAME:-yourusername}.github.io/$REPO_NAME

# Base path (must match vite.config.js)
VITE_BASE_PATH=/$REPO_NAME

# Features
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
EOF
    echo -e "${GREEN}✓${NC} Created client/.env.production"
fi

echo ""

# Step 3: Create CNAME file (optional)
echo -e "${BLUE}Step 3: Custom domain configuration...${NC}"

if [ -f "client/public/CNAME" ]; then
    echo -e "${YELLOW}!${NC} client/public/CNAME already exists"
else
    echo "Do you want to configure a custom domain?"
    read -p "Enter your domain (or press Enter to skip): " CUSTOM_DOMAIN
    
    if [ -n "$CUSTOM_DOMAIN" ]; then
        echo "$CUSTOM_DOMAIN" > client/public/CNAME
        echo -e "${GREEN}✓${NC} Created client/public/CNAME with: $CUSTOM_DOMAIN"
        echo ""
        echo "Next steps for custom domain:"
        echo "  1. Configure DNS with your domain provider"
        echo "  2. Add domain in GitHub Settings → Pages"
        echo "  3. Enable HTTPS after DNS propagation"
    else
        echo "Skipping custom domain configuration"
        echo "Template available at: client/public/CNAME.example"
    fi
fi

echo ""

# Step 4: Verify GitHub Actions workflow
echo -e "${BLUE}Step 4: Verifying GitHub Actions workflow...${NC}"

if [ -f ".github/workflows/deploy-gh-pages.yml" ]; then
    echo -e "${GREEN}✓${NC} GitHub Actions workflow exists"
else
    echo -e "${YELLOW}!${NC} Workflow file not found"
    echo "Creating basic workflow..."
    
    mkdir -p .github/workflows
    cat > .github/workflows/deploy-gh-pages.yml << 'EOF'
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
EOF
    echo -e "${GREEN}✓${NC} Created GitHub Actions workflow"
fi

echo ""

# Step 5: Enable GitHub Pages
echo -e "${BLUE}Step 5: GitHub Pages configuration...${NC}"
echo ""
echo "To enable GitHub Pages:"
echo "  1. Go to: https://github.com/${GITHUB_USERNAME:-yourusername}/$REPO_NAME/settings/pages"
echo "  2. Source: GitHub Actions"
echo "  3. Save"
echo ""

# Step 6: Test build
echo -e "${BLUE}Step 6: Testing production build...${NC}"

if command -v npm &> /dev/null; then
    echo "Building client..."
    cd client
    if npm run build; then
        echo -e "${GREEN}✓${NC} Build successful!"
        cd ..
    else
        echo -e "${RED}✗${NC} Build failed. Please fix errors and try again."
        cd ..
        exit 1
    fi
else
    echo -e "${YELLOW}!${NC} npm not found, skipping build test"
fi

echo ""

# Summary
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Configuration Summary:"
echo "  Repository: $REPO_NAME"
echo "  Base Path: /$REPO_NAME/"
echo "  Workflow: .github/workflows/deploy-gh-pages.yml"
echo ""
echo "Next Steps:"
echo "  1. Update VITE_API_URL in client/.env.production"
echo "  2. Commit changes: git add . && git commit -m 'Setup GitHub Pages'"
echo "  3. Push to GitHub: git push origin main"
echo "  4. Enable GitHub Pages in repository settings"
echo "  5. Monitor Actions tab for deployment"
echo ""
echo "Your site will be available at:"
echo "  https://${GITHUB_USERNAME:-yourusername}.github.io/$REPO_NAME/"
echo ""
echo "========================================"
