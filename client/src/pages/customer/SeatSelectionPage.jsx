import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Film,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  ArrowRight,
  AlertCircle,
  Armchair,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { socket } = useSocket();

  const [show, setShow] = useState(null);
  const [screen, setScreen] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLocking, setIsLocking] = useState(false);

  const MAX_SEATS = 8;

  // 1. Fetch initial show & screen layout
  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const res = await API.get(`/shows/${showId}`);
        setShow(res.data.show);
        setScreen(res.data.show.screenId);
        setBookedSeats(res.data.bookedSeats || []);
        setLockedSeats(res.data.lockedSeats || []);
      } catch (err) {
        toast.error('Failed to load show seat matrix');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId]);

  // 2. Realtime Socket.IO synchronization
  useEffect(() => {
    if (!socket || !showId) return;

    socket.emit('joinShow', { showId });

    socket.on('seatStatusChanged', (data) => {
      if (data.showId === showId) {
        if (data.bookedSeats) setBookedSeats(data.bookedSeats);
        if (data.lockedSeats) setLockedSeats(data.lockedSeats);

        // Deselect if seat was just booked or locked by someone else
        setSelectedSeats((prev) =>
          prev.filter((seat) => {
            const isBooked = data.bookedSeats?.includes(seat.seatId);
            const isLockedByOther = data.lockedSeats?.some(
              (ls) => ls.seatId === seat.seatId && String(ls.userId) !== String(user?._id)
            );
            return !isBooked && !isLockedByOther;
          })
        );
      }
    });

    return () => {
      socket.emit('leaveShow', { showId });
      socket.off('seatStatusChanged');
    };
  }, [socket, showId, user?._id]);

  // Determine Seat Status
  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';

    const isSelectedByMe = selectedSeats.some((s) => s.seatId === seatId);
    if (isSelectedByMe) return 'selected';

    const isLockedByOther = lockedSeats.some(
      (ls) => ls.seatId === seatId && String(ls.userId) !== String(user?._id)
    );
    if (isLockedByOther) return 'locked';

    return 'available';
  };

  // Toggle Seat Selection
  const handleSeatClick = (seat, row) => {
    const status = getSeatStatus(seat.seatId);

    if (status === 'booked') {
      toast.error(`Seat ${seat.seatId} is already booked.`);
      return;
    }

    if (status === 'locked') {
      toast.error(`Seat ${seat.seatId} is temporarily reserved by another user.`);
      return;
    }

    if (status === 'selected') {
      setSelectedSeats(selectedSeats.filter((s) => s.seatId !== seat.seatId));
      if (socket) {
        socket.emit('seatSelected', {
          showId,
          seatId: seat.seatId,
          isSelected: false,
          userId: user?._id
        });
      }
    } else {
      if (selectedSeats.length >= MAX_SEATS) {
        toast.error(`You can select a maximum of ${MAX_SEATS} seats per booking.`);
        return;
      }

      const price = show.seatPricing?.[row.category] || row.basePrice || 220;

      const newSelection = [
        ...selectedSeats,
        {
          seatId: seat.seatId,
          seatNumber: seat.seatNumber,
          rowLetter: row.rowLetter,
          category: row.category,
          price
        }
      ];

      setSelectedSeats(newSelection);

      if (socket) {
        socket.emit('seatSelected', {
          showId,
          seatId: seat.seatId,
          isSelected: true,
          userId: user?._id
        });
      }
    }
  };

  // Calculate Subtotal
  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  // Proceed to Checkout: Lock seats and navigate
  const handleProceedToCheckout = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least 1 seat to continue');
      return;
    }

    if (!isAuthenticated) {
      toast('Please log in or sign up to finalize your booking', { icon: '🔒' });
      navigate('/login', { state: { from: `/seat-selection/${showId}` } });
      return;
    }

    setIsLocking(true);
    try {
      const seatIds = selectedSeats.map((s) => s.seatId);
      await API.post('/bookings/lock-seats', {
        showId,
        seatIds
      });

      // Save selected seats in session storage for checkout
      sessionStorage.setItem(
        `checkout_${showId}`,
        JSON.stringify({
          showId,
          selectedSeats,
          subtotal
        })
      );

      navigate(`/checkout/${showId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not lock selected seats. Please re-select.');
    } finally {
      setIsLocking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!show || !screen) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
        <h2 className="text-xl font-bold">Show details unavailable</h2>
        <Link to="/movies" className="text-[#A855F7] mt-3 inline-block underline">
          Return to Movies
        </Link>
      </div>
    );
  }

  const movie = show.movieId || {};
  const theatre = show.theatreId || {};

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] pb-32">
      
      {/* 1. Header Bar with Movie & Show Info */}
      <div className="bg-[#11182B] border-b border-[#27324A] py-4 px-4 sm:px-8 sticky top-20 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-[#171D33] border border-[#27324A] hover:text-[#A855F7] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white leading-tight flex items-center space-x-2">
                <span>{movie.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#7C3AED]/20 text-[#A855F7] font-bold">
                  {movie.certification || 'UA'}
                </span>
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center space-x-2">
                <span>{theatre.name}</span>
                <span>•</span>
                <span>{screen.screenName}</span>
                <span>•</span>
                <span className="text-[#A855F7] font-semibold">{screen.screenType}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-[#94A3B8]">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-[#A855F7]" />
              <span className="text-white font-medium">{show.showDate}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-[#A855F7]" />
              <span className="text-white font-bold">{show.startTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Seat Legend Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-[#171D33]/70 border border-[#27324A] text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-[#11182B] border-2 border-[#27324A]"></div>
            <span className="text-[#94A3B8]">Available</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] shadow-md shadow-[#7C3AED]/50"></div>
            <span className="text-white font-semibold">Selected</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-[#F59E0B]/30 border border-[#F59E0B]/60"></div>
            <span className="text-[#F59E0B]">Locked</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-[#27324A] opacity-50 cursor-not-allowed"></div>
            <span className="text-[#94A3B8]">Booked</span>
          </div>

          <div className="hidden sm:block border-l border-[#27324A] h-4"></div>

          {/* Pricing Legend */}
          <div className="flex items-center space-x-4 text-[11px] text-[#A855F7] font-semibold">
            <span>VIP: ₹{show.seatPricing?.VIP || 500}</span>
            <span>Premium: ₹{show.seatPricing?.Premium || 320}</span>
            <span>Regular: ₹{show.seatPricing?.Regular || 220}</span>
          </div>
        </div>
      </div>

      {/* 3. Screen Indicator Beam */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-12 text-center space-y-4">
        <div className="w-3/4 mx-auto cinema-screen-curve"></div>
        <p className="text-xs uppercase tracking-widest text-[#94A3B8] font-bold">
          All Eyes This Way • Cinema Screen
        </p>
      </div>

      {/* 4. Interactive Seat Grid Matrix */}
      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-8">
        <div className="min-w-[580px] space-y-3">
          {screen.seatLayout?.map((row) => (
            <div key={row.rowLetter} className="flex items-center justify-center space-x-3">
              {/* Row Letter Left */}
              <div className="w-6 text-center text-xs font-black text-[#A855F7]">
                {row.rowLetter}
              </div>

              {/* Seats in this row */}
              <div className="flex items-center space-x-2">
                {row.seats?.map((seat, index) => {
                  const status = getSeatStatus(seat.seatId);
                  
                  // Add a gap in the middle of cinema rows for realistic aisle
                  const hasAisle = index === Math.floor(row.seats.length / 2);

                  return (
                    <React.Fragment key={seat.seatId}>
                      {hasAisle && <div className="w-6"></div>}

                      <button
                        type="button"
                        onClick={() => handleSeatClick(seat, row)}
                        disabled={status === 'booked' || status === 'locked'}
                        title={`${seat.seatId} - ${row.category} (₹${show.seatPricing?.[row.category] || row.basePrice})`}
                        className={`w-8 h-8 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all duration-200 ${
                          status === 'selected'
                            ? 'bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] text-white scale-110 shadow-lg shadow-[#7C3AED]/50 border-2 border-white'
                            : status === 'booked'
                            ? 'bg-[#1E2642] text-[#94A3B8]/30 cursor-not-allowed opacity-40 line-through'
                            : status === 'locked'
                            ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#F59E0B] cursor-not-allowed'
                            : row.category === 'VIP'
                            ? 'bg-[#171D33] text-white border border-[#A855F7]/40 hover:border-[#A855F7] hover:scale-105'
                            : 'bg-[#11182B] text-[#94A3B8] border border-[#27324A] hover:border-[#7C3AED] hover:text-white hover:scale-105'
                        }`}
                      >
                        {seat.seatNumber}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row Letter Right */}
              <div className="w-6 text-center text-xs font-black text-[#A855F7]">
                {row.rowLetter}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Sticky Bottom Checkout Summary Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-[#11182B]/95 backdrop-blur-md border-t border-[#27324A] py-4 px-4 sm:px-8 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center text-[#A855F7]">
              <Armchair className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-[#94A3B8]">
                Selected Seats ({selectedSeats.length}/{MAX_SEATS}):
              </div>
              <div className="text-sm font-bold text-white tracking-wide">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map((s) => s.seatId).join(', ')
                ) : (
                  <span className="text-[#94A3B8] font-normal italic">No seats selected yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Estimated Total</span>
              <span className="text-2xl font-black text-white">₹{subtotal}</span>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={selectedSeats.length === 0 || isLocking}
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 shadow-lg shadow-[#7C3AED]/40 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span>{isLocking ? 'Reserving Seats...' : 'Proceed to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SeatSelectionPage;

