import React, { useState, useEffect } from 'react';
import { Tv, Plus, Armchair, Building2 } from 'lucide-react';
import API from '../../services/api';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const ManagerScreensPage = () => {
  const [screens, setScreens] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    theatreId: '',
    screenName: '',
    screenType: '4K Dolby Atmos',
    totalSeats: 82
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [screensRes, theatresRes] = await Promise.all([
        API.get('/screens'),
        API.get('/theatres')
      ]);
      setScreens(screensRes.data.screens || []);
      setTheatres(theatresRes.data.theatres || []);
    } catch (err) {
      toast.error('Failed to load screens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      theatreId: theatres[0]?._id || '',
      screenName: `Screen ${screens.length + 1}`,
      screenType: '4K Dolby Atmos',
      totalSeats: 82
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/screens', formData);
      toast.success('Auditorium screen created');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create screen');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#27324A] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Screens & Seat Layouts</h2>
          <p className="text-xs text-[#94A3B8]">Auditorium formats and seat layouts configured for your theatres</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 flex items-center space-x-1.5 shadow-md shadow-[#7C3AED]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Screen</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screens.map((s) => (
          <div key={s._id} className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Tv className="w-4 h-4 text-[#A855F7]" />
                  <span>{s.screenName}</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">{s.theatreId?.name}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#7C3AED]/20 text-[#A855F7]">
                {s.screenType}
              </span>
            </div>

            <div className="pt-3 border-t border-[#27324A] flex items-center justify-between text-xs text-[#94A3B8]">
              <div className="flex items-center space-x-1">
                <Armchair className="w-3.5 h-3.5 text-[#22C55E]" />
                <span className="text-white font-semibold">{s.totalSeats} Seats</span>
              </div>
              <span className="text-white font-medium">VIP + Premium + Regular</span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Auditorium Screen"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Cinema Theatre</label>
            <select
              value={formData.theatreId}
              onChange={(e) => setFormData({ ...formData, theatreId: e.target.value })}
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
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Screen Name</label>
            <input
              type="text"
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
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Total Seats</label>
              <input
                type="number"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
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
              {isSubmitting ? 'Creating...' : 'Create Screen'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManagerScreensPage;

