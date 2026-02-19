import { Link } from 'react-router-dom';

const destinations = [
  { id: 1, name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', tours: 24 },
  { id: 2, name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', tours: 18 },
  { id: 3, name: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', tours: 32 },
  { id: 4, name: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', tours: 21 },
  { id: 5, name: 'London', country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', tours: 28 },
  { id: 6, name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea904ac66de?w=800', tours: 15 },
];

export default function Destinations() {
  return (
    <div className="page-container py-8">
      <h1 className="section-title">Popular Destinations</h1>
      <p className="section-subtitle mb-8">Explore tours from cities around the world</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map(dest => (
          <Link key={dest.id} to={`/destination/${dest.id}`} className="card-hover group">
            <div className="relative aspect-tour overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white">{dest.name}</h3>
                <p className="text-white/80">{dest.country}</p>
                <p className="text-primary-400 mt-2">{dest.tours} tours available</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
