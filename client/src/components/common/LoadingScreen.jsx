import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/50"
        >
          <Globe className="w-8 h-8 text-white" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-dark-400 font-medium"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;