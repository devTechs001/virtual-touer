import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Play, 
  Globe2,
  Users 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToggleFavorite, useCheckFavorite } from '../../hooks/useFavorites';

const TourCard = ({ tour, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data: favoriteData } = useCheckFavorite(tour._id);
  const toggleFavorite = useToggleFavorite();

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login or show modal
      return;
    }
    
    toggleFavorite.mutate({
      tourId: tour._id,
      isFavorite: favoriteData?.isFavorite
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/tour/${tour._id}`} className="block group">
        <div className="card-hover overflow-hidden">
          {/* Image */}
          <div className="relative aspect-tour overflow-hidden">
            <img
              src={tour.images?.[0] || '/placeholder-tour.jpg'}
              alt={tour.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {tour.isVirtual && (
                <span className="badge bg-primary-500/90 text-white text-xs">
                  <Globe2 className="w-3 h-3 mr-1" />
                  Virtual
                </span>
              )}
              {tour.is360 && (
                <span className="badge bg-secondary-500/90 text-white text-xs">
                  360°
                </span>
              )}
              {tour.featured && (
                <span className="badge bg-yellow-500/90 text-dark-900 text-xs font-semibold">
                  Featured
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavorite}
              className="absolute top-3 right-3 p-2 rounded-full bg-dark-900/50 backdrop-blur-sm hover:bg-dark-900/80 transition-all"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  favoriteData?.isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-white'
                }`}
              />
            </button>

            {/* Play Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary-500/90 flex items-center justify-center shadow-lg shadow-primary-500/50">
                <Play className="w-6 h-6 text-white ml-1" fill="white" />
              </div>
            </motion.div>

            {/* Location */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{tour.location?.city}, {tour.location?.country}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-dark-100 mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
              {tour.title}
            </h3>
            
            <p className="text-dark-400 text-sm mb-4 line-clamp-2">
              {tour.shortDescription || tour.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-dark-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{tour.participants || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-dark-100">
                  {tour.rating?.toFixed(1) || 'New'}
                </span>
                <span className="text-dark-500 text-sm">
                  ({tour.reviewCount || 0})
                </span>
              </div>
            </div>

            {/* Price */}
            {tour.price > 0 && (
              <div className="mt-4 pt-4 border-t border-dark-700">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-primary-400">
                    ${tour.price}
                  </span>
                  <span className="text-dark-500 text-sm">/ person</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TourCard;