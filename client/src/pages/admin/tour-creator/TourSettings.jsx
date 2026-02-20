import { useEffect } from 'react';

const TourSettings = ({ register, control, watch, setValue, errors }) => {
  const formData = watch();

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Tour Title
            </label>
            <input
              type="text"
              {...register('title')}
              className="input w-full"
              placeholder="Enter tour title"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="input w-full"
              placeholder="Describe the tour experience"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Category
              </label>
              <select {...register('category')} className="input w-full">
                <option value="">Select category</option>
                <option value="cultural">Cultural</option>
                <option value="nature">Nature</option>
                <option value="adventure">Adventure</option>
                <option value="historical">Historical</option>
                <option value="urban">Urban</option>
                <option value="relaxation">Relaxation</option>
                <option value="food">Food</option>
                <option value="art">Art</option>
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Duration
              </label>
              <input
                type="text"
                {...register('duration')}
                className="input w-full"
                placeholder="e.g., 2 hours"
              />
              {errors.duration && (
                <p className="text-red-400 text-sm mt-1">{errors.duration.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="input w-full"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && (
                <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Max Guests
              </label>
              <input
                type="number"
                {...register('maxGuests', { valueAsNumber: true })}
                className="input w-full"
                placeholder="10"
                min="1"
              />
              {errors.maxGuests && (
                <p className="text-red-400 text-sm mt-1">{errors.maxGuests.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Location</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Destination
            </label>
            <input
              type="text"
              {...register('destination')}
              className="input w-full"
              placeholder="Enter destination"
            />
            {errors.destination && (
              <p className="text-red-400 text-sm mt-1">{errors.destination.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                {...register('location.lat', { valueAsNumber: true })}
                className="input w-full"
                placeholder="0.0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                {...register('location.lng', { valueAsNumber: true })}
                className="input w-full"
                placeholder="0.0000"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('isVirtual')}
                className="w-4 h-4 rounded border-dark-700 bg-dark-800 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-dark-300">Virtual Tour</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('is360')}
                className="w-4 h-4 rounded border-dark-700 bg-dark-800 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-dark-300">360° Experience</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('isAR')}
                className="w-4 h-4 rounded border-dark-700 bg-dark-800 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-dark-300">AR Enabled</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              {...register('amenities')}
              className="input w-full"
              placeholder="WiFi, Parking, Restaurant, etc."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourSettings;
