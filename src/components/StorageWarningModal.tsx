import React from 'react';
import { X } from 'lucide-react';

interface StorageWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StorageWarningModal({ isOpen, onClose }: StorageWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-cyan-500/10">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-white mb-3">
          Storage Limit Reached
        </h2>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          You can store a maximum of 10 analysis at the same time. Delete some to make space or your analysis results will not be stored.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
