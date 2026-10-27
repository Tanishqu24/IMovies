import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Film,
  MapPin,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Ticket,
  ChevronDown,
  Menu,
  X,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isManager, logout } = useAuth();
  const { selectedCity, changeCity, availableCities } = useCity();
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const cityRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setIsCityOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Theatres', path: '/theatres' },
    { name: 'My Bookings', path: '/my-bookings', authOnly: true },
    { name: 'About', path: '/about' },
  ];

  const isActiveLink = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#27324A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & City Selector */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center shadow-lg shadow-[#7C3AED]/30 group-hover:scale-105 transition-transform duration-300">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-wider text-white">
                  I<span className="text-[#A855F7]">MOVIES</span>
                </span>
                <span className="text-[10px] tracking-widest text-[#94A3B8] font-medium uppercase -mt-1">
                  Cinema Experience
                </span>
              </div>
            </Link>

            {/* City Selector */}
            <div className="relative hidden md:block" ref={cityRef}>
              <button
                type="button"
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#11182B] border border-[#27324A] text-sm text-[#F8FAFC] hover:border-[#7C3AED] transition-all"
              >
                <MapPin className="w-4 h-4 text-[#A855F7]" />
                <span className="font-medium">{selectedCity}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-200 ${isCityOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCityOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-[#171D33] border border-[#27324A] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Select Your City
                  </div>
                  {availableCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        changeCity(city);
                        setIsCityOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                        selectedCity === city
                          ? 'bg-[#7C3AED]/20 text-[#A855F7] font-semibold'
                          : 'text-[#F8FAFC] hover:bg-[#1E2642]'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search movies, genres, or directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#11182B] text-sm text-[#F8FAFC] placeholder-[#94A3B8] pl-10 pr-4 py-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
              />
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
            </form>
          </div>

          {/* Navigation Links & User Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-1">
              {navLinks.map((link) => {
                if (link.authOnly && !isAuthenticated) return null;
                const active = isActiveLink(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-white bg-[#7C3AED]/20 font-semibold text-[#A855F7]'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#11182B]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Dropdown or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full bg-[#11182B] border border-[#27324A] hover:border-[#7C3AED] transition-all"
                >
                  <img
                    src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.fullName || 'User')}`}
                    alt={user?.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-[#7C3AED]"
                  />
                  <span className="text-sm font-medium text-white max-w-[120px] truncate">
                    {user?.fullName?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#171D33] border border-[#27324A] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-[#27324A]">
                      <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                      <p className="text-xs text-[#94A3B8] truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-[#7C3AED]/30 text-[#A855F7]">
                        {user?.role}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-[#A855F7] hover:bg-[#1E2642] font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {isManager && (
                      <Link
                        to="/manager"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-[#A855F7] hover:bg-[#1E2642] font-semibold"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Manager Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/my-bookings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-[#F8FAFC] hover:bg-[#1E2642]"
                    >
                      <Ticket className="w-4 h-4 text-[#94A3B8]" />
                      <span>My Bookings</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-[#F8FAFC] hover:bg-[#1E2642]"
                    >
                      <User className="w-4 h-4 text-[#94A3B8]" />
                      <span>My Profile</span>
                    </Link>

                    <div className="border-t border-[#27324A] my-1"></div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#1E2642]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-white hover:text-[#A855F7] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 shadow-lg shadow-[#7C3AED]/30 transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-[#11182B] text-[#94A3B8] hover:text-white border border-[#27324A]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0B1020] border-b border-[#27324A] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#11182B] text-sm text-[#F8FAFC] pl-10 pr-4 py-2.5 rounded-xl border border-[#27324A]"
            />
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
          </form>

          {/* Mobile City Selector */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#11182B] rounded-xl border border-[#27324A]">
            <div className="flex items-center space-x-2 text-sm text-white">
              <MapPin className="w-4 h-4 text-[#A855F7]" />
              <span>City:</span>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => changeCity(e.target.value)}
              className="bg-transparent text-sm text-[#A855F7] font-semibold focus:outline-none"
            >
              {availableCities.map((city) => (
                <option key={city} value={city} className="bg-[#171D33] text-white">
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              if (link.authOnly && !isAuthenticated) return null;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActiveLink(link.path)
                      ? 'bg-[#7C3AED]/20 text-[#A855F7] font-semibold'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {isAuthenticated ? (
            <div className="border-t border-[#27324A] pt-4 space-y-2">
              <div className="flex items-center space-x-3 px-2 py-1">
                <img
                  src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.fullName || 'User')}`}
                  alt=""
                  className="w-9 h-9 rounded-full border border-[#7C3AED]"
                />
                <div>
                  <div className="text-sm font-semibold text-white">{user?.fullName}</div>
                  <div className="text-xs text-[#94A3B8]">{user?.email}</div>
                </div>
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#A855F7] bg-[#7C3AED]/10"
                >
                  Admin Dashboard
                </Link>
              )}

              {isManager && (
                <Link
                  to="/manager"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#A855F7] bg-[#7C3AED]/10"
                >
                  Manager Dashboard
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-[#F8FAFC]"
              >
                Profile Settings
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2 text-sm text-[#EF4444]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="border-t border-[#27324A] pt-4 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-[#27324A] text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

