import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import MainLayout from './components/layout/MainLayout';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MaintenanceWrapper from './components/common/MaintenanceWrapper';
import AnnouncementBanner from './components/common/AnnouncementBanner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const TourDetails = lazy(() => import('./pages/TourDetails'));
const VirtualTour = lazy(() => import('./pages/VirtualTour'));
const Destinations = lazy(() => import('./pages/Destinations'));
const DestinationDetails = lazy(() => import('./pages/DestinationDetails'));
const Map = lazy(() => import('./pages/Map'));
const Profile = lazy(() => import('./pages/Profile'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Checkout = lazy(() => import('./pages/Checkout'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminTours = lazy(() => import('./pages/admin/ToursPage'));
const TourCreator = lazy(() => import('./pages/admin/TourCreator'));
const AdminUsers = lazy(() => import('./pages/admin/UsersPage'));
const AdminBookings = lazy(() => import('./pages/admin/BookingsPage'));
const AdminSystem = lazy(() => import('./pages/admin/SettingsPage'));

function App() {
  return (
    <ErrorBoundary>
      <MaintenanceWrapper>
        <AnnouncementBanner />
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Maintenance page - always accessible */}
              <Route path="/maintenance" element={<Maintenance />} />

              {/* Main routes with layout */}
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
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="checkout/:bookingId" element={<Checkout />} />
                  <Route path="booking/success" element={<Checkout />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
                <Route element={<AdminDashboard />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="tours" element={<AdminTours />} />
                  <Route path="tours/create" element={<TourCreator />} />
                  <Route path="tours/:id/edit" element={<TourCreator />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="system" element={<AdminSystem />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </AnimatePresence>
      </MaintenanceWrapper>
    </ErrorBoundary>
  );
}

export default App;