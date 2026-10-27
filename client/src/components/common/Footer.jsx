import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Shield, Ticket, CreditCard, Sparkles, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0B1020] border-t border-[#27324A] text-[#94A3B8] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#27324A]">
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#11182B] border border-[#27324A]">
            <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center text-[#A855F7]">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Instant E-Tickets</h4>
              <p className="text-xs text-[#94A3B8]">Real-time QR ticket downloads & booking</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#11182B] border border-[#27324A]">
            <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center text-[#A855F7]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Interactive Seat Locks</h4>
              <p className="text-xs text-[#94A3B8]">Realtime live seat sync powered by Socket.IO</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#11182B] border border-[#27324A]">
            <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center text-[#A855F7]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Safe & Instant Refunds</h4>
              <p className="text-xs text-[#94A3B8]">Hassle-free 1-click ticket cancellations</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white">
                I<span className="text-[#A855F7]">MOVIES</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#94A3B8] mb-4">
              Movie Ticket Booking Made Simple. A modern, cinema-inspired MERN Stack capstone application with interactive seat maps, real-time sync, and comprehensive management.
            </p>
            <div className="text-xs text-[#94A3B8] space-y-1">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>support@imovies.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>+91 1800 200 4668</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/movies" className="hover:text-white transition-colors">Now Showing</Link></li>
              <li><Link to="/movies?status=upcoming" className="hover:text-white transition-colors">Upcoming Movies</Link></li>
              <li><Link to="/theatres" className="hover:text-white transition-colors">Cinemas & Theatres</Link></li>
              <li><Link to="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About IMovies</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Popular Cities</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-[#F8FAFC]">Mumbai</span></li>
              <li><span className="text-[#F8FAFC]">Delhi-NCR</span></li>
              <li><span className="text-[#F8FAFC]">Bengaluru</span></li>
              <li><span className="text-[#F8FAFC]">Hyderabad</span></li>
              <li><span className="text-[#F8FAFC]">Pune & Chennai</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Cinema Experience</h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#11182B] border border-[#27324A]">
                <div className="font-semibold text-white">Dolby Atmos & IMAX 4K</div>
                <div className="text-[#94A3B8]">Immersive soundscapes and lifelike laser clarity</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#11182B] border border-[#27324A]">
                <div className="font-semibold text-white">VIP Recliner Luxury</div>
                <div className="text-[#94A3B8]">Gourmet dining and motorized plush seating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#27324A] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8]">
          <p>© {new Date().getFullYear()} IMovies – Movie Ticket Booking Made Simple. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built for Capstone Engineering Project</span>
            <span>•</span>
            <span className="text-[#A855F7]">Midnight Cinema Theme</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

