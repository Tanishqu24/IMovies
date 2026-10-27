import React, { useState, useEffect } from 'react';
import { Ticket, Search, CheckCircle, XCircle, Trash2, Calendar, MapPin } from 'lucide-react';
import API from '../../services/api';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cancellation
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('page', page);
      params.append('limit', 12);

      const res = await API.get(`/bookings?${params.toString()}`);
      setBookings(res.data.bookings || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, search, statusFilter]);

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    try {
      await API.put(`/bookings/${bookingToCancel._id}/cancel`);
      toast.success(`Booking #${bookingToCancel.bookingId} cancelled and refunded`);
      setCancelModalOpen(false);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Customer Bookings"
        subtitle="Monitor tickets, payment settlements, cancellations, and seat allocations"
      />

      <div className="p-8 space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search Booking ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#11182B] text-sm text-white placeholder-[#94A3B8] pl-10 pr-4 py-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#11182B] text-xs font-semibold text-white px-3 py-2.5 rounded-xl border border-[#27324A]"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-[#171D33] border border-[#27324A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#94A3B8]">
              <thead className="bg-[#11182B] text-xs font-bold uppercase tracking-wider text-white border-b border-[#27324A]">
                <tr>
                  <th className="py-4 px-6">Booking ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Movie & Theatre</th>
                  <th className="py-4 px-6">Seats</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27324A]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-[#94A3B8]">
                      Loading bookings...
                    </td>
                  </tr>
                ) : bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-[#11182B]/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-[#A855F7]">
                        #{b.bookingId}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium block">{b.userId?.fullName || 'User'}</span>
                        <span className="text-xs text-[#94A3B8]">{b.userId?.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium block">{b.movieId?.title}</span>
                        <span className="text-xs text-[#94A3B8]">{b.theatreId?.name}</span>
                      </td>
                      <td className="py-4 px-6 text-white font-bold text-xs">
                        {b.selectedSeats?.map((s) => s.seatId).join(', ')}
                      </td>
                      <td className="py-4 px-6 font-bold text-white">
                        ₹{b.totalAmount}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            b.bookingStatus === 'confirmed'
                              ? 'bg-[#22C55E]/20 text-[#22C55E]'
                              : 'bg-[#EF4444]/20 text-[#EF4444]'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {b.bookingStatus === 'confirmed' ? (
                          <button
                            onClick={() => {
                              setBookingToCancel(b);
                              setCancelModalOpen(true);
                            }}
                            className="px-3 py-1 rounded-lg text-xs font-semibold text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-[#94A3B8] italic">Refunded</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-[#94A3B8]">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#27324A]">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
          </div>
        </div>

      </div>

      {/* Cancel Confirm */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        title="Admin Cancellation & Refund"
        message={`Are you sure you want to cancel booking #${bookingToCancel?.bookingId}? A refund will be initiated and the seats will be released back to the cinema auditorium.`}
        confirmText="Confirm Cancel"
        isLoading={isCancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelModalOpen(false)}
      />

    </div>
  );
};

export default AdminBookingsPage;

