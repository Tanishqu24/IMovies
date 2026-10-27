import React, { useState, useEffect } from 'react';
import { Film, Plus, Search, Edit2, Trash2, Star, Eye } from 'lucide-react';
import API from '../../services/api';
import AdminHeader from '../../components/admin/AdminHeader';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirm State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster: '',
    backdrop: '',
    trailerUrl: '',
    genre: 'Action, Sci-Fi',
    language: 'English, Hindi',
    duration: 150,
    rating: 8.5,
    releaseDate: new Date().toISOString().split('T')[0],
    director: '',
    cast: '',
    certification: 'UA',
    status: 'now_showing'
  });

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/movies?search=${search}&page=${page}&limit=10`);
      setMovies(res.data.movies || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load movies catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, search]);

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      description: '',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80',
      backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
      trailerUrl: '',
      genre: 'Action, Drama',
      language: 'English, Hindi',
      duration: 140,
      rating: 8.0,
      releaseDate: new Date().toISOString().split('T')[0],
      director: '',
      cast: '',
      certification: 'UA',
      status: 'now_showing'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      description: movie.description || '',
      poster: movie.poster || '',
      backdrop: movie.backdrop || '',
      trailerUrl: movie.trailerUrl || '',
      genre: movie.genre?.join(', ') || '',
      language: movie.language?.join(', ') || '',
      duration: movie.duration || 120,
      rating: movie.rating || 0,
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
      director: movie.director || '',
      cast: movie.cast?.join(', ') || '',
      certification: movie.certification || 'UA',
      status: movie.status || 'now_showing'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      duration: Number(formData.duration),
      rating: Number(formData.rating),
      genre: formData.genre.split(',').map((s) => s.trim()).filter(Boolean),
      language: formData.language.split(',').map((s) => s.trim()).filter(Boolean),
      cast: formData.cast.split(',').map((s) => s.trim()).filter(Boolean)
    };

    try {
      if (editingMovie) {
        await API.put(`/movies/${editingMovie._id}`, payload);
        toast.success('Movie updated successfully');
      } else {
        await API.post('/movies', payload);
        toast.success('New movie created successfully');
      }
      setIsModalOpen(false);
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!movieToDelete) return;
    setIsDeleting(true);
    try {
      await API.delete(`/movies/${movieToDelete._id}`);
      toast.success('Movie deleted successfully');
      setDeleteModalOpen(false);
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete movie');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Manage Movies Catalog"
        subtitle="Add, edit, or archive movies, ratings, and posters"
      />

      <div className="p-8 space-y-6">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search movie titles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#11182B] text-sm text-white placeholder-[#94A3B8] pl-10 pr-4 py-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            />
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 flex items-center space-x-2 shadow-lg shadow-[#7C3AED]/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Movie</span>
          </button>
        </div>

        {/* Movies Table */}
        <div className="rounded-2xl bg-[#171D33] border border-[#27324A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#94A3B8]">
              <thead className="bg-[#11182B] text-xs font-bold uppercase tracking-wider text-white border-b border-[#27324A]">
                <tr>
                  <th className="py-4 px-6">Movie</th>
                  <th className="py-4 px-6">Genres</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27324A]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-[#94A3B8]">
                      Loading movies catalog...
                    </td>
                  </tr>
                ) : movies.length > 0 ? (
                  movies.map((m) => (
                    <tr key={m._id} className="hover:bg-[#11182B]/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={m.poster}
                            alt=""
                            className="w-10 h-14 object-cover rounded-md border border-[#27324A]"
                          />
                          <div>
                            <span className="font-bold text-white line-clamp-1 block">{m.title}</span>
                            <span className="text-xs text-[#94A3B8]">{m.director}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {m.genre?.slice(0, 2).map((g) => (
                            <span key={g} className="px-2 py-0.5 rounded-md bg-[#11182B] text-xs text-white">
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white font-medium">{m.duration}m</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1 text-[#F59E0B]">
                          <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                          <span className="text-xs font-bold text-white">{m.rating || 0}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            m.status === 'now_showing'
                              ? 'bg-[#22C55E]/20 text-[#22C55E]'
                              : 'bg-[#7C3AED]/20 text-[#A855F7]'
                          }`}
                        >
                          {m.status === 'now_showing' ? 'Now Showing' : 'Upcoming'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#A855F7] hover:bg-[#11182B]"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setMovieToDelete(m);
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
                      No movies found matching criteria.
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

      {/* Add / Edit Movie Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMovie ? 'Edit Movie Details' : 'Add New Cinema Movie'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Movie Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Description *</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED] resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Poster Image URL *</label>
              <input
                type="text"
                value={formData.poster}
                onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Backdrop Image URL *</label>
              <input
                type="text"
                value={formData.backdrop}
                onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Trailer YouTube URL</label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.trailerUrl}
                onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Genres (comma separated)</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Languages (comma separated)</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Director</label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Cast (comma separated)</label>
              <input
                type="text"
                value={formData.cast}
                onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              >
                <option value="now_showing">Now Showing</option>
                <option value="upcoming">Upcoming</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Release Date</label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
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
              {isSubmitting ? 'Saving...' : editingMovie ? 'Update Movie' : 'Create Movie'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Movie?"
        message={`Are you sure you want to remove "${movieToDelete?.title}" from the catalog? This will delete the movie record.`}
        confirmText="Delete Movie"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />

    </div>
  );
};

export default AdminMoviesPage;

