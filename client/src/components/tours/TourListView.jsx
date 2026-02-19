import { motion } from 'framer-motion';
import TourCard from './TourCard';
import { Spinner } from '../common';

export default function TourListView({ tours = [], isLoading = false, error = null }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading tours: {error.message}</p>
      </div>
    );
  }

  if (!tours || tours.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-400">No tours found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {tours.map((tour, index) => (
        <motion.div
          key={tour._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
            <TourCard tour={tour} index={index} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
