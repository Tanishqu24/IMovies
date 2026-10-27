import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, Calendar, Check, X } from 'lucide-react';
import API from '../../services/api';
import AdminHeader from '../../components/admin/AdminHeader';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'flat',
    discountValue: 100,
    minimumAmount: 500,
    maxDiscount: 200,
    expiryDate: new Date('2026-12-31').toISOString().split('T')[0],
    usageLimit: 200,
    isActive: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await API.get('/coupons');
      setCoupons(res.data.coupons || []);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'flat',
      discountValue: 100,
      minimumAmount: 500,
      maxDiscount: 200,
      expiryDate: new Date('2026-12-31').toISOString().split('T')[0],
      usageLimit: 200,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType || 'flat',
      discountValue: coupon.discountValue || 50,
      minimumAmount: coupon.minimumAmount || 0,
      maxDiscount: coupon.maxDiscount || 200,
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
      usageLimit: coupon.usageLimit || 100,
      isActive: coupon.isActive ?? true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await API.put(`/coupons/${editingCoupon._id}`, formData);
        toast.success('Coupon updated successfully');
      } else {
        await API.post('/coupons', formData);
        toast.success('New coupon created successfully');
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;
    setIsDeleting(true);
    try {
      await API.delete(`/coupons/${couponToDelete._id}`);
      toast.success('Coupon deleted');
      setDeleteModalOpen(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete coupon');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Promotional Discount Coupons"
        subtitle="Create and manage checkout coupon codes, discounts, and expiration rules"
      />

      <div className="p-8 space-y-6">
        
        {/* Controls */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 flex items-center space-x-2 shadow-lg shadow-[#7C3AED]/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Coupon</span>
          </button>
        </div>

        {/* Coupons Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 bg-[#171D33] rounded-2xl animate-pulse border border-[#27324A]"></div>
            ))}
          </div>
        ) : coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((c) => (
              <div
                key={c._id}
                className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] hover:border-[#7C3AED] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xl font-mono font-black text-[#A855F7] tracking-wider block">
                        {c.code}
                      </span>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{c.description || 'Cinema Discount'}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        c.isActive ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#11182B] border border-[#27324A] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Discount:</span>
                      <span className="font-bold text-white">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Min Order:</span>
                      <span className="font-medium text-white">₹{c.minimumAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Usage Limit:</span>
                      <span className="font-medium text-white">{c.timesUsed} / {c.usageLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Valid Till:</span>
                      <span className="font-medium text-white">
                        {new Date(c.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#27324A] flex justify-end space-x-2">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#A855F7] hover:bg-[#11182B]"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCouponToDelete(c);
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
            No coupons available. Click "Create New Coupon" to offer discounts.
          </div>
        )}

      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCoupon ? 'Edit Coupon' : 'Create New Promotional Coupon'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Coupon Code (Uppercase) *</label>
            <input
              type="text"
              placeholder="e.g. SUMMER50"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
              className="w-full bg-[#11182B] text-sm font-mono text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Description</label>
            <input
              type="text"
              placeholder="Flat ₹100 off on ticket bookings above ₹500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              >
                <option value="flat">Flat Amount (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Discount Value *</label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Minimum Order Amount (₹)</label>
              <input
                type="number"
                value={formData.minimumAmount}
                onChange={(e) => setFormData({ ...formData, minimumAmount: Number(e.target.value) })}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Expiry Date *</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
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
              {isSubmitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Coupon?"
        message={`Are you sure you want to delete coupon ${couponToDelete?.code}?`}
        confirmText="Delete Coupon"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />

    </div>
  );
};

export default AdminCouponsPage;

