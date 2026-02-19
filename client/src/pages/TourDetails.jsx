import { useParams } from 'react-router-dom';
import { MapPin, Clock, Users, Star, Calendar } from 'lucide-react';

const tourData = {
  id: 1,
  name: 'Eiffel Tower Experience',
  location: 'Paris, France',
  description: 'Experience the iconic Eiffel Tower like never before with our immersive virtual tour.',
  price: 49,
  rating: 4.8,
  reviews: 256,
  duration: '2 hours',
  groupSize: 10,
  image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=1200',
  highlights: ['Skip-the-line access', 'Professional guide', '360° views', 'Historical commentary'],
  includes: ['VR headset support', 'Live narration', 'Digital photos'],
};

export default function TourDetails() {
  const { id } = useParams();

  return (
    <div className="page-container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <img src={tourData.image} alt={tourData.name} className="w-full rounded-2xl mb-6" />
          <h1 className="text-3xl font-bold text-dark-100 mb-2">{tourData.name}</h1>
          <div className="flex items-center text-dark-400 mb-4">
            <MapPin className="w-5 h-5 mr-2" />
            {tourData.location}
          </div>
          <p className="text-dark-300 mb-6">{tourData.description}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-primary-400" />
              <p className="text-dark-400 text-sm">Duration</p>
              <p className="text-dark-100 font-medium">{tourData.duration}</p>
            </div>
            <div className="card p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-primary-400" />
              <p className="text-dark-400 text-sm">Group Size</p>
              <p className="text-dark-100 font-medium">Up to {tourData.groupSize}</p>
            </div>
            <div className="card p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-primary-400" />
              <p className="text-dark-400 text-sm">Rating</p>
              <p className="text-dark-100 font-medium">{tourData.rating} ({tourData.reviews})</p>
            </div>
          </div>

          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Highlights</h2>
            <ul className="grid grid-cols-2 gap-3">
              {tourData.highlights.map((h, i) => (
                <li key={i} className="flex items-center text-dark-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div>
          <div className="card p-6 sticky top-24">
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-bold text-primary-400">${tourData.price}</span>
              <span className="text-dark-400 ml-2">/ person</span>
            </div>
            <button className="btn-primary w-full mb-4">Book Now</button>
            <div className="space-y-3 text-sm text-dark-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-primary-400" />
                Daily availability
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-3 text-primary-400" />
                Free cancellation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
