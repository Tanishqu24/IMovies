import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit2, Trash2, MapPin, UserCheck } from 'lucide-react';
import API from '../../services/api';
import AdminHeader from '../../components/admin/AdminHeader';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const AdminTheatresPage = () => {
  const [theatres, setTheatres] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [theatreToDelete, setTheatreToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const availableFacilities = [
    '4K Dolby Atmos',
    'IMAX Laser',
    'Recliner Loungers',
    'Gourmet Food Court',
    'Valet Parking',
    '4DX Motion',
    'Dolby 7.1',
    'Wheelchair Access'
  ];

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    managerId: '',
    facilities: ['4K Dolby Atmos', 'Recliner Loungers', 'Valet Parking'],
    status: 'active'
  });

  const fetchTheatres = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (cityFilter !== 'All Cities') params.append('city', cityFilter);
      params.append('page', page);
      params.append('limit', 10);

      const res = await API.get(`/theatres?${params.toString()}`);
      setTheatres(res.data.theatres || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load theatres');
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await API.get('/users/managers/list');
      setManagers(res.data.managers || []);
    } catch (err) {
      console.error('Failed to load managers list');
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, [page, search, cityFilter]);

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleOpenAdd = () => {
    setEditingTheatre(null);
    setFormData({
      name: '',
      address: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      managerId: managers[0]?._id || '',
      facilities: ['4K Dolby Atmos', 'Recliner Loungers'],
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (theatre) => {
    setEditingTheatre(theatre);
    setFormData({
      name: theatre.name || '',
      address: theatre.address || '',
      city: theatre.city || 'Mumbai',
      state: theatre.state || 'Maharashtra',
      pincode: theatre.pincode || '',
      managerId: theatre.managerId?._id || '',
      facilities: theatre.facilities || [],
      status: theatre.status || 'active'
    });
    setIsModalOpen(true);
  };

  const toggleFacility = (facility) => {
    if (formData.facilities.includes(facility)) {
      setFormData({
        ...formData,
        facilities: formData.facilities.filter((f) => f !== facility)
      });
    } else {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facility]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTheatre) {
        await API.put(`/theatres/${editingTheatre._id}`, formData);
        toast.success('Theatre updated successfully');
      } else {
        await API.post('/theatres', formData);
        toast.success('New theatre created successfully');
      }
      setIsModalOpen(false);
      fetchTheatres();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!theatreToDelete) return;
    setIsDeleting(true);
    try {
      await API.delete(`/theatres/${theatreToDelete._id}`);
      toast.success('Theatre deleted successfully');
      setDeleteModalOpen(false);
      fetchTheatres();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete theatre');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Manage Cinema Theatres"
        subtitle="Manage locations, facility formats, and assigned managers"
      />

      <div className="p-8 space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search theatres..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#11182B] text-sm text-white placeholder-[#94A3B8] pl-10 pr-4 py-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
            </div>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-[#11182B] text-xs font-semibold text-white px-3 py-2.5 rounded-xl border border-[#27324A]"
            >
              <option value="All Cities">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi-NCR">Delhi-NCR</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 flex items-center space-x-2 shadow-lg shadow-[#7C3AED]/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Theatre</span>
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-[#171D33] border border-[#27324A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#94A3B8]">
              <thead className="bg-[#11182B] text-xs font-bold uppercase tracking-wider text-white border-b border-[#27324A]">
                <tr>
                  <th className="py-4 px-6">Theatre Name</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Assigned Manager</th>
                  <th className="py-4 px-6">Facilities</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27324A]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-[#94A3B8]">
                      Loading theatres...
                    </td>
                  </tr>
                ) : theatres.length > 0 ? (
                  theatres.map((t) => (
                    <tr key={t._id} className="hover:bg-[#11182B]/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-[#A855F7]" />
                          <span>{t.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white block font-medium">{t.city}</span>
                        <span className="text-xs text-[#94A3B8]">{t.address}</span>
                      </td>
                      <td className="py-4 px-6">
                        {t.managerId ? (
                          <div className="flex items-center space-x-1.5 text-white">
                            <UserCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                            <span className="text-xs font-medium">{t.managerId.fullName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#94A3B8] italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {t.facilities?.slice(0, 2).map((f) => (
                            <span key={f} className="px-2 py-0.5 rounded-md bg-[#11182B] text-[10px] text-white">
                              {f}
                            </span>
                          ))}
                          {t.facilities?.length > 2 && (
                            <span className="text-[10px] text-[#A855F7] font-semibold">
                              +{t.facilities.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            t.status === 'active' ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#A855F7] hover:bg-[#11182B]"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setTheatreToDelete(t);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#11182B]"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-[#94A3B8]">
                      No theatres found.
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

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTheatre ? 'Edit Cinema Theatre' : 'Add New Cinema Theatre'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Theatre Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Street Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Assigned Theatre Manager</label>
            <select
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="">-- No Manager Assigned --</option>
              {managers.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.fullName} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2">Available Facilities</label>
            <div className="grid grid-cols-2 gap-2">
              {availableFacilities.map((fac) => {
                const checked = formData.facilities.includes(fac);
                return (
                  <button
                    type="button"
                    key={fac}
                    onClick={() => toggleFacility(fac)}
                    className={`p-2 rounded-xl text-xs font-medium text-left border transition-all ${
                      checked
                        ? 'bg-[#7C3AED]/20 border-[#A855F7] text-white'
                        : 'bg-[#11182B] border-[#27324A] text-[#94A3B8]'
                    }`}
                  >
                    {fac}
                  </button>
                );
              })}
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
              {isSubmitting ? 'Saving...' : editingTheatre ? 'Update Theatre' : 'Create Theatre'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Theatre?"
        message={`Are you sure you want to remove "${theatreToDelete?.name}"? All associated screens and shows will also be impacted.`}
        confirmText="Delete Theatre"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />

    </div>
  );
};

export default AdminTheatresPage;

