import { Heart } from 'lucide-react';

const favorites = [
  { id: 1, name: 'Eiffel Tower', location: 'Paris, France', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800', price: 49 },
  { id: 2, name: 'Santorini Sunset', location: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', price: 69 },
];

export default function Favorites() {
  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-6">My Favorites</h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map(tour => (
            <div key={tour.id} className="card-hover">
              <a href={`/tour/${tour.id}`}>
                <img src={tour.image} alt={tour.name} className="w-full aspect-tour object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-dark-100">{tour.name}</h3>
                  <p className="text-dark-400 text-sm">{tour.location}</p>
                  <p className="text-primary-400 font-bold mt-2">${tour.price}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Heart className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-100 mb-2">No favorites yet</h3>
          <p className="text-dark-500 mb-6">Start exploring and save your favorite tours!</p>
          <a href="/explore" className="btn-primary">Browse Tours</a>
        </div>
      )}
    </div>
  );
}
