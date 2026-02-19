import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Camera, ArrowRight } from 'lucide-react';

const DestinationCard = ({ destination, index = 0, featured = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/destination/${destination._id}`}
        className={`block group ${featured ? 'h-80' : ''}`}
      >
        <div className={`card-hover overflow-hidden ${featured ? 'h-full' : ''}`}>
          <div className={`relative ${featured ? 'h-full' : 'aspect-[4/3]'}`}>
            <img
              src={destination.coverImage || destination.images?.[0]?.url || '/placeholder-destination.jpg'}
              alt={destination.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${
              featured 
                ? 'from-dark-900 via-dark-900/50 to-transparent' 
                : 'from-dark-900/80 via-transparent to-transparent'
            }`} />

            {/* Tour Count Badge */}
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-900/70 backdrop-blur-sm rounded-full text-white text-sm">
                <Camera className="w-4 h-4" />
                {destination.tourCount} tours
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className={`font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors ${
                    featured ? 'text-2xl' : 'text-lg'
                  }`}>
                    {destination.name}
                  </h3>
                  <div className="flex items-center gap-2 text-dark-300 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{destination.location?.country}</span>
                  </div>
                </div>
                
                {destination.rating > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-dark-800/70 backdrop-blur-sm rounded-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-medium">{destination.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {featured && destination.shortDescription && (
                <p className="text-dark-300 text-sm mt-3 line-clamp-2">
                  {destination.shortDescription}
                </p>
              )}

              {featured && (
                <div className="flex items-center gap-2 mt-4 text-primary-400 group-hover:text-primary-300">
                  <span className="text-sm font-medium">Explore destination</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default DestinationCard;