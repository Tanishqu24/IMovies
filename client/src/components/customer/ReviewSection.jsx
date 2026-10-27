import React, { useState } from 'react';
import { Star, MessageSquare, Send, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

const ReviewSection = ({ movieId, initialReviews = [], onReviewAdded }) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(8);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await API.post('/reviews', {
        movieId,
        rating,
        comment: comment.trim()
      });

      toast.success('Review posted successfully!');
      setReviews([res.data.review, ...reviews]);
      setComment('');
      if (onReviewAdded) onReviewAdded(res.data.review);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-[#27324A] pb-4">
        <div className="flex items-center space-x-2.5">
          <MessageSquare className="w-5 h-5 text-[#A855F7]" />
          <h3 className="text-xl font-bold text-white">Audience Reviews & Ratings</h3>
        </div>
        <span className="text-xs text-[#94A3B8] font-semibold">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </span>
      </div>

      {/* Add Review Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
          <h4 className="text-sm font-semibold text-white">Rate & Review this Movie</h4>
          
          {/* Interactive Rating Scale 1-10 */}
          <div>
            <label className="block text-xs text-[#94A3B8] mb-2 font-medium">
              Your Rating: <span className="text-[#A855F7] font-bold text-sm">{rating}/10</span>
            </label>
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    rating >= star
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-md shadow-[#7C3AED]/30 scale-105'
                      : 'bg-[#11182B] text-[#94A3B8] border border-[#27324A] hover:border-[#7C3AED]'
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              rows="3"
              placeholder="What did you think of the acting, direction, cinematography, and story?..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-[#11182B] text-sm text-[#F8FAFC] placeholder-[#94A3B8] p-3.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED] transition-all resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 shadow-md shadow-[#7C3AED]/30 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting...' : 'Post Review'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-xl bg-[#11182B] border border-[#27324A] text-center text-sm text-[#94A3B8]">
          Please <a href="/login" className="text-[#A855F7] font-semibold underline">sign in</a> to write a review.
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-[#94A3B8] italic">No reviews yet. Be the first to share your thoughts!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="p-4 rounded-2xl bg-[#11182B] border border-[#27324A] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={rev.userId?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.userId?.fullName || 'User')}`}
                    alt=""
                    className="w-8 h-8 rounded-full border border-[#7C3AED]"
                  />
                  <div>
                    <h5 className="text-sm font-semibold text-white">{rev.userId?.fullName || 'Movie Fan'}</h5>
                    <span className="text-[10px] text-[#94A3B8]">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#171D33] border border-[#27324A]">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="text-xs font-bold text-white">{rev.rating}/10</span>
                </div>
              </div>

              <p className="text-sm text-[#94A3B8] leading-relaxed pl-10">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

