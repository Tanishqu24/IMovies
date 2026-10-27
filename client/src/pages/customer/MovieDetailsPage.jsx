import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  Play,
  Film,
  MapPin,
  ChevronRight,
  Shield,
  Armchair,
  Volume2
} from 'lucide-react';
import API from '../../services/api';
import { useCity } from '../../context/CityContext';
import TrailerModal from '../../components/customer/TrailerModal';
import ReviewSection from '../../components/customer/ReviewSection';
import { MovieDetailsSkeleton } from '../../components/common/LoadingSkeleton';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCity } = useCity();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [theatresWithShows, setTheatresWithShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Generate 4 consecutive dates for the picker
  const generateDates = () => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString(undefined, { weekday: 'short' });
      const dateStr = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      arr.push({ iso, dayName, dateStr });
    }
    return arr;
  };

  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState(dates[0].iso);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await API.get(`/movies/${id}`);
        setMovie(res.data.movie);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error('Error fetching movie details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchShows = async () => {
      if (!id) return;
      setShowsLoading(true);
      try {
        const res = await API.get(`/shows/movie/${id}?date=${selectedDate}&city=${encodeURIComponent(selectedCity)}`);
        setTheatresWithShows(res.data.theatres || []);
      } catch (err) {
        console.error('Error fetching shows for movie', err);
      } finally {
        setShowsLoading(false);
      }
    };
    fetchShows();
  }, [id, selectedDate, selectedCity]);

  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Movie not found</h2>
        <Link to="/movies" className="text-[#A855F7] underline mt-4 inline-block">
          Return to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1020] pb-24">
      
      {/* 1. Backdrop Hero Banner */}
      <div className="relative w-full h-[380px] md:h-[480px] overflow-hidden">
        <img
          src={movie.backdrop || movie.poster || FALLBACK_POSTER}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020] via-[#0B1020]/50 to-transparent"></div>
      </div>

      {/* 2. Main Movie Info Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-56 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Poster Card */}
          <div className="w-56 md:w-72 shrink-0 rounded-2xl overflow-hidden border-2 border-[#27324A] shadow-2xl bg-[#171D33] group">
            <img
              src={movie.poster || FALLBACK_POSTER}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4 pt-4 md:pt-16">
            
            {/* Status & Rating */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#7C3AED]/30 text-[#A855F7] border border-[#7C3AED]/40">
                {movie.status === 'upcoming' ? 'Coming Soon' : 'Now Showing'}
              </span>

              {movie.rating > 0 && (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#11182B] border border-[#27324A] text-xs font-bold text-white">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{movie.rating.toFixed(1)}/10</span>
                  <span className="text-[#94A3B8]">({movie.ratingCount || 100}+ reviews)</span>
                </div>
              )}

              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#11182B] border border-[#27324A] text-white">
                {movie.certification || 'UA'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {movie.title}
            </h1>

            {/* Language & Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#94A3B8]">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-[#A855F7]" />
                <span className="text-white font-medium">{movie.duration} mins</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-[#A855F7]" />
                <span>
                  Released{' '}
                  {new Date(movie.releaseDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <span>•</span>
              <span className="text-white font-medium">{movie.language?.join(', ')}</span>
            </div>

            {/* Genre Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {movie.genre?.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-[#171D33] text-[#F8FAFC] border border-[#27324A]"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-3xl pt-2">
              {movie.description}
            </p>

            {/* Cast & Director */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#171D33]/70 border border-[#27324A]">
                <span className="text-[#94A3B8] block mb-1 font-semibold uppercase text-[10px] tracking-wider">Director</span>
                <span className="text-white font-medium">{movie.director || 'Unknown'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#171D33]/70 border border-[#27324A]">
                <span className="text-[#94A3B8] block mb-1 font-semibold uppercase text-[10px] tracking-wider">Cast</span>
                <span className="text-white font-medium">{movie.cast?.join(', ') || 'N/A'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {movie.trailerUrl && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setIsTrailerOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#171D33] hover:bg-[#1E2642] border border-[#27324A] hover:border-[#7C3AED] flex items-center space-x-2 transition-all shadow-md"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Watch Official Trailer</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* 3. SHOWTIMES & THEATRES BOOKING SECTION */}
        <section className="mt-16 pt-12 border-t border-[#27324A] space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Select Show & Timings</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Showing in <span className="text-[#A855F7] font-semibold">{selectedCity}</span> cinemas
              </p>
            </div>

            {/* Date Picker Horizontal Bar */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {dates.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  className={`px-4 py-2 rounded-xl text-center transition-all ${
                    selectedDate === d.iso
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-lg shadow-[#7C3AED]/30 scale-105'
                      : 'bg-[#171D33] text-[#94A3B8] hover:text-white border border-[#27324A]'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider">{d.dayName}</div>
                  <div className="text-xs font-black">{d.dateStr}</div>
                </button>
              ))}
            </div>
          </div>

          {/* List of Theatres showing this movie */}
          <div className="space-y-4">
            {showsLoading ? (
              <div className="p-12 text-center text-sm text-[#94A3B8] bg-[#171D33] rounded-2xl border border-[#27324A]">
                Loading available cinema shows for {selectedDate}...
              </div>
            ) : theatresWithShows.length > 0 ? (
              theatresWithShows.map((item) => (
                <div
                  key={item.theatre._id}
                  className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] hover:border-[#7C3AED]/60 transition-all space-y-4"
                >
                  {/* Theatre Details */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#27324A] pb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <span>{item.theatre.name}</span>
                      </h3>
                      <p className="text-xs text-[#94A3B8] flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#A855F7]" />
                        <span>{item.theatre.address}, {item.theatre.city}</span>
                      </p>
                    </div>

                    {/* Facilities Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.theatre.facilities?.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#11182B] text-[#94A3B8] border border-[#27324A]"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Show Timings Grid */}
                  <div className="flex flex-wrap gap-3">
                    {item.shows.map((show) => (
                      <button
                        key={show._id}
                        onClick={() => navigate(`/seat-selection/${show._id}`)}
                        className="group relative p-3 rounded-xl bg-[#11182B] border border-[#27324A] hover:border-[#7C3AED] hover:bg-[#1E2642] text-left transition-all"
                      >
                        <div className="text-sm font-bold text-white group-hover:text-[#A855F7] transition-colors">
                          {show.startTime}
                        </div>
                        <div className="text-[10px] text-[#94A3B8] mt-0.5 flex items-center space-x-1">
                          <span>{show.screenId?.screenName || 'Screen 1'}</span>
                        </div>
                        <div className="text-[10px] text-[#22C55E] font-semibold mt-1">
                          {show.availableSeatsCount} seats left
                        </div>
                      </button>
                    ))}
                  </div>

                </div>
              ))
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#171D33] border border-[#27324A] space-y-3">
                <Film className="w-8 h-8 text-[#94A3B8] mx-auto" />
                <h4 className="text-base font-bold text-white">No shows available for this date in {selectedCity}</h4>
                <p className="text-xs text-[#94A3B8]">
                  Try selecting another date or switch your city in the top navigation bar.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 4. REVIEWS SECTION */}
        <section className="mt-16 pt-12 border-t border-[#27324A]">
          <ReviewSection
            movieId={movie._id}
            initialReviews={reviews}
            onReviewAdded={(newRev) => setReviews([newRev, ...reviews])}
          />
        </section>

      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </div>
  );
};

export default MovieDetailsPage;

