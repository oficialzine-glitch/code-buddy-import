import React from 'react';
import phoneMockup from '../assets/phone-mockup.png';
interface IntroductionPageProps {
  onGetStarted: () => void;
}
export default function IntroductionPage({
  onGetStarted
}: IntroductionPageProps) {
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden flex flex-col">
      {/* Blue gradient overlay */}
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

      {/* Circular outlines */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-slate-700/20 absolute inset-0 animate-pulse"></div>
        <div className="w-[700px] h-[700px] rounded-full border border-slate-600/15 absolute -inset-[50px] animate-pulse" style={{
        animationDelay: '0.5s'
      }}></div>
        <div className="w-[800px] h-[800px] rounded-full border border-slate-500/10 absolute -inset-[100px] animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        {/* Phone mockup */}
        <div className="relative mb-8 animate-fade-in">
          <img src={phoneMockup} alt="Face analysis on phone" className="w-auto h-[400px] object-contain drop-shadow-2xl" />
        </div>

        {/* Text content */}
        <div className="text-center mb-8 max-w-md animate-slide-up">
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
            Upload a photo, get your AI analysis
          </h1>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-8 space-y-4">
        {/* Get Started button */}
        <button onClick={onGetStarted} className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold py-4 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center relative overflow-hidden group">
          <span className="text-lg font-medium">Get Started</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>

        {/* Sign in link */}
        <p className="text-center text-slate-400">
          Already have an account?{' '}
          <button onClick={onGetStarted} className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            Sign in
          </button>
        </p>
      </div>
    </div>;
}