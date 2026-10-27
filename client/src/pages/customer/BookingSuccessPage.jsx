import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Ticket, ArrowRight, Home } from 'lucide-react';
import API from '../../services/api';
import TicketPDF from '../../components/customer/TicketPDF';

const BookingSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (!booking && id) {
      const fetchBooking = async () => {
        try {
          const res = await API.get(`/bookings/${id}`);
          setBooking(res.data.booking);
        } catch (err) {
          console.error('Failed to fetch confirmed booking', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [id, booking]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 mx-auto flex items-center justify-center shadow-lg shadow-[#22C55E]/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Booking Confirmed!</h1>
        <p className="text-sm text-[#94A3B8] max-w-md mx-auto">
          Your payment was verified and tickets are secured. Show the QR code at the cinema entry gate.
        </p>
      </div>

      {/* Ticket Card with PDF Download */}
      {booking && <TicketPDF booking={booking} />}

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <Link
          to="/my-bookings"
          className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#171D33] border border-[#27324A] hover:border-[#7C3AED] hover:bg-[#1E2642] flex items-center space-x-2 transition-all"
        >
          <Ticket className="w-4 h-4 text-[#A855F7]" />
          <span>View in My Bookings</span>
        </Link>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 flex items-center space-x-2 shadow-lg shadow-[#7C3AED]/30 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccessPage;

