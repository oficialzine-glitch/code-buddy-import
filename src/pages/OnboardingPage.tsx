import React, { useState, useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface OnboardingPageProps {
  onComplete: () => void;
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [progress, setProgress] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    // Animate from 0 to 100 over 7 seconds
    const duration = 7000;
    const intervalTime = 50;
    const increment = (100 / duration) * intervalTime;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowCompletion(true), 300);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  // Completion screen
  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-6">
        <div className="text-center animate-fade-in">
          {/* Circular progress with checkmark */}
          <div className="relative w-48 h-48 mx-auto mb-12">
            {/* Arc segments */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
              {/* Bottom arc (cyan) */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="url(#gradient-cyan)"
                strokeWidth="6"
                strokeDasharray="267"
                strokeDashoffset="134"
                strokeLinecap="round"
                className="animate-fade-in"
              />
              {/* Top arc (blue) */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="url(#gradient-blue)"
                strokeWidth="6"
                strokeDasharray="267"
                strokeDashoffset="-134"
                strokeLinecap="round"
                className="animate-fade-in"
              />
              <defs>
                <linearGradient id="gradient-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center circle with checkmark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-scale-in">
                <Check className="w-16 h-16 text-white stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Text content */}
          <h1 className="text-5xl font-bold text-white mb-4 animate-slide-up">
            Thanks!
          </h1>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8 animate-slide-up">
            You're All Set
          </h2>
          <p className="text-slate-300 text-lg mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Your personalized AI experience is ready.
          </p>

          {/* Button */}
          <button
            onClick={onComplete}
            className="w-full max-w-md mx-auto py-5 px-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white font-semibold text-lg rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] animate-slide-up flex items-center justify-center gap-3 relative overflow-hidden group"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative">Start Your First Analysis</span>
            <ArrowRight className="w-6 h-6 relative" />
          </button>
        </div>
      </div>
    );
  }

  // Loading screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
      <div className="relative w-64 h-64">
        {/* Arc segments */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Bottom arc (cyan) - animates based on progress */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#gradient-cyan-loading)"
            strokeWidth="6"
            strokeDasharray="267"
            strokeDashoffset={267 - (267 * progress) / 200}
            strokeLinecap="round"
            className="transition-all duration-100 ease-linear"
          />
          {/* Top arc (blue) - animates based on progress */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#gradient-blue-loading)"
            strokeWidth="6"
            strokeDasharray="267"
            strokeDashoffset={267 - (267 * progress) / 200}
            strokeLinecap="round"
            className="transition-all duration-100 ease-linear"
            style={{ transform: 'rotate(180deg)', transformOrigin: 'center' }}
          />
          <defs>
            <linearGradient id="gradient-cyan-loading" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="gradient-blue-loading" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center circle with percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-44 h-44 rounded-full border-2 border-slate-700/30 flex items-center justify-center">
            <span className="text-5xl font-bold text-white animate-number-count">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
