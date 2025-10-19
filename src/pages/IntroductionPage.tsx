import React from 'react';
import phoneMockupImage from '../assets/phone-mockup.png';

interface IntroductionPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export default function IntroductionPage({ onGetStarted, onSignIn }: IntroductionPageProps) {
  const handleSwipe = (e: React.TouchEvent | React.MouseEvent) => {
    // For now, we'll trigger on touch/click, but this could be enhanced with actual swipe detection
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black relative overflow-hidden flex flex-col">
      {/* Blue gradient overlay in top right */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-bl from-cyan-400/15 via-blue-500/8 to-transparent rounded-full blur-2xl pointer-events-none"></div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-between px-6 py-12">
        {/* Phone Mockup */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <img 
            src={phoneMockupImage}
            alt="NextFace AI phone mockup"
            className="w-56 h-auto shadow-2xl"
          />
        </div>

        {/* Text content */}
        <div className="text-center max-w-sm mb-8 relative z-10">
          <h1 className="text-2xl font-bold text-white mb-6 leading-tight">
            Upload a photo, get your AI analysis
          </h1>
        </div>

        {/* Get Started button */}
        <div className="w-full relative z-10">
          <button
            onClick={handleSwipe}
            onTouchEnd={handleSwipe}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center relative overflow-hidden group text-lg"
          >
            <span>Get Started</span>
          </button>
          
          {/* Sign in link */}
          <div className="text-center mt-4">
            <span className="text-slate-400">Already have an account? </span>
            <button
              onClick={onSignIn}
              className="text-cyan-400 font-semibold underline hover:text-cyan-300 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}