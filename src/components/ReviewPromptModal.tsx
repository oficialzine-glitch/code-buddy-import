import React from 'react';
import { X, Star, ThumbsUp, MessageSquare } from 'lucide-react';

interface ReviewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewPromptModal({ isOpen, onClose }: ReviewPromptModalProps) {
  if (!isOpen) return null;

  const handleReviewClick = () => {
    // Open app store or review platform
    // For now, just close the modal
    onClose();
  };

  const handleFeedbackClick = () => {
    // Could open a feedback form
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 hover:bg-slate-700/60 transition-colors duration-200 z-10"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Star className="w-10 h-10 text-white fill-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3">
            Enjoying NextFace?
          </h2>

          {/* Description */}
          <p className="text-slate-300 mb-8 leading-relaxed">
            Your honest feedback helps us improve and helps others discover our app. 
            If you're finding value in your glowup journey, we'd love to hear about it!
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleReviewClick}
              className="w-full p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl font-semibold text-white shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>Leave a Review</span>
            </button>

            <button
              onClick={handleFeedbackClick}
              className="w-full p-4 bg-slate-800/60 backdrop-blur-sm rounded-2xl font-medium text-slate-300 border border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-700/60 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Send Feedback Instead</span>
            </button>

            <button
              onClick={onClose}
              className="w-full p-3 text-slate-400 hover:text-slate-300 transition-colors duration-200 text-sm"
            >
              Maybe later
            </button>
          </div>

          {/* Footer Note */}
          <p className="mt-6 text-xs text-slate-500">
            We never incentivize reviews. Your honest opinion matters most.
          </p>
        </div>
      </div>
    </div>
  );
}
