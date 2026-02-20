#!/bin/bash

# 🔒 Security Scanner for Virtual Tourist
# Scans the repository for potential secrets and sensitive data

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔒 Virtual Tourist Security Scanner"
echo "===================================="
echo ""

ISSUES=0

# Function to check for file patterns
check_files() {
  local pattern=$1
  local description=$2
  
  echo "Checking: $description"
  FILES=$(find . -type f -name "$pattern" \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -not -path "./dist/*" \
    -not -path "./build/*" \
    2>/dev/null)
  
  if [ ! -z "$FILES" ]; then
    echo -e "${RED}❌ Found:${NC}"
    echo "$FILES"
    echo ""
    ISSUES=$((ISSUES + 1))
  else
    echo -e "${GREEN}✅ None found${NC}"
  fi
  echo ""
}

# Function to check for secret patterns in code
check_patterns() {
  local pattern=$1
  local description=$2
  
  echo "Scanning for: $description"
  MATCHES=$(grep -r "$pattern" \
    --include="*.js" \
    --include="*.jsx" \
    --include="*.ts" \
    --include="*.tsx" \
    --include="*.json" \
    --include="*.env*" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=dist \
    --exclude-dir=build \
    -n . 2>/dev/null | grep -v "your-\|example\|placeholder\|<.*>\|example.com" | head -20)
  
  if [ ! -z "$MATCHES" ]; then
    echo -e "${YELLOW}⚠️  Potential secrets found:${NC}"
    echo "$MATCHES"
    echo ""
    ISSUES=$((ISSUES + 1))
  else
    echo -e "${GREEN}✅ No matches${NC}"
  fi
  echo ""
}

# Check for sensitive files
echo "${BLUE}=== Checking for Sensitive Files ===${NC}"
echo ""

check_files ".env" "Environment files (.env)"
check_files "*.pem" "PEM certificate files"
check_files "*.key" "Private key files"
check_files "credentials.json" "Credentials JSON files"
check_files "service-account*.json" "Service account files"
check_files "*-service-account.json" "Service account files (alt)"
check_files "firebase-config*.js" "Firebase config files"
check_files "GoogleService-Info.plist" "Google Service Info"
check_files "secrets.md" "Secrets documentation"
check_files "credentials.md" "Credentials documentation"
check_files "passwords.md" "Passwords documentation"
check_files "api-keys.md" "API keys documentation"

# Check for secret patterns in code
echo "${BLUE}=== Scanning Code for Secret Patterns ===${NC}"
echo ""

check_patterns "password\s*=\s*['\"][^'\"]{8,}['\"]" "Hardcoded passwords"
check_patterns "api_key\s*=\s*['\"][^'\"]{8,}['\"]" "Hardcoded API keys"
check_patterns "apikey\s*=\s*['\"][^'\"]{8,}['\"]" "Hardcoded API keys (alt)"
check_patterns "secret\s*=\s*['\"][^'\"]{8,}['\"]" "Hardcoded secrets"
check_patterns "token\s*=\s*['\"][^'\"]{8,}['\"]" "Hardcoded tokens"
check_patterns "JWT_SECRET\s*=" "JWT secret in code"
check_patterns "mongodb(\+srv)?://[^:]+:[^@]+@" "MongoDB connection strings with credentials"
check_patterns "sk_live_[a-zA-Z0-9]+" "Stripe live keys"
check_patterns "sk_test_[a-zA-Z0-9]+" "Stripe test keys"
check_patterns "ghp_[a-zA-Z0-9]+" "GitHub personal access tokens"
check_patterns "xox[baprs]-[a-zA-Z0-9]+" "Slack tokens"

# Check .gitignore
echo "${BLUE}=== Checking .gitignore Coverage ===${NC}"
echo ""

echo "Checking root .gitignore..."
if [ -f ".gitignore" ]; then
  if grep -q "^\.env$" ".gitignore"; then
    echo -e "${GREEN}✅ .env is ignored${NC}"
  else
    echo -e "${RED}❌ .env is NOT in .gitignore${NC}"
    ISSUES=$((ISSUES + 1))
  fi
  
  if grep -q "\.pem" ".gitignore"; then
    echo -e "${GREEN}✅ .pem files are ignored${NC}"
  else
    echo -e "${YELLOW}⚠️  .pem files might not be ignored${NC}"
  fi
else
  echo -e "${RED}❌ No .gitignore found${NC}"
  ISSUES=$((ISSUES + 1))
fi
echo ""

# Check for .env.example
echo "${BLUE}=== Checking for .env.example Templates ===${NC}"
echo ""

if [ -f "server/.env.example" ]; then
  echo -e "${GREEN}✅ server/.env.example exists${NC}"
else
  echo -e "${YELLOW}⚠️  server/.env.example not found${NC}"
fi

if [ -f "client/.env.example" ]; then
  echo -e "${GREEN}✅ client/.env.example exists${NC}"
else
  echo -e "${YELLOW}⚠️  client/.env.example not found${NC}"
fi
echo ""

# Check git history for secrets
echo "${BLUE}=== Checking Git History (Recent Commits) ===${NC}"
echo ""

if [ -d ".git" ]; then
  HISTORY_SECRETS=$(git log -p --since="1 month ago" 2>/dev/null | \
    grep -iE "password\s*=\s*['\"][^'\"]+['\"]|api_key\s*=\s*['\"][^'\"]+['\"]|secret\s*=\s*['\"][^'\"]+['\"]" | \
    grep -v "your-\|example\|placeholder" | head -10)
  
  if [ ! -z "$HISTORY_SECRETS" ]; then
    echo -e "${YELLOW}⚠️  Potential secrets in recent commits:${NC}"
    echo "$HISTORY_SECRETS"
    echo ""
    ISSUES=$((ISSUES + 1))
  else
    echo -e "${GREEN}✅ No obvious secrets in recent commits${NC}"
  fi
else
  echo "Not a git repository, skipping history check"
fi
echo ""

# Summary
echo "================================"
echo "Security Scan Summary"
echo "================================"

if [ $ISSUES -gt 0 ]; then
  echo -e "${RED}❌ Found $ISSUES potential security issue(s)${NC}"
  echo ""
  echo "Recommendations:"
  echo "1. Review all flagged files and code"
  echo "2. Remove any real secrets from the repository"
  echo "3. Add sensitive files to .gitignore"
  echo "4. Use environment variables for secrets"
  echo "5. Rotate any exposed credentials immediately"
  echo ""
  exit 1
else
  echo -e "${GREEN}✅ No security issues detected${NC}"
  echo ""
  echo "Your repository looks clean!"
  echo "Remember to:"
  echo "- Never commit .env files"
  echo "- Use environment variables for secrets"
  echo "- Review code before committing"
  echo ""
fi

exit 0
