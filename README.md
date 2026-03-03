# 🌍 Virtual Tourist - Explore the World Virtually (2026)

> **Version 2.0.0** | Modern MERN Stack Virtual Tour Platform | Enhanced with Offline Support

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://mongodb.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://devtechs001.github.io/world-tourist-virtual/)

A comprehensive virtual tourist application that lets you explore the world from the comfort of your home with immersive 360° virtual tours, interactive maps, and seamless booking capabilities.

---

## ✨ What's New in v2.0 (2026)

### 🎯 Key Improvements
- ✅ **MongoDB Fallback**: Automatic failover from Atlas to local MongoDB
- ✅ **Compass Offline Mode**: Auto North fallback when offline
- ✅ **16 New Components**: Dashboard enhancements, travel tools, AR features
- ✅ **26 Destinations**: 12 African destinations with rich history, 8 mysterious places, 6 hidden gems
- ✅ **Enhanced Dashboards**: Admin & User dashboard improvements
- ✅ **Better Organization**: Complete documentation in `/docs` folder
- ✅ **Deployment Ready**: Netlify, Render, GitHub Pages configurations

### 🆕 New Features
| Category | Features |
|----------|----------|
| **Dashboard** | Notification Center, Quick Actions, Activity Feed, Enhanced Stats |
| **Travel Tools** | Compass, Weather, Currency Converter, Travel Guide, Trip Planner |
| **Navigation** | WorldAtlas, Interactive Map, Nearby Places |
| **Media** | Photo Gallery, Social Sharing, AR View |
| **Content** | 12 African Destinations, 8 Mysterious Places, 6 Hidden Gems |

---

## 🚀 Quick Start

### One-Command Setup

```bash
# Clone, install, and setup MongoDB
git clone https://github.com/devTechs001/virtual-tourist.git
cd virtual-tourist
npm run setup
```

### Manual Setup

```bash
# 1. Install dependencies
npm run install:all

# 2. Setup MongoDB
npm run setup:mongodb

# 3. Start development
npm run dev
```

### Access Points

| Service | URL | Port |
|---------|-----|------|
| **Client** | http://localhost:5173 | 5173 |
| **Server API** | http://localhost:5000/api | 5000 |
| **MongoDB** | localhost:27017 | 27017 |

---

## 📚 Documentation

Complete documentation is available in the [`/docs`](docs/) folder:

| Document | Description |
|----------|-------------|
| [SETUP_DEPLOYMENT.md](docs/SETUP_DEPLOYMENT.md) | Complete setup & deployment |
| [SETUP.md](docs/SETUP.md) | Detailed setup guide |
| [MONGODB_SETUP.md](docs/MONGODB_SETUP.md) | MongoDB configuration |
| [SECURITY.md](docs/SECURITY.md) | Security guide |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment guides |
| [FEATURES.md](docs/FEATURES.md) | Complete feature list |
| [COMPONENTS.md](docs/COMPONENTS.md) | Component reference |
| [GITHUB_PAGES.md](docs/GITHUB_PAGES.md) | GitHub Pages deployment |
| [INDEX.md](docs/INDEX.md) | Full documentation index |

**Note**: All documentation is kept in `/docs` folder except this main README.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Query** for data fetching
- **React Router v6** for routing
- **Recharts** for charts
- **Lucide React** for icons
- **PWA** support with Workbox

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **Socket.io** for real-time
- **Helmet** for security
- **Rate Limiting** for API protection

### DevOps
- **Docker** & Docker Compose
- **Netlify** for frontend hosting
- **Render** for backend hosting
- **GitHub Pages** for static hosting
- **GitHub Actions** for CI/CD

---

## 📦 Project Structure

```
virtual-tourist/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # React components (16 new!)
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── context/     # State management
│   │   └── services/    # API services
│   └── ...
│
├── server/              # Express Backend
│   ├── config/          # MongoDB connection manager
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── middleware/      # Express middleware
│
├── docs/                # Documentation (NEW!)
│   ├── SETUP.md
│   ├── MONGODB_SETUP.md
│   ├── DEPLOYMENT.md
│   ├── FEATURES.md
│   └── ...
│
├── scripts/             # Setup scripts
├── docker-compose.yml   # Docker configuration
├── netlify.toml         # Netlify config
├── render.yaml          # Render config
└── package.json         # Root package
```

---

## 🎯 Key Features

### For Users
- 🌍 **Virtual Tours** - 360° panoramic experiences
- 🗺️ **Interactive Map** - Explore destinations visually
- 📅 **Booking System** - Seamless booking flow
- ❤️ **Favorites** - Save preferred tours
- ⭐ **Reviews** - Rate and review experiences
- 📱 **PWA** - Installable web app
- 🧭 **Travel Tools** - Compass, Weather, Currency, Guide
- 📊 **Trip Planner** - Plan your virtual adventures

### For Admins
- 📊 **Dashboard** - Enhanced analytics and stats
- 🔔 **Notifications** - Real-time notification center
- ⚡ **Quick Actions** - Keyboard shortcuts
- 📈 **Activity Feed** - Track platform activity
- 🗂️ **Content Management** - Manage tours and destinations
- 👥 **User Management** - Manage users and roles
- 📝 **Review Moderation** - Approve/reject reviews

---

## 🔌 MongoDB Configuration

The application features **intelligent connection fallback**:

```
1. MongoDB Atlas (Production)
   ↓ (if unavailable)
2. MongoDB Docker (Development)
   ↓ (if unavailable)
3. MongoDB Local/Compass (Fallback)
```

### Setup Options

```bash
# Docker MongoDB (Recommended)
npm run docker:mongodb

# Interactive Setup
npm run setup:mongodb

# Using Docker Compose
docker-compose up mongodb -d
```

See [docs/MONGODB_SETUP.md](docs/MONGODB_SETUP.md) for details.

---

## 🚀 Deployment

### Frontend (Netlify)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Backend (Render)

1. Push to GitHub
2. Import in Render dashboard
3. Deploy automatically

### Full Stack (Docker)

```bash
docker-compose up -d
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete guides.

---

## 📝 Environment Setup

### Server (.env)

```bash
# Database (Auto-fallback configured)
MONGODB_URI_DOCKER=mongodb://admin:admin123@localhost:27017/virtual-tourist
MONGODB_URI_LOCAL=mongodb://localhost:27017/virtual-tourist
USE_LOCAL_DB=true

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your-secret-key-2026
```

### Client (.env)

```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Virtual Tourist
VITE_APP_URL=http://localhost:5173
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Client tests
cd client && npm test

# E2E tests
cd client && npm run test:e2e
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License - feel free to use for learning or commercial projects.

---

## 🙏 Acknowledgments

- Built with the MERN Stack
- Icons by Lucide React
- Maps by Mapbox/Google Maps
- Inspired by real-world travel platforms

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/virtual-tourist/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/virtual-tourist/discussions)

---

**Built with ❤️ for virtual explorers worldwide**

**Last Updated**: March 2026  
**Version**: 2.0.0
