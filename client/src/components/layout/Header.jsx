import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Globe, User, LogOut, Calendar, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Explore', href: '/explore' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Map', href: '/map' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-dark-100">Virtual Tourist</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-dark-400 hover:text-dark-100 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-dark-400 hover:text-dark-100 transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-dark-400 hover:text-dark-100">
                  <User className="w-5 h-5" />
                  <span>{user?.name}</span>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="py-2">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-dark-400 hover:bg-dark-700 hover:text-dark-100">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link to="/bookings" className="flex items-center px-4 py-2 text-dark-400 hover:bg-dark-700 hover:text-dark-100">
                      <Calendar className="w-4 h-4 mr-2" />
                      Bookings
                    </Link>
                    <Link to="/favorites" className="flex items-center px-4 py-2 text-dark-400 hover:bg-dark-700 hover:text-dark-100">
                      <Heart className="w-4 h-4 mr-2" />
                      Favorites
                    </Link>
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="flex items-center w-full px-4 py-2 text-dark-400 hover:bg-dark-700 hover:text-dark-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-dark-400 hover:text-dark-100 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-dark-400 hover:text-dark-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-dark-800 border-t border-dark-700"
        >
          <div className="page-container py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-dark-400 hover:text-dark-100 py-2"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-dark-700">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-dark-400 hover:text-dark-100 py-2">
                    Profile
                  </Link>
                  <Link to="/bookings" onClick={() => setIsMenuOpen(false)} className="block text-dark-400 hover:text-dark-100 py-2">
                    Bookings
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); navigate('/'); }}
                    className="block text-dark-400 hover:text-dark-100 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-dark-400 hover:text-dark-100 py-2">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full mt-2">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
