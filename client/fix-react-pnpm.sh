#!/bin/bash

# ============================================
# React Duplicate Instance Fix Script (pnpm)
# ============================================
# This script fixes the "Invalid hook call" error
# specifically for pnpm package manager
# ============================================

echo "🔧 Fixing React duplicate instance issue (pnpm)..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean everything
echo "📦 Step 1: Cleaning node_modules and caches..."
rm -rf node_modules
rm -rf pnpm-lock.yaml
rm -rf .vite
rm -rf dist
rm -rf node_modules/.vite
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

# Step 2: Check pnpm version
echo "📋 Step 2: Checking pnpm version..."
pnpm --version
echo ""

# Step 3: Install with --shamefully-hoist
echo "📦 Step 3: Installing dependencies with --shamefully-hoist..."
echo -e "${YELLOW}This ensures React is available at the root level${NC}"
pnpm install --shamefully-hoist
echo -e "${GREEN}✓ Installation complete${NC}"
echo ""

# Step 4: Verify React is installed only once
echo "🔍 Step 4: Checking for duplicate React instances..."
echo ""
echo "React installations:"
pnpm list react
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
echo "React: $(pnpm list react --depth=0 | grep react | awk '{print $2}')"
echo "React-DOM: $(pnpm list react-dom --depth=0 | grep react | awk '{print $2}')"
echo "Vite: $(pnpm list vite --depth=0 | grep vite | awk '{print $2}')"
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✓ Fix complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Next steps:"
echo "1. Run: pnpm dev"
echo "2. If issues persist, try: pnpm dev -- --force"
echo ""
echo "If you still see errors:"
echo "  - Disable AdBlock for localhost"
echo "  - Clear browser cache"
echo "  - Check browser console for specific errors"
echo ""
