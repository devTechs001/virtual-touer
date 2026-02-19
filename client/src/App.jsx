import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import MainLayout from './components/layout/MainLayout';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const TourDetails = lazy(() => import('./pages/TourDetails'));
const VirtualTour = lazy(() => import('./pages/VirtualTour'));
const Destinations = lazy(() => import('./pages/Destinations'));
const DestinationDetails = lazy(() => import('./pages/DestinationDetails'));
const Map = lazy(() => import('./pages/Map'));
const Profile = lazy(() => import('./pages/Profile'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="tour/:id" element={<TourDetails />} />
            <Route path="virtual-tour/:id" element={<VirtualTour />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="destination/:id" element={<DestinationDetails />} />
            <Route path="map" element={<Map />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="favorites" element={<Favorites />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;