import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading IMovies...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-t-[#7C3AED] border-r-transparent border-b-[#A855F7] border-l-transparent animate-spin`}
      ></div>
      {text && <p className="text-xs text-[#94A3B8] font-medium tracking-wide animate-pulse">{text}</p>}
    </div>
  );
};

export const MovieCardSkeleton = () => {
  return (
    <div className="rounded-2xl bg-[#171D33] border border-[#27324A] overflow-hidden skeleton-shimmer">
      <div className="aspect-[2/3] w-full bg-[#1E2642]"></div>
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-[#27324A] rounded-md w-3/4"></div>
        <div className="h-3 bg-[#27324A] rounded-md w-1/2"></div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-3 bg-[#27324A] rounded-md w-1/4"></div>
          <div className="h-7 bg-[#27324A] rounded-lg w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full rounded-2xl bg-[#171D33] border border-[#27324A] p-4 space-y-4 skeleton-shimmer">
      <div className="h-6 bg-[#27324A] rounded-lg w-1/4"></div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex space-x-3">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-5 bg-[#27324A] rounded-md flex-1"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const MovieDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] animate-pulse">
      <div className="h-[450px] w-full bg-[#11182B]"></div>
      <div className="max-w-7xl mx-auto px-4 -mt-32 space-y-8 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-64 h-96 bg-[#171D33] rounded-2xl border border-[#27324A]"></div>
          <div className="flex-1 space-y-4 pt-12">
            <div className="h-8 bg-[#171D33] rounded-md w-1/2"></div>
            <div className="h-4 bg-[#171D33] rounded-md w-1/4"></div>
            <div className="h-20 bg-[#171D33] rounded-md w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

