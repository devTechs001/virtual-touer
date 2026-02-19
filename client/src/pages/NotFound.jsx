import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page-container py-32 text-center">
      <h1 className="text-9xl font-bold text-dark-700 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-dark-100 mb-4">Page Not Found</h2>
      <p className="text-dark-500 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
    </div>
  );
}
