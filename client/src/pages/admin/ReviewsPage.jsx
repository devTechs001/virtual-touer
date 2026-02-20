import { useState } from 'react';
import { Star, Search, Trash2, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/api';

const ReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: () => adminService.getReviews().then(res => res.data)
  });

  const reviews = reviewsData?.reviews || [];

  const filteredReviews = reviews.filter(review =>
    review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Reviews</h2>
        <p className="text-dark-400 mt-1">Moderate user reviews and ratings</p>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            placeholder="Search reviews..."
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
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review._id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                    {review.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{review.user?.name || 'Anonymous'}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (review.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-dark-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-dark-400 text-sm mt-1">
                      Reviewed: <span className="text-white">{review.tour?.title || 'Unknown Tour'}</span>
                    </p>
                    <p className="text-dark-300 mt-2">{review.comment}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-primary-400 hover:bg-primary-500/20 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredReviews.length === 0 && (
            <div className="card p-12 text-center">
              <Star className="w-12 h-12 text-dark-500 mx-auto mb-4" />
              <p className="text-dark-400">No reviews found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
