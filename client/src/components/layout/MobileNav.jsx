import { NavLink } from 'react-router-dom';
import { Home, Compass, Map, Heart, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MobileNav = () => {
  const { isAuthenticated, user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/map', icon: Map, label: 'Map' },
    { to: '/favorites', icon: Heart, label: 'Saved', protected: true },
    ...(isAdmin ? [{ to: '/admin', icon: Settings, label: 'Admin', protected: true }] : []),
    { to: isAuthenticated ? '/profile' : '/login', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-900/95 backdrop-blur-lg border-t border-dark-800 safe-bottom md:hidden z-40">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          if (item.protected && !isAuthenticated) return null;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary-400'
                    : 'text-dark-500 hover:text-dark-300'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;