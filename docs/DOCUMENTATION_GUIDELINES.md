# Documentation Guidelines (2026)

**Repository**: [devTechs001/world-tourist-virtual](https://github.com/devTechs001/world-tourist-virtual)

---

## 📁 Documentation Structure

All documentation files are kept in the `/docs` folder, except:
- `README.md` (main project overview in root)

### File Organization

```
virtual-tourist/
├── README.md              # Main documentation (root)
├── docs/                  # All other documentation
│   ├── INDEX.md          # Documentation hub
│   ├── SETUP.md          # Setup guide
│   ├── SECURITY.md       # Security guide
│   ├── DEPLOYMENT.md     # Deployment guide
│   └── ...               # All other docs
└── ...
```

---

## 🔒 Security Rules for Documentation

### ✅ Safe to Include

- Example configurations with placeholders
- Environment variable names (not values)
- Code snippets without credentials
- Architecture diagrams
- API endpoint structure (without keys)
- Installation instructions
- Troubleshooting guides

### ❌ Never Include

- Actual passwords or API keys
- Database connection strings with real credentials
- JWT secrets
- OAuth client secrets
- AWS/GCP/Azure credentials
- Stripe/PayPal API keys
- Email service credentials
- Any file with `.env`, `.key`, `.pem`, `.secret`

### Placeholder Format

Use these formats for examples:

```bash
# ✅ Good placeholders
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db
JWT_SECRET=your-secret-key-here
API_KEY=your-api-key-change-this

# ❌ Bad - looks like real values
MONGODB_URI=mongodb+srv://admin:secret123@cluster.mongodb.net/prod
```

---

## 📝 Documentation Standards

### File Naming

- Use UPPERCASE for main guides: `SETUP.md`, `SECURITY.md`
- Use lowercase for supplementary: `troubleshooting.md`
- Use hyphens for multi-word: `github-pages.md`

### File Structure

Each documentation file should have:

1. **Title** with year (2026)
2. **Brief description**
3. **Table of contents** (for long docs)
4. **Main content** with clear headings
5. **Last updated** date
6. **Version** number

### Markdown Style

```markdown
# Title (2026)

Brief description.

## Section Heading

Content here.

### Subsection

- Bullet points
- For lists

```javascript
// Code blocks with syntax highlighting
const example = true;
```

**Last Updated**: March 2026  
**Version**: 2.0.0
```

---

## 🔄 Updating Documentation

### When to Update

- Adding new features
- Changing configuration
- Fixing bugs
- Updating dependencies
- Changing deployment process

### How to Update

1. Edit the relevant `.md` file in `/docs`
2. Update "Last Updated" date
3. Increment version if major change
4. Update `docs/INDEX.md` if adding new file
5. Commit with clear message

### Commit Messages

```bash
# Good
docs: Update MongoDB setup instructions
docs: Add GitHub Pages deployment guide
docs: Fix security configuration examples

# Bad
update docs
fixed stuff
```

---

## 📊 Documentation Checklist

Before committing documentation:

- [ ] No secrets or credentials included
- [ ] All placeholders use proper format
- [ ] Code snippets are tested
- [ ] Links are working
- [ ] "Last Updated" date is current
- [ ] Version number is updated if needed
- [ ] File is in `/docs` folder (except README.md)
- [ ] `docs/INDEX.md` is updated if new file added

---

## 🔍 Security Review

Before pushing documentation:

```bash
# Check for accidental secrets
grep -r "password\|secret\|key\|token" docs/ \
  | grep -v "example\|placeholder\|your-\|change-"

# Review changed files
git diff --name-only
```

---

## 📚 Documentation Files

### Core Documentation (Required)

| File | Purpose |
|------|---------|
| `INDEX.md` | Documentation hub |
| `SETUP.md` | Setup instructions |
| `SECURITY.md` | Security guide |
| `FEATURES.md` | Feature list |

### Deployment Documentation

| File | Purpose |
|------|---------|
| `DEPLOYMENT.md` | All deployment options |
| `GITHUB_PAGES.md` | GitHub Pages guide |
| `NETLIFY.md` | Netlify guide |
| `RENDER.md` | Render guide |

### Development Documentation

| File | Purpose |
|------|---------|
| `PROJECT_STRUCTURE.md` | Code organization |
| `COMPONENTS.md` | Component reference |
| `API_REFERENCE.md` | API docs |

---

## 🎯 Quick Reference

### Documentation Location

- Main README: `/README.md`
- All other docs: `/docs/*.md`

### Safe Example Values

```
your-username
your-password
change-me
example-value
placeholder
devTechs001 (our GitHub username)
```

### Never Commit

```
.env
.env.local
.env.production
*.key
*.pem
credentials.json
*-service-account.json
```

---

**Last Updated**: March 2026  
**Version**: 2.0.0
