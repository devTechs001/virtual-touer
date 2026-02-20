import { useState } from 'react';
import { Plus, Search, Globe, MapPin, Image, Edit, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/api';

const DestinationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: destinationsData, isLoading } = useQuery({
    queryKey: ['admin', 'destinations'],
    queryFn: () => adminService.getAllDestinations?.().then(res => res.data).catch(() => ({ destinations: [] }))
  });

  const destinations = destinationsData?.destinations || [];

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Destinations</h2>
          <p className="text-dark-400 mt-1">Manage travel destinations</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          Add Destination
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div key={dest._id} className="card overflow-hidden group">
              <div className="relative aspect-video">
                <img
                  src={dest.image || dest.images?.[0] || '/placeholder.jpg'}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-semibold text-white">{dest.name}</h3>
                  <p className="text-dark-300 text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {dest.country}
                  </p>
                </div>
              </div>
              <div className="p-4 flex gap-2">
                <button className="flex-1 btn-secondary">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredDestinations.length === 0 && (
            <div className="col-span-full card p-12 text-center">
              <Globe className="w-12 h-12 text-dark-500 mx-auto mb-4" />
              <p className="text-dark-400">No destinations found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
