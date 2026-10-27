import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Trash2 } from 'lucide-react';
import API from '../../services/api';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Delete Confirm
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/reviews?page=${page}&limit=12`);
      setReviews(res.data.reviews || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    try {
      await API.delete(`/reviews/${reviewToDelete._id}`);
      toast.success('Review deleted');
      setDeleteModalOpen(false);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete review');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Audience Reviews Moderation"
        subtitle="Manage and moderate customer ratings, comments, and sentiment"
      />

      <div className="p-8 space-y-6">
        {/* Table */}
        <div className="rounded-2xl bg-[#171D33] border border-[#27324A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#94A3B8]">
              <thead className="bg-[#11182B] text-xs font-bold uppercase tracking-wider text-white border-b border-[#27324A]">
                <tr>
                  <th className="py-4 px-6">Movie</th>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Comment</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27324A]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-[#94A3B8]">
                      Loading reviews...
                    </td>
                  </tr>
                ) : reviews.length > 0 ? (
                  reviews.map((r) => (
                    <tr key={r._id} className="hover:bg-[#11182B]/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-white max-w-[180px] truncate">
                        {r.movieId?.title}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium block">{r.userId?.fullName || 'User'}</span>
                        <span className="text-xs text-[#94A3B8]">{r.userId?.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1 text-[#F59E0B]">
                          <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                          <span className="text-xs font-bold text-white">{r.rating}/10</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-sm">
                        <p className="line-clamp-2 text-xs text-[#F8FAFC]">{r.comment}</p>
                      </td>
                      <td className="py-4 px-6 text-xs text-[#94A3B8]">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setReviewToDelete(r);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#11182B]"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-[#94A3B8]">
                      No reviews found.
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

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Review?"
        message="Are you sure you want to remove this review? The movie rating will automatically recalculate."
        confirmText="Delete Review"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default AdminReviewsPage;

