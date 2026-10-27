import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Flame, Sparkles, Calendar, ArrowRight, ShieldCheck, Armchair, Volume2, QrCode } from 'lucide-react';
import API from '../../services/api';
import HeroBanner from '../../components/customer/HeroBanner';
import MovieCard from '../../components/customer/MovieCard';
import { MovieCardSkeleton } from '../../components/common/LoadingSkeleton';

const HomePage = () => {
  const [featuredData, setFeaturedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchHomeMovies = async () => {
      try {
        const res = await API.get('/movies/featured/home');
        setFeaturedData(res.data.data);
      } catch (err) {
        console.error('Error fetching home featured movies', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeMovies();
  }, []);

  const categories = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Comedy', 'Thriller'];

  const filteredNowShowing = featuredData?.nowShowing?.filter((movie) => {
    if (selectedCategory === 'All') return true;
    return movie.genre?.includes(selectedCategory);
  }) || [];

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Featured Carousel */}
      {loading ? (
        <div className="w-full h-[540px] md:h-[620px] bg-[#11182B] animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#7C3AED] border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <HeroBanner movies={featuredData?.hero || []} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 2. Trending Movies Carousel / Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#EF4444]/20 text-[#EF4444]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Trending in Cinemas</h2>
                <p className="text-xs text-[#94A3B8]">The highest-rated and most booked movies this week</p>
              </div>
            </div>

            <Link
              to="/movies?sortBy=rating"
              className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-[#A855F7] hover:text-white transition-colors"
            >
              <span>See Top Rated</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <MovieCardSkeleton key={i} />)
            ) : (
              featuredData?.trending?.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            )}
          </div>
        </section>

        {/* 3. Now Showing Section with Category Filters */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#7C3AED]/20 text-[#A855F7]">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Now Showing</h2>
                <p className="text-xs text-[#94A3B8]">Browse currently running shows and book your seats</p>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-md shadow-[#7C3AED]/30'
                      : 'bg-[#11182B] text-[#94A3B8] border border-[#27324A] hover:text-white hover:border-[#7C3AED]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)
            ) : filteredNowShowing.length > 0 ? (
              filteredNowShowing.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-[#94A3B8] text-sm">
                No movies in this genre currently showing.
              </div>
            )}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/movies"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#171D33] border border-[#27324A] hover:border-[#7C3AED] hover:bg-[#1E2642] transition-all"
            >
              <span>Explore All Movies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 4. Cinema Highlights Promo Banner */}
        <section className="relative rounded-3xl bg-gradient-to-r from-[#171D33] via-[#11182B] to-[#171D33] border border-[#27324A] p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#7C3AED]/20 text-[#A855F7] border border-[#7C3AED]/30">
                Premium Cinema Experience
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Immerse Yourself in <span className="text-[#A855F7]">True Cinema Sound</span> & Vision
              </h2>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Step into state-of-the-art theatres equipped with IMAX Laser 4K projection, 64-channel Dolby Atmos sound, and plush VIP motor recliners.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-3 text-sm text-white">
                  <Volume2 className="w-5 h-5 text-[#A855F7]" />
                  <span>Dolby Atmos 7.1</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-white">
                  <Armchair className="w-5 h-5 text-[#A855F7]" />
                  <span>VIP Motor Recliners</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-white">
                  <QrCode className="w-5 h-5 text-[#A855F7]" />
                  <span>Contactless QR Entry</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-white">
                  <ShieldCheck className="w-5 h-5 text-[#A855F7]" />
                  <span>Instant Cancellation</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[#27324A] shadow-2xl aspect-video">
              <img
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80"
                alt="Cinema Audi"
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-bold">PVR & Cinépolis Partner Cinemas</span>
                <span className="text-[#A855F7] font-semibold">Over 50+ Screens</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Upcoming Releases */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Coming Soon to Theatres</h2>
                <p className="text-xs text-[#94A3B8]">Get ready for the most anticipated cinematic blockbusters</p>
              </div>
            </div>

            <Link
              to="/movies?status=upcoming"
              className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-[#A855F7] hover:text-white transition-colors"
            >
              <span>View All Upcoming</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <MovieCardSkeleton key={i} />)
            ) : (
              featuredData?.upcoming?.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePage;

