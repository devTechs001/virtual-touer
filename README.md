# Virtual Tourist - MERN Stack Application

A comprehensive, modern virtual tourist application built with the MERN stack (MongoDB, Express.js, React, Node.js). Explore the world from the comfort of your home with immersive 360° virtual tours, interactive maps, and seamless booking capabilities.

## 🌟 Features

### Frontend (React + Vite)
- **Modern UI/UX** - Built with Tailwind CSS and Framer Motion for smooth animations
- **PWA Support** - Progressive Web App with offline capabilities
- **Virtual Tours** - 360° panoramic views with VR support
- **Interactive Maps** - Mapbox/Google Maps integration
- **Booking System** - Complete booking flow with status tracking
- **User Authentication** - Secure JWT-based authentication
- **Responsive Design** - Mobile-first, works on all devices
- **State Management** - Zustand for global state management
- **API Integration** - React Query for efficient data fetching

### Backend (Node.js + Express)
- **RESTful API** - Well-structured API endpoints
- **Authentication** - JWT-based auth with refresh tokens
- **Authorization** - Role-based access control
- **Database** - MongoDB with Mongoose ODM
- **Security** - Helmet, CORS, rate limiting, input sanitization
- **File Upload** - Cloudinary integration for images
- **Email** - Nodemailer for transactional emails
- **Payments** - Stripe integration ready
- **Real-time** - Socket.io for live updates

## 📁 Project Structure

```
virtual-tourist/
├── client/                          # React + Vite Frontend
│   ├── public/
│   │   ├── manifest.json           # PWA manifest
│   │   ├── sw.js                   # Service worker
│   │   └── icons/                  # PWA icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Reusable UI components
│   │   │   ├── layout/            # Layout components
│   │   │   ├── tours/             # Tour-related components
│   │   │   ├── maps/              # Map components
│   │   │   ├── vr/                # VR/360° viewer components
│   │   │   └── booking/           # Booking components
│   │   ├── pages/                 # Page components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── context/               # Zustand stores
│   │   ├── services/              # API services
│   │   ├── utils/                 # Utility functions
│   │   ├── styles/                # Global styles
│   │   ├── assets/                # Static assets
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                          # Express Backend
│   ├── controllers/                 # Route controllers
│   ├── models/                      # Mongoose models
│   ├── routes/                      # API routes
│   ├── middleware/                  # Custom middleware
│   ├── config/                      # Configuration files
│   ├── server.js                    # Entry point
│   └── package.json
├── docker-compose.yml               # Docker configuration
├── package.json                     # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm or pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/virtual-tourist.git
cd virtual-tourist
```

2. **Install dependencies**
```bash
# Install all dependencies (root, client, and server)
npm run install:all
```

3. **Set up environment variables**

Create `.env` files in both `client` and `server` directories:

**server/.env**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/virtual-tourist
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development servers**
```bash
# Start both client and server
npm run dev

# Or start them separately
npm run client    # Start client only
npm run server    # Start server only
```

5. **Open your browser**
- Client: http://localhost:3000
- Server API: http://localhost:5000/api

## 🐳 Docker Setup

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Tours
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get single tour
- `GET /api/tours/featured` - Get featured tours
- `GET /api/tours/category/:category` - Get tours by category
- `GET /api/tours/search?q=query` - Search tours
- `POST /api/tours` - Create tour (Admin)
- `PUT /api/tours/:id` - Update tour (Admin)
- `DELETE /api/tours/:id` - Delete tour (Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/upcoming` - Get upcoming bookings
- `GET /api/bookings/past` - Get past bookings

### Reviews
- `GET /api/tours/:tourId/reviews` - Get tour reviews
- `POST /api/tours/:tourId/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Zustand** - State management
- **React Query** - Data fetching
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Validation
- **Lucide React** - Icons
- **Mapbox/React-Map-GL** - Maps
- **Three.js/React Three Fiber** - 3D rendering
- **Socket.io Client** - Real-time communication
- **i18next** - Internationalization
- **Workbox** - PWA support

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting
- **Express Validator** - Input validation
- **Nodemailer** - Email
- **Cloudinary** - Image hosting
- **Stripe** - Payments
- **Socket.io** - Real-time

## 📝 Scripts

```bash
# Development
npm run dev              # Start both client and server
npm run client           # Start client only
npm run server           # Start server only

# Production
npm run build            # Build both client and server
npm run start            # Start production server

# Testing & Linting
npm run test             # Run tests
npm run lint             # Run linter

# Installation
npm run install:all      # Install all dependencies
```

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- MongoDB injection prevention
- XSS protection

## 🌐 PWA Features

- Offline support with service workers
- App manifest for installability
- Cached API responses
- Background sync
- Push notifications ready

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using the MERN Stack
