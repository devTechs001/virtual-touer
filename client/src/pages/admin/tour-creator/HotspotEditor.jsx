import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Info,
  Layers,
  Link as LinkIcon,
  Trash2,
  Save
} from 'lucide-react';

const HotspotEditor = ({
  hotspot,
  scenes,
  currentSceneIndex,
  onUpdate,
  onDelete,
  onClose
}) => {
  const [localHotspot, setLocalHotspot] = useState(hotspot);

  const handleSave = () => {
    onUpdate(localHotspot);
    onClose();
  };

  const hotspotTypes = [
    { id: 'info', label: 'Information', icon: Info, description: 'Show text information' },
    { id: 'scene', label: 'Scene Link', icon: Layers, description: 'Navigate to another scene' },
    { id: 'link', label: 'External Link', icon: LinkIcon, description: 'Open a URL' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-semibold text-white">Edit Hotspot</h2>
          <button
            onClick={onClose}
            className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={localHotspot.title}
              onChange={(e) => setLocalHotspot({ ...localHotspot, title: e.target.value })}
              className="input"
              placeholder="Hotspot title"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-3">
              Hotspot Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {hotspotTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setLocalHotspot({ ...localHotspot, type: type.id })}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    localHotspot.type === type.id
                      ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                      : 'bg-dark-700 border-dark-600 text-dark-300 hover:border-dark-500'
                  }`}
                >
                  <type.icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-medium text-sm">{type.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Type-specific fields */}
          {localHotspot.type === 'info' && (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Description
              </label>
              <textarea
                value={localHotspot.description || ''}
                onChange={(e) => setLocalHotspot({ ...localHotspot, description: e.target.value })}
                className="input resize-none h-24"
                placeholder="Information to display when clicked"
              />
            </div>
          )}

          {localHotspot.type === 'scene' && (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Target Scene
              </label>
              <select
                value={localHotspot.targetScene ?? ''}
                onChange={(e) => setLocalHotspot({ 
                  ...localHotspot, 
                  targetScene: e.target.value ? parseInt(e.target.value) : null 
                })}
                className="input"
              >
                <option value="">Select a scene</option>
                {scenes.map((scene, index) => (
                  index !== currentSceneIndex && (
                    <option key={scene.id} value={index}>
                      {scene.title}
                    </option>
                  )
                ))}
              </select>
            </div>
          )}

          {localHotspot.type === 'link' && (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                URL
              </label>
              <input
                type="url"
                value={localHotspot.url || ''}
                onChange={(e) => setLocalHotspot({ ...localHotspot, url: e.target.value })}
                className="input"
                placeholder="https://example.com"
              />
            </div>
          )}

          {/* Position (read-only) */}
          <div className="p-4 bg-dark-700/50 rounded-xl">
            <p className="text-sm text-dark-400 mb-2">Position</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-dark-500">Pitch:</span>
                <span className="text-white ml-2">{localHotspot.pitch?.toFixed(2)}°</span>
              </div>
              <div>
                <span className="text-dark-500">Yaw:</span>
                <span className="text-white ml-2">{localHotspot.yaw?.toFixed(2)}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-dark-700">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HotspotEditor;