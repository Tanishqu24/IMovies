import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  Compass,
  Building2,
  Tv,
  Calendar,
  Ticket,
  DollarSign,
  ArrowLeft,
  Clapperboard,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ManagerLayout = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Overview', path: '/manager', icon: Compass, exact: true },
    { name: 'My Theatres', path: '/manager/theatres', icon: Building2 },
    { name: 'Screens & Layouts', path: '/manager/screens', icon: Tv },
    { name: 'Schedule Shows', path: '/manager/shows', icon: Calendar },
    { name: 'Theatre Bookings', path: '/manager/bookings', icon: Ticket },
    { name: 'Revenue Reports', path: '/manager/revenue', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen flex bg-[#0B1020] text-[#F8FAFC]">
      {/* Manager Sidebar */}
      <aside className="w-64 bg-[#0B1020] border-r border-[#27324A] flex flex-col justify-between shrink-0 min-h-screen sticky top-0">
        <div>
          {/* Brand Header */}
          <div className="h-20 flex items-center px-6 border-b border-[#27324A]">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center shadow-lg shadow-[#7C3AED]/30">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-black text-white leading-none">
                  I<span className="text-[#A855F7]">MOVIES</span>
                </div>
                <span className="text-[10px] text-[#A855F7] font-bold uppercase tracking-widest">
                  Theatre Manager
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="px-3 py-6 space-y-1">
            <div className="px-3 mb-2 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Theatre Operations
            </div>
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#7C3AED]/20 text-[#A855F7] font-semibold border-l-4 border-[#A855F7] pl-3'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#11182B]'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Back to Client Site */}
        <div className="p-4 border-t border-[#27324A]">
          <Link
            to="/"
            className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-sm text-[#94A3B8] hover:text-white hover:bg-[#11182B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cinema Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#27324A] px-8 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Theatre Manager Portal</h1>
            <p className="text-xs text-[#94A3B8]">Manage screens, schedule shows, and track live bookings</p>
          </div>

          <div className="flex items-center space-x-3">
            <img
              src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.fullName || 'Manager')}`}
              alt=""
              className="w-9 h-9 rounded-full border border-[#7C3AED] object-cover"
            />
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-white leading-tight">{user?.fullName}</p>
              <span className="text-[10px] font-bold uppercase text-[#A855F7] bg-[#7C3AED]/20 px-2 py-0.5 rounded-md">
                Theatre Manager
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#11182B] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;

