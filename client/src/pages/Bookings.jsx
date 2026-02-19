import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const bookings = [
  { id: 1, tour: 'Eiffel Tower Experience', date: '2024-03-15', time: '10:00 AM', guests: 2, price: 98, status: 'confirmed', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400' },
  { id: 2, tour: 'Grand Canyon Adventure', date: '2024-03-20', time: '08:00 AM', guests: 4, price: 316, status: 'pending', image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400' },
];

export default function Bookings() {
  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-6">My Bookings</h1>

      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="card flex flex-col md:flex-row overflow-hidden">
            <img src={booking.image} alt={booking.tour} className="w-full md:w-48 h-48 md:h-auto object-cover" />
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-dark-100">{booking.tour}</h3>
                  <div className="flex items-center text-dark-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">Paris, France</span>
                  </div>
                </div>
                <span className={`badge ${booking.status === 'confirmed' ? 'badge-secondary' : 'badge-warning'}`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-dark-400">
                  <Calendar className="w-5 h-5 mr-2 text-primary-400" />
                  <div>
                    <p className="text-xs">Date</p>
                    <p className="font-medium">{booking.date}</p>
                  </div>
                </div>
                <div className="flex items-center text-dark-400">
                  <Clock className="w-5 h-5 mr-2 text-primary-400" />
                  <div>
                    <p className="text-xs">Time</p>
                    <p className="font-medium">{booking.time}</p>
                  </div>
                </div>
                <div className="flex items-center text-dark-400">
                  <Users className="w-5 h-5 mr-2 text-primary-400" />
                  <div>
                    <p className="text-xs">Guests</p>
                    <p className="font-medium">{booking.guests}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary-400">${booking.price}</span>
                <button className="btn-outline text-sm">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
