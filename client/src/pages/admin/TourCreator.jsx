import { useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Save,
  Eye,
  Settings,
  Image,
  Video,
  Globe2,
  MapPin,
  Plus,
  Trash2,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Check,
  AlertCircle,
  Layers,
  Type,
  Link as LinkIcon,
  Info,
  Play,
  Maximize,
  RotateCcw,
  Crosshair
} from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { tourService, uploadService } from '../../services/api';
import Viewer360 from '../../components/vr/Viewer360';
import HotspotEditor from './tour-creator/HotspotEditor';
import MediaUploader from './tour-creator/MediaUploader';
import SceneList from './tour-creator/SceneList';
import TourSettings from './tour-creator/TourSettings';
import PreviewModal from './tour-creator/PreviewModal';

const tourSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  shortDescription: z.string().max(200).optional(),
  category: z.enum(['cultural', 'nature', 'adventure', 'historical', 'urban', 'relaxation', 'food', 'art']),
  duration: z.string().min(1, 'Duration is required'),
  price: z.number().min(0),
  location: z.object({
    address: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    coordinates: z.array(z.number()).length(2).optional()
  }),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  languages: z.array(z.string()).min(1),
  difficulty: z.enum(['easy', 'moderate', 'challenging']),
  isVirtual: z.boolean(),
  is360: z.boolean(),
  featured: z.boolean(),
  published: z.boolean()
});

const TourCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  // State
  const [activeStep, setActiveStep] = useState(0);
  const [scenes, setScenes] = useState([]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showHotspotEditor, setShowHotspotEditor] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Refs
  const viewerRef = useRef(null);

  // Form
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: '',
      description: '',
      shortDescription: '',
      category: 'cultural',
      duration: '30 minutes',
      price: 0,
      location: { city: '', country: '', coordinates: [0, 0] },
      tags: [],
      languages: ['en'],
      difficulty: 'easy',
      isVirtual: true,
      is360: true,
      featured: false,
      published: false
    }
  });

  // Load existing tour if editing
  const { data: existingTour, isLoading: loadingTour } = useQuery({
    queryKey: ['tour', id],
    queryFn: () => tourService.getById(id).then(res => res.data.tour),
    enabled: isEditing,
    onSuccess: (tour) => {
      // Populate form with existing data
      Object.keys(tour).forEach(key => {
        if (key !== '_id' && key !== '__v') {
          setValue(key, tour[key]);
        }
      });
      setScenes(tour.panoramas || []);
    }
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const tourData = {
        ...data,
        panoramas: scenes,
        images: scenes.map((s, i) => ({
          url: s.thumbnail || s.url,
          caption: s.title,
          isPrimary: i === 0
        }))
      };

      if (isEditing) {
        return tourService.update(id, tourData);
      }
      return tourService.create(tourData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tours']);
      toast.success(isEditing ? 'Tour updated successfully!' : 'Tour created successfully!');
      navigate('/admin/tours');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save tour');
    }
  });

  // Handlers
  const handleAddScene = useCallback(() => {
    setScenes(prev => [...prev, {
      id: `scene-${Date.now()}`,
      url: '',
      thumbnail: '',
      title: `Scene ${prev.length + 1}`,
      description: '',
      hotspots: []
    }]);
    setActiveSceneIndex(scenes.length);
  }, [scenes.length]);

  const handleRemoveScene = useCallback((index) => {
    setScenes(prev => prev.filter((_, i) => i !== index));
    if (activeSceneIndex >= scenes.length - 1) {
      setActiveSceneIndex(Math.max(0, scenes.length - 2));
    }
  }, [activeSceneIndex, scenes.length]);

  const handleUpdateScene = useCallback((index, updates) => {
    setScenes(prev => prev.map((scene, i) => 
      i === index ? { ...scene, ...updates } : scene
    ));
  }, []);

  const handleSceneUpload = useCallback(async (index, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await uploadService.uploadImage(formData);
      
      handleUpdateScene(index, {
        url: response.data.image.url,
        thumbnail: response.data.image.url
      });
      
      toast.success('Panorama uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload panorama');
    }
  }, [handleUpdateScene]);

  const handleAddHotspot = useCallback((position) => {
    const newHotspot = {
      id: `hotspot-${Date.now()}`,
      pitch: position.pitch,
      yaw: position.yaw,
      type: 'info',
      title: 'New Hotspot',
      description: '',
      targetScene: null
    };

    setScenes(prev => prev.map((scene, i) => 
      i === activeSceneIndex
        ? { ...scene, hotspots: [...(scene.hotspots || []), newHotspot] }
        : scene
    ));

    setSelectedHotspot(newHotspot);
    setShowHotspotEditor(true);
  }, [activeSceneIndex]);

  const handleUpdateHotspot = useCallback((hotspotId, updates) => {
    setScenes(prev => prev.map((scene, i) => 
      i === activeSceneIndex
        ? {
            ...scene,
            hotspots: scene.hotspots.map(h => 
              h.id === hotspotId ? { ...h, ...updates } : h
            )
          }
        : scene
    ));

    if (selectedHotspot?.id === hotspotId) {
      setSelectedHotspot(prev => ({ ...prev, ...updates }));
    }
  }, [activeSceneIndex, selectedHotspot]);

  const handleDeleteHotspot = useCallback((hotspotId) => {
    setScenes(prev => prev.map((scene, i) => 
      i === activeSceneIndex
        ? { ...scene, hotspots: scene.hotspots.filter(h => h.id !== hotspotId) }
        : scene
    ));
    setSelectedHotspot(null);
    setShowHotspotEditor(false);
  }, [activeSceneIndex]);

  const handleSave = handleSubmit((data) => {
    if (scenes.length === 0) {
      toast.error('Please add at least one scene');
      return;
    }

    if (scenes.some(s => !s.url)) {
      toast.error('Please upload panorama images for all scenes');
      return;
    }

    saveMutation.mutate(data);
  });

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: Type },
    { id: 'scenes', label: 'Scenes', icon: Layers },
    { id: 'hotspots', label: 'Hotspots', icon: Crosshair },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const activeScene = scenes[activeSceneIndex];

  if (isEditing && loadingTour) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-900 border-b border-dark-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/tours')}
              className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                {isEditing ? 'Edit Tour' : 'Create New Tour'}
              </h1>
              <p className="text-sm text-dark-400">
                {watch('title') || 'Untitled Tour'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="btn-secondary"
              disabled={scenes.length === 0}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="btn-primary"
            >
              {saveMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Tour
                </>
              )}
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center px-6 pb-4">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeStep === index
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <step.icon className="w-4 h-4" />
              <span className="font-medium">{step.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Left Panel - Form / Scene List */}
        <div className="w-96 bg-dark-900 border-r border-dark-800 h-[calc(100vh-140px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-6"
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Tour Title *
                  </label>
                  <input
                    {...register('title')}
                    className={`input ${errors.title ? 'input-error' : ''}`}
                    placeholder="Enter tour title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                  )}
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Short Description
                  </label>
                  <input
                    {...register('shortDescription')}
                    className="input"
                    placeholder="Brief description (max 200 chars)"
                    maxLength={200}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    {...register('description')}
                    className={`input resize-none h-32 ${errors.description ? 'input-error' : ''}`}
                    placeholder="Detailed tour description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Category *
                  </label>
                  <select {...register('category')} className="input">
                    <option value="cultural">🏛️ Cultural</option>
                    <option value="nature">🌿 Nature</option>
                    <option value="adventure">🏔️ Adventure</option>
                    <option value="historical">🏰 Historical</option>
                    <option value="urban">🌆 Urban</option>
                    <option value="relaxation">🏖️ Relaxation</option>
                    <option value="food">🍷 Food & Drink</option>
                    <option value="art">🎨 Art & Museums</option>
                  </select>
                </div>

                {/* Duration & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Duration *
                    </label>
                    <select {...register('duration')} className="input">
                      <option value="15 minutes">15 minutes</option>
                      <option value="30 minutes">30 minutes</option>
                      <option value="45 minutes">45 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="1.5 hours">1.5 hours</option>
                      <option value="2 hours">2 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Price ($)
                    </label>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="input"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Location *
                  </label>
                  <div className="space-y-3">
                    <input
                      {...register('location.city')}
                      className={`input ${errors.location?.city ? 'input-error' : ''}`}
                      placeholder="City"
                    />
                    <input
                      {...register('location.country')}
                      className={`input ${errors.location?.country ? 'input-error' : ''}`}
                      placeholder="Country"
                    />
                    <input
                      {...register('location.address')}
                      className="input"
                      placeholder="Address (optional)"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Tags *
                  </label>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Add tags..."
                      />
                    )}
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Difficulty
                  </label>
                  <div className="flex gap-2">
                    {['easy', 'moderate', 'challenging'].map((level) => (
                      <label
                        key={level}
                        className={`flex-1 flex items-center justify-center px-4 py-2 rounded-xl cursor-pointer transition-colors ${
                          watch('difficulty') === level
                            ? 'bg-primary-500 text-white'
                            : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('difficulty')}
                          value={level}
                          className="sr-only"
                        />
                        <span className="capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                key="scenes"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SceneList
                  scenes={scenes}
                  activeIndex={activeSceneIndex}
                  onSelect={setActiveSceneIndex}
                  onAdd={handleAddScene}
                  onRemove={handleRemoveScene}
                  onUpdate={handleUpdateScene}
                  onUpload={handleSceneUpload}
                  onReorder={setScenes}
                />
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="hotspots"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Hotspots</h3>
                  <p className="text-sm text-dark-400">
                    Click on the panorama to add interactive hotspots. Hotspots can show information or link to other scenes.
                  </p>
                </div>

                {activeScene?.hotspots?.length === 0 ? (
                  <div className="p-8 bg-dark-800/50 rounded-xl text-center">
                    <Crosshair className="w-12 h-12 text-dark-500 mx-auto mb-3" />
                    <p className="text-dark-400">No hotspots yet</p>
                    <p className="text-sm text-dark-500 mt-1">
                      Click on the panorama to add hotspots
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeScene?.hotspots?.map((hotspot, index) => (
                      <div
                        key={hotspot.id}
                        onClick={() => {
                          setSelectedHotspot(hotspot);
                          setShowHotspotEditor(true);
                        }}
                        className={`p-4 bg-dark-800 rounded-xl cursor-pointer hover:bg-dark-700 transition-colors ${
                          selectedHotspot?.id === hotspot.id ? 'ring-2 ring-primary-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              hotspot.type === 'info' ? 'bg-primary-500/20 text-primary-400' :
                              hotspot.type === 'scene' ? 'bg-secondary-500/20 text-secondary-400' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>
                              {hotspot.type === 'info' && <Info className="w-4 h-4" />}
                              {hotspot.type === 'scene' && <Layers className="w-4 h-4" />}
                              {hotspot.type === 'link' && <LinkIcon className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-white font-medium">{hotspot.title}</p>
                              <p className="text-sm text-dark-400 capitalize">{hotspot.type}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHotspot(hotspot.id);
                            }}
                            className="p-2 text-dark-500 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeStep === 3 && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <TourSettings
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel - Viewer */}
        <div className="flex-1 h-[calc(100vh-140px)] relative">
          {activeScene?.url ? (
            <>
              <Viewer360
                ref={viewerRef}
                images={[activeScene]}
                hotspots={activeScene.hotspots || []}
                showControls={true}
                onHotspotClick={(hotspot) => {
                  setSelectedHotspot(hotspot);
                  setShowHotspotEditor(true);
                }}
                onPanoramaClick={(position) => {
                  if (activeStep === 2) {
                    handleAddHotspot(position);
                  }
                }}
              />

              {activeStep === 2 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-dark-800/90 backdrop-blur-sm rounded-xl">
                  <p className="text-sm text-white flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-primary-400" />
                    Click anywhere on the panorama to add a hotspot
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-dark-800">
              <div className="text-center">
                <Globe2 className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-300 mb-2">
                  {scenes.length === 0 ? 'No Scenes Added' : 'Upload Panorama'}
                </h3>
                <p className="text-dark-500 mb-4">
                  {scenes.length === 0
                    ? 'Add a scene to get started'
                    : 'Upload a 360° panorama image for this scene'
                  }
                </p>
                {scenes.length === 0 ? (
                  <button
                    onClick={handleAddScene}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Scene
                  </button>
                ) : (
                  <MediaUploader
                    onUpload={(file) => handleSceneUpload(activeSceneIndex, file)}
                    accept="image/*"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hotspot Editor Modal */}
      <AnimatePresence>
        {showHotspotEditor && selectedHotspot && (
          <HotspotEditor
            hotspot={selectedHotspot}
            scenes={scenes}
            currentSceneIndex={activeSceneIndex}
            onUpdate={(updates) => handleUpdateHotspot(selectedHotspot.id, updates)}
            onDelete={() => handleDeleteHotspot(selectedHotspot.id)}
            onClose={() => {
              setShowHotspotEditor(false);
              setSelectedHotspot(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <PreviewModal
            tour={{
              ...watch(),
              panoramas: scenes
            }}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Tag Input Component
const TagInput = ({ value = [], onChange, placeholder }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = input.trim();
      if (tag && !value.includes(tag)) {
        onChange([...value, tag]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-dark-800 border border-dark-700 rounded-xl focus-within:border-primary-500">
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-sm"
        >
          {tag}
          <button onClick={() => removeTag(tag)} className="hover:text-white">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-24 bg-transparent text-white placeholder-dark-500 outline-none"
      />
    </div>
  );
};

export default TourCreator;