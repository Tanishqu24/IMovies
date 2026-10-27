import React, { useState, useEffect } from 'react';
import { Tv, Plus, Edit2, Trash2, Building2, Armchair } from 'lucide-react';
import API from '../../services/api';
import AdminHeader from '../../components/admin/AdminHeader';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';

const AdminScreensPage = () => {
  const [screens, setScreens] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [theatreFilter, setTheatreFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [screenToDelete, setScreenToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    theatreId: '',
    screenName: '',
    screenType: '4K Dolby Atmos',
    totalSeats: 82
  });

  const fetchTheatres = async () => {
    try {
      const res = await API.get('/theatres?limit=50');
      setTheatres(res.data.theatres || []);
    } catch (err) {
      console.error('Failed to load theatres');
    }
  };

  const fetchScreens = async () => {
    setLoading(true);
    try {
      const query = theatreFilter ? `?theatreId=${theatreFilter}` : '';
      const res = await API.get(`/screens${query}`);
      setScreens(res.data.screens || []);
    } catch (err) {
      toast.error('Failed to load screens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  useEffect(() => {
    fetchScreens();
  }, [theatreFilter]);

  const handleOpenAdd = () => {
    setEditingScreen(null);
    setFormData({
      theatreId: theatres[0]?._id || '',
      screenName: `Screen ${screens.length + 1} (Dolby Atmos)`,
      screenType: '4K Dolby Atmos',
      totalSeats: 82
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (screen) => {
    setEditingScreen(screen);
    setFormData({
      theatreId: screen.theatreId?._id || screen.theatreId || '',
      screenName: screen.screenName || '',
      screenType: screen.screenType || '4K Dolby Atmos',
      totalSeats: screen.totalSeats || 82
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingScreen) {
        await API.put(`/screens/${editingScreen._id}`, formData);
        toast.success('Screen updated successfully');
      } else {
        await API.post('/screens', formData);
        toast.success('New screen created successfully');
      }
      setIsModalOpen(false);
      fetchScreens();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!screenToDelete) return;
    setIsDeleting(true);
    try {
      await API.delete(`/screens/${screenToDelete._id}`);
      toast.success('Screen deleted successfully');
      setDeleteModalOpen(false);
      fetchScreens();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete screen');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Auditoriums & Screens"
        subtitle="Manage theatre screens, seating capacities, and projection types"
      />

      <div className="p-8 space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <label className="text-xs text-[#94A3B8]">Filter by Cinema:</label>
            <select
              value={theatreFilter}
              onChange={(e) => setTheatreFilter(e.target.value)}
              className="bg-[#11182B] text-xs font-semibold text-white px-3 py-2 rounded-xl border border-[#27324A]"
            >
              <option value="">All Theatres</option>
              {theatres.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.city})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 flex items-center space-x-2 shadow-lg shadow-[#7C3AED]/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Screen</span>
          </button>
        </div>

        {/* Screens Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 bg-[#171D33] rounded-2xl animate-pulse border border-[#27324A]"></div>
            ))}
          </div>
        ) : screens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screens.map((s) => (
              <div
                key={s._id}
                className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] hover:border-[#7C3AED] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <Tv className="w-4 h-4 text-[#A855F7]" />
                        <span>{s.screenName}</span>
                      </h3>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        {s.theatreId?.name || 'Assigned Theatre'}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-[#7C3AED]/20 text-[#A855F7]">
                      {s.screenType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-[#94A3B8] pt-2 border-t border-[#27324A]">
                    <div className="flex items-center space-x-1">
                      <Armchair className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span className="text-white font-semibold">{s.totalSeats} Total Seats</span>
                    </div>
                    <span>•</span>
                    <span className="text-white font-medium">VIP + Premium + Regular</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#27324A] flex justify-end space-x-2">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#A855F7] hover:bg-[#11182B]"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setScreenToDelete(s);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#11182B]"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#171D33] border border-[#27324A] text-sm text-[#94A3B8]">
            No screens found. Click "Add New Screen" to configure your first auditorium.
          </div>
        )}

      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingScreen ? 'Edit Screen Auditorium' : 'Create New Screen'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Cinema Theatre *</label>
            <select
              value={formData.theatreId}
              onChange={(e) => setFormData({ ...formData, theatreId: e.target.value })}
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
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Screen Name *</label>
            <input
              type="text"
              placeholder="Audi 1 (IMAX Laser)"
              value={formData.screenName}
              onChange={(e) => setFormData({ ...formData, screenName: e.target.value })}
              required
              className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Screen Format</label>
              <select
                value={formData.screenType}
                onChange={(e) => setFormData({ ...formData, screenType: e.target.value })}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              >
                <option value="4K Dolby Atmos">4K Dolby Atmos</option>
                <option value="IMAX 3D / Laser">IMAX 3D / Laser</option>
                <option value="4DX Motion">4DX Motion</option>
                <option value="Dolby 7.1 Prime">Dolby 7.1 Prime</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Total Seats Capacity</label>
              <input
                type="number"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
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
              {isSubmitting ? 'Saving...' : editingScreen ? 'Update Screen' : 'Create Screen'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Auditorium Screen?"
        message={`Are you sure you want to delete ${screenToDelete?.screenName}?`}
        confirmText="Delete Screen"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />

    </div>
  );
};

export default AdminScreensPage;

