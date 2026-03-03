import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Plane, Hotel, Utensils, Camera, CheckCircle, Circle, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

/**
 * TimelineView Component - Trip Planning Timeline
 * Features:
 * - Day-by-day itinerary planning
 * - Drag and drop activities
 * - Time estimates
 * - Progress tracking
 * - Offline storage
 */

const ACTIVITY_TYPES = {
  flight: { icon: Plane, color: 'bg-blue-500', label: 'Flight' },
  hotel: { icon: Hotel, color: 'bg-purple-500', label: 'Accommodation' },
  meal: { icon: Utensils, color: 'bg-orange-500', label: 'Meal' },
  activity: { icon: Camera, color: 'bg-green-500', label: 'Activity' },
  transport: { icon: MapPin, color: 'bg-red-500', label: 'Transport' }
};

const DEFAULT_ITINERARY = [
  {
    day: 1,
    date: '',
    activities: [
      { id: '1', type: 'flight', title: 'Arrival Flight', time: '10:00', duration: '3h', completed: false },
      { id: '2', type: 'hotel', title: 'Check-in Hotel', time: '14:00', duration: '1h', completed: false },
      { id: '3', type: 'meal', title: 'Welcome Lunch', time: '15:30', duration: '2h', completed: false },
      { id: '4', type: 'activity', title: 'City Tour', time: '18:00', duration: '3h', completed: false }
    ]
  },
  {
    day: 2,
    date: '',
    activities: [
      { id: '5', type: 'meal', title: 'Breakfast', time: '08:00', duration: '1h', completed: false },
      { id: '6', type: 'activity', title: 'Museum Visit', time: '10:00', duration: '3h', completed: false },
      { id: '7', type: 'meal', title: 'Local Restaurant', time: '13:30', duration: '2h', completed: false },
      { id: '8', type: 'activity', title: 'Shopping', time: '16:00', duration: '3h', completed: false }
    ]
  },
  {
    day: 3,
    date: '',
    activities: [
      { id: '9', type: 'meal', title: 'Breakfast', time: '08:00', duration: '1h', completed: false },
      { id: '10', type: 'activity', title: 'Day Trip', time: '09:30', duration: '6h', completed: false },
      { id: '11', type: 'flight', title: 'Departure Flight', time: '20:00', duration: '3h', completed: false }
    ]
  }
];

const TimelineView = ({ 
  destination, 
  duration = 3,
  itinerary: propItinerary,
  onSave 
}) => {
  const [itinerary, setItinerary] = useState(propItinerary || DEFAULT_ITINERARY.slice(0, duration));
  const [selectedDay, setSelectedDay] = useState(0);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: 'activity', title: '', time: '', duration: '' });

  // Calculate progress
  const progress = useMemo(() => {
    const totalActivities = itinerary.reduce((sum, day) => sum + day.activities.length, 0);
    const completedActivities = itinerary.reduce(
      (sum, day) => sum + day.activities.filter(a => a.completed).length,
      0
    );
    return totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
  }, [itinerary]);

  // Calculate total duration per day
  const getDayDuration = (activities) => {
    return activities.reduce((sum, activity) => {
      const hours = parseFloat(activity.duration) || 0;
      return sum + hours;
    }, 0);
  };

  // Toggle activity completion
  const toggleComplete = (dayIndex, activityId) => {
    const updated = [...itinerary];
    const activity = updated[dayIndex].activities.find(a => a.id === activityId);
    if (activity) {
      activity.completed = !activity.completed;
      setItinerary(updated);
      
      // Auto-save to localStorage
      localStorage.setItem('trip_itinerary', JSON.stringify(updated));
      onSave?.(updated);
    }
  };

  // Delete activity
  const deleteActivity = (dayIndex, activityId) => {
    const updated = [...itinerary];
    updated[dayIndex].activities = updated[dayIndex].activities.filter(a => a.id !== activityId);
    setItinerary(updated);
    localStorage.setItem('trip_itinerary', JSON.stringify(updated));
    onSave?.(updated);
  };

  // Add new activity
  const addActivity = () => {
    if (!newActivity.title || !newActivity.time) return;

    const updated = [...itinerary];
    updated[selectedDay].activities.push({
      id: Date.now().toString(),
      ...newActivity,
      completed: false
    });
    
    // Sort by time
    updated[selectedDay].activities.sort((a, b) => a.time.localeCompare(b.time));
    
    setItinerary(updated);
    setNewActivity({ type: 'activity', title: '', time: '', duration: '' });
    setShowAddModal(false);
    localStorage.setItem('trip_itinerary', JSON.stringify(updated));
    onSave?.(updated);
  };

  // Load from localStorage on mount
  useState(() => {
    const saved = localStorage.getItem('trip_itinerary');
    if (saved) {
      try {
        setItinerary(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load itinerary:', e);
      }
    }
  });

  const currentDay = itinerary[selectedDay];
  const dayDuration = getDayDuration(currentDay?.activities || []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Trip Timeline</h2>
            <p className="text-dark-400">{duration} days itinerary</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-400">{progress}%</div>
            <div className="text-sm text-dark-500">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-300"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {itinerary.map((day, index) => {
          const dayActivities = day.activities.length;
          const dayCompleted = day.activities.filter(a => a.completed).length;
          const isComplete = dayCompleted === dayActivities && dayActivities > 0;

          return (
            <button
              key={day.day}
              onClick={() => setSelectedDay(index)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-colors ${
                selectedDay === index
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'bg-dark-800 border-dark-700 text-dark-400 hover:border-dark-600'
              }`}
            >
              <div className="text-sm font-medium">Day {day.day}</div>
              <div className={`text-xs mt-1 ${
                selectedDay === index ? 'text-white/70' : 'text-dark-500'
              }`}>
                {dayCompleted}/{dayActivities}
              </div>
              {isComplete && (
                <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Day Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden"
        >
          {/* Day Header */}
          <div className="p-4 border-b border-dark-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-400" />
                <div>
                  <h3 className="font-semibold text-white">Day {currentDay?.day}</h3>
                  <div className="flex items-center gap-2 text-sm text-dark-400">
                    <Clock className="w-4 h-4" />
                    <span>{dayDuration} hours of activities</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Activity</span>
              </button>
            </div>
          </div>

          {/* Activities Timeline */}
          <div className="p-4 space-y-3">
            {currentDay?.activities.map((activity, index) => {
              const ActivityIcon = ACTIVITY_TYPES[activity.type]?.icon || Camera;
              const activityColor = ACTIVITY_TYPES[activity.type]?.color || 'bg-gray-500';

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                    activity.completed
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-dark-900 border-dark-700'
                  }`}
                >
                  {/* Status */}
                  <button
                    onClick={() => toggleComplete(selectedDay, activity.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    {activity.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-dark-500 hover:text-primary-400" />
                    )}
                  </button>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${activityColor} flex items-center justify-center flex-shrink-0`}>
                    <ActivityIcon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`font-medium ${
                        activity.completed ? 'text-dark-400 line-through' : 'text-white'
                      }`}>
                        {activity.title}
                      </h4>
                      <button
                        onClick={() => deleteActivity(selectedDay, activity.id)}
                        className="p-1 hover:bg-dark-800 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-dark-500 hover:text-red-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-dark-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{activity.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{activity.duration}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {currentDay?.activities.length === 0 && (
              <div className="text-center py-12 text-dark-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No activities planned for this day</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium"
                >
                  Add your first activity
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-900 rounded-2xl border border-dark-700 w-full max-w-md"
            >
              <div className="p-6 border-b border-dark-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Add Activity</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-dark-800 rounded-lg"
                  >
                    <X className="w-5 h-5 text-dark-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Type */}
                <div>
                  <label className="block text-sm text-dark-400 mb-2">Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(ACTIVITY_TYPES).map(([type, { icon: Icon, color, label }]) => (
                      <button
                        key={type}
                        onClick={() => setNewActivity({ ...newActivity, type })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                          newActivity.type === type
                            ? `${color} text-white`
                            : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm text-dark-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    placeholder="e.g., Visit Museum"
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-dark-400 mb-2">Time</label>
                    <input
                      type="time"
                      value={newActivity.time}
                      onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-dark-400 mb-2">Duration</label>
                    <input
                      type="text"
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                      placeholder="e.g., 2h"
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-dark-700 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-dark-800 hover:bg-dark-700 rounded-xl text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addActivity}
                  className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-medium transition-colors"
                >
                  Add Activity
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimelineView;
