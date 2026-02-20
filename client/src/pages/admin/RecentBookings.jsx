import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, MoreVertical } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-secondary-500/20 text-secondary-400',
  cancelled: 'bg-red-500/20 text-red-400',
  completed: 'bg-primary-500/20 text-primary-400'
};

const RecentBookings = ({ bookings = [] }) => {
  // Mock data if empty
  const displayBookings = bookings.length > 0 ? bookings : [
    {
      _id: '1',
      confirmationCode: 'VT7X8K2M',
      user: { name: 'John Doe', avatar: null },
      tour: { title: 'Paris: Eiffel Tower Experience' },
      date: new Date(),
      totalPrice: 29.99,
      status: 'confirmed'
    },
    {
      _id: '2',
      confirmationCode: 'VT9P3L4N',
      user: { name: 'Jane Smith', avatar: null },
      tour: { title: 'Tokyo: Shibuya & Harajuku' },
      date: new Date(Date.now() - 86400000),
      totalPrice: 19.99,
      status: 'pending'
    },
    {
      _id: '3',
      confirmationCode: 'VT2K5M7Q',
      user: { name: 'Mike Johnson', avatar: null },
      tour: { title: 'Rome: Colosseum Tour' },
      date: new Date(Date.now() - 172800000),
      totalPrice: 24.99,
      status: 'completed'
    }
  ];

  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
          <Link to="/admin/bookings" className="text-sm text-primary-400 hover:text-primary-300">
            View all
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Booking</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Customer</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Tour</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Date</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Amount</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-dark-400"></th>
            </tr>
          </thead>
          <tbody>
            {displayBookings.map((booking) => (
              <tr key={booking._id} className="border-b border-dark-800 hover:bg-dark-800/50">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-primary-400">
                    #{booking.confirmationCode}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-medium">
                      {booking.user?.name?.charAt(0)}
                    </div>
                    <span className="text-dark-200">{booking.user?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-dark-300 line-clamp-1 max-w-48">
                    {booking.tour?.title}
                  </span>
                </td>
                <td className="px-6 py-4 text-dark-400 text-sm">
                  {format(new Date(booking.date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-white font-medium">
                  ${booking.totalPrice}
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${statusColors[booking.status]} capitalize`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/bookings/${booking._id}`}
                    className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;