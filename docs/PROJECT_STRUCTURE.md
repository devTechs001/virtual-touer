# Virtual Tourist - Project Structure (2026)

Complete organizational structure of the Virtual Tourist application.

## 📁 Root Structure

```
virtual-tourist/
├── 📂 .github/                    # GitHub configuration
│   └── workflows/
│       └── deploy-gh-pages.yml   # GitHub Pages deployment
│
├── 📂 .githooks/                  # Git hooks
│   └── pre-commit                # Pre-commit checks
│
├── 📂 client/                     # React Frontend (Vite)
│   ├── 📂 public/                # Static assets
│   │   ├── manifest.json        # PWA manifest
│   │   ├── sw.js                # Service worker
│   │   └── icons/               # PWA icons
│   │
│   ├── 📂 src/                   # Source code
│   │   ├── 📂 assets/           # Images, fonts, etc.
│   │   ├── 📂 components/       # React components
│   │   │   ├── ar/             # AR components
│   │   │   ├── auth/           # Authentication
│   │   │   ├── booking/        # Booking components
│   │   │   ├── common/         # Reusable components
│   │   │   ├── destination/    # Destination components
│   │   │   ├── filter/         # Filter components
│   │   │   ├── layout/         # Layout components
│   │   │   ├── maps/           # Map components
│   │   │   ├── notification/   # Notification components
│   │   │   ├── reviews/        # Review components
│   │   │   ├── social/         # Social sharing
│   │   │   ├── tours/          # Tour components
│   │   │   └── vr/             # VR/AR components
│   │   │
│   │   ├── 📂 context/          # State management (Zustand)
│   │   ├── 📂 data/             # Static data
│   │   ├── 📂 hooks/            # Custom hooks
│   │   ├── 📂 i18n/             # Internationalization
│   │   ├── 📂 pages/            # Page components
│   │   │   └── admin/          # Admin pages
│   │   │
│   │   ├── 📂 services/         # API services
│   │   ├── 📂 styles/           # Global styles
│   │   ├── 📂 test/             # Test utilities
│   │   ├── 📂 utils/            # Utility functions
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # App styles
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # Entry point
│   │
│   ├── 📂 e2e/                   # E2E tests (Playwright)
│   ├── .env.example              # Environment template
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── playwright.config.js
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── TESTING.md
│   ├── vitest.config.js
│   └── vite.config.js
│
├── 📂 docs/                      # Documentation
│   ├── INDEX.md                  # Documentation index
│   ├── SETUP.md                  # Setup guide
│   ├── MONGODB_SETUP.md          # MongoDB configuration
│   ├── DEPLOYMENT.md             # Deployment guides
│   ├── FEATURES.md               # Features list
│   ├── PROJECT_STRUCTURE.md      # This file
│   ├── COMPONENTS.md             # Component documentation
│   ├── API_REFERENCE.md          # API docs
│   ├── TROUBLESHOOTING.md        # Troubleshooting
│   └── FAQ.md                    # FAQ
│
├── 📂 scripts/                   # Utility scripts
│   ├── setup-mongodb.sh          # MongoDB setup (Unix)
│   └── setup-mongodb.bat         # MongoDB setup (Windows)
│
├── 📂 server/                    # Express Backend
│   ├── 📂 config/               # Configuration
│   │   ├── config.js           # App config
│   │   ├── database.js         # Database config
│   │   └── db.js               # MongoDB connection manager
│   │
│   ├── 📂 controllers/          # Route controllers
│   ├── 📂 middleware/           # Express middleware
│   ├── 📂 models/               # Mongoose models
│   ├── 📂 routes/               # API routes
│   ├── 📂 services/             # Business logic
│   ├── 📂 utils/                # Utility functions
│   ├── 📂 tests/                # Backend tests
│   │
│   ├── 📂 uploads/              # Uploaded files (dev)
│   ├── .env.example             # Environment template
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package.json
│   ├── seed.js                  # Database seeding
│   ├── server.js                # Entry point
│   ├── TESTING.md
│   └── vitest.config.js
│
├── 📄 .gitignore                 # Git ignore rules
├── 📄 docker-compose.yml         # Docker configuration
├── 📄 netlify.toml               # Netlify config
├── 📄 render.yaml                # Render config
├── 📄 package.json               # Root package.json
├── 📄 README.md                  # Main README
├── 📄 ENHANCEMENTS.md            # Enhancement docs
├── 📄 FEATURE_SUMMARY.md         # Feature summary
├── 📄 DASHBOARD_ENHANCEMENTS.md  # Dashboard docs
├── 📄 COMPLETE_SUMMARY.md        # Complete summary
└── 📄 setup.sh                   # Setup script
```

---

## 📂 Component Organization

### Maps Components (`client/src/components/maps/`)

```
maps/
├── InteractiveMap.jsx    # Mapbox/Google Maps integration
├── Compass.jsx          # Directional compass with offline fallback
├── WorldAtlas.jsx       # Country encyclopedia
└── index.js             # Exports
```

### Destination Components (`client/src/components/destination/`)

```
destination/
├── WeatherWidget.jsx       # Weather forecast
├── TravelGuide.jsx         # Travel tips and guides
├── CurrencyConverter.jsx   # Currency conversion
├── NearbyPlaces.jsx        # Nearby amenities
├── TimelineView.jsx        # Trip itinerary
└── index.js                # Exports
```

### Common Components (`client/src/components/common/`)

```
common/
├── Button.jsx              # Reusable button
├── Input.jsx               # Form input
├── Card.jsx                # Card container
├── Modal.jsx               # Modal dialog
├── Spinner.jsx             # Loading spinner
├── Badge.jsx               # Status badge
├── LoadingScreen.jsx       # Full-screen loader
├── PhotoGallery.jsx        # Image gallery
├── QuickActions.jsx        # Quick action buttons
├── ActivityFeed.jsx        # Activity stream
├── EnhancedDashboardStats.jsx  # Dashboard statistics
└── index.js                # Exports
```

### Dashboard Components

```
notification/
└── NotificationCenter.jsx  # Notification center

booking/
├── BookingForm.jsx        # Booking form
├── BookingStatus.jsx      # Booking status
├── TripPlanner.jsx        # Trip planning
└── index.js               # Exports

social/
└── SocialSharing.jsx      # Social media sharing

vr/
├── VRViewer.jsx           # VR viewer
├── ThreeScene.jsx         # 3D scene
├── ARView.jsx             # AR camera
└── index.js               # Exports
```

---

## 📂 Page Organization

### Public Pages (`client/src/pages/`)

```
pages/
├── Home.jsx               # Landing page
├── Explore.jsx            # Explore tours
├── Destinations.jsx       # Destinations list
├── DestinationDetails.jsx # Destination details
├── TourDetails.jsx        # Tour details
├── VirtualTour.jsx        # VR tour viewer
├── Map.jsx                # Interactive map (enhanced)
├── Login.jsx              # Login page
├── Register.jsx           # Registration
├── About.jsx              # About page
├── Contact.jsx            # Contact page
├── NotFound.jsx           # 404 page
├── Maintenance.jsx        # Maintenance page
│
├── UserDashboard.jsx      # User dashboard
├── Profile.jsx            # User profile
├── Bookings.jsx           # User bookings
├── Favorites.jsx          # User favorites
├── Checkout.jsx           # Checkout page
│
└── admin/                 # Admin pages
    ├── AdminDashboard.jsx     # Admin dashboard
    ├── AdminTours.jsx         # Tour management
    ├── AdminUsers.jsx         # User management
    ├── AdminBookings.jsx      # Booking management
    ├── AdminSystem.jsx        # System settings
    ├── TourCreator.jsx        # Tour creation
    ├── AnalyticsPage.jsx      # Analytics
    └── ...
```

---

## 📂 Server Organization

### Configuration (`server/config/`)

```
config/
├── config.js            # Application config
├── database.js          # Database utilities
└── db.js                # MongoDB connection manager
```

### Models (`server/models/`)

```
models/
├── User.js              # User model
├── Tour.js              # Tour model
├── Destination.js       # Destination model
├── Booking.js           # Booking model
├── Review.js            # Review model
├── Favorite.js          # Favorite model
└── ...
```

### Controllers (`server/controllers/`)

```
controllers/
├── authController.js        # Authentication
├── tourController.js        # Tour operations
├── destinationController.js # Destination operations
├── bookingController.js     # Booking operations
├── reviewController.js      # Review operations
├── userController.js        # User operations
└── adminController.js       # Admin operations
```

### Routes (`server/routes/`)

```
routes/
├── authRoutes.js        # /api/auth/*
├── tourRoutes.js        # /api/tours/*
├── destinationRoutes.js # /api/destinations/*
├── bookingRoutes.js     # /api/bookings/*
├── reviewRoutes.js      # /api/reviews/*
├── favoriteRoutes.js    # /api/favorites/*
├── uploadRoutes.js      # /api/upload/*
├── adminRoutes.js       # /api/admin/*
└── index.js             # Route aggregator
```

### Middleware (`server/middleware/`)

```
middleware/
├── auth.js              # Authentication middleware
├── error.js             # Error handling
├── notFound.js          # 404 handler
├── upload.js            # File upload
├── validate.js          # Input validation
├── rateLimiter.js       # Rate limiting
└── auditLogger.js       # Audit logging
```

---

## 🔌 API Endpoints Structure

```
/api/
├── auth/
│   ├── POST   /register
│   ├── POST   /login
│   ├── POST   /logout
│   ├── GET    /me
│   └── PUT    /profile
│
├── tours/
│   ├── GET    /              # List tours
│   ├── GET    /:id           # Get tour
│   ├── GET    /featured      # Featured tours
│   ├── GET    /search        # Search tours
│   ├── POST   /              # Create tour (Admin)
│   ├── PUT    /:id           # Update tour (Admin)
│   └── DELETE /:id           # Delete tour (Admin)
│
├── destinations/
│   ├── GET    /              # List destinations
│   ├── GET    /:id           # Get destination
│   └── ...
│
├── bookings/
│   ├── GET    /              # List bookings
│   ├── POST   /              # Create booking
│   ├── GET    /:id           # Get booking
│   ├── PUT    /:id           # Update booking
│   └── DELETE /:id           # Cancel booking
│
├── reviews/
│   ├── GET    /tour/:tourId  # Tour reviews
│   ├── POST   /              # Create review
│   ├── PUT    /:id           # Update review
│   └── DELETE /:id           # Delete review
│
├── favorites/
│   ├── GET    /              # List favorites
│   ├── POST   /:tourId       # Add favorite
│   └── DELETE /:tourId       # Remove favorite
│
└── admin/
    ├── GET    /stats         # Get statistics
    ├── GET    /users         # Get all users
    ├── GET    /bookings      # Get all bookings
    ├── GET    /activity      # Get activity log
    └── ...
```

---

## 📊 Data Flow

### Frontend Data Flow

```
User Action → Component → Hook/Context → Service → API
                                          ↓
                                      Response
                                          ↓
Component ← State Update ← Context ← React Query
```

### Backend Data Flow

```
Request → Middleware → Route → Controller → Service → Model
                                                        ↓
                                                  Database
                                                        ↓
Response ← Middleware ← Error Handler ← Controller ← Service
```

---

## 🔐 State Management

### Zustand Stores (`client/src/context/`)

```
context/
├── authStore.js           # Authentication state
├── tourStore.js           # Tour state
├── bookingStore.js        # Booking state
├── uiStore.js             # UI state
└── index.js               # Store exports
```

### React Query (`client/src/hooks/`)

```
hooks/
├── useAuth.js             # Auth queries
├── useTours.js            # Tour queries
├── useBookings.js         # Booking queries
├── useDashboard.js        # Dashboard data
└── useApi.js              # Generic API hook
```

---

## 📝 Configuration Files

### Root Level

| File | Purpose |
|------|---------|
| `package.json` | Root npm config |
| `docker-compose.yml` | Docker services |
| `netlify.toml` | Netlify deployment |
| `render.yaml` | Render deployment |
| `.gitignore` | Git ignore rules |

### Client Level

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite build config |
| `tailwind.config.js` | Tailwind CSS config |
| `postcss.config.js` | PostCSS config |
| `vitest.config.js` | Vitest test config |
| `playwright.config.js` | E2E test config |
| `eslint.config.js` | ESLint config |
| `.env.example` | Environment template |

### Server Level

| File | Purpose |
|------|---------|
| `server.js` | Express app entry |
| `seed.js` | Database seeding |
| `vitest.config.js` | Test config |
| `.env.example` | Environment template |

---

## 🎯 Key Files Reference

| File | Description |
|------|-------------|
| `client/src/App.jsx` | Main React app |
| `client/src/main.jsx` | React entry point |
| `server/server.js` | Express server |
| `server/config/db.js` | MongoDB connection |
| `docs/INDEX.md` | Documentation index |
| `scripts/setup-mongodb.sh` | MongoDB setup |

---

**Last Updated**: March 2026  
**Version**: 2.0.0
