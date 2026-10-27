import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Film, Trash2 } from 'lucide-react';
import API from '../../services/api';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';

const ManagerShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete
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
    regularPrice: 220,
    premiumPrice: 320,
    vipPrice: 500
  });

  const fetchShows = async () => {
    setLoading(true);
    try {
      const res = await API.get('/shows?limit=50');
      setShows(res.data.shows || []);
    } catch (err) {
      toast.error('Failed to load shows');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [moviesRes, theatresRes] = await Promise.all([
        API.get('/movies?status=now_showing&limit=50'),
        API.get('/theatres')
      ]);
      setMovies(moviesRes.data.movies || []);
      setTheatres(theatresRes.data.theatres || []);
    } catch (err) {
      console.error(err);
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
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShows();
    fetchDropdowns();
  }, []);

  const handleOpenAdd = () => {
    const defaultTheatre = theatres[0]?._id || '';
    setFormData({
      movieId: movies[0]?._id || '',
      theatreId: defaultTheatre,
      screenId: '',
      showDate: new Date().toISOString().split('T')[0],
      startTime: '06:15 PM',
      regularPrice: 220,
      premiumPrice: 320,
      vipPrice: 500
    });
    if (defaultTheatre) {
      fetchScreensForTheatre(defaultTheatre);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/shows', {
        movieId: formData.movieId,
        theatreId: formData.theatreId,
        screenId: formData.screenId,
        showDate: formData.showDate,
        startTime: formData.startTime,
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
      toast.success('Show deleted');
      setDeleteModalOpen(false);
      fetchShows();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete show');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#27324A] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Movie Show Timings & Scheduling</h2>
          <p className="text-xs text-[#94A3B8]">Schedule, reschedule, or cancel cinema shows for your theatres</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 flex items-center space-x-1.5 shadow-md shadow-[#7C3AED]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Show</span>
        </button>
      </div>

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
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27324A]">
              {shows.map((s) => (
                <tr key={s._id} className="hover:bg-[#11182B]/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">
                    {s.movieId?.title}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white block font-medium">{s.theatreId?.name}</span>
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
                  <td className="py-4 px-6 font-bold text-white text-xs">
                    {s.bookedSeats?.length || 0} / {s.screenId?.totalSeats || 82}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => {
                        setShowToDelete(s);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#11182B]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Show for Your Theatre"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Movie *</label>
            <select
              value={formData.movieId}
              onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
              required
              className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            >
              {movies.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Theatre *</label>
              <select
                value={formData.theatreId}
                onChange={(e) => {
                  setFormData({ ...formData, theatreId: e.target.value });
                  fetchScreensForTheatre(e.target.value);
                }}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              >
                {theatres.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Screen *</label>
              <select
                value={formData.screenId}
                onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              >
                {screens.map((sc) => (
                  <option key={sc._id} value={sc._id}>
                    {sc.screenName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Date *</label>
              <input
                type="date"
                value={formData.showDate}
                onChange={(e) => setFormData({ ...formData, showDate: e.target.value })}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Time *</label>
              <input
                type="text"
                placeholder="06:15 PM"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
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
              {isSubmitting ? 'Scheduling...' : 'Schedule Show'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Show?"
        message="Are you sure you want to cancel this show?"
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ManagerShowsPage;

