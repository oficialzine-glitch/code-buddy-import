import React, { useState, useEffect } from 'react';
import { Sparkles, Scissors, BarChart3, Scan, History, Camera, Users, TrendingUp, User, X, Crown, Languages, Globe, Trophy, Shield, Star } from 'lucide-react';
import { getHistory } from '../lib/history';
import GradientButton from '../components/GradientButton';
import PremiumModal from '../components/PremiumModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import appFotoImage from '../assets/neon-face-scan.png';
import mapImage from '../assets/map.webp';

interface HomePageProps {
  onNavigate: (page: 'analysis' | 'hairstyles' | 'results' | 'profile' | 'auth' | 'upload') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [percentile, setPercentile] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { user, isPremium, canStartAnalysis, syncFreeAnalysisCount } = useAuth();

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
          const count = data.length;
          setAnalysisCount(count);
          
          // Sync the local analysis count to ensure consistency
          syncFreeAnalysisCount(count);
          
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

  const renderJoinPremiumButton = () => (
    null
  );

  const renderAnalysisTab = () => (
    <div className="max-w-2xl mx-auto pb-20 bg-transparent">
      {/* Face Scan Image */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          {/* Subtle glowing border */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/40 to-cyan-500/30 rounded-2xl blur-sm scale-[1.02] pointer-events-none"></div>
          
          {/* Main image */}
          <img 
            src={appFotoImage}
            alt="AI Face Analysis"
            className="relative z-10 w-full max-w-md mx-auto rounded-2xl shadow-lg border border-cyan-500/20"
          />
        </div>
      </div>

      {/* Start Analysis Button */}
      <div className="text-center mb-8">
        <button
          onClick={() => {
            if (isPremium || canStartAnalysis()) {
              onNavigate('upload');
            } else {
              setShowPremiumModal(true);
            }
          }}
          className="px-8 py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-pulse-glow"
        >
          {t.startAIAnalysis}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 text-center">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">93%</div>
          <div className="text-slate-400 text-xs">Positive feedback</div>
        </div>
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 text-center">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">4.9</div>
          <div className="text-slate-400 text-xs">{t.rating}</div>
        </div>
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 text-center">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">92.6%</div>
          <div className="text-slate-400 text-xs">{t.precision}</div>
        </div>
      </div>

      {/* Glowup Map Promotional Image */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="relative inline-block group cursor-pointer hover:scale-105 transition-all duration-300">
          <img 
            src={mapImage}
            alt="Glowup Map - Your personalized transformation roadmap"
            className="w-full max-w-lg mx-auto rounded-2xl shadow-lg shadow-blue-500/20 border border-blue-500/20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 right-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <h3 className="text-white font-bold text-xl mb-2">Discover Your Glowup Map</h3>
            <p className="text-blue-200 text-sm">Get your personalized transformation roadmap</p>
          </div>
        </div>
      </div>

      {/* Glowup Map Button */}
      <div className="text-center mb-8">
        <button
          onClick={() => {
            if (isPremium || canStartAnalysis()) {
              onNavigate('upload');
            } else {
              setShowPremiumModal(true);
            }
          }}
          className="px-8 py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Get Your Glowup Map
        </button>
      </div>

      {/* Why Choose Section */}
      <div className="bg-gradient-to-br from-slate-800/80 via-blue-900/40 to-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-blue-500/30 shadow-2xl shadow-blue-500/20 mb-8">
        {/* Header with Social Proof */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Powered by OpenAI's GPT-5 for strong results.
          </h3>
          <p className="text-blue-200/80 text-sm">Trusted by users worldwide • 4.9★ Rating</p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Scientific Accuracy */}
          <div className="bg-gradient-to-br from-blue-600/20 via-cyan-500/15 to-blue-600/20 rounded-2xl p-4 border border-blue-400/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold">92.6% Accuracy</h4>
                <p className="text-cyan-300 text-sm">Scientific Precision</p>
              </div>
            </div>
            <p className="text-blue-100/90 text-sm leading-relaxed mb-3">
              Analyzes <span className="text-cyan-300 font-semibold">127 facial points</span> with advanced AI for precise results.
            </p>
            <div className="flex items-center text-xs text-cyan-300">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              Scientifically validated
            </div>
          </div>

          {/* Instant Results */}
          <div className="bg-gradient-to-br from-indigo-600/20 via-blue-500/15 to-indigo-600/20 rounded-2xl p-4 border border-indigo-400/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold">1 Min Analysis</h4>
                <p className="text-blue-300 text-sm">Lightning Fast</p>
              </div>
            </div>
            <p className="text-blue-100/90 text-sm leading-relaxed mb-3">
              Get complete analysis in seconds with <span className="text-blue-300 font-semibold">instant</span> AI processing.
            </p>
            <div className="flex items-center text-xs text-blue-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              Immediate results
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-gradient-to-br from-purple-600/20 via-indigo-500/15 to-purple-600/20 rounded-2xl p-4 border border-purple-400/30 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold">100% Private</h4>
                <p className="text-purple-300 text-sm">Your Data Protected</p>
              </div>
            </div>
            <p className="text-blue-100/90 text-sm leading-relaxed mb-3">
              Photos <span className="text-purple-300 font-semibold">only stored</span>, to show you previous analysis with complete privacy.
            </p>
            <div className="flex items-center text-xs text-purple-300">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              GDPR Compliant
            </div>
          </div>

          {/* Personalized Insights */}
          <div className="bg-gradient-to-br from-cyan-600/20 via-teal-500/15 to-cyan-600/20 rounded-2xl p-4 border border-cyan-400/30 hover:border-teal-400/50 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold">Personalized Tips</h4>
                <p className="text-teal-300 text-sm">Tailored For You</p>
              </div>
            </div>
            <p className="text-blue-100/90 text-sm leading-relaxed mb-3">
              Get <span className="text-teal-300 font-semibold">custom recommendations</span> based on your unique features.
            </p>
            <div className="flex items-center text-xs text-teal-300">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              AI-powered advice
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600/15 via-cyan-500/10 to-blue-600/15 rounded-2xl p-4 border border-cyan-400/20 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-400/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm font-medium">Limited Time: Analysis + Glowup Map</span>
            </div>
          </div>
          <h4 className="text-white font-bold text-lg mb-2">Ready to Discover Your Potential?</h4>
          <p className="text-slate-300 text-sm mb-3">Join thousands who've transformed their confidence</p>
          <div className="flex items-center justify-center space-x-4 text-xs text-blue-300">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>Worldwide Users</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              <span>4.9 Rating by beta users</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              <span>92% Precision</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHairstylesTab = () => (
    <div className="max-w-2xl mx-auto pb-20 bg-transparent">
      {/* Hairstyles tab content will be added here */}
    </div>
  );

  const renderResultsTab = () => (
    <div className="max-w-2xl mx-auto pb-20 bg-transparent">
      {/* Results page content will be redesigned */}
      <div className="text-center py-12">
        <p className="text-slate-400">Results page - Coming soon with better design</p>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="max-w-2xl mx-auto pb-20 bg-transparent">
      {user ? (
        <>
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
          </div>
        </>
      ) : (
          /* This should never show since non-authenticated users see AuthPage */
          null
      )}

      {/* Account Section */}
      {user && <div className="mb-6">
        <h3 className="text-white font-semibold text-lg mb-4">{t.account}</h3>
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden animate-slide-up">
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-white font-medium">{t.editProfile}</div>
                <div className="text-slate-400 text-sm">{t.updatePersonalInfo}</div>
              </div>
            </div>
          </button>

          <div className="border-t border-slate-700/50"></div>

          <button 
            onClick={() => setShowPremiumModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-left">
                <div className="text-white font-medium">Premium Settings</div>
                <div className="text-slate-400 text-sm">Manage your premium subscription</div>
              </div>
            </div>
          </button>
          <div className="border-t border-slate-700/50"></div>

          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Languages className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="text-white font-medium">{t.language}</div>
                <div className="text-slate-400 text-sm">{t.currentLanguage}</div>
              </div>
            </div>
          </button>
        </div>
      </div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black p-4 pb-20">
      <div className="max-w-4xl mx-auto">

        {/* Tab Content */}
        {renderAnalysisTab()}

        {/* Premium Modal */}
        {showPremiumModal && (
          <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
        )}
      </div>
    </div>
  );
}