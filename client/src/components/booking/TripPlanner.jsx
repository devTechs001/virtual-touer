import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, 
  Hotel, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Heart, 
  Star,
  CheckCircle,
  Circle,
  Plus,
  Trash2,
  Edit2,
  Share2,
  Download,
  AlertCircle
} from 'lucide-react';

/**
 * TripPlanner Component for User Dashboard
 * Features:
 * - Plan multiple trips
 * - Add destinations to trips
 * - Track booking status
 * - Budget tracking
 * - Share trips
 */

const TRIP_STATUSES = {
  planning: { label: 'Planning', color: 'bg-blue-500' },
  booked: { label: 'Booked', color: 'bg-green-500' },
  ongoing: { label: 'Ongoing', color: 'bg-orange-500' },
  completed: { label: 'Completed', color: 'bg-purple-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' }
};

// Sample trips data
const SAMPLE_TRIPS = [
  {
    id: '1',
    name: 'Egyptian Adventure',
    destination: 'Egypt',
    startDate: '2024-04-15',
    endDate: '2024-04-25',
    status: 'planning',
    budget: 5000,
    spent: 2350,
    destinations: [
      { name: 'Pyramids of Giza', booked: true, price: 299 },
      { name: 'Luxor Temple', booked: true, price: 199 },
      { name: 'Red Sea Resort', booked: false, price: 450 }
    ],
    image: '/images/egypt.jpg'
  },
  {
    id: '2',
    name: 'Tokyo Explorer',
    destination: 'Japan',
    startDate: '2024-06-01',
    endDate: '2024-06-10',
    status: 'booked',
    budget: 8000,
    spent: 6200,
    destinations: [
      { name: 'Tokyo City Tour', booked: true, price: 399 },
      { name: 'Mount Fuji Day Trip', booked: true, price: 299 },
      { name: 'Kyoto Temples', booked: true, price: 349 }
    ],
    image: '/images/tokyo.jpg'
  },
  {
    id: '3',
    name: 'Paris Romance',
    destination: 'France',
    startDate: '2024-03-01',
    endDate: '2024-03-07',
    status: 'completed',
    budget: 4000,
    spent: 3850,
    destinations: [
      { name: 'Eiffel Tower', booked: true, price: 199 },
      { name: 'Louvre Museum', booked: true, price: 149 },
      { name: 'Versailles Palace', booked: true, price: 179 }
    ],
    image: '/images/paris.jpg'
  }
];

const TripPlanner = ({ trips: propTrips, onTripUpdate }) => {
  const [trips] = useState(propTrips || SAMPLE_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate totals
  const totals = useMemo(() => {
    const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);
    const totalSpent = trips.reduce((sum, trip) => sum + trip.spent, 0);
    const upcomingTrips = trips.filter(t => t.status === 'planning' || t.status === 'booked').length;
    const completedTrips = trips.filter(t => t.status === 'completed').length;
    
    return { totalBudget, totalSpent, upcomingTrips, completedTrips };
  }, [trips]);

  const handleDeleteTrip = (tripId) => {
    // Delete logic here
    console.log('Delete trip:', tripId);
  };

  const handleShareTrip = (trip) => {
    // Share logic here
    console.log('Share trip:', trip);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Trips</h2>
          <p className="text-dark-400">Plan and track your virtual adventures</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Trip
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totals.upcomingTrips}</p>
              <p className="text-xs text-dark-400">Upcoming</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totals.completedTrips}</p>
              <p className="text-xs text-dark-400">Completed</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${totals.totalBudget.toLocaleString()}</p>
              <p className="text-xs text-dark-400">Total Budget</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${totals.totalSpent.toLocaleString()}</p>
              <p className="text-xs text-dark-400">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trips.map((trip, index) => {
          const status = TRIP_STATUSES[trip.status];
          const budgetPercent = (trip.spent / trip.budget) * 100;
          
          return (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden"
            >
              {/* Trip Image */}
              <div className="relative h-40 bg-dark-800">
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <button
                  onClick={() => handleShareTrip(trip)}
                  className="absolute top-3 left-3 p-2 bg-dark-900/70 rounded-full text-white hover:bg-dark-900"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Trip Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{trip.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <MapPin className="w-4 h-4" />
                      <span>{trip.destination}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTrip(trip)}
                    className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-dark-400" />
                  </button>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-4 mb-4 text-sm text-dark-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{trip.startDate}</span>
                  </div>
                  <span>→</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{trip.endDate}</span>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-400">Budget Progress</span>
                    <span className="text-sm font-medium text-white">
                      ${trip.spent.toLocaleString()} / ${trip.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        budgetPercent > 90 ? 'bg-red-500' :
                        budgetPercent > 70 ? 'bg-orange-500' :
                        'bg-green-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${budgetPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  {budgetPercent > 90 && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      <span>Near budget limit</span>
                    </div>
                  )}
                </div>

                {/* Destinations */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-400">Destinations</span>
                    <span className="text-sm text-dark-400">
                      {trip.destinations.filter(d => d.booked).length} / {trip.destinations.length} booked
                    </span>
                  </div>
                  <div className="space-y-2">
                    {trip.destinations.slice(0, 3).map((dest, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        {dest.booked ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-dark-600" />
                        )}
                        <span className={dest.booked ? 'text-dark-300' : 'text-dark-500'}>
                          {dest.name}
                        </span>
                        <span className="text-dark-500 ml-auto">${dest.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-dark-700">
                  <button
                    onClick={() => setSelectedTrip(trip)}
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-dark-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trip Detail Modal */}
      <AnimatePresence>
        {selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTrip(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-900 rounded-2xl border border-dark-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="relative h-48 bg-dark-800">
                <img
                  src={selectedTrip.image}
                  alt={selectedTrip.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="absolute top-4 right-4 p-2 bg-dark-900/70 rounded-full text-white"
                >
                  <Circle className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedTrip.name}</h3>
                  <div className="flex items-center gap-2 text-dark-400">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedTrip.destination}</span>
                  </div>
                </div>

                {/* Trip Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-800 rounded-xl p-4">
                    <p className="text-sm text-dark-400 mb-1">Start Date</p>
                    <p className="text-white font-semibold">{selectedTrip.startDate}</p>
                  </div>
                  <div className="bg-dark-800 rounded-xl p-4">
                    <p className="text-sm text-dark-400 mb-1">End Date</p>
                    <p className="text-white font-semibold">{selectedTrip.endDate}</p>
                  </div>
                  <div className="bg-dark-800 rounded-xl p-4">
                    <p className="text-sm text-dark-400 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${
                      TRIP_STATUSES[selectedTrip.status].color
                    }`}>
                      {TRIP_STATUSES[selectedTrip.status].label}
                    </span>
                  </div>
                  <div className="bg-dark-800 rounded-xl p-4">
                    <p className="text-sm text-dark-400 mb-1">Duration</p>
                    <p className="text-white font-semibold">
                      {Math.ceil((new Date(selectedTrip.endDate) - new Date(selectedTrip.startDate)) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>

                {/* All Destinations */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Planned Destinations</h4>
                  <div className="space-y-2">
                    {selectedTrip.destinations.map((dest, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg">
                        {dest.booked ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-dark-600" />
                        )}
                        <div className="flex-1">
                          <p className={`font-medium ${dest.booked ? 'text-white' : 'text-dark-400'}`}>
                            {dest.name}
                          </p>
                        </div>
                        <p className="text-white font-semibold">${dest.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Summary */}
                <div className="bg-dark-800 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-3">Budget Summary</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-dark-400">Total Budget</span>
                      <span className="text-white font-semibold">${selectedTrip.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-dark-400">Amount Spent</span>
                      <span className="text-white font-semibold">${selectedTrip.spent.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-dark-700">
                      <span className="text-dark-400">Remaining</span>
                      <span className={`font-semibold ${
                        selectedTrip.budget - selectedTrip.spent < 0 
                          ? 'text-red-400' 
                          : 'text-green-400'
                      }`}>
                        ${(selectedTrip.budget - selectedTrip.spent).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-medium transition-colors">
                    Edit Trip
                  </button>
                  <button className="flex-1 px-4 py-3 bg-dark-800 hover:bg-dark-700 rounded-xl text-white font-medium transition-colors">
                    Export Details
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripPlanner;
