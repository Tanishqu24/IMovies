import React, { useEffect, useState } from 'react';
import {
  Users,
  Film,
  Building2,
  Calendar,
  Ticket,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import API from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import AdminHeader from '../../components/admin/AdminHeader';
import { LoadingSpinner } from '../../components/common/LoadingSkeleton';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/analytics/admin');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching admin analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Dashboard Analytics" />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Aggregating MongoDB metrics..." />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const monthlyRevenue = data?.monthlyRevenue || [];
  const topMovies = data?.topMovies || [];
  const theatrePerformance = data?.theatrePerformance || [];
  const statusDist = data?.statusDistribution || [];
  const recentBookings = data?.recentBookings || [];

  const COLORS = ['#7C3AED', '#A855F7', '#22C55E', '#F59E0B', '#38BDF8', '#EF4444'];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Admin Dashboard Analytics"
        subtitle="Live metrics & aggregate reports from MongoDB Community Edition"
      />

      <div className="p-8 space-y-8">
        
        {/* 1. Stat Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue?.toLocaleString('en-IN') || 0}`}
            icon={DollarSign}
            color="green"
            trend="+14% this month"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings || 0}
            icon={Ticket}
            color="purple"
            trend="+8% this week"
          />
          <StatCard
            title="Registered Users"
            value={stats.totalUsers || 0}
            icon={Users}
            color="blue"
            trend="+18 new customers"
          />
          <StatCard
            title="Movies Catalog"
            value={stats.totalMovies || 0}
            icon={Film}
            color="amber"
            trend="12 in library"
          />
          <StatCard
            title="Active Theatres"
            value={stats.totalTheatres || 0}
            icon={Building2}
            color="purple"
            trend="5 cities covered"
          />
          <StatCard
            title="Scheduled Shows"
            value={stats.totalShows || 0}
            icon={Calendar}
            color="green"
            trend="Next 4 days live"
          />
        </div>

        {/* 2. Charts Row: Monthly Revenue & Movie Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Bar Chart (2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
            <div className="flex items-center justify-between border-b border-[#27324A] pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Monthly Revenue & Bookings</h3>
                <p className="text-xs text-[#94A3B8]">Gross ticket sales aggregated by month</p>
              </div>
              <span className="text-xs text-[#22C55E] font-bold bg-[#22C55E]/10 px-2.5 py-1 rounded-lg">
                Revenue Trending Up
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27324A" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#11182B',
                      border: '1px solid #27324A',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#7C3AED" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Booking Status Distribution (1 col) */}
          <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Booking Status Ratio</h3>
              <p className="text-xs text-[#94A3B8]">Confirmed vs Cancelled tickets</p>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDist.length > 0 ? statusDist : [{ name: 'Confirmed', value: 100 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Confirmed' ? '#22C55E' : '#EF4444'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#11182B',
                      border: '1px solid #27324A',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-around text-xs border-t border-[#27324A] pt-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>
                <span className="text-white font-medium">Confirmed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
                <span className="text-[#94A3B8]">Cancelled</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Top Movies & Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top Movies by Bookings */}
          <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
            <h3 className="text-base font-bold text-white border-b border-[#27324A] pb-3">
              Most Popular Movies
            </h3>

            <div className="space-y-3">
              {topMovies.map((movie, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#11182B] border border-[#27324A]"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-black text-[#A855F7] w-5">#{idx + 1}</span>
                    <img
                      src={movie.poster}
                      alt=""
                      className="w-10 h-14 object-cover rounded-md border border-[#27324A]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{movie.title}</h4>
                      <span className="text-xs text-[#94A3B8]">Rating: ★ {movie.rating || 0}/10</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">
                      {movie.totalBookings} Bookings
                    </span>
                    <span className="text-[11px] text-[#22C55E] font-semibold">
                      ₹{movie.totalRevenue?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings Activity */}
          <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
            <h3 className="text-base font-bold text-white border-b border-[#27324A] pb-3">
              Recent Transactions
            </h3>

            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#11182B] border border-[#27324A]"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#A855F7]">#{b.bookingId}</span>
                      <span className="text-xs text-white font-medium">• {b.userId?.fullName || 'Customer'}</span>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      {b.movieId?.title} • {b.theatreId?.name}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-white block">₹{b.totalAmount}</span>
                    <span className="text-[10px] text-[#94A3B8]">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;

