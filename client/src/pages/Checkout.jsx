import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Lock,
  Check,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Shield,
  Clock
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { bookingService, paymentService } from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // If returning from Stripe checkout
  if (sessionId) {
    return <PaymentSuccess sessionId={sessionId} />;
  }

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getById(bookingId).then(res => res.data.booking)
  });

  const createPaymentIntentMutation = useMutation({
    mutationFn: () => paymentService.createPaymentIntent({ bookingId }),
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to initialize payment')
  });

  useEffect(() => {
    if (booking && booking.paymentStatus !== 'paid') {
      createPaymentIntentMutation.mutate();
    }
  }, [booking]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Booking not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (booking.paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <Check className="w-16 h-16 text-secondary-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Already Paid</h2>
          <p className="text-dark-400 mb-4">This booking has already been paid for.</p>
          <button onClick={() => navigate('/bookings')} className="btn-primary">
            View Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-dark-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Order Summary</h1>
            
            <div className="card p-6 space-y-6">
              {/* Tour Info */}
              <div className="flex gap-4">
                <img
                  src={booking.tour?.images?.[0]?.url || '/placeholder-tour.jpg'}
                  alt={booking.tour?.title}
                  className="w-24 h-20 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold text-white">{booking.tour?.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-dark-400 mt-1">
                    <MapPin className="w-4 h-4" />
                    {booking.tour?.location?.city}, {booking.tour?.location?.country}
                  </div>
                </div>
              </div>

              <hr className="border-dark-700" />

              {/* Booking Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-dark-400">
                    <Calendar className="w-4 h-4" />
                    <span>Date</span>
                  </div>
                  <span className="text-white">
                    {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-dark-400">
                    <Users className="w-4 h-4" />
                    <span>Participants</span>
                  </div>
                  <span className="text-white">{booking.participants}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-dark-400">
                    <Clock className="w-4 h-4" />
                    <span>Duration</span>
                  </div>
                  <span className="text-white">{booking.tour?.duration}</span>
                </div>
              </div>

              <hr className="border-dark-700" />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-dark-300">
                  <span>${booking.tour?.price} × {booking.participants} participants</span>
                  <span>${(booking.tour?.price * booking.participants).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-dark-300">
                  <span>Service fee</span>
                  <span>$0.00</span>
                </div>
              </div>

              <hr className="border-dark-700" />

              <div className="flex justify-between text-lg">
                <span className="font-semibold text-white">Total</span>
                <span className="font-bold text-primary-400">${booking.totalPrice.toFixed(2)}</span>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-dark-400">
                  <Shield className="w-4 h-4 text-secondary-400" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-dark-400">
                  <Lock className="w-4 h-4 text-secondary-400" />
                  <span>SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
            
            {createPaymentIntentMutation.data?.clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: createPaymentIntentMutation.data.clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#3b82f6',
                      colorBackground: '#1e293b',
                      colorText: '#e2e8f0',
                      colorTextSecondary: '#94a3b8',
                      borderRadius: '12px',
                      fontFamily: 'Inter, system-ui, sans-serif'
                    }
                  }
                }}
              >
                <CheckoutForm booking={booking} />
              </Elements>
            ) : createPaymentIntentMutation.isPending ? (
              <div className="card p-8 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="card p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-dark-400">Failed to initialize payment</p>
                <button
                  onClick={() => createPaymentIntentMutation.mutate()}
                  className="btn-primary mt-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Checkout Form Component
const CheckoutForm = ({ booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setIsProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success`,
      },
      redirect: 'if_required'
    });

    if (confirmError) {
      setError(confirmError.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success('Payment successful!');
      navigate(`/booking/success?booking_id=${booking._id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <CreditCard className="w-6 h-6 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">Card Information</h3>
      </div>

      <PaymentElement
        options={{
          layout: 'tabs'
        }}
      />

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn-primary w-full py-4 text-lg"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" />
            Pay ${booking.totalPrice.toFixed(2)}
          </span>
        )}
      </button>

      <p className="text-center text-sm text-dark-500">
        By completing this purchase, you agree to our{' '}
        <a href="/terms" className="text-primary-400 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-primary-400 hover:underline">Privacy Policy</a>
      </p>
    </form>
  );
};

// Payment Success Component
const PaymentSuccess = ({ sessionId }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  const { data, isLoading, error } = useQuery({
    queryKey: ['payment-success', sessionId || bookingId],
    queryFn: async () => {
      if (sessionId) {
        return paymentService.handleSuccess(sessionId).then(res => res.data);
      }
      return bookingService.getById(bookingId).then(res => res.data);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-dark-400 mb-4">We couldn't confirm your payment.</p>
          <button onClick={() => navigate('/bookings')} className="btn-primary">
            View Bookings
          </button>
        </div>
      </div>
    );
  }

  const booking = data?.booking;

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-lg w-full"
      >
        <div className="card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-secondary-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-secondary-400" />
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-dark-400 mb-6">
            Your booking has been confirmed. You're all set to enjoy your virtual tour!
          </p>

          {/* Booking Details */}
          <div className="bg-dark-700/50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-400">Confirmation Code</span>
              <span className="font-mono text-primary-400 font-semibold">
                {booking?.confirmationCode}
              </span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-400">Tour</span>
              <span className="text-white">{booking?.tour?.title}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-400">Date</span>
              <span className="text-white">
                {booking?.date && format(new Date(booking.date), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-400">Total Paid</span>
              <span className="text-secondary-400 font-semibold">
                ${booking?.totalPrice?.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/bookings')}
              className="btn-secondary flex-1"
            >
              View Bookings
            </button>
            <button
              onClick={() => navigate(`/virtual-tour/${booking?.tour?._id}`)}
              className="btn-primary flex-1"
            >
              Start Tour
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;