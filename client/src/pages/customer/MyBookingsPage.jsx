import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Film,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';
import API from '../../services/api';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';
import TicketPDF from '../../components/customer/TicketPDF';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'cancelled', 'all'

  // Cancellation modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // View Ticket Modal
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [viewingBooking, setViewingBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/bookings/my-bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      toast.error('Failed to load your booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelClick = (booking) => {
    setSelectedBookingForCancel(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;
    setIsCancelling(true);

    try {
      const res = await API.put(`/bookings/${selectedBookingForCancel._id}/cancel`);
      toast.success(res.data.message || 'Booking cancelled successfully');
      setCancelModalOpen(false);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'cancelled') return b.bookingStatus === 'cancelled';
    if (activeTab === 'upcoming') return b.bookingStatus === 'confirmed';
    return true; // 'all'
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27324A] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">My Movie Bookings</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Access your cinema e-tickets, download PDFs, or manage cancellations
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 p-1 bg-[#11182B] rounded-xl border border-[#27324A]">
          {[
            { id: 'upcoming', label: 'Confirmed / Active' },
            { id: 'cancelled', label: 'Cancelled' },
            { id: 'all', label: 'All Bookings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#7C3AED] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-[#171D33] rounded-2xl animate-pulse border border-[#27324A]"></div>
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((b) => {
            const isConfirmed = b.bookingStatus === 'confirmed';
            return (
              <div
                key={b._id}
                className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] hover:border-[#7C3AED]/60 transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
              >
                {/* Left Poster & Details */}
                <div className="flex items-start space-x-4">
                  <img
                    src={b.movieId?.poster}
                    alt=""
                    className="w-20 aspect-[2/3] object-cover rounded-xl border border-[#27324A]"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#A855F7]">
                        #{b.bookingId}
                      </span>
                      {isConfirmed ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                          Confirmed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
                          Cancelled (Refunded)
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white">{b.movieId?.title}</h3>

                    <p className="text-xs text-[#94A3B8] flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#A855F7]" />
                      <span>{b.theatreId?.name} ({b.theatreId?.city})</span>
                      <span>•</span>
                      <span>{b.screenId?.screenName}</span>
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-[#94A3B8] pt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-[#A855F7]" />
                        <span>{b.showId?.showDate || new Date(b.createdAt).toISOString().split('T')[0]}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#A855F7]" />
                        <span className="text-white font-semibold">{b.showId?.startTime || '07:00 PM'}</span>
                      </div>
                    </div>

                    <div className="text-xs text-[#94A3B8]">
                      Seats: <span className="font-bold text-white">{b.selectedSeats?.map(s => s.seatId).join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Right Price & Actions */}
                <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-[#27324A] pt-4 md:pt-0 space-y-0 md:space-y-3">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase text-[#94A3B8]">Amount</span>
                    <p className="text-xl font-black text-white">₹{b.totalAmount}</p>
                    {b.refundAmount > 0 && (
                      <p className="text-[11px] text-[#22C55E]">Refunded: ₹{b.refundAmount}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setViewingBooking(b);
                        setTicketModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 flex items-center space-x-1.5 shadow-md shadow-[#7C3AED]/20"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>View Ticket / PDF</span>
                    </button>

                    {isConfirmed && (
                      <button
                        onClick={() => handleCancelClick(b)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Ticket}
          title="No bookings in this section"
          description="Browse our cinema catalog and book tickets for the latest blockbusters."
          actionText="Browse Movies Now"
          onAction={() => window.location.href = '/movies'}
        />
      )}

      {/* Cancellation Confirmation Modal */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        title="Cancel Ticket Booking?"
        message={`Are you sure you want to cancel booking #${selectedBookingForCancel?.bookingId}? In accordance with our cancellation policy, a 90% refund (approx ₹${Math.round((selectedBookingForCancel?.totalAmount || 0) * 0.9)}) will be credited to your original payment method, and the reserved seats will be released back to the cinema.`}
        confirmText="Confirm Cancellation"
        cancelText="Keep Booking"
        isDanger={true}
        isLoading={isCancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelModalOpen(false)}
      />

      {/* View & Download Ticket Modal */}
      <Modal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        title="Your Cinema Ticket Stub"
        maxWidth="max-w-3xl"
      >
        {viewingBooking && <TicketPDF booking={viewingBooking} />}
      </Modal>

    </div>
  );
};

export default MyBookingsPage;

