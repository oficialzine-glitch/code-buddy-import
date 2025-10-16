import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, User, Camera, Trophy, Globe, ChevronRight, Languages, AlertTriangle, Bell, Shield, Crown, FileText, MessageCircle } from 'lucide-react';
import { getHistory } from '../lib/history';
import LanguageModal from '../components/LanguageModal';
import EditProfileModal from '../components/EditProfileModal';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';
import TermsOfServiceModal from '../components/TermsOfServiceModal';
import ContactModal from '../components/ContactModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import GradientButton from '../components/GradientButton';

interface ProfilePageProps {
  onBack: () => void;
  onNavigate?: (page: PageType) => void;
}

type PageType = 'intro' | 'onboarding' | 'home' | 'analysis' | 'upload' | 'results' | 'profile' | 'auth' | 'analysis-view' | 'previous-analyses' | 'glowup-map' | 'hairstyles';

export default function ProfilePage({ onBack, onNavigate }: ProfilePageProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);
  const [showTermsOfServiceModal, setShowTermsOfServiceModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [percentile, setPercentile] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, isPremium } = useAuth();

  // Function to calculate percentile based on best score
  const calculatePercentile = (score: number): number => {
    if (score >= 1 && score <= 10) return 1;
    if (score >= 11 && score <= 20) return 2;
    if (score >= 21 && score <= 30) return 5;
    if (score >= 31 && score <= 40) return 9;
    if (score >= 41 && score <= 50) return 16;
    if (score >= 51 && score <= 60) return 20;
    if (score >= 61 && score <= 70) return 18;
    if (score >= 71 && score <= 80) return 15;
    if (score >= 81 && score <= 90) return 9;
    if (score >= 91 && score <= 100) return 5;
    return 1; // fallback
  };

  // Load user statistics
  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Load analysis history to get count and best score
        const { ok, data } = await getHistory({ userId: user.id, limit: 100 });
        if (ok && data) {
          setAnalysisCount(data.length);
          
          // Find the best overall score
          if (data.length > 0) {
            const scores = data.map(analysis => analysis.analysis?.overall || 0);
            const maxScore = Math.max(...scores);
            if (maxScore > 0) {
              setBestScore(maxScore);
              setPercentile(calculatePercentile(maxScore));
            } else {
              setBestScore(null);
              setPercentile(null);
            }
          } else {
            setBestScore(null);
            setPercentile(null);
          }
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, [user]);

  const getLanguageDisplay = () => {
    return language === 'en' ? t.english : t.spanish;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black p-4 pb-20">
      <div className="max-w-md mx-auto">
        {!user ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">Please sign in to view your profile</p>
            <GradientButton onClick={onBack}>
              Go Back
            </GradientButton>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <button
            onClick={onBack}
            className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">{t.profile}</h1>
          <button 
            onClick={() => setShowContactModal(true)}
            className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-colors duration-200"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 mb-6 animate-fade-in">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'}
                </h2>
              <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-emerald-400 text-sm">Online</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Camera className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : analysisCount}
              </div>
              <div className="text-slate-400 text-sm">{t.analysis}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : bestScore !== null ? Math.round(bestScore) : '-'}
              </div>
              <div className="text-slate-400 text-sm">{t.bestScore}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : percentile !== null ? `${percentile}%` : '-'}
              </div>
              <div className="text-slate-400 text-sm">% of analyzed faces</div>
            </div>
          </div>
          
          {/* Premium Status */}
          {isPremium && (
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-2xl border border-yellow-400/20">
              <div className="flex items-center justify-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Premium Member</span>
              </div>
            </div>
          )}
        </div>

        {/* Account Section */}
        <div className="mb-6">
          <h3 className="text-white font-semibold text-lg mb-4">{t.account}</h3>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden animate-slide-up">
            <button 
              onClick={() => setShowEditProfileModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">{t.editProfile}</div>
                  <div className="text-slate-400 text-sm">{t.updatePersonalInfo}</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <div className="border-t border-slate-700/50"></div>

            <button 
              onClick={() => setShowLanguageModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Languages className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">{t.language}</div>
                  <div className="text-slate-400 text-sm">{t.currentLanguage.replace('English', getLanguageDisplay()).replace('Español', getLanguageDisplay())}</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <div className="border-t border-slate-700/50"></div>

            <button 
              onClick={async () => {
                await signOut();
                onBack();
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">Sign Out</div>
                  <div className="text-slate-400 text-sm">Sign out of your account</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Legal Section */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">{t.legal}</h3>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden animate-slide-up">
            <button 
              onClick={() => setShowTermsOfServiceModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">{t.termsOfService}</div>
                  <div className="text-slate-400 text-sm">View our terms and conditions</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <div className="border-t border-slate-700/50"></div>

            <button 
              onClick={() => setShowPrivacyPolicyModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">{t.privacyPolicy}</div>
                  <div className="text-slate-400 text-sm">How we protect your data</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <div className="border-t border-slate-700/50"></div>

            <button 
              onClick={() => setShowContactModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">{t.contactSupport}</div>
                  <div className="text-slate-400 text-sm">Get help and support</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
          </>
        )}
      </div>

      <LanguageModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />

      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />

      <PrivacyPolicyModal
        isOpen={showPrivacyPolicyModal}
        onClose={() => setShowPrivacyPolicyModal(false)}
      />

      <TermsOfServiceModal
        isOpen={showTermsOfServiceModal}
        onClose={() => setShowTermsOfServiceModal(false)}
      />

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}