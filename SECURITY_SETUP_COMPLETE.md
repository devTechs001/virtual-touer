# 🔐 Security & Secrets - Complete Guide

## ✅ What's Been Configured

### 1. Comprehensive .gitignore Files

Updated all .gitignore files to ignore:
- ✅ Environment files (`.env`, `.env.local`, etc.)
- ✅ API keys and credentials
- ✅ Certificate files (`.pem`, `.key`, `.crt`, etc.)
- ✅ Service account files
- ✅ Secret documentation (`secrets.md`, `credentials.md`, etc.)
- ✅ Backup files that might contain secrets
- ✅ Database files
- ✅ Logs that might contain sensitive data

### 2. Pre-commit Hook

Created `.githooks/pre-commit` that:
- ✅ Blocks `.env` files from being committed
- ✅ Blocks credential files
- ✅ Blocks key/certificate files
- ✅ Blocks secret documentation
- ✅ Warns about secret patterns in code
- ✅ Warns about MongoDB connection strings with passwords
- ✅ Warns about backup files

### 3. Security Scanner

Created `scripts/security-scan.sh` that:
- ✅ Scans for sensitive files
- ✅ Scans code for secret patterns
- ✅ Checks .gitignore coverage
- ✅ Checks recent git history
- ✅ Provides detailed report

### 4. Documentation

Created comprehensive guides:
- ✅ `SECURITY_CHECKLIST.md` - Complete security checklist
- ✅ `SECRETS_GUIDE.md` - Secrets management guide

---

## 🚀 Quick Start

### 1. Install Pre-commit Hook

```bash
# Make hook executable
chmod +x .githooks/pre-commit

# Configure git to use it
git config core.hooksPath .githooks

# Verify
git config --get core.hooksPath
# Should output: .githooks
```

### 2. Run Security Scan

```bash
# Make scanner executable
chmod +x scripts/security-scan.sh

# Run scan
./scripts/security-scan.sh
```

### 3. Set Up Environment Files

```bash
# Server
cd server
cp .env.example .env
# Edit .env with your secrets (NEVER commit!)

# Client
cd client
cp .env.example .env
# Edit .env with your secrets (NEVER commit!)
```

---

## 📁 Files That Are Now Ignored

### Environment Files
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.env
.env~
```

### Credential Files
```
credentials.json
service-account*.json
*-service-account.json
firebase-config*.js
firebase-service-account*.json
google-services*.json
GoogleService-Info.plist
stripe-keys.json
aws-credentials
```

### Key Files
```
*.pem
*.key
*.crt
*.cer
*.p12
*.pfx
*.private
```

### Documentation with Secrets
```
secrets.md
secret*.md
credentials.md
passwords.md
api-keys.md
private-keys.md
*.secret.md
*.credentials.md
*.passwords.md
*.api-keys.md
```

### Backup Files
```
*.bak
*.backup
*.old
*.orig
*~
```

---

## 🔍 How to Check for Secrets

### Manual Check

```bash
# Check for .env files
find . -name ".env" -not -name ".env.example"

# Check for key files
find . -name "*.pem" -o -name "*.key"

# Check git status
git status

# Check staged files
git diff --cached --name-only
```

### Automated Scan

```bash
# Run the security scanner
./scripts/security-scan.sh

# Output will show:
# - Sensitive files found
# - Secret patterns in code
# - .gitignore coverage
# - Git history issues
```

### Pre-commit Check

The pre-commit hook automatically runs when you commit:

```bash
git commit -m "Your commit"

# Hook will:
# 1. Check for .env files
# 2. Check for credential files
# 3. Check for key files
# 4. Check for secret patterns
# 5. Block commit if issues found
```

---

## 🚨 If You Find Secrets

### In Working Directory

```bash
# 1. Delete the file
rm .env
rm credentials.json

# 2. Or move to safe location
mv .env ../safe-location/.env

# 3. Verify .gitignore covers it
cat .gitignore | grep "\.env"
```

### In Git History

```bash
# If just committed (not pushed)
git reset --soft HEAD~1
git reset HEAD <file>
git checkout -- <file>

# If already pushed
# 1. Rotate secrets IMMEDIATELY
# 2. Use BFG Repo-Cleaner
bfg --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

---

## ✅ Security Checklist

### Before Every Commit

- [ ] Run `git status` - no .env files
- [ ] Run `git diff --cached` - review changes
- [ ] No credentials in code
- [ ] No API keys in documentation
- [ ] Pre-commit hook is active

### Before Every Push

- [ ] Run security scanner
- [ ] Check for .env files
- [ ] Check for credential files
- [ ] Review git log
- [ ] All secrets in environment variables

### Before Deployment

- [ ] All secrets in deployment platform
- [ ] No .env files in build
- [ ] .gitignore is comprehensive
- [ ] Pre-commit hook is working
- [ ] Security scan passes

---

## 📊 Secret Patterns to Watch For

### In Code

```javascript
// ❌ BAD - Hardcoded secrets
const password = "MyPassword123";
const apiKey = "sk_live_xxxxx";
const mongoUri = "mongodb+srv://admin:password@cluster...";

// ✅ GOOD - Environment variables
const password = process.env.PASSWORD;
const apiKey = process.env.API_KEY;
const mongoUri = process.env.MONGODB_URI;
```

### In Documentation

```env
# ❌ BAD - Real credentials
MONGODB_URI=mongodb+srv://admin:Password123@cluster.mongodb.net/db

# ✅ GOOD - Placeholders
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/db
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

---

## 🛡️ Best Practices

### DO ✅
- Use `.env.example` as template
- Add all secrets to `.gitignore`
- Use environment variables
- Install pre-commit hook
- Run security scans regularly
- Rotate secrets regularly
- Use secret management services
- Enable 2FA

### DON'T ❌
- Commit `.env` files
- Hardcode API keys in code
- Share secrets via chat/email
- Store secrets in documentation
- Use same secret across environments
- Log sensitive data
- Commit credential files

---

## 🔧 Commands Reference

### Install Pre-commit Hook
```bash
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks
```

### Run Security Scan
```bash
chmod +x scripts/security-scan.sh
./scripts/security-scan.sh
```

### Check for .env Files
```bash
find . -name ".env" -not -name ".env.example"
```

### Check Staged Files
```bash
git diff --cached --name-only
```

### Search for Secrets
```bash
grep -r "password\s*=" --include="*.js" .
grep -r "api_key\s*=" --include="*.js" .
```

### Remove Sensitive File from Git
```bash
git reset HEAD <file>
git checkout -- <file>
rm <file>
```

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `SECURITY_CHECKLIST.md` | Complete security checklist |
| `SECRETS_GUIDE.md` | Secrets management guide |
| `.githooks/pre-commit` | Pre-commit hook script |
| `scripts/security-scan.sh` | Security scanner script |
| `.gitignore` | Root gitignore (updated) |
| `client/.gitignore` | Client gitignore (updated) |
| `server/.gitignore` | Server gitignore (updated) |

---

## 🎯 Summary

### What's Protected

| Type | Protection | Status |
|------|-----------|--------|
| .env files | .gitignore + pre-commit | ✅ |
| Credential files | .gitignore + pre-commit | ✅ |
| Key files | .gitignore + pre-commit | ✅ |
| Secret docs | .gitignore + pre-commit | ✅ |
| Backup files | .gitignore + pre-commit | ✅ |
| Code secrets | Pre-commit + scanner | ✅ |
| Git history | Scanner check | ✅ |

### How It's Protected

1. **.gitignore** - Prevents accidental staging
2. **Pre-commit hook** - Blocks sensitive files
3. **Security scanner** - Detects leaked secrets
4. **Documentation** - Educates developers

---

## 🆘 Emergency Procedures

### If Secrets Are Committed

1. **Rotate Immediately**
   - Change passwords
   - Generate new API keys
   - Revoke old credentials

2. **Remove from Git**
   ```bash
   git reset --soft HEAD~1
   git reset HEAD <file>
   git checkout -- <file>
   rm <file>
   ```

3. **Clean History** (if pushed)
   ```bash
   bfg --delete-files .env
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

4. **Audit**
   - Check who had access
   - Review logs
   - Monitor for unauthorized access

---

## ✅ Verification

Run these commands to verify everything is set up:

```bash
# 1. Check .gitignore
cat .gitignore | grep "^\.env"
# Should show: .env, .env.local, etc.

# 2. Check pre-commit hook
ls -la .githooks/pre-commit
# Should show executable file

# 3. Check git config
git config --get core.hooksPath
# Should output: .githooks

# 4. Run security scan
./scripts/security-scan.sh
# Should pass with no issues
```

---

**Your secrets are now protected! 🔐**

Remember:
- Never commit .env files
- Use environment variables
- Run security scans regularly
- Keep the pre-commit hook active
