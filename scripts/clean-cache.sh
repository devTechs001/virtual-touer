#!/bin/bash

# 🧹 Virtual Tourist - Cache & Build Cleaner
# Cleans all cache, build artifacts, and temporary files

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🧹 Virtual Tourist Cache Cleaner"
echo "================================"
echo ""

# Track total space freed
TOTAL_FREED=0

# Function to clean directory
clean_dir() {
  local dir=$1
  local description=$2
  
  if [ -d "$dir" ]; then
    SIZE=$(du -sh "$dir" 2>/dev/null | cut -f1)
    echo -e "${YELLOW}Cleaning: $description ($dir)${NC}"
    rm -rf "$dir"
    echo -e "${GREEN}✓ Removed: $dir ($SIZE)${NC}"
    echo ""
  fi
}

# Function to clean files by pattern
clean_files() {
  local pattern=$1
  local description=$2
  local count=0
  
  # Find and count files
  count=$(find . -name "$pattern" -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null | wc -l | tr -d ' ')
  
  if [ "$count" -gt 0 ]; then
    echo -e "${YELLOW}Cleaning: $description ($count files)${NC}"
    find . -name "$pattern" -not -path "./node_modules/*" -not -path "./.git/*" -delete 2>/dev/null
    echo -e "${GREEN}✓ Removed: $count $pattern files${NC}"
    echo ""
  fi
}

# Root directory
echo -e "${BLUE}=== Cleaning Root Directory ===${NC}"
echo ""
clean_dir "node_modules" "Node modules"
clean_dir ".pnpm-store" "PNPM store"
clean_dir ".cache" "Cache directory"
clean_dir ".temp" "Temp directory"
clean_dir ".tmp" "Temp directory"
clean_dir ".parcel-cache" "Parcel cache"
clean_dir ".vercel" "Vercel cache"
clean_dir ".netlify" "Netlify cache"
clean_dir "coverage" "Test coverage"
clean_dir ".nyc_output" "NYC coverage"
clean_dir ".jest" "Jest cache"
clean_dir "test-results" "Test results"
clean_dir "playwright-report" "Playwright report"
clean_dir "logs" "Log files"
clean_dir "uploads" "Upload files"
clean_dir "data" "Data files"
clean_files "*.log" "Log files"
clean_files "*.tsbuildinfo" "TypeScript build info"
clean_files ".eslintcache" "ESLint cache"
clean_files ".stylelintcache" "Stylelint cache"

# Client directory
echo -e "${BLUE}=== Cleaning Client Directory ===${NC}"
echo ""
if [ -d "client" ]; then
  cd client
  clean_dir "node_modules" "Node modules"
  clean_dir "dist" "Build output"
  clean_dir "build" "Build output"
  clean_dir "out" "Build output"
  clean_dir ".vite" "Vite cache"
  clean_dir ".parcel-cache" "Parcel cache"
  clean_dir "coverage" "Test coverage"
  clean_dir "playwright-report" "Playwright report"
  clean_files "*.map" "Source maps"
  clean_files "*.min.js" "Minified JS"
  clean_files "*.min.css" "Minified CSS"
  clean_files "*.bundle.js" "Bundle files"
  clean_files "workbox-*.js" "Workbox files"
  cd ..
fi

# Server directory
echo -e "${BLUE}=== Cleaning Server Directory ===${NC}"
echo ""
if [ -d "server" ]; then
  cd server
  clean_dir "node_modules" "Node modules"
  clean_dir "dist" "Build output"
  clean_dir "build" "Build output"
  clean_dir "logs" "Log files"
  clean_dir "uploads" "Upload files"
  clean_dir "public/uploads" "Public uploads"
  clean_dir "tmp" "Temp files"
  clean_dir "temp" "Temp files"
  clean_files "*.log" "Log files"
  clean_files "*.tsbuildinfo" "TypeScript build info"
  clean_files "*.class" "Java class files"
  cd ..
fi

# Docker cleanup (optional)
echo -e "${BLUE}=== Docker Cleanup (Optional) ===${NC}"
echo ""
if command -v docker &> /dev/null; then
  read -p "Clean Docker containers? (y/N): " clean_containers
  if [ "$clean_containers" = "y" ] || [ "$clean_containers" = "Y" ]; then
    docker container prune -f
    echo -e "${GREEN}✓ Cleaned stopped containers${NC}"
  fi
  
  read -p "Clean Docker images? (y/N): " clean_images
  if [ "$clean_images" = "y" ] || [ "$clean_images" = "Y" ]; then
    docker image prune -f
    echo -e "${GREEN}✓ Cleaned dangling images${NC}"
  fi
else
  echo "Docker not installed, skipping..."
fi
echo ""

# NPM/PNPM cache
echo -e "${BLUE}=== Package Manager Cache ===${NC}"
echo ""
if command -v pnpm &> /dev/null; then
  echo -e "${YELLOW}Cleaning PNPM cache...${NC}"
  pnpm store prune 2>/dev/null
  echo -e "${GREEN}✓ PNPM cache cleaned${NC}"
  echo ""
fi

if command -v npm &> /dev/null; then
  echo -e "${YELLOW}Cleaning NPM cache...${NC}"
  npm cache clean --force 2>/dev/null
  echo -e "${GREEN}✓ NPM cache cleaned${NC}"
  echo ""
fi

# Summary
echo "================================"
echo -e "${GREEN}✅ Cache Cleaning Complete!${NC}"
echo "================================"
echo ""
echo "Cleaned:"
echo "  - node_modules directories"
echo "  - build outputs (dist, build, out)"
echo "  - cache directories (.vite, .parcel-cache, etc.)"
echo "  - log files"
echo "  - test coverage reports"
echo "  - temporary files"
echo "  - package manager caches"
echo ""
echo -e "${YELLOW}Note: Run 'pnpm install' or 'npm install' to reinstall dependencies${NC}"
echo ""
