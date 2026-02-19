import { Star } from 'lucide-react';

export default function Rating({ value, count, size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizes[size]} ${
              star <= Math.floor(value)
                ? 'fill-yellow-400 text-yellow-400'
                : star - 0.5 <= value
                ? 'fill-yellow-400 text-yellow-400 opacity-50'
                : 'text-dark-300'
            }`}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="ml-2 text-sm text-dark-600">({count})</span>
      )}
    </div>
  );
}
