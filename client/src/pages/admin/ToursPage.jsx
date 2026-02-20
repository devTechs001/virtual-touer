import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Eye, Edit, Trash2, Star, TrendingUp } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/api';
import toast from 'react-hot-toast';

const ToursPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const queryClient = useQueryClient();

  const { data: tours, isLoading } = useQuery({
    queryKey: ['admin', 'tours'],
    queryFn: () => adminService.getAllTours().then(res => res.data)
  });

  const deleteMutation = useMutation({
    mutationFn: (tourId) => adminService.deleteTour(tourId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'tours']);
      toast.success('Tour deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete tour');
    }
  });

  const handleDelete = (tourId) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      deleteMutation.mutate(tourId);
    }
  };

  const filteredTours = tours?.tours?.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tour.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Tours Management</h2>
          <p className="text-dark-400 mt-1">Create and manage virtual tour experiences</p>
        </div>
        <Link to="/admin/tours/create" className="btn-primary">
          <Plus className="w-5 h-5" />
          Create Tour
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input
              type="text"
              placeholder="Search tours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-dark-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              <option value="cultural">Cultural</option>
              <option value="nature">Nature</option>
              <option value="adventure">Adventure</option>
              <option value="historical">Historical</option>
              <option value="urban">Urban</option>
              <option value="relaxation">Relaxation</option>
              <option value="food">Food & Drink</option>
              <option value="art">Art & Museums</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours?.map((tour, index) => (
            <motion.div
              key={tour._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card overflow-hidden group"
            >
              <div className="relative aspect-video">
                <img
                  src={tour.images?.[0]?.url || '/placeholder-tour.jpg'}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                <div className="absolute top-2 right-2 flex gap-2">
                  {tour.featured && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </span>
                  )}
                  {tour.published && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      Published
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{tour.title}</h3>
                <p className="text-dark-400 text-sm mb-3 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  {tour.rating?.toFixed(1) || '0.0'} • {tour.reviews?.length || 0} reviews
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary-400 font-semibold">${tour.price}</span>
                  <span className="text-dark-500 text-sm capitalize">{tour.category}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/tour/${tour._id}`}
                    className="flex-1 btn-secondary text-center"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <Link
                    to={`/admin/tours/${tour._id}/edit`}
                    className="flex-1 btn-secondary text-center"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(tour._id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredTours?.length === 0 && !isLoading && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-dark-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No tours found</h3>
          <p className="text-dark-400 mb-4">
            {searchTerm ? 'Try adjusting your search or filters' : 'Create your first tour to get started'}
          </p>
          {!searchTerm && (
            <Link to="/admin/tours/create" className="btn-primary">
              <Plus className="w-5 h-5" />
              Create Tour
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ToursPage;
