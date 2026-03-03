import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Share2, Maximize2, Heart, ZoomIn } from 'lucide-react';

/**
 * PhotoGallery Component
 * Features:
 * - Lightbox with fullscreen view
 * - Image navigation
 * - Favorites system
 * - Lazy loading
 * - Responsive grid
 */

const PhotoGallery = ({ 
  images = [], 
  title = 'Photo Gallery',
  allowDownload = true,
  allowShare = true,
  columns = 3 
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleFavorite = useCallback((imageId, e) => {
    e?.stopPropagation();
    setFavorites(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  }, []);

  const openLightbox = useCallback((image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const navigateImage = useCallback((direction) => {
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  }, [currentIndex, images]);

  // Keyboard navigation
  useState(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'ArrowLeft') navigateImage('prev');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  };

  return (
    <div className="w-full">
      {/* Header */}
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-dark-400">{images.length} photos</p>
        </div>
      )}

      {/* Gallery Grid */}
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {images.map((image, index) => (
          <motion.div
            key={image.id || index}
            className="relative group aspect-square overflow-hidden rounded-xl bg-dark-800 cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => openLightbox(image, index)}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={image.src || image}
              alt={image.alt || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(image.id || index, e);
                  }}
                  className="p-2 bg-dark-900/70 rounded-full hover:bg-dark-900 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(image.id || index)
                        ? 'fill-red-500 text-red-500'
                        : 'text-white'
                    }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(image, index);
                    }}
                    className="p-2 bg-dark-900/70 rounded-full hover:bg-dark-900 transition-colors"
                  >
                    <Maximize2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Favorite Badge */}
            {favorites.includes(image.id || index) && (
              <div className="absolute top-3 right-3 p-2 bg-red-500 rounded-full">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 bg-dark-900/70 rounded-full text-white hover:bg-dark-900 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-4 p-3 bg-dark-900/70 rounded-full text-white hover:bg-dark-900"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-4 p-3 bg-dark-900/70 rounded-full text-white hover:bg-dark-900"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-w-7xl max-h-screen p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src || selectedImage}
                alt={selectedImage.alt || 'Full size image'}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />

              {/* Image Info & Actions */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                {allowDownload && (
                  <a
                    href={selectedImage.src || selectedImage}
                    download={selectedImage.alt || 'image'}
                    className="flex items-center gap-2 px-4 py-2 bg-dark-900/70 rounded-lg text-white hover:bg-dark-900 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-5 h-5" />
                    <span className="text-sm font-medium">Download</span>
                  </a>
                )}
                {allowShare && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Share functionality
                      if (navigator.share) {
                        navigator.share({
                          title: selectedImage.alt || 'Check out this image',
                          url: selectedImage.src || selectedImage
                        });
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-dark-900/70 rounded-lg text-white hover:bg-dark-900 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(selectedImage.id || currentIndex, e);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    favorites.includes(selectedImage.id || currentIndex)
                      ? 'bg-red-500 text-white'
                      : 'bg-dark-900/70 text-white hover:bg-dark-900'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(selectedImage.id || currentIndex) ? 'fill-white' : ''}`} />
                  <span className="text-sm font-medium">
                    {favorites.includes(selectedImage.id || currentIndex) ? 'Saved' : 'Save'}
                  </span>
                </button>
              </div>

              {/* Counter */}
              {images.length > 1 && (
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-dark-900/70 rounded-lg text-white text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorites Summary */}
      {favorites.length > 0 && (
        <div className="mt-6 p-4 bg-dark-800 rounded-xl border border-dark-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span className="text-white font-medium">{favorites.length} favorites</span>
            </div>
            <button
              onClick={() => setFavorites([])}
              className="text-sm text-dark-400 hover:text-white"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
