import React from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  if (!isOpen) return null;

  // Convert youtube url to embed format if needed
  let embedUrl = trailerUrl;
  if (trailerUrl && trailerUrl.includes('youtube.com/watch?v=')) {
    const videoId = trailerUrl.split('watch?v=')[1]?.split('&')[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (trailerUrl && trailerUrl.includes('youtu.be/')) {
    const videoId = trailerUrl.split('youtu.be/')[1]?.split('?')[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#171D33] rounded-2xl border border-[#27324A] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27324A] bg-[#11182B]">
          <h3 className="text-base font-bold text-white truncate max-w-md">
            {movieTitle} – Official Trailer
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E2642] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-[#94A3B8]">
              Trailer video is currently unavailable.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;

