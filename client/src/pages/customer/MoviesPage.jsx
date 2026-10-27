import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Film, Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import API from '../../services/api';
import MovieCard from '../../components/customer/MovieCard';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { MovieCardSkeleton } from '../../components/common/LoadingSkeleton';

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter States
  const search = searchParams.get('search') || '';
  const genre = searchParams.get('genre') || 'all';
  const language = searchParams.get('language') || 'all';
  const status = searchParams.get('status') || 'all';
  const minRating = searchParams.get('minRating') || '';
  const sortBy = searchParams.get('sortBy') || 'releaseDateDesc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const genres = ['Action', 'Sci-Fi', 'Drama', 'Adventure', 'Comedy', 'Thriller', 'Biography', 'Animation'];
  const languages = ['English', 'Hindi', 'Telugu', 'Tamil'];

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (genre !== 'all') params.append('genre', genre);
        if (language !== 'all') params.append('language', language);
        if (status !== 'all') params.append('status', status);
        if (minRating) params.append('minRating', minRating);
        if (sortBy) params.append('sortBy', sortBy);
        params.append('page', page);
        params.append('limit', 12);

        const res = await API.get(`/movies?${params.toString()}`);
        setMovies(res.data.movies || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      } catch (err) {
        console.error('Error fetching movies', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [search, genre, language, status, minRating, sortBy, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27324A] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Movie Catalog</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Explore now showing & upcoming cinema releases ({totalCount} movies available)
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search titles, directors..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#11182B] text-sm text-[#F8FAFC] placeholder-[#94A3B8] pl-10 pr-4 py-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED] transition-all"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filters Toggle Button */}
        <div className="lg:hidden flex items-center justify-between">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="px-4 py-2 rounded-xl bg-[#11182B] border border-[#27324A] text-sm text-white flex items-center space-x-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#A855F7]" />
            <span>Filters & Sort</span>
          </button>

          {(genre !== 'all' || language !== 'all' || status !== 'all' || minRating || search) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#A855F7] flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Filters Sidebar */}
        <aside
          className={`${
            showMobileFilters ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 shrink-0 space-y-6 bg-[#171D33] border border-[#27324A] p-6 rounded-2xl h-fit`}
        >
          <div className="flex items-center justify-between border-b border-[#27324A] pb-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <Filter className="w-4 h-4 text-[#A855F7]" />
              <span>Filter Movies</span>
            </div>
            {(genre !== 'all' || language !== 'all' || status !== 'all' || minRating || search) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#94A3B8] hover:text-[#A855F7] flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
              Release Status
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'now_showing', label: 'Now Showing' },
                { id: 'upcoming', label: 'Upcoming' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => updateParam('status', s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    status === s.id
                      ? 'bg-[#7C3AED] text-white shadow-md'
                      : 'bg-[#11182B] text-[#94A3B8] hover:text-white border border-[#27324A]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
              Genre
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => updateParam('genre', 'all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  genre === 'all'
                    ? 'bg-[#7C3AED] text-white'
                    : 'bg-[#11182B] text-[#94A3B8] hover:text-white border border-[#27324A]'
                }`}
              >
                All Genres
              </button>
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => updateParam('genre', g)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    genre === g
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-[#11182B] text-[#94A3B8] hover:text-white border border-[#27324A]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Language Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
              Language
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => updateParam('language', 'all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  language === 'all'
                    ? 'bg-[#7C3AED] text-white'
                    : 'bg-[#11182B] text-[#94A3B8] hover:text-white border border-[#27324A]'
                }`}
              >
                All
              </button>
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => updateParam('language', l)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    language === l
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-[#11182B] text-[#94A3B8] hover:text-white border border-[#27324A]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
              Minimum Rating
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: '', label: 'Any' },
                { id: '7', label: '★ 7.0+' },
                { id: '8', label: '★ 8.0+' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => updateParam('minRating', r.id)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-center ${
                    minRating === r.id
                      ? 'bg-[#7C3AED] text-white shadow-md'
                      : 'bg-[#11182B] text-[#94A3B8] hover:text-white border border-[#27324A]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              className="w-full bg-[#11182B] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="releaseDateDesc">Newest Release First</option>
              <option value="releaseDateAsc">Oldest Release First</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </aside>

        {/* Movies Grid */}
        <div className="flex-1 space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => updateParam('page', String(p))}
              />
            </>
          ) : (
            <EmptyState
              title="No movies found"
              description="Try relaxing your genre, rating, or search filters to discover more cinema experiences."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default MoviesPage;

