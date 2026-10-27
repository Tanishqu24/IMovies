import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl bg-[#11182B] border border-[#27324A] text-[#94A3B8] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        // Show first, last, and pages around current
        if (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        ) {
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                currentPage === page
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-lg shadow-[#7C3AED]/30 scale-105'
                  : 'bg-[#11182B] border border-[#27324A] text-[#94A3B8] hover:text-white hover:border-[#7C3AED]'
              }`}
            >
              {page}
            </button>
          );
        } else if (
          page === currentPage - 2 ||
          page === currentPage + 2
        ) {
          return (
            <span key={page} className="px-1 text-[#94A3B8]">
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl bg-[#11182B] border border-[#27324A] text-[#94A3B8] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;

