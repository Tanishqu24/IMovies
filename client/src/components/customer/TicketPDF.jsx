import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Film, MapPin, Calendar, Clock, Ticket, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const TicketPDF = ({ booking }) => {
  const ticketRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!booking) return null;

  const movie = booking.movieId || {};
  const theatre = booking.theatreId || {};
  const screen = booking.screenId || {};
  const seats = booking.selectedSeats?.map(s => s.seatId).join(', ') || '';

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    toast.loading('Generating high-res cinema ticket...', { id: 'ticket-pdf' });

    try {
      const element = ticketRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0B1020',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`IMovies_Ticket_${booking.bookingId}.pdf`);
      toast.success('Ticket downloaded successfully!', { id: 'ticket-pdf' });
    } catch (err) {
      console.error('Ticket PDF download error', err);
      toast.error('Failed to generate PDF. You can also screenshot this ticket.', { id: 'ticket-pdf' });
    } finally {
      setIsDownloading(false);
    }
  };

  const qrData = booking.qrCodeData || JSON.stringify({
    bookingId: booking.bookingId,
    movie: movie.title,
    theatre: theatre.name,
    seats
  });

  return (
    <div className="space-y-4">
      {/* Printable Ticket Card */}
      <div
        ref={ticketRef}
        className="w-full max-w-2xl mx-auto bg-[#171D33] rounded-3xl border-2 border-[#27324A] overflow-hidden shadow-2xl relative text-[#F8FAFC]"
        style={{ minWidth: '320px' }}
      >
        {/* Ticket Header Gradient */}
        <div className="h-3 w-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#7C3AED]"></div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 relative">
          
          {/* Main Ticket Section */}
          <div className="flex-1 space-y-5">
            {/* Brand & Booking ID */}
            <div className="flex items-center justify-between border-b border-[#27324A] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white">
                  <Film className="w-4 h-4" />
                </div>
                <span className="text-lg font-black tracking-wider text-white">
                  I<span className="text-[#A855F7]">MOVIES</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#94A3B8]">Booking ID</span>
                <p className="text-sm font-mono font-bold text-[#A855F7]">{booking.bookingId}</p>
              </div>
            </div>

            {/* Movie Title */}
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">{movie.title || 'Movie'}</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {movie.language?.join(', ')} • {movie.genre?.join(', ')} • {movie.certification || 'UA'}
              </p>
            </div>

            {/* Theatre & Screen Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-[#94A3B8]">
                  <MapPin className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span className="font-semibold">Cinema / Theatre</span>
                </div>
                <p className="font-bold text-white text-sm">{theatre.name || 'Cinema Hall'}</p>
                <p className="text-[#94A3B8] text-[11px] truncate">{theatre.city}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-[#94A3B8]">
                  <Film className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span className="font-semibold">Audi / Screen</span>
                </div>
                <p className="font-bold text-white text-sm">{screen.screenName || 'Screen 1'}</p>
                <p className="text-[#A855F7] text-[11px] font-semibold">{screen.screenType || '4K Atmos'}</p>
              </div>
            </div>

            {/* Date, Time & Seats */}
            <div className="p-3.5 rounded-2xl bg-[#11182B] border border-[#27324A] grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Date</span>
                <p className="text-xs font-bold text-white mt-0.5">
                  {booking.showId?.showDate || new Date().toISOString().split('T')[0]}
                </p>
              </div>

              <div className="border-x border-[#27324A]">
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Time</span>
                <p className="text-xs font-bold text-[#A855F7] mt-0.5">
                  {booking.showId?.startTime || '07:00 PM'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Seats</span>
                <p className="text-xs font-bold text-[#22C55E] mt-0.5">{seats || 'N/A'}</p>
              </div>
            </div>

            {/* Total Paid */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#94A3B8]">Total Amount Paid:</span>
              <span className="text-base font-black text-white">₹{booking.totalAmount}</span>
            </div>
          </div>

          {/* Ticket Perforation Divider */}
          <div className="hidden md:flex flex-col justify-between items-center -my-8 py-2 relative">
            <div className="w-5 h-5 rounded-full bg-[#0B1020] border-b border-[#27324A] -mt-2"></div>
            <div className="h-full border-r-2 border-dashed border-[#27324A]"></div>
            <div className="w-5 h-5 rounded-full bg-[#0B1020] border-t border-[#27324A] -mb-2"></div>
          </div>

          {/* QR Stub Section */}
          <div className="w-full md:w-44 flex flex-col items-center justify-center space-y-3 pt-4 md:pt-0 border-t md:border-t-0 border-[#27324A]">
            <div className="p-3 bg-white rounded-2xl shadow-lg shadow-black/40">
              <QRCodeSVG value={qrData} size={110} level="M" />
            </div>
            
            <div className="text-center">
              <span className="text-[10px] text-[#94A3B8] tracking-widest uppercase">Scan at Entrance</span>
              <div className="flex items-center justify-center space-x-1 text-[#22C55E] text-xs font-semibold mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Ticket</span>
              </div>
            </div>

            {/* Faux Barcode Effect */}
            <div className="w-full h-6 flex items-center justify-between px-2 opacity-50">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full bg-[#F8FAFC] ${i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-0.5' : 'w-1.5'}`}
                ></div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 shadow-lg shadow-[#7C3AED]/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Generating PDF...' : 'Download Ticket PDF'}</span>
        </button>
      </div>
    </div>
  );
};

export default TicketPDF;

