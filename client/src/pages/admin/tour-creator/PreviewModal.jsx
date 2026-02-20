import { X, Maximize, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import Viewer360 from '../../../components/vr/Viewer360';

const PreviewModal = ({ tour, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark-950/95 backdrop-blur-lg z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full h-full max-w-7xl max-h-[90vh] mx-4 my-8 bg-dark-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-16 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold text-white">{tour?.title || 'Preview'}</h2>
            <p className="text-sm text-dark-400">{tour?.destination || ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700">
              <Maximize className="w-5 h-5" />
            </button>
            <button className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-4rem)]">
          {tour?.panoramas?.length > 0 ? (
            <Viewer360
              images={tour.panoramas}
              hotspots={tour.panoramas[0]?.hotspots || []}
              showControls={true}
              autoRotate={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-dark-400 text-lg">No panoramas available</p>
                <p className="text-dark-500 text-sm mt-2">Add scenes to preview the tour</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewModal;
