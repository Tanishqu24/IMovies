import React, { useState, useEffect } from 'react';
import { DollarSign, Ticket, Film, TrendingUp } from 'lucide-react';
import API from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import toast from 'react-hot-toast';

const ManagerRevenuePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/analytics/manager');
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load revenue report');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = data?.stats || {};
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="space-y-8">
      <div className="border-b border-[#27324A] pb-4">
        <h2 className="text-xl font-bold text-white">Theatre Revenue Reports</h2>
        <p className="text-xs text-[#94A3B8]">Financial analytics and ticket sale settlements for your theatres</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Gross Revenue"
          value={`₹${stats.totalRevenue?.toLocaleString('en-IN') || 0}`}
          icon={DollarSign}
          color="green"
          trend="Auditorium collections"
        />
        <StatCard
          title="Total Tickets Booked"
          value={stats.totalBookings || 0}
          icon={Ticket}
          color="purple"
          trend="Across all active shows"
        />
        <StatCard
          title="Average Ticket Value"
          value={stats.totalBookings > 0 ? `₹${Math.round(stats.totalRevenue / stats.totalBookings)}` : '₹0'}
          icon={TrendingUp}
          color="amber"
          trend="Per customer booking"
        />
      </div>

      <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
        <h3 className="text-base font-bold text-white border-b border-[#27324A] pb-3">
          Detailed Revenue Settlement Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#94A3B8]">
            <thead className="bg-[#11182B] text-xs font-bold uppercase tracking-wider text-white border-b border-[#27324A]">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Movie</th>
                <th className="py-3 px-4">Screen</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27324A]">
              {recentBookings.map((b) => (
                <tr key={b._id} className="hover:bg-[#11182B]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#A855F7]">#{b.bookingId}</td>
                  <td className="py-3 px-4 text-white font-medium">{b.userId?.fullName}</td>
                  <td className="py-3 px-4 text-white">{b.movieId?.title}</td>
                  <td className="py-3 px-4 text-xs">{b.screenId?.screenName}</td>
                  <td className="py-3 px-4 font-bold text-white">₹{b.totalAmount}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#22C55E]/20 text-[#22C55E]">
                      Settled
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

export default ManagerRevenuePage;

