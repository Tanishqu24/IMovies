import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend = '+12% from last month', color = 'purple' }) => {
  const colorSchemes = {
    purple: {
      bg: 'bg-[#7C3AED]/20',
      text: 'text-[#A855F7]',
      border: 'border-[#7C3AED]/30'
    },
    green: {
      bg: 'bg-[#22C55E]/20',
      text: 'text-[#22C55E]',
      border: 'border-[#22C55E]/30'
    },
    blue: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30'
    },
    amber: {
      bg: 'bg-[#F59E0B]/20',
      text: 'text-[#F59E0B]',
      border: 'border-[#F59E0B]/30'
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.purple;

  return (
    <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] hover:border-[#7C3AED] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">{title}</span>
        <div className={`w-11 h-11 rounded-xl ${scheme.bg} ${scheme.text} flex items-center justify-center border ${scheme.border}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
        {value}
      </div>

      {trend && (
        <div className="flex items-center space-x-1.5 text-xs text-[#22C55E] font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

