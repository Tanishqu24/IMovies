import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-[#171D33] border border-[#27324A] p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDanger ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#7C3AED]/20 text-[#A855F7]'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-xs text-[#94A3B8]">Confirmation required</p>
          </div>
        </div>

        <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[#94A3B8] hover:text-white bg-[#11182B] border border-[#27324A] hover:bg-[#1E2642] transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-lg ${
              isDanger
                ? 'bg-[#EF4444] hover:bg-[#DC2626] shadow-[#EF4444]/20'
                : 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-[#7C3AED]/20'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

