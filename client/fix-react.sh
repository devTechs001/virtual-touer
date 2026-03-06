#!/bin/bash

# ============================================
# React Duplicate Instance Fix Script
# ============================================
# This script fixes the "Invalid hook call" error
# caused by multiple React instances
# ============================================

echo "🔧 Fixing React duplicate instance issue..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean everything
echo "📦 Step 1: Cleaning node_modules and caches..."
rm -rf node_modules
rm -rf package-lock.json
rm -rf .vite
rm -rf dist
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

# Step 2: Check npm version
echo "📋 Step 2: Checking npm version..."
npm --version
echo ""

# Step 3: Install with legacy peer deps (if npm >= 7)
echo "📦 Step 3: Installing dependencies..."
NPM_MAJOR=$(npm --version | cut -d'.' -f1)

if [ "$NPM_MAJOR" -ge 7 ]; then
    echo -e "${YELLOW}Using --legacy-peer-deps for npm $NPM_MAJOR${NC}"
    npm install --legacy-peer-deps
else
    npm install
fi
echo -e "${GREEN}✓ Installation complete${NC}"
echo ""

# Step 4: Verify React is installed only once
echo "🔍 Step 4: Checking for duplicate React instances..."
echo ""
echo "React installations:"
npm ls react
echo ""

# Step 5: Clear Vite cache
echo "🧹 Step 5: Clearing Vite cache..."
rm -rf node_modules/.vite
echo -e "${GREEN}✓ Vite cache cleared${NC}"
echo ""

# Step 6: Verify installation
echo "✅ Step 6: Verifying installation..."
if [ -d "node_modules/react" ] && [ -d "node_modules/react-dom" ]; then
    echo -e "${GREEN}✓ React and React-DOM installed${NC}"
else
    echo -e "${RED}✗ React installation failed${NC}"
    exit 1
fi
echo ""

# Step 7: Show versions
echo "📊 Step 7: Package versions..."
echo "React: $(npm ls react --depth=0 | grep react | awk '{print $2}')"
echo "React-DOM: $(npm ls react-dom --depth=0 | grep react | awk '{print $2}')"
echo "Vite: $(npm ls vite --depth=0 | grep vite | awk '{print $2}')"
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✓ Fix complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. If issues persist, try: npm run dev -- --force"
echo ""
echo "If you still see errors, check:"
echo "  - Your ThemeContext.jsx for proper React imports"
echo "  - No multiple React versions in dependencies"
echo "  - Browser extensions (disable AdBlock for localhost)"
echo ""
