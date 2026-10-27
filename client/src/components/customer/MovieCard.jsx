import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';

const MovieCard = ({ movie }) => {
  const [imgSrc, setImgSrc] = useState(movie.poster || FALLBACK_POSTER);

  return (
    <div className="group relative rounded-2xl bg-[#171D33] border border-[#27324A] overflow-hidden flex flex-col transition-all duration-300 hover:border-[#7C3AED] hover:shadow-xl hover:shadow-[#7C3AED]/20 hover:-translate-y-1.5">
      {/* Poster Image Container */}
      <Link to={`/movies/${movie._id}`} className="relative aspect-[2/3] overflow-hidden bg-[#11182B] block">
        <img
          src={imgSrc}
          alt={movie.title}
          onError={() => setImgSrc(FALLBACK_POSTER)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Rating Badge */}
        {movie.rating > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#0B1020]/80 backdrop-blur-md border border-[#27324A] flex items-center space-x-1 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            <span className="text-xs font-bold text-white">{movie.rating.toFixed(1)}</span>
            <span className="text-[10px] text-[#94A3B8]">/10</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {movie.status === 'upcoming' ? (
            <span className="px-2.5 py-1 rounded-lg bg-[#7C3AED]/90 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-md">
              Upcoming
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-[#22C55E]/90 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-md">
              Now Showing
            </span>
          )}
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-xs font-bold text-center shadow-lg shadow-[#7C3AED]/40 flex items-center justify-center space-x-1.5">
            <Ticket className="w-4 h-4" />
            <span>Book Tickets</span>
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {movie.genre?.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#11182B] text-[#94A3B8] border border-[#27324A]"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Title */}
          <Link to={`/movies/${movie._id}`}>
            <h3 className="text-base font-bold text-white group-hover:text-[#A855F7] transition-colors line-clamp-1 mb-1">
              {movie.title}
            </h3>
          </Link>
        </div>

        {/* Duration & Languages */}
        <div className="pt-3 border-t border-[#27324A]/60 flex items-center justify-between text-xs text-[#94A3B8]">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>{movie.duration}m</span>
          </div>
          <div className="line-clamp-1 max-w-[120px] text-right">
            {movie.language?.join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

