const TourCardSkeleton = () => {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-tour skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-6 skeleton rounded-lg w-3/4" />
        <div className="space-y-2">
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-2/3" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 skeleton rounded w-24" />
          <div className="h-4 skeleton rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export default TourCardSkeleton;