import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { Button, Input, Modal } from '../common';

export default function BookingForm({ tour, onSubmit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-primary-600">${tour?.price}</span>
            <span className="text-dark-500 ml-1">/ person</span>
          </div>
          <p className="text-sm text-dark-500 mt-1">Best price guaranteed</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-dark-700">
            <Calendar className="w-5 h-5 mr-3 text-primary-600" />
            <span>Daily availability</span>
          </div>
          <div className="flex items-center text-dark-700">
            <Users className="w-5 h-5 mr-3 text-primary-600" />
            <span>Up to {tour?.groupSize} guests</span>
          </div>
          <div className="flex items-center text-dark-700">
            <CreditCard className="w-5 h-5 mr-3 text-primary-600" />
            <span>Free cancellation</span>
          </div>
        </div>

        <Button variant="primary" className="w-full" size="lg" onClick={() => setIsModalOpen(true)}>
          Book Now
        </Button>

        <p className="text-xs text-center text-dark-500 mt-4">
          You won't be charged yet
        </p>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Complete Your Booking"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>

          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+1 (555) 123-4567"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={format(new Date(), 'yyyy-MM-dd')}
            />
            <Input
              label="Number of Guests"
              name="guests"
              type="number"
              value={formData.guests}
              onChange={handleChange}
              required
              min={1}
              max={tour?.groupSize}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">
              Special Requests
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Any special requirements or questions?"
            />
          </div>

          {/* Summary */}
          <div className="bg-dark-50 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-dark-900 mb-2">Booking Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-600">Tour</span>
                <span className="text-dark-900">{tour?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Date</span>
                <span className="text-dark-900">{formData.date || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Guests</span>
                <span className="text-dark-900">{formData.guests}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-dark-200 pt-2 mt-2">
                <span className="text-dark-900">Total</span>
                <span className="text-primary-600">
                  ${(tour?.price || 0) * (formData.guests || 1)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
