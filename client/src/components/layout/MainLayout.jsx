import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileNav from './MobileNav';
import InstallPrompt from '../common/InstallPrompt';

const MainLayout = () => {
  const location = useLocation();
  const isVirtualTour = location.pathname.includes('/virtual-tour');

  return (
    <div className="min-h-screen flex flex-col">
      {!isVirtualTour && <Navbar />}
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {!isVirtualTour && (
        <>
          <Footer />
          <MobileNav />
        </>
      )}
      
      <InstallPrompt />
    </div>
  );
};

export default MainLayout;