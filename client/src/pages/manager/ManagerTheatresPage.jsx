import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Check, Edit2 } from 'lucide-react';
import API from '../../services/api';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const ManagerTheatresPage = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '', facilities: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTheatres = async () => {
    setLoading(true);
    try {
      const res = await API.get('/theatres');
      setTheatres(res.data.theatres || []);
    } catch (err) {
      toast.error('Failed to load assigned theatres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleEdit = (theatre) => {
    setEditingTheatre(theatre);
    setFormData({
      name: theatre.name,
      address: theatre.address,
      facilities: theatre.facilities || []
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.put(`/theatres/${editingTheatre._id}`, formData);
      toast.success('Theatre details updated');
      setIsModalOpen(false);
      fetchTheatres();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update theatre');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#27324A] pb-4">
        <h2 className="text-xl font-bold text-white">My Managed Theatres</h2>
        <p className="text-xs text-[#94A3B8]">Review details, address, and amenities of theatres under your supervision</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {theatres.map((t) => (
          <div key={t._id} className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-[#A855F7]" />
                  <span>{t.name}</span>
                </h3>
                <p className="text-xs text-[#94A3B8] flex items-center space-x-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>{t.address}, {t.city}</span>
                </p>
              </div>
              <button
                onClick={() => handleEdit(t)}
                className="p-2 rounded-xl bg-[#11182B] text-[#94A3B8] hover:text-[#A855F7] border border-[#27324A]"
                title="Edit Theatre Info"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-3 border-t border-[#27324A]">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block mb-2">
                Active Facilities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {t.facilities?.map((f) => (
                  <span
                    key={f}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[#11182B] text-white border border-[#27324A] flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3 text-[#22C55E]" />
                    <span>{f}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Theatre Details"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Theatre Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Street Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            />
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManagerTheatresPage;

