import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await register(formData);
    setLoading(false);
  };

  return (
    <div className="page-container py-16">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="section-title text-center mb-2">Create Account</h1>
        <p className="text-center text-dark-400 mb-8">Start your virtual journey today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-dark-400 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-dark-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
