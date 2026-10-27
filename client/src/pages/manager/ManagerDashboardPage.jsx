import React, { useState, useEffect } from 'react';
import { Compass, Building2, Calendar, Ticket, DollarSign, ArrowUpRight } from 'lucide-react';
import API from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSkeleton';

const ManagerDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagerStats = async () => {
      try {
        const res = await API.get('/analytics/manager');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching manager stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <LoadingSpinner text="Loading theatre operations..." />
      </div>
    );
  }

  const stats = data?.stats || {};
  const managedTheatres = data?.managedTheatres || [];
  const upcomingShows = data?.upcomingShows || [];
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171D33] via-[#11182B] to-[#171D33] border border-[#27324A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7]">Operations Center</span>
          <h2 className="text-2xl font-black text-white mt-1">Theatre Manager Dashboard</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Managing: {managedTheatres.map(t => t.name).join(', ') || 'Assigned Theatres'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
            Active Management Mode
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned Theatres"
          value={stats.theatresCount || 0}
          icon={Building2}
          color="purple"
          trend="Under your supervision"
        />
        <StatCard
          title="Scheduled Shows"
          value={stats.totalShows || 0}
          icon={Calendar}
          color="blue"
          trend="Running today & upcoming"
        />
        <StatCard
          title="Theatre Bookings"
          value={stats.totalBookings || 0}
          icon={Ticket}
          color="green"
          trend="Customer tickets reserved"
        />
        <StatCard
          title="Total Gross Revenue"
          value={`₹${stats.totalRevenue?.toLocaleString('en-IN') || 0}`}
          icon={DollarSign}
          color="amber"
          trend="Generated revenue"
        />
      </div>

      {/* Tables Row: Shows & Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Shows */}
        <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
          <div className="flex items-center justify-between border-b border-[#27324A] pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#A855F7]" />
              <span>Upcoming Scheduled Shows</span>
            </h3>
            <span className="text-xs text-[#94A3B8]">{upcomingShows.length} Shows</span>
          </div>

          <div className="space-y-3">
            {upcomingShows.length > 0 ? (
              upcomingShows.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#11182B] border border-[#27324A]"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={s.movieId?.poster}
                      alt=""
                      className="w-10 h-14 object-cover rounded-md border border-[#27324A]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{s.movieId?.title}</h4>
                      <p className="text-xs text-[#94A3B8]">
                        {s.theatreId?.name} • {s.screenId?.screenName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#22C55E] block">{s.startTime}</span>
                    <span className="text-[11px] text-[#94A3B8]">{s.showDate}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#94A3B8] text-center py-6">No scheduled shows found.</p>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
          <div className="flex items-center justify-between border-b border-[#27324A] pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Ticket className="w-4 h-4 text-[#A855F7]" />
              <span>Live Theatre Bookings</span>
            </h3>
            <span className="text-xs text-[#94A3B8]">{recentBookings.length} Bookings</span>
          </div>

          <div className="space-y-3">
            {recentBookings.length > 0 ? (
              recentBookings.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#11182B] border border-[#27324A]"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#A855F7]">#{b.bookingId}</span>
                      <span className="text-xs text-white font-medium">• {b.userId?.fullName}</span>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Seats: <span className="font-bold text-white">{b.selectedSeats?.map(s => s.seatId).join(', ')}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-white block">₹{b.totalAmount}</span>
                    <span className="text-[10px] text-[#22C55E] uppercase font-bold">Confirmed</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#94A3B8] text-center py-6">No recent bookings recorded.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerDashboardPage;

