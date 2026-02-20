import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Users, Star, Calendar, Share2, Heart, Zap, Play } from 'lucide-react';
import { motion } from 'framer-motion';

import CommentSection from '../components/social/CommentSection';
import ShareModal from '../components/social/ShareModal';
import ARViewer from '../components/ar/ARViewer';

const tourData = {
  id: 1,
  name: 'Eiffel Tower Experience',
  location: 'Paris, France',
  description: 'Experience the iconic Eiffel Tower like never before with our immersive virtual tour.',
  price: 49,
  rating: 4.8,
  reviews: 256,
  duration: '2 hours',
  groupSize: 10,
  image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=1200',
  highlights: ['Skip-the-line access', 'Professional guide', '360° views', 'Historical commentary'],
  includes: ['VR headset support', 'Live narration', 'Digital photos'],
};

export default function TourDetails() {
  const { id } = useParams();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showARViewer, setShowARViewer] = useState(false);

  return (
    <div className="page-container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="relative mb-6">
            <img src={tourData.image} alt={tourData.name} className="w-full rounded-2xl" />
            <div className="absolute top-4 right-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-full backdrop-blur-lg ${
                  isFavorite ? 'bg-red-500/80 text-white' : 'bg-dark-900/80 text-dark-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowShareModal(true)}
                className="p-3 rounded-full bg-dark-900/80 text-dark-300 backdrop-blur-lg hover:text-white"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* AR Preview Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowARViewer(true)}
              className="absolute bottom-4 left-4 px-4 py-2 bg-primary-500/90 backdrop-blur-lg rounded-xl text-white font-medium flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              AR Preview
            </motion.button>
          </div>

          <h1 className="text-3xl font-bold text-dark-100 mb-2">{tourData.name}</h1>
          <div className="flex items-center text-dark-400 mb-4">
            <MapPin className="w-5 h-5 mr-2" />
            {tourData.location}
          </div>
          <p className="text-dark-300 mb-6">{tourData.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-primary-400" />
              <p className="text-dark-400 text-sm">Duration</p>
              <p className="text-dark-100 font-medium">{tourData.duration}</p>
            </div>
            <div className="card p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-primary-400" />
              <p className="text-dark-400 text-sm">Group Size</p>
              <p className="text-dark-100 font-medium">Up to {tourData.groupSize}</p>
            </div>
            <div className="card p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-primary-400" />
              <p className="text-dark-400 text-sm">Rating</p>
              <p className="text-dark-100 font-medium">{tourData.rating} ({tourData.reviews})</p>
            </div>
          </div>

          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Highlights</h2>
            <ul className="grid grid-cols-2 gap-3">
              {tourData.highlights.map((h, i) => (
                <li key={i} className="flex items-center text-dark-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">What's Included</h2>
            <ul className="space-y-2">
              {tourData.includes.map((item, i) => (
                <li key={i} className="flex items-center text-dark-300">
                  <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Comments Section */}
          <CommentSection tourId={id} />
        </div>

        {/* Booking Sidebar */}
        <div>
          <div className="card p-6 sticky top-24">
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-bold text-primary-400">${tourData.price}</span>
              <span className="text-dark-400 ml-2">/ person</span>
            </div>
            <Link to={`/checkout/${id}`} className="btn-primary w-full mb-4 block text-center">
              Book Now
            </Link>
            <div className="space-y-3 text-sm text-dark-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-primary-400" />
                Daily availability
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-3 text-primary-400" />
                Free cancellation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          tour={tourData}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* AR Viewer */}
      {showARViewer && (
        <ARViewer
          tourId={id}
          onClose={() => setShowARViewer(false)}
        />
      )}
    </div>
  );
}
