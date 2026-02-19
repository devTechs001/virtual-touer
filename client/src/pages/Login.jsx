import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Globe, ArrowRight } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">VTourist</span>
          </Link>

          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Welcome back
          </h1>
          <p className="text-dark-400 mb-8">
            Sign in to continue your virtual adventures
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={`input pl-12 ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-dark-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input pl-12 pr-12 ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-dark-700" />
            <span className="text-dark-500 text-sm">or continue with</span>
            <div className="flex-1 h-px bg-dark-700" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="btn-secondary">
              <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
            <button className="btn-secondary">
              <img src="/icons/apple.svg" alt="Apple" className="w-5 h-5" />
              Apple
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center mt-8 text-dark-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/50 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <blockquote className="text-xl text-white font-medium mb-4">
            "Virtual Tourist changed the way I explore the world. It's like being there without leaving home."
          </blockquote>
          <div className="flex items-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="User"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-white font-medium">Sarah Johnson</p>
              <p className="text-dark-400 text-sm">Travel Enthusiast</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;