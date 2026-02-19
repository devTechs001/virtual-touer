import TourCard from './TourCard';
import TourCardSkeleton from './TourCardSkeleton';

const TourGrid = ({ tours, isLoading, error, emptyMessage = 'No tours found' }) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading tours. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <TourCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!tours || tours.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tours.map((tour, index) => (
        <TourCard key={tour._id} tour={tour} index={index} />
      ))}
    </div>
  );
};

export default TourGrid;