import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, Globe2, Shield, Check, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/api';

const BookingCard = ({ tour }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [participants, setParticipants] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const totalPrice = tour.price * participants;

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/tour/${tour._id}` } });
      return;
    }

    if (tour.price > 0 && !selectedDate) {
      toast.error('Please select a date');
      return;
    }

    setIsBooking(true);
    try {
      const response = await bookingService.create({
        tour: tour._id,
        date: selectedDate,
        participants
      });

      if (tour.price > 0) {
        // Redirect to payment
        navigate(`/checkout/${response.data.booking._id}`);
      } else {
        // Free tour - go directly to virtual tour
        toast.success('Booking confirmed!');
        navigate(`/virtual-tour/${tour._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  // Generate available dates (next 30 days)
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="card p-6 space-y-6">
      {/* Price */}
      <div className="flex items-baseline justify-between">
        <div>
          {tour.price > 0 ? (
            <>
              <span className="text-3xl font-bold text-white">${tour.price}</span>
              <span className="text-dark-400 ml-2">/ person</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-secondary-400">Free</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-dark-400">
          <Clock className="w-4 h-4" />
          {tour.duration}
        </div>
      </div>

      {/* Date Selection */}
      {tour.price > 0 && (
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Select Date
          </label>
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full flex items-center justify-between px-4 py-3 bg-dark-700 rounded-xl text-left"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-400" />
                <span className={selectedDate ? 'text-white' : 'text-dark-500'}>
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  }) : 'Choose a date'}
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 text-dark-400 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
            </button>

            {showDatePicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-dark-700 rounded-xl border border-dark-600 shadow-xl"
              >
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setShowDatePicker(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left hover:bg-dark-600 transition-colors ${
                      selectedDate === date ? 'bg-primary-500/20 text-primary-400' : 'text-dark-200'
                    }`}
                  >
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Participants */}
      {tour.price > 0 && (
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Participants
          </label>
          <div className="flex items-center gap-4 px-4 py-3 bg-dark-700 rounded-xl">
            <Users className="w-5 h-5 text-primary-400" />
            <button
              onClick={() => setParticipants(Math.max(1, participants - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-600 text-white hover:bg-dark-500"
            >
              -
            </button>
            <span className="flex-1 text-center text-white font-medium">
              {participants}
            </span>
            <button
              onClick={() => setParticipants(Math.min(tour.maxParticipants || 10, participants + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-600 text-white hover:bg-dark-500"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Total */}
      {tour.price > 0 && (
        <div className="flex items-center justify-between py-4 border-t border-dark-700">
          <span className="text-dark-300">Total</span>
          <span className="text-2xl font-bold text-white">${totalPrice}</span>
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={handleBookNow}
        disabled={isBooking}
        className="btn-primary w-full py-4 text-lg"
      >
        {isBooking ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : tour.price > 0 ? (
          'Book Now'
        ) : (
          'Start Free Tour'
        )}
      </button>

      {/* Features */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-dark-400">
          <Check className="w-4 h-4 text-secondary-400" />
          <span>Instant confirmation</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-dark-400">
          <Globe2 className="w-4 h-4 text-secondary-400" />
          <span>Available in {tour.languages?.length || 1} languages</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-dark-400">
          <Shield className="w-4 h-4 text-secondary-400" />
          <span>Free cancellation up to 24h before</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;