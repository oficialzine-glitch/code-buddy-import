import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface OnboardingPageProps {
  onComplete: () => void;
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showThanks, setShowThanks] = useState(false);
  const [selectedValues, setSelectedValues] = useState<Record<number, string | string[]>>({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [touchedButton, setTouchedButton] = useState<string | null>(null);

  const questions = [
    {
      title: "Choose your Gender",
      subtitle: "This will be used to calibrate your custom plan.",
      options: [
        { id: 'male', text: 'Male' },
        { id: 'female', text: 'Female' },
        { id: 'other', text: 'Other / Prefer not to say' }
      ],
      multiSelect: false
    },
    {
      title: "What's your age range?",
      subtitle: "Help us personalize your experience.",
      options: [
        { id: 'age1', text: '16–17' },
        { id: 'age2', text: '18–24' },
        { id: 'age3', text: '25–34' },
        { id: 'age4', text: '35+' }
      ],
      multiSelect: false
    },
    {
      title: "What's your main goal?",
      subtitle: "Choose what matters most to you.",
      options: [
        { id: 'goal1', text: 'Look more attractive overall' },
        { id: 'goal2', text: 'Improve skin' },
        { id: 'goal3', text: 'Sharpen jawline / cheekbones' },
        { id: 'goal4', text: 'Reduce tired look / eyebags' },
        { id: 'goal5', text: 'Look younger' }
      ],
      multiSelect: false
    },
    {
      title: 'Which of these habits do you already have?',
      subtitle: 'Select all that apply to you.',
      options: [
        { id: 'habit1', text: 'Skincare routine' },
        { id: 'habit2', text: 'Gym / exercise' },
        { id: 'habit3', text: 'Diet awareness' },
        { id: 'habit4', text: 'Face exercises' },
        { id: 'none', text: 'None of the above' }
      ],
      multiSelect: true
    },
    {
      title: 'How much effort are you willing to put in?',
      subtitle: "Choose your commitment level.",
      options: [
        { id: 'effort1', text: 'Light (2–3 min daily)' },
        { id: 'effort2', text: 'Medium (5–10 min daily)' },
        { id: 'effort3', text: 'Heavy (willing to invest more time)' }
      ],
      multiSelect: false
    }
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleOptionClick = (optionId: string) => {
    setTouchedButton(optionId);
    setTimeout(() => setTouchedButton(null), 150);
    
    if (currentQuestion.multiSelect) {
      const currentSelections = (selectedValues[currentStep] as string[]) || [];
      
      if (optionId === 'none') {
        // Toggle "none" - if selected, clear all; if not selected, select only "none"
        if (currentSelections.includes('none')) {
          setSelectedValues(prev => ({ ...prev, [currentStep]: [] }));
        } else {
          setSelectedValues(prev => ({ ...prev, [currentStep]: ['none'] }));
        }
      } else {
        // For other options, remove "none" and toggle the option
        const withoutNone = currentSelections.filter(id => id !== 'none');
        if (withoutNone.includes(optionId)) {
          // Remove this option
          const newSelections = withoutNone.filter(id => id !== optionId);
          setSelectedValues(prev => ({ ...prev, [currentStep]: newSelections }));
        } else {
          // Add this option
          const newSelections = [...withoutNone, optionId];
          setSelectedValues(prev => ({ ...prev, [currentStep]: newSelections }));
        }
      }
    } else {
      // Single select
      setSelectedValues(prev => ({ ...prev, [currentStep]: optionId }));
    }
  };

  const isSelected = (optionId: string) => {
    const currentSelections = selectedValues[currentStep];
    if (currentQuestion.multiSelect) {
      return (currentSelections as string[] || []).includes(optionId);
    } else {
      return currentSelections === optionId;
    }
  };

  const canProceed = () => {
    const currentSelections = selectedValues[currentStep];
    if (currentQuestion.multiSelect) {
      return (currentSelections as string[] || []).length > 0;
    } else {
      return currentSelections !== undefined && currentSelections !== '';
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowThanks(true);

      // Start loading animation
      let progress = 0;
      const duration = 6000; // 6 seconds
      const increment = 100 / (duration / 50); // Update every 50ms

      const timer = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
          progress = 100;
          setLoadingProgress(100);
          clearInterval(timer);
          setTimeout(() => {
            setLoadingComplete(true);
          }, 200);
        } else {
          setLoadingProgress(progress);
        }
      }, 50);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Thanks screen - Simplified & Static (No Scroll)
  if (showThanks) {
    return (
      <div className="h-screen bg-gradient-to-br from-black via-slate-950 to-black relative overflow-hidden flex items-center justify-center p-6">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/20 via-blue-600/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/15 via-cyan-400/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="text-center max-w-md mx-auto relative z-10">
          {/* Success animation circle */}
          <div className="relative w-36 h-36 mx-auto mb-8 animate-scale-in">
            {/* Rotating rings */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-400 border-l-cyan-500 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>

            {/* Center icon or progress */}
            <div className="absolute inset-0 flex items-center justify-center">
              {loadingComplete ? (
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                  <svg className="w-10 h-10 text-white animate-scale-in" style={{ animationDelay: '0.3s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/30 border-2 border-cyan-500/30">
                  <span className="text-2xl font-bold text-white">
                    {Math.round(loadingProgress)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Main message */}
          {loadingComplete && (
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h1 className="text-5xl font-bold mb-3 leading-tight">
                <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                  Thanks!
                </span>
              </h1>
              <h2 className="text-3xl font-bold mb-5">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  You're All Set
                </span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Your personalized AI experience is ready.
              </p>
            </div>
          )}

          {/* CTA button */}
          {loadingComplete && (
            <button
              onClick={onComplete}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] animate-fade-in relative overflow-hidden group"
              style={{ animationDelay: '0.6s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <span>Start Your First Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black relative overflow-hidden flex flex-col">
      {/* Blue gradient overlay */}
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="pointer-events-none absolute top-10 right-10 w-64 h-64 bg-gradient-to-bl from-cyan-400/15 via-blue-500/8 to-transparent rounded-full blur-2xl"></div>
      
      {/* Progress Bar */}
      <div className="w-full p-4 pt-8">
        <div className="max-w-sm mx-auto">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-cyan-500/30"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-20 relative z-10">
        <div className="max-w-sm mx-auto w-full">
          {/* Question Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-white mb-3 leading-tight">
              {currentQuestion.title}
            </h1>
            <p className="text-slate-400 text-base">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Options - Completely New */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => {
              const selected = isSelected(option.id);
              
              return (
                <button
                  key={option.id}
                  type="button"
                  onTouchStart={() => handleOptionClick(option.id)}
                  className={`w-full p-4 rounded-xl text-center font-medium text-base border-2 pointer-events-auto transition-all duration-150 active:scale-95 ${
                    selected
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border-cyan-400 shadow-lg shadow-cyan-500/20'
                      : touchedButton === option.id
                      ? 'bg-slate-700/50 text-white border-slate-600/50 scale-95'
                      : 'bg-slate-800/40 text-slate-300 border-slate-700/50'
                  }`}
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                >
                  {option.text}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {currentStep > 0 ? (
              <button
                type="button"
                onTouchStart={handleBack}
                className="w-12 h-12 bg-slate-800/60 rounded-full flex items-center justify-center text-slate-300 active:text-white active:bg-slate-700/60 transition-all duration-150 active:scale-95"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-12 h-12"></div>
            )}

            <button
              type="button"
              onTouchStart={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-full font-bold text-base transition-all duration-150 active:scale-95 ${
                canProceed()
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              {currentStep === questions.length - 1 ? 'Complete' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
