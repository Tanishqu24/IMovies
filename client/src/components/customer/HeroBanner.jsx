import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Ticket, ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import TrailerModal from './TrailerModal';

const HeroBanner = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  return (
    <div className="relative w-full h-[540px] md:h-[620px] overflow-hidden bg-[#0B1020]">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={currentMovie.backdrop || currentMovie.poster}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105 transition-all duration-1000"
        />
        {/* Cinematic Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020] via-[#0B1020]/70 to-transparent w-full md:w-3/4"></div>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl space-y-4 pt-10">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#7C3AED]/30 text-[#A855F7] border border-[#7C3AED]/40 backdrop-blur-md">
              Featured Blockbuster
            </span>

            {currentMovie.rating > 0 && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#11182B]/80 border border-[#27324A] text-xs font-semibold text-white">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{currentMovie.rating.toFixed(1)}/10</span>
                <span className="text-[#94A3B8]">({currentMovie.ratingCount || 120}+ votes)</span>
              </div>
            )}

            <div className="flex items-center space-x-1 text-xs text-[#94A3B8]">
              <Clock className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>{currentMovie.duration} mins</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {currentMovie.title}
          </h1>

          {/* Genre Badges & Language */}
          <div className="flex flex-wrap items-center gap-2">
            {currentMovie.genre?.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-lg bg-[#171D33]/90 text-xs text-[#F8FAFC] border border-[#27324A]"
              >
                {g}
              </span>
            ))}
            <span className="text-xs text-[#94A3B8] ml-2">
              • {currentMovie.language?.join(', ')}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#94A3B8] line-clamp-3 leading-relaxed max-w-xl">
            {currentMovie.description}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to={`/movies/${currentMovie._id}`}
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 shadow-lg shadow-[#7C3AED]/40 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
            </Link>

            {currentMovie.trailerUrl && (
              <button
                type="button"
                onClick={() => setIsTrailerOpen(true)}
                className="px-5 py-3.5 rounded-xl font-bold text-sm text-white bg-[#171D33]/90 hover:bg-[#1E2642] border border-[#27324A] hover:border-[#7C3AED] backdrop-blur-md flex items-center space-x-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Watch Trailer</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Carousel Controls */}
      {movies.length > 1 && (
        <div className="absolute bottom-8 right-8 hidden sm:flex items-center space-x-3 z-20">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-xl bg-[#11182B]/80 hover:bg-[#1E2642] border border-[#27324A] hover:border-[#7C3AED] text-white flex items-center justify-center transition-all backdrop-blur-md"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-1.5 px-3">
            {movies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-[#A855F7]' : 'w-2 bg-[#27324A]'
                }`}
                aria-label={`Slide ${idx + 1}`}
              ></button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-xl bg-[#11182B]/80 hover:bg-[#1E2642] border border-[#27324A] hover:border-[#7C3AED] text-white flex items-center justify-center transition-all backdrop-blur-md"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={currentMovie.trailerUrl}
        movieTitle={currentMovie.title}
      />
    </div>
  );
};

export default HeroBanner;

