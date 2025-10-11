import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingPageProps {
  onComplete: () => void;
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedValues, setSelectedValues] = useState<Record<number, string | string[]>>({});
  const [showLoading, setShowLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

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
  const questionProgress = ((currentStep + 1) / questions.length) * 100;

  // Loading animation effect
  useEffect(() => {
    if (showLoading) {
      const duration = 7000;
      const intervalTime = 50;
      const increment = (100 / duration) * intervalTime;

      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
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
    }
  }, [showLoading]);

  const handleOptionClick = (optionId: string) => {
    if (currentQuestion.multiSelect) {
      const currentSelections = (selectedValues[currentStep] as string[]) || [];
      
      if (optionId === 'none') {
        if (currentSelections.includes('none')) {
          setSelectedValues(prev => ({ ...prev, [currentStep]: [] }));
        } else {
          setSelectedValues(prev => ({ ...prev, [currentStep]: ['none'] }));
        }
      } else {
        const withoutNone = currentSelections.filter(id => id !== 'none');
        if (withoutNone.includes(optionId)) {
          const newSelections = withoutNone.filter(id => id !== optionId);
          setSelectedValues(prev => ({ ...prev, [currentStep]: newSelections }));
        } else {
          const newSelections = [...withoutNone, optionId];
          setSelectedValues(prev => ({ ...prev, [currentStep]: newSelections }));
        }
      }
    } else {
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
      setShowLoading(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Completion screen
  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center p-6">
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
  if (showLoading && !showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center">
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
              strokeDashoffset={267 - (267 * loadingProgress) / 200}
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
              strokeDashoffset={267 - (267 * loadingProgress) / 200}
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
                {Math.round(loadingProgress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Questions screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black relative overflow-hidden flex flex-col">
      {/* Blue gradient overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-bl from-cyan-400/15 via-blue-500/8 to-transparent rounded-full blur-2xl"></div>
      
      {/* Progress Bar */}
      <div className="w-full p-4 pt-8">
        <div className="max-w-sm mx-auto">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-cyan-500/30"
              style={{ width: `${questionProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-20">
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

          {/* Options */}
          <div className="space-y-3 mb-8 animate-slide-up">
            {currentQuestion.options.map((option, index) => {
              const selected = isSelected(option.id);
              
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionClick(option.id)}
                  className={`w-full p-4 rounded-xl transition-all duration-200 text-center font-medium text-base border-2 animate-fade-in ${
                    selected
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border-cyan-400 shadow-lg shadow-cyan-500/20 transform scale-[1.02]'
                      : 'bg-slate-800/40 text-slate-300 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 hover:scale-[1.01]'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
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
                onClick={handleBack}
                className="w-12 h-12 bg-slate-800/60 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-12 h-12"></div>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-full font-bold text-base transition-all duration-300 transform ${
                canProceed()
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95'
                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              {currentStep === questions.length - 1 ? 'Complete' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
