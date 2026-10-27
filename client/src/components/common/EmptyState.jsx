import React from 'react';
import { Film, Search, Inbox, AlertCircle } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Film,
  title = 'No items found',
  description = 'There are currently no records matching your criteria.',
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#11182B]/60 border border-[#27324A] my-6">
      <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/30 flex items-center justify-center text-[#A855F7] mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#94A3B8] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] shadow-lg shadow-[#7C3AED]/25 hover:opacity-90 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

