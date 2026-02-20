import { Link } from 'react-router-dom';
import { Star, TrendingUp, Eye } from 'lucide-react';

const TopTours = ({ tours = [] }) => {
  // Mock data if empty
  const displayTours = tours.length > 0 ? tours : [
    {
      _id: '1',
      title: 'Paris: Eiffel Tower Experience',
      images: [{ url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=200' }],
      rating: 4.9,
      participants: 15420,
      revenue: 45000
    },
    {
      _id: '2',
      title: 'Tokyo: Shibuya Street Culture',
      images: [{ url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=200' }],
      rating: 4.8,
      participants: 12350,
      revenue: 38000
    },
    {
      _id: '3',
      title: 'New York: Manhattan Skyline',
      images: [{ url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200' }],
      rating: 4.7,
      participants: 18930,
      revenue: 52000
    },
    {
      _id: '4',
      title: 'Rome: Ancient Colosseum',
      images: [{ url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200' }],
      rating: 4.8,
      participants: 11200,
      revenue: 33000
    },
    {
      _id: '5',
      title: 'Bali: Temple Journey',
      images: [{ url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200' }],
      rating: 4.9,
      participants: 9870,
      revenue: 28000
    }
  ];

  return (
    <div className="card overflow-hidden h-full">
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Top Performing Tours</h3>
          <Link to="/admin/tours" className="text-sm text-primary-400 hover:text-primary-300">
            View all
          </Link>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {displayTours.map((tour, index) => (
          <Link
            key={tour._id}
            to={`/admin/tours/${tour._id}`}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark-800/50 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-dark-700 text-dark-400 font-bold">
              {index + 1}
            </div>
            <img
              src={tour.images?.[0]?.url || '/placeholder-tour.jpg'}
              alt={tour.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-dark-200 font-medium line-clamp-1">{tour.title}</h4>
              <div className="flex items-center gap-3 mt-1 text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{tour.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-dark-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{(tour.participants / 1000).toFixed(1)}k</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary-400 font-semibold">
                ${(tour.revenue / 1000).toFixed(1)}k
              </p>
              <div className="flex items-center gap-1 text-secondary-400 text-sm">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopTours;