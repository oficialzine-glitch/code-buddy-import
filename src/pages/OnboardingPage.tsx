import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface OnboardingPageProps {
  onComplete: () => void;
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showThanks, setShowThanks] = useState(false);
  const [selectedValues, setSelectedValues] = useState<Record<number, string | string[]>>({});

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
    console.log('Button clicked:', optionId); // Debug log
    
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
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Thanks screen
  if (showThanks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black relative overflow-hidden flex items-center justify-center p-4">
        {/* Enhanced blue gradient overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/30 via-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-bl from-cyan-400/25 via-blue-500/15 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/20 via-cyan-400/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="text-center animate-fade-in max-w-md mx-auto">
          {/* Enhanced icon with blue theme */}
          <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in shadow-2xl shadow-blue-500/50 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-75"></div>
            <Sparkles className="w-16 h-16 text-white animate-pulse relative z-10" />
          </div>
          
          {/* Enhanced title */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent mb-6 animate-slide-up leading-tight">
            Perfect! You're All Set
          </h1>
          
          {/* Enhanced description */}
          <div className="space-y-4 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-white text-xl font-semibold leading-relaxed">
              Your personalized experience is now ready!
            </p>
            <p className="text-slate-300 text-base leading-relaxed">
              Based on your preferences, NextFace AI will provide tailored analysis results, customized recommendations, and personalized improvement suggestions designed specifically for your goals.
            </p>
            <p className="text-blue-300 text-sm font-medium">
              Everything you see will be optimized for your unique profile and preferences.
            </p>
          </div>
          
          {/* Continue button */}
          <button
            onClick={onComplete}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] animate-slide-up relative overflow-hidden group"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative">Continue to NextFace AI</span>
          </button>
          
          {/* Status indicator */}
          <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-400 text-sm font-medium">Ready to analyze your photos</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              style={{ width: `${progress}%` }}
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

          {/* Options - Completely New */}
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
