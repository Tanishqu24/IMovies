import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, LogOut } from 'lucide-react';

const AdminHeader = ({ title = 'Dashboard Overview', subtitle = 'Welcome to IMovies Administration' }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-20 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#27324A] px-8 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-xs text-[#94A3B8]">{subtitle}</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Card */}
        <div className="flex items-center space-x-3 pl-4 border-l border-[#27324A]">
          <img
            src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.fullName || 'Admin')}`}
            alt=""
            className="w-9 h-9 rounded-full border border-[#7C3AED] object-cover"
          />
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-white leading-tight">{user?.fullName}</p>
            <span className="text-[10px] font-bold uppercase text-[#A855F7] bg-[#7C3AED]/20 px-2 py-0.5 rounded-md">
              {user?.role}
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
      </div>
    </header>
  );
};

export default AdminHeader;

