# 🔐 Security Guide - Virtual Tourist (2026)

This guide covers all security measures and how to properly manage secrets in the Virtual Tourist project.

---

## 🚫 Never Commit These Files

### Environment Files
- ❌ `.env` (use `.env.example` instead)
- ❌ `.env.local`
- ❌ `.env.production`
- ❌ Any file with actual credentials

### Key Files
- ❌ `*.pem`, `*.key`, `*.crt`
- ❌ `*.p12`, `*.pfx`
- ❌ `*-service-account.json`
- ❌ `firebase-adminsdk*.json`

### Configuration with Secrets
- ❌ `config.local.json`
- ❌ `credentials.json`
- ❌ `aws-credentials`
- ❌ `stripe-keys.json`

### Documentation with Secrets
- ❌ `SECRETS.md`
- ❌ `CREDENTIALS.md`
- ❌ `API_KEYS.md`
- ❌ `PASSWORDS.md`

---

## ✅ Safe Files to Commit

### Example Files
- ✅ `.env.example` (with placeholder values)
- ✅ `*.example`
- ✅ `*.template`
- ✅ `*.sample`

### Main Documentation
- ✅ `README.md`
- ✅ `docs/` (without secrets)
- ✅ `CONTRIBUTING.md`

### Configuration
- ✅ `package.json` (without secrets)
- ✅ `netlify.toml` (without secrets)
- ✅ `render.yaml` (without secrets)
- ✅ `docker-compose.yml` (without secrets)

---

## 🔑 Managing Secrets

### Development

1. **Create .env from example**:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. **Fill in real values** (these files are gitignored):
```bash
# server/.env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
JWT_SECRET=your-actual-secret-here
```

### Production

1. **Use Environment Variables** in your hosting platform:
   - Netlify: Settings → Environment Variables
   - Render: Environment tab
   - GitHub Actions: Repository Secrets

2. **Use Secret Managers**:
   - AWS Secrets Manager
   - Google Secret Manager
   - Azure Key Vault
   - Doppler
   - Vault

---

## 📁 .gitignore Coverage

The root `.gitignore` blocks:

### Patterns
```
.env*                    # All env files
*.key, *.pem, *.crt     # Key files
credentials*             # Credential files
secrets/                 # Secret directories
*password*               # Password files
*token*                  # Token files
*secret*                 # Secret files
```

### Specific Files
```
.aws/credentials
firebase-adminsdk*.json
stripe-keys.json
google-services.json
```

---

## 🔍 Checking for Accidental Commits

### Before Pushing

```bash
# Check for secrets in staged files
git diff --cached | grep -i "password\|secret\|key\|token"

# Check for .env files
git ls-files | grep -E "\.env|credentials|secrets"

# Use git-secrets
git secrets --scan
```

### Tools

```bash
# Install git-secrets
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
sudo make install

# Initialize in your repo
git secrets --install
git secrets --register-aws

# Scan history
git secrets --scan-history
```

### TruffleHog (Secret Scanner)

```bash
# Install
pip install truffleHog

# Scan repository
trufflehog .

# Scan specific branch
trufflehog --branch=main .
```

---

## 🛡️ Best Practices

### 1. Environment Variables

```bash
# ✅ Good: Use environment variables
const mongoUri = process.env.MONGODB_URI;

# ❌ Bad: Hardcode secrets
const mongoUri = 'mongodb://user:password@...';
```

### 2. Example Files

```bash
# ✅ Good: .env.example with placeholders
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-jwt-secret-here

# ❌ Bad: Real values in example
MONGODB_URI=mongodb+srv://admin:realpassword123@cluster.mongodb.net/prod
```

### 3. Client Secrets

```bash
# ✅ Good: Public keys only in client
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ❌ Bad: Never put secret keys in client
VITE_STRIPE_SECRET_KEY=sk_test_...  # NEVER!
```

### 4. Git Hooks

```bash
# Pre-commit hook to check for secrets
# .githooks/pre-commit

#!/bin/bash
if git diff --cached | grep -iE "password|secret|api_key|token"; then
    echo "⚠️  Potential secret detected in staged changes!"
    echo "Please review before committing."
    exit 1
fi
```

---

## 🚨 If You Accidentally Commit Secrets

### Immediate Actions

1. **Rotate the secret immediately**
   - Change passwords
   - Regenerate API keys
   - Update tokens

2. **Remove from Git history**

```bash
# Remove specific file from history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/secret' \
  --prune-empty --tag-name-filter cat -- --all

# Or use BFG Repo-Cleaner
bfg --delete-files .env
```

3. **Force push**
```bash
git push origin --force --all
```

4. **Contact GitHub** (if public repo)
   - Request cached data removal
   - Report exposed secrets

---

## 📋 Security Checklist

### Before Each Commit
- [ ] No `.env` files staged
- [ ] No key files staged
- [ ] No credentials in code
- [ ] Using environment variables
- [ ] Example files have placeholders

### Before Each Push
- [ ] Run secret scanner
- [ ] Review git diff
- [ ] Check for accidental logs
- [ ] Verify .gitignore is working

### Production Deployment
- [ ] All secrets in environment variables
- [ ] No secrets in code repository
- [ ] HTTPS everywhere
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Error messages don't leak info

---

## 🔐 Encryption

### Sensitive Data at Rest

```javascript
// Use bcrypt for passwords
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 12);

// Use crypto for sensitive data
const crypto = require('crypto');
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(data));
```

### API Keys in Transit

```bash
# Always use HTTPS
# Never send secrets in URL
https://api.example.com/data  # ✅ Good
http://api.example.com/data?key=secret  # ❌ Bad
```

---

## 📞 Emergency Contacts

If secrets are exposed:

1. **MongoDB Atlas**: Change password immediately
2. **JWT Secret**: Regenerate and force re-login
3. **API Keys**: Revoke and create new ones
4. **Database**: Change credentials, audit access

---

## 📚 Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Git Secrets](https://github.com/awslabs/git-secrets)
- [TruffleHog](https://github.com/dxa4481/truffleHog)
- [OWASP Secret Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Last Updated**: March 2026  
**Version**: 2.0.0
