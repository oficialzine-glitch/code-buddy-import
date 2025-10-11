import React from 'react';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

interface IntroductionPageProps {
  onGetStarted: () => void;
}

export default function IntroductionPage({ onGetStarted }: IntroductionPageProps) {
  const handleSwipe = (e: React.TouchEvent | React.MouseEvent) => {
    // For now, we'll trigger on touch/click, but this could be enhanced with actual swipe detection
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black relative overflow-hidden flex flex-col">
      {/* Blue gradient overlay in top right */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-bl from-cyan-400/15 via-blue-500/8 to-transparent rounded-full blur-2xl"></div>
      
      {/* Subtle dots pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-1 h-1 bg-blue-400 rounded-full"></div>
        <div className="absolute top-32 left-20 w-1 h-1 bg-cyan-400 rounded-full"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-300 rounded-full"></div>
        <div className="absolute top-60 right-32 w-1 h-1 bg-cyan-300 rounded-full"></div>
        <div className="absolute bottom-40 left-16 w-1 h-1 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-32 right-24 w-1 h-1 bg-cyan-400 rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        {/* Circular logo design */}
        <div className="relative mb-16">
          {/* Outer circles */}
          <div className="w-80 h-80 rounded-full border border-slate-700/30 absolute inset-0 animate-pulse"></div>
          <div className="w-64 h-64 rounded-full border border-slate-600/40 absolute inset-8 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-48 h-48 rounded-full border border-slate-500/50 absolute inset-16 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Center logo */}
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-cyan-500/30 animate-pulse" style={{ animationDelay: '1.5s' }}>
            <Sparkles className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Text content */}
        <div className="text-center mb-16 max-w-sm">
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Take your face to the next level with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
              NextFace AI
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Unlock your true potential with advanced AI facial analysis and personalized beauty insights
          </p>
        </div>

        {/* Page indicators */}
        <div className="flex space-x-2 mb-12">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
        </div>
      </div>

      {/* Get Started button */}
      <div className="px-6 pb-8">
        <button
          onClick={handleSwipe}
          onTouchEnd={handleSwipe}
          className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold py-4 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center relative overflow-hidden group"
        >
          {/* Centered text */}
          <span className="text-lg font-medium">Get Started</span>
          
          {/* Swipe animation effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>
      </div>
    </div>
  );
}