import React, { useState } from 'react';
import { X, Crown, Check } from 'lucide-react';
import TermsOfServiceModal from './TermsOfServiceModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly'>('yearly');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-950 to-black z-[99999] flex flex-col w-screen h-screen overflow-y-auto overflow-x-hidden">
      {/* Blue gradient overlay in top right */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-bl from-cyan-400/15 via-blue-500/8 to-transparent rounded-full blur-2xl pointer-events-none"></div>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white transition-colors z-20 bg-slate-800/60 rounded-full border border-slate-700/50"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Content - Compact Layout */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8 relative z-10 max-h-screen">
        {/* Header - Reduced spacing */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
            UPGRADE NOW
          </h1>
          <p className="text-slate-400 text-base">
            Take the next step, looksmaxxing based on science.
          </p>
        </div>

        {/* Feature Cards Container - More compact */}
        <div className="w-full max-w-sm mx-auto mb-6">
          {/* Static Container */}
          <div className="space-y-4">
            {/* Block 1: Get your ratings */}
            <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
                <h2 className="text-xl font-bold text-white text-center mb-4">
                  Get your ratings
                </h2>
                
                {/* 6 Feature Cards Grid - Restored original size */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {/* Row 1 */}
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#334155"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="url(#neonBlueGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${(68 / 100) * 251} 251`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">68</span>
                      </div>
                    </div>
                    <h3 className="text-white font-medium text-xs">Overall</h3>
                  </div>
                  
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#334155"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="url(#neonBlueGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${(91 / 100) * 251} 251`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">91</span>
                      </div>
                    </div>
                    <h3 className="text-white font-medium text-xs">Potential</h3>
                  </div>
                  
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#334155"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="url(#neonBlueGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${(56 / 100) * 251} 251`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">56</span>
                      </div>
                    </div>
                    <h3 className="text-white font-medium text-xs">Jawline</h3>
                  </div>
                  
                  {/* Row 2 */}
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#334155"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="url(#neonBlueGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${(81 / 100) * 251} 251`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">81</span>
                      </div>
                    </div>
                    <h3 className="text-white font-medium text-xs">Masculinity</h3>
                  </div>
                  
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#334155"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="url(#neonBlueGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${(65 / 100) * 251} 251`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">65</span>
                      </div>
                    </div>
                    <h3 className="text-white font-medium text-xs">Skin quality</h3>
                  </div>
                  
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#334155"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="url(#neonBlueGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${(76 / 100) * 251} 251`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">76</span>
                      </div>
                    </div>
                    <h3 className="text-white font-medium text-xs">Cheekbones</h3>
                  </div>
                  
                  {/* SVG Gradient Definition */}
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id="neonBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00FFFF" stopOpacity="1" />
                        <stop offset="25%" stopColor="#00E5FF" stopOpacity="1" />
                        <stop offset="50%" stopColor="#00B4FF" stopOpacity="1" />
                        <stop offset="75%" stopColor="#0080FF" stopOpacity="1" />
                        <stop offset="100%" stopColor="#0040FF" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Stats */}
                <div className="text-center text-slate-400 text-sm">
                  Powered by OpenAI
                </div>
              </div>
          </div>
        </div>

        {/* Bottom Action Area - Fixed at bottom */}
        <div className="px-4 pb-6 relative z-10">
          {/* Pricing - Compact */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-white">$4.99</span>
              <span className="text-slate-400 text-sm">per week, auto-renews</span>
            </div>
          </div>

          {/* Unlock Button - Slightly smaller */}
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold py-3.5 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center relative overflow-hidden group mb-3">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="text-base font-medium mr-2">Upgrade to premium</span>
            <span className="text-lg"></span>
          </button>

          {/* Footer Links - Smaller */}
          <div className="flex justify-center space-x-6 text-slate-400 text-xs">
            <button 
              onClick={() => setShowTermsModal(true)}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Selection Modal */}
      {showSubscriptionModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 max-w-md w-full relative border border-slate-700/50 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors bg-slate-800/60 rounded-full border border-slate-700/50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
              <p className="text-slate-400 text-sm">Unlock premium features now</p>
            </div>

            {/* Subscription Plans */}
            <div className="space-y-3 mb-6">
              {/* Yearly Plan - Most Popular */}
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden ${
                  selectedPlan === 'yearly'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-bold text-lg">Yearly</h3>
                      {selectedPlan === 'yearly' && (
                        <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className="text-cyan-400 font-bold text-xl">$0.40/week</p>
                    <p className="text-slate-400 text-xs mt-1">Billed yearly at $19.99</p>
                  </div>
                </div>
              </button>

              {/* Monthly Plan */}
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                  selectedPlan === 'monthly'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <div className="flex items-center justify-between relative">
                  <div className="text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-bold text-lg">Monthly</h3>
                      {selectedPlan === 'monthly' && (
                        <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className="text-white font-bold text-xl">$4.99/month</p>
                    <p className="text-slate-400 text-xs mt-1">Billed monthly</p>
                  </div>
                </div>
              </button>

              {/* Weekly Plan */}
              <button
                onClick={() => setSelectedPlan('weekly')}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                  selectedPlan === 'weekly'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-bold text-lg">Weekly</h3>
                      {selectedPlan === 'weekly' && (
                        <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className="text-white font-bold text-xl">$3.99/week</p>
                    <p className="text-slate-400 text-xs mt-1">Billed weekly</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Upgrade Button */}
            <button
              onClick={() => {
                // Handle upgrade logic here
                console.log('Upgrading to:', selectedPlan);
              }}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <span className="relative">Upgrade Now</span>
            </button>

            {/* Fine print */}
            <p className="text-slate-500 text-xs text-center mt-4 leading-relaxed">
              Auto-renews unless cancelled. Cancel anytime.
            </p>
            <p className="text-slate-600 text-xs text-center mt-2 leading-relaxed">
              *Savings compared to weekly subscription. See{' '}
              <button
                onClick={() => setShowTermsModal(true)}
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
              >
                Terms of Service
              </button>
              {' '}for details.
            </p>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </div>
  );
}
