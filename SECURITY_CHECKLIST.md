# 🔐 Security Checklist - Virtual Tourist

## ⚠️ CRITICAL: Never Commit Secrets

This checklist helps ensure no sensitive data is accidentally committed to version control.

---

## 📁 Files That Should NEVER Be Committed

### Environment Files
- [ ] `.env`
- [ ] `.env.local`
- [ ] `.env.development.local`
- [ ] `.env.test.local`
- [ ] `.env.production.local`
- [ ] `*.env`
- [ ] `.env~`

### API Keys & Credentials
- [ ] `credentials.json`
- [ ] `service-account*.json`
- [ ] `firebase-config*.js`
- [ ] `firebase-service-account*.json`
- [ ] `google-services*.json`
- [ ] `GoogleService-Info.plist`
- [ ] `aws-credentials`
- [ ] `.aws/credentials`
- [ ] `stripe-keys.json`

### Certificates & Keys
- [ ] `*.pem`
- [ ] `*.key`
- [ ] `*.crt`
- [ ] `*.cer`
- [ ] `*.p12`
- [ ] `*.pfx`
- [ ] `*.private`

### Documentation with Secrets
- [ ] `secrets.md`
- [ ] `secret*.md`
- [ ] `credentials.md`
- [ ] `passwords.md`
- [ ] `api-keys.md`
- [ ] `private-keys.md`
- [ ] `*.secret.md`
- [ ] `*.credentials.md`
- [ ] `*.passwords.md`
- [ ] `*.api-keys.md`

### Backup Files (May Contain Secrets)
- [ ] `*.bak`
- [ ] `*.backup`
- [ ] `*.old`
- [ ] `*.orig`
- [ ] `*~`

### Database Files
- [ ] `*.sqlite`
- [ ] `*.sqlite3`
- [ ] `*.db`
- [ ] `*.mongod.lock`
- [ ] `*.pid`

### Logs (May Contain Sensitive Data)
- [ ] `*.log`
- [ ] `error.log`
- [ ] `access.log`
- [ ] `npm-debug.log*`

---

## 🔍 Pre-Commit Security Check

### Run Before Every Commit

```bash
# Check for .env files
find . -name ".env*" -not -name ".env.example" -type f

# Check for key files
find . -name "*.pem" -o -name "*.key" -o -name "*.crt" -type f

# Check for credential files
find . -name "credentials.json" -o -name "service-account*.json" -type f

# Check for secret documentation
find . -name "*secret*.md" -o -name "*credentials*.md" -o -name "*password*.md" -type f
```

### Git Scan for Accidental Commits

```bash
# Check staged files
git diff --cached --name-only

# Search for secrets in staged changes
git diff --cached | grep -i "password\|secret\|key\|token\|credential"

# Check for .env in staged files
git diff --cached --name-only | grep -E "\.env|credentials|secret"
```

---

## 🛡️ Git Pre-Commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Pre-commit hook to prevent committing secrets

echo "🔒 Running security check..."

# Check for .env files
ENV_FILES=$(git diff --cached --name-only | grep -E "^\.env|\.env\.local|\.env\." || true)
if [ ! -z "$ENV_FILES" ]; then
  echo "❌ ERROR: Attempting to commit environment files:"
  echo "$ENV_FILES"
  echo ""
  echo "Please remove these files from staging:"
  echo "  git reset HEAD $ENV_FILES"
  exit 1
fi

# Check for common secret patterns
SECRETS=$(git diff --cached | grep -iE "password\s*=\s*['\"][^'\"]+['\"]|api_key\s*=\s*['\"][^'\"]+['\"]|secret\s*=\s*['\"][^'\"]+['\"]" || true)
if [ ! -z "$SECRETS" ]; then
  echo "⚠️  WARNING: Possible secrets detected in changes:"
  echo "$SECRETS"
  echo ""
  echo "Please review these changes carefully."
  read -p "Continue anyway? (y/N): " confirm
  if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    exit 1
  fi
fi

echo "✅ Security check passed"
exit 0
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## 📋 Secure Environment Setup

### 1. Create .env from Example

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

### 2. Verify .gitignore

```bash
# Check .gitignore includes .env
cat .gitignore | grep "^\.env"

# Should output:
# .env
# .env.local
# etc.
```

### 3. Add to .git/info/exclude (Local Only)

```bash
# Add local files that should be ignored
echo ".env" >> .git/info/exclude
echo "*.local" >> .git/info/exclude
echo "uploads/" >> .git/info/exclude
```

---

## 🔐 Secrets Management

### Use Environment Variables

**✅ Good:**
```javascript
// config.js
const apiKey = process.env.STRIPE_SECRET_KEY;
```

**❌ Bad:**
```javascript
// config.js
const apiKey = "sk_live_xxxxx"; // NEVER DO THIS
```

### Use Secret Management Services

For production, use:
- **Render**: Environment Variables dashboard
- **Netlify**: Site Settings → Build & Deploy → Environment
- **Vercel**: Project Settings → Environment Variables
- **AWS**: Secrets Manager or Parameter Store
- **Doppler**: Secret management platform

---

## 🚨 If You Accidentally Commit Secrets

### 1. Rotate the Secret Immediately

- Change the password/API key
- Generate new credentials
- Revoke the compromised secret

### 2. Remove from Git History

```bash
# If just committed (not pushed)
git reset --soft HEAD~1
git reset HEAD <file-with-secrets>
git checkout -- <file-with-secrets>

# If already pushed
# 1. Rotate secrets IMMEDIATELY
# 2. Use BFG Repo-Cleaner or git-filter-repo
# 3. Force push (coordinate with team)
```

### 3. Use BFG Repo-Cleaner

```bash
# Install BFG
brew install bfg

# Remove files with secrets
bfg --delete-files .env
bfg --delete-files credentials.json

# Clean and push
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

### 4. GitHub Secret Scanning

If public repo:
- GitHub will automatically scan for secrets
- You'll get an alert
- Rotate the secret immediately
- GitHub will show the commit

---

## 📊 Security Audit Commands

### Check for Secrets in Repository

```bash
# Search for common secret patterns
grep -r "password\s*=" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" .
grep -r "api_key\s*=" --include="*.js" --include="*.jsx" .
grep -r "secret\s*=" --include="*.js" --include="*.jsx" .
grep -r "token\s*=" --include="*.js" --include="*.jsx" .

# Search for hardcoded URLs with credentials
grep -r "://.*:.*@" .
```

### Check Git History

```bash
# Search entire git history for secrets
git log -p --all | grep -i "password\|secret\|api_key\|token"

# Find commits with .env files
git log --all --full-history -- "**/.env*"
```

### Use Secret Scanning Tools

```bash
# Install truffleHog
pip install truffleHog

# Scan repository
trufflehog .

# Install gitleaks
brew install gitleaks

# Scan repository
gitleaks detect --source . -v
```

---

## 🎯 Best Practices

### ✅ DO:
- Use `.env.example` as template
- Add all secrets to `.gitignore`
- Use environment variables in code
- Rotate secrets regularly
- Use secret management services
- Enable 2FA on all accounts
- Use different secrets for dev/staging/prod
- Audit access regularly

### ❌ DON'T:
- Commit `.env` files
- Hardcode API keys in code
- Share secrets via chat/email
- Use same secret across environments
- Log sensitive data
- Commit credential files
- Store secrets in documentation
- Push to public repos with secrets

---

## 📝 Environment Variables Checklist

### Server (.env)
- [ ] `MONGODB_URI` - Database connection string
- [ ] `JWT_SECRET` - JWT signing key
- [ ] `EMAIL_PASSWORD` - Email service password
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary secret
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `AWS_SECRET_ACCESS_KEY` - AWS secret key

### Client (.env)
- [ ] `VITE_API_URL` - Backend API URL
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- [ ] `VITE_GOOGLE_MAPS_KEY` - Google Maps API key
- [ ] `VITE_MAPBOX_TOKEN` - Mapbox token

---

## 🔍 Documentation Review

Before committing any documentation:

- [ ] No real API keys in examples
- [ ] No passwords in screenshots
- [ ] No connection strings with credentials
- [ ] Use placeholders like `your-api-key-here`
- [ ] Use `<password>` instead of real passwords
- [ ] Use `mongodb+srv://user:pass@...` format

### Example Documentation

**✅ Good:**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/db
```

**❌ Bad:**
```env
MONGODB_URI=mongodb+srv://admin:MyRealPassword123@cluster0.abc123.mongodb.net/db
```

---

## 🚀 Deployment Security

### Before Deploying

- [ ] All secrets in deployment platform's env vars
- [ ] No .env files in build output
- [ ] Build process doesn't expose secrets
- [ ] API keys are properly scoped
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced

### After Deploying

- [ ] Test with new secrets
- [ ] Verify old secrets are revoked
- [ ] Check logs for leaked secrets
- [ ] Monitor for unauthorized access
- [ ] Update documentation

---

## 📞 Emergency Contacts

If secrets are compromised:

1. **Rotate Immediately**: Change all compromised credentials
2. **Audit Access**: Check who had access
3. **Monitor**: Watch for unauthorized activity
4. **Document**: Record what happened and response
5. **Prevent**: Implement measures to prevent recurrence

---

## 📚 Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [GitGuardian](https://www.gitguardian.com/)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [OWASP Secret Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12 Factor App - Config](https://12factor.net/config)

---

## ✅ Final Checklist Before Push

```bash
# Run this before every push

echo "🔒 Security Check"
echo "================"

# Check for .env files
echo "1. Checking for .env files..."
if find . -name ".env" -not -name ".env.example" | grep -q .; then
  echo "   ❌ Found .env files!"
  exit 1
else
  echo "   ✅ No .env files"
fi

# Check git status
echo "2. Checking staged files..."
git diff --cached --name-only | grep -E "\.env|credentials|secret" && {
  echo "   ❌ Found sensitive files in staging!"
  exit 1
} || echo "   ✅ No sensitive files staged"

# Check for key files
echo "3. Checking for key files..."
if find . -name "*.pem" -o -name "*.key" | grep -q .; then
  echo "   ⚠️  Found key files - verify they're not staged"
else
  echo "   ✅ No key files"
fi

echo ""
echo "✅ Security check complete!"
```

---

**Remember: Once secrets are in git history, they're very hard to remove completely. Always check before committing!** 🔐
