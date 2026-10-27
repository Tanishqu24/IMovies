import React, { useState, useEffect } from 'react';
import { Ticket, Search, Calendar } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const ManagerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/bookings?limit=50');
      setBookings(res.data.bookings || []);
    } catch (err) {
      toast.error('Failed to load theatre bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    return (
      b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
      b.userId?.fullName?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27324A] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Auditorium Bookings</h2>
          <p className="text-xs text-[#94A3B8]">Review customer tickets and seat allocations across your theatres</p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search Booking ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#11182B] text-sm text-white placeholder-[#94A3B8] pl-10 pr-4 py-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
        </div>
      </div>

      <div className="rounded-2xl bg-[#171D33] border border-[#27324A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#94A3B8]">
            <thead className="bg-[#11182B] text-xs font-bold uppercase tracking-wider text-white border-b border-[#27324A]">
              <tr>
                <th className="py-4 px-6">Booking ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Movie</th>
                <th className="py-4 px-6">Screen</th>
                <th className="py-4 px-6">Seats</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27324A]">
              {filtered.map((b) => (
                <tr key={b._id} className="hover:bg-[#11182B]/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#A855F7]">#{b.bookingId}</td>
                  <td className="py-4 px-6">
                    <span className="text-white font-medium block">{b.userId?.fullName || 'Customer'}</span>
                    <span className="text-xs text-[#94A3B8]">{b.userId?.email}</span>
                  </td>
                  <td className="py-4 px-6 font-medium text-white">{b.movieId?.title}</td>
                  <td className="py-4 px-6 text-xs text-white">{b.screenId?.screenName}</td>
                  <td className="py-4 px-6 font-bold text-white text-xs">
                    {b.selectedSeats?.map((s) => s.seatId).join(', ')}
                  </td>
                  <td className="py-4 px-6 font-bold text-white">₹{b.totalAmount}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        b.bookingStatus === 'confirmed' ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerBookingsPage;

