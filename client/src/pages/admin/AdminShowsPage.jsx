import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Trash2, Clock, MapPin, Film, Armchair } from 'lucide-react';
import API from '../../services/api';
import AdminHeader from '../../components/admin/AdminHeader';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const AdminShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTheatre, setSelectedTheatre] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirm
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showToDelete, setShowToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    movieId: '',
    theatreId: '',
    screenId: '',
    showDate: new Date().toISOString().split('T')[0],
    startTime: '06:15 PM',
    endTime: '09:00 PM',
    regularPrice: 220,
    premiumPrice: 320,
    vipPrice: 500
  });

  const fetchDropdownData = async () => {
    try {
      const [moviesRes, theatresRes] = await Promise.all([
        API.get('/movies?limit=50&status=now_showing'),
        API.get('/theatres?limit=50')
      ]);
      setMovies(moviesRes.data.movies || []);
      setTheatres(theatresRes.data.theatres || []);
    } catch (err) {
      console.error('Error fetching dropdowns');
    }
  };

  const fetchScreensForTheatre = async (theatreId) => {
    if (!theatreId) return;
    try {
      const res = await API.get(`/screens?theatreId=${theatreId}`);
      setScreens(res.data.screens || []);
      if (res.data.screens?.length > 0) {
        setFormData((prev) => ({ ...prev, screenId: res.data.screens[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load screens for theatre');
    }
  };

  const fetchShows = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDate) params.append('showDate', selectedDate);
      if (selectedTheatre) params.append('theatreId', selectedTheatre);
      params.append('page', page);
      params.append('limit', 15);

      const res = await API.get(`/shows?${params.toString()}`);
      setShows(res.data.shows || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load scheduled shows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchShows();
  }, [page, selectedDate, selectedTheatre]);

  const handleOpenAdd = () => {
    const defaultTheatre = theatres[0]?._id || '';
    setFormData({
      movieId: movies[0]?._id || '',
      theatreId: defaultTheatre,
      screenId: '',
      showDate: new Date().toISOString().split('T')[0],
      startTime: '06:15 PM',
      endTime: '09:00 PM',
      regularPrice: 220,
      premiumPrice: 320,
      vipPrice: 500
    });
    if (defaultTheatre) {
      fetchScreensForTheatre(defaultTheatre);
    }
    setIsModalOpen(true);
  };

  const handleTheatreChange = (theatreId) => {
    setFormData({ ...formData, theatreId });
    fetchScreensForTheatre(theatreId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.movieId || !formData.theatreId || !formData.screenId) {
      toast.error('Please select Movie, Theatre, and Screen');
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post('/shows', {
        movieId: formData.movieId,
        theatreId: formData.theatreId,
        screenId: formData.screenId,
        showDate: formData.showDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        seatPricing: {
          Regular: Number(formData.regularPrice),
          Premium: Number(formData.premiumPrice),
          VIP: Number(formData.vipPrice)
        }
      });

      toast.success('Movie show scheduled successfully!');
      setIsModalOpen(false);
      fetchShows();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule show');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!showToDelete) return;
    setIsDeleting(true);
    try {
      await API.delete(`/shows/${showToDelete._id}`);
      toast.success('Show deleted/cancelled successfully');
      setDeleteModalOpen(false);
      fetchShows();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete show');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Schedule Movie Shows"
        subtitle="Manage movie show timings, auditoriums, dates, and seat pricing"
      />

      <div className="p-8 space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#11182B] text-xs font-semibold text-white px-3 py-2 rounded-xl border border-[#27324A]"
            />

            <select
              value={selectedTheatre}
              onChange={(e) => setSelectedTheatre(e.target.value)}
              className="bg-[#11182B] text-xs font-semibold text-white px-3 py-2 rounded-xl border border-[#27324A]"
            >
              <option value="">All Theatres</option>
              {theatres.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.city})
                </option>
              ))}
            </select>

            {(selectedDate || selectedTheatre) && (
              <button
                onClick={() => {
                  setSelectedDate('');
                  setSelectedTheatre('');
                }}
                className="text-xs text-[#A855F7] font-semibold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 flex items-center space-x-2 shadow-lg shadow-[#7C3AED]/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Show</span>
          </button>
        </div>

        {/* Shows Table */}
        <div className="rounded-2xl bg-[#171D33] border border-[#27324A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#94A3B8]">
              <thead className="bg-[#11182B] text-xs font-bold uppercase tracking-wider text-white border-b border-[#27324A]">
                <tr>
                  <th className="py-4 px-6">Movie</th>
                  <th className="py-4 px-6">Theatre & Screen</th>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Pricing</th>
                  <th className="py-4 px-6">Occupancy</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27324A]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-[#94A3B8]">
                      Loading scheduled shows...
                    </td>
                  </tr>
                ) : shows.length > 0 ? (
                  shows.map((s) => (
                    <tr key={s._id} className="hover:bg-[#11182B]/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={s.movieId?.poster}
                            alt=""
                            className="w-9 h-12 object-cover rounded-md border border-[#27324A]"
                          />
                          <span className="font-bold text-white block line-clamp-1">{s.movieId?.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium block">{s.theatreId?.name}</span>
                        <span className="text-xs text-[#A855F7]">{s.screenId?.screenName}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white block font-semibold">{s.showDate}</span>
                        <span className="text-xs text-[#22C55E] font-bold">{s.startTime}</span>
                      </td>
                      <td className="py-4 px-6 text-xs text-white">
                        <span>VIP: ₹{s.seatPricing?.VIP}</span> •{' '}
                        <span>Prem: ₹{s.seatPricing?.Premium}</span> •{' '}
                        <span>Reg: ₹{s.seatPricing?.Regular}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-bold text-white">
                          {s.bookedSeats?.length || 0} / {s.screenId?.totalSeats || 82} booked
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            s.status === 'active' ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setShowToDelete(s);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#11182B]"
                          title="Delete / Cancel Show"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-[#94A3B8]">
                      No scheduled shows found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#27324A]">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
          </div>
        </div>

      </div>

      {/* Schedule Show Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Cinema Movie Show"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Select Movie *</label>
            <select
              value={formData.movieId}
              onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
              required
              className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            >
              {movies.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title} ({m.duration} mins)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Cinema Theatre *</label>
              <select
                value={formData.theatreId}
                onChange={(e) => handleTheatreChange(e.target.value)}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              >
                {theatres.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Auditorium Screen *</label>
              <select
                value={formData.screenId}
                onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              >
                {screens.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.screenName} ({s.screenType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Show Date *</label>
              <input
                type="date"
                value={formData.showDate}
                onChange={(e) => setFormData({ ...formData, showDate: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Start Time *</label>
              <input
                type="text"
                placeholder="06:15 PM"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Regular (₹)</label>
              <input
                type="number"
                value={formData.regularPrice}
                onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Premium (₹)</label>
              <input
                type="number"
                value={formData.premiumPrice}
                onChange={(e) => setFormData({ ...formData, premiumPrice: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">VIP Recliner (₹)</label>
              <input
                type="number"
                value={formData.vipPrice}
                onChange={(e) => setFormData({ ...formData, vipPrice: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#27324A]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#94A3B8] bg-[#11182B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] disabled:opacity-50"
            >
              {isSubmitting ? 'Scheduling...' : 'Confirm Show'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete / Cancel Confirm */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Cancel or Delete Show?"
        message={`Are you sure you want to cancel the show for ${showToDelete?.movieId?.title} on ${showToDelete?.showDate}?`}
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />

    </div>
  );
};

export default AdminShowsPage;

