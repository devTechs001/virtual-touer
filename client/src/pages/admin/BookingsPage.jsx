import { useState } from 'react';
import { Calendar, Search, Filter, DollarSign, Clock, Check, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/api';

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: () => adminService.getBookings().then(res => res.data)
  });

  const bookings = bookingsData?.bookings || [];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-dark-700 text-dark-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Bookings</h2>
        <p className="text-dark-400 mt-1">Manage all tour bookings</p>
      </div>

      <div className="card p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Booking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Tour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-dark-800/50">
                  <td className="px-6 py-4 text-dark-400">#{booking._id.slice(-6)}</td>
                  <td className="px-6 py-4 text-white">{booking.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-white">{booking.tour?.title || 'N/A'}</td>
                  <td className="px-6 py-4 text-dark-400">
                    {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-primary-400 font-semibold">
                    ${booking.amount?.toLocaleString() || booking.tour?.price || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
