import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Film,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  CreditCard,
  QrCode,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronLeft
} from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [checkoutData, setCheckoutData] = useState(null);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Payment processing state
  const [isProcessing, setIsProcessing] = useState(false);

  // Countdown timer for seat lock (8 minutes)
  const [timeLeft, setTimeLeft] = useState(480);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('Seat lock expired. Please select your seats again.');
          navigate(`/seat-selection/${showId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showId, navigate]);

  useEffect(() => {
    const raw = sessionStorage.getItem(`checkout_${showId}`);
    if (!raw) {
      toast.error('No seats selected. Returning to seat matrix.');
      navigate(`/seat-selection/${showId}`);
      return;
    }

    const parsed = JSON.parse(raw);
    setCheckoutData(parsed);

    const fetchShow = async () => {
      try {
        const res = await API.get(`/shows/${showId}`);
        setShow(res.data.show);
      } catch (err) {
        toast.error('Failed to load show information');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId, navigate]);

  // Handle Coupon Apply
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const res = await API.post('/coupons/validate', {
        code: couponCode.trim(),
        orderAmount: checkoutData?.subtotal || 0
      });

      setAppliedCoupon(res.data.coupon);
      setCouponDiscount(res.data.coupon.discountAmount);
      toast.success(`Coupon ${res.data.coupon.code} applied! Saved ₹${res.data.coupon.discountAmount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired coupon');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    toast('Coupon removed');
  };

  // Calculations
  const seatCount = checkoutData?.selectedSeats?.length || 0;
  const subtotal = checkoutData?.subtotal || 0;
  const convenienceFee = 30 * seatCount;
  const tax = Math.round(convenienceFee * 0.18);
  const totalAmount = Math.max(0, subtotal + convenienceFee + tax - couponDiscount);

  // Handle Payment Submission
  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    toast.loading('Processing simulated cinema payment gateway...', { id: 'payment-toast' });

    try {
      // 1. Create simulated payment order
      const orderRes = await API.post('/payments/create', {
        amount: totalAmount,
        bookingData: { showId, selectedSeats: checkoutData.selectedSeats }
      });

      // 2. Simulated payment delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 3. Finalize booking creation on backend
      const bookingRes = await API.post('/bookings', {
        showId,
        selectedSeats: checkoutData.selectedSeats,
        couponCode: appliedCoupon?.code || '',
        paymentMethod
      });

      toast.success('Payment verified & Tickets booked successfully!', { id: 'payment-toast' });

      // Clear session storage
      sessionStorage.removeItem(`checkout_${showId}`);

      navigate(`/booking-success/${bookingRes.data.booking._id}`, {
        state: { booking: bookingRes.data.booking }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment or booking creation failed', { id: 'payment-toast' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !show || !checkoutData) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Navigation & Countdown Lock Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27324A] pb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-[#171D33] border border-[#27324A] hover:text-[#A855F7] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Booking Checkout</h1>
            <p className="text-xs text-[#94A3B8]">Review tickets, apply promotional coupons, and pay securely</p>
          </div>
        </div>

        {/* Lock Expiry Timer */}
        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#171D33] border border-[#F59E0B]/40 text-xs text-[#F59E0B]">
          <Clock className="w-4 h-4 animate-spin text-[#F59E0B]" />
          <span>Seat Lock Expires in:</span>
          <span className="font-mono font-bold text-sm text-white">{formatTimer(timeLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Payment Methods & Order Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Movie & Show Info Card */}
          <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] flex flex-col sm:flex-row gap-6">
            <img
              src={show.movieId?.poster}
              alt=""
              className="w-24 sm:w-28 aspect-[2/3] object-cover rounded-xl border border-[#27324A]"
            />
            <div className="space-y-2 flex-1">
              <h2 className="text-xl font-bold text-white">{show.movieId?.title}</h2>
              <p className="text-xs text-[#94A3B8]">{show.movieId?.language?.join(', ')} • {show.movieId?.genre?.join(', ')}</p>

              <div className="pt-2 text-xs text-[#94A3B8] space-y-1">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span className="text-white font-medium">{show.theatreId?.name}</span>
                  <span>({show.theatreId?.city})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>{show.showDate}</span>
                  <span>•</span>
                  <span className="text-white font-bold">{show.startTime}</span>
                  <span>•</span>
                  <span>{show.screenId?.screenName}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs text-[#94A3B8]">Seats Booked: </span>
                <span className="text-xs font-bold text-[#A855F7]">
                  {checkoutData.selectedSeats?.map((s) => s.seatId).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-6">
            <div className="flex items-center justify-between border-b border-[#27324A] pb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-[#A855F7]" />
                <span>Select Payment Method</span>
              </h3>
              <span className="text-[10px] uppercase font-bold text-[#22C55E] flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Simulated Secure Gateway</span>
              </span>
            </div>

            {/* Radio Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'card', label: 'Cards', icon: CreditCard },
                { id: 'netbanking', label: 'Net Banking', icon: Lock },
                { id: 'wallet', label: 'Wallets', icon: Ticket }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center space-y-2 ${
                    paymentMethod === m.id
                      ? 'bg-[#7C3AED]/20 border-[#A855F7] text-white shadow-md'
                      : 'bg-[#11182B] border-[#27324A] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <m.icon className="w-5 h-5 text-[#A855F7]" />
                  <span className="text-xs font-bold">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Method Inputs */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-xl bg-[#11182B] border border-[#27324A] space-y-3">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Enter Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. mobile@okhdfcbank or user@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-[#171D33] text-sm text-white p-3 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                />
                <p className="text-[11px] text-[#94A3B8]">
                  Supports Google Pay, PhonePe, Paytm, Amazon Pay & any BHIM UPI app.
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-[#11182B] border border-[#27324A] space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#171D33] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#171D33] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-[#171D33] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-4 rounded-xl bg-[#11182B] border border-[#27324A] text-xs text-[#94A3B8]">
                Select from popular banks: HDFC, State Bank of India, ICICI, Axis Bank, Kotak. Simulation mode active.
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="p-4 rounded-xl bg-[#11182B] border border-[#27324A] text-xs text-[#94A3B8]">
                Pay using Paytm Wallet, PhonePe Wallet, or MobiKwik. Instant simulated authorization.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="space-y-6">
          
          {/* Coupon Box */}
          <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Tag className="w-4 h-4 text-[#A855F7]" />
              <span>Promo Coupons</span>
            </h3>

            {appliedCoupon ? (
              <div className="p-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#22C55E]">{appliedCoupon.code}</span>
                  <p className="text-[11px] text-[#94A3B8]">Saved ₹{couponDiscount}</p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs text-[#EF4444] font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME50, IMOVIES100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#11182B] text-xs text-white uppercase p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                />
                <button
                  type="submit"
                  disabled={isValidatingCoupon}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-all disabled:opacity-50"
                >
                  {isValidatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </form>
            )}

            <div className="text-[11px] text-[#94A3B8]">
              Try demo codes: <span className="text-[#A855F7] font-mono font-bold">WELCOME50</span> or{' '}
              <span className="text-[#A855F7] font-mono font-bold">BLOCKBUSTER20</span>
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-[#27324A] pb-3">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-[#94A3B8]">
              <div className="flex justify-between">
                <span>Tickets ({seatCount} seats):</span>
                <span className="text-white font-medium">₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Convenience Fees:</span>
                <span className="text-white font-medium">₹{convenienceFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Integrated GST (18%):</span>
                <span className="text-white font-medium">₹{tax}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#22C55E] font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#27324A] pt-4 flex items-center justify-between">
              <span className="text-sm font-bold text-white">Total Amount</span>
              <span className="text-2xl font-black text-white">₹{totalAmount}</span>
            </div>

            <button
              type="button"
              onClick={handlePaymentSubmit}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 shadow-xl shadow-[#7C3AED]/40 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Authorizing Payment...' : `Pay ₹${totalAmount}`}</span>
            </button>

            <p className="text-[10px] text-center text-[#94A3B8]">
              By clicking Pay, you agree to IMovies Terms of Service and Cancellation Policy.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;

