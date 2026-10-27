import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  Building2,
  Tv,
  Calendar,
  Ticket,
  Users,
  CreditCard,
  MessageSquare,
  Tag,
  ArrowLeft,
  Clapperboard
} from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Movies', path: '/admin/movies', icon: Film },
    { name: 'Theatres', path: '/admin/theatres', icon: Building2 },
    { name: 'Screens', path: '/admin/screens', icon: Tv },
    { name: 'Shows', path: '/admin/shows', icon: Calendar },
    { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
  ];

  return (
    <aside className="w-64 bg-[#0B1020] border-r border-[#27324A] flex flex-col justify-between shrink-0 min-h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-[#27324A]">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center shadow-lg shadow-[#7C3AED]/30">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-black text-white leading-none">
                I<span className="text-[#A855F7]">MOVIES</span>
              </div>
              <span className="text-[10px] text-[#A855F7] font-bold uppercase tracking-widest">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 py-6 space-y-1">
          <div className="px-3 mb-2 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
            Management
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
          <span>Exit to Customer Site</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;

