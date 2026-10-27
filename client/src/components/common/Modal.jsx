import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className={`relative w-full ${maxWidth} my-8 rounded-2xl bg-[#171D33] border border-[#27324A] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27324A]">
          <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#11182B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

