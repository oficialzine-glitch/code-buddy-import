import React, { useState } from 'react';
import { Scan, History, User, Crown, Sparkles, BarChart3 } from 'lucide-react';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import IntroductionPage from './pages/IntroductionPage';
import ResultsPage from './pages/ResultsPage';
import AnalysisViewPage from './pages/AnalysisViewPage';
import PreviousAnalysesPage from './pages/PreviousAnalysesPage';
import GlowupMapPage from './pages/GlowupMapPage';
import OnboardingPage from './pages/OnboardingPage';
import PremiumModal from './components/PremiumModal';
import ReviewPromptModal from './components/ReviewPromptModal';
import LoadingSpinner from './components/LoadingSpinner';
import CreatorCodeModal from './components/CreatorCodeModal';
import { FacialAnalysis } from './types';
import { useAuth } from './contexts/AuthContext';

type PageType = 'intro' | 'onboarding' | 'home' | 'analysis' | 'upload' | 'results' | 'profile' | 'auth' | 'analysis-view' | 'previous-analyses' | 'glowup-map' | 'hairstyles';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('intro');
  const [analysisData, setAnalysisData] = useState<FacialAnalysis | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [showCreatorCodeModal, setShowCreatorCodeModal] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [logoTapTimer, setLogoTapTimer] = useState<NodeJS.Timeout | null>(null);
  const [analysisCount, setAnalysisCount] = useState(0);
  const { user, loading, isPremium, canStartAnalysis } = useAuth();

  // Redirect authenticated users to home page
  React.useEffect(() => {
    if (user && ['intro', 'onboarding', 'auth'].includes(currentPage)) {
      setCurrentPage('analysis');
    }
  }, [user, currentPage]);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center">
        <LoadingSpinner message="Loading your account..." />
      </div>
    );
  }

  // Show auth page if user is not authenticated
  if (!user) {
    if (currentPage === 'intro') {
      return <IntroductionPage 
        onGetStarted={() => setCurrentPage('onboarding')} 
        onSignIn={() => setCurrentPage('auth')}
      />;
    }
    if (currentPage === 'onboarding') {
      return <OnboardingPage onComplete={() => setCurrentPage('auth')} />;
    }
    return <AuthPage onBack={() => setCurrentPage('intro')} />;
  }

  const handleNavigateWithData = (page: PageType, data?: FacialAnalysis) => {
    if (data) {
      setAnalysisData(data);
    }
    setCurrentPage(page);
  };

  const handleNavigate = (page: PageType) => {
    // Block navigation to upload page if free user has reached limit
    if (page === 'upload' && !isPremium && !canStartAnalysis()) {
      setShowPremiumModal(true);
      return;
    }
    
    // Check if user is coming back from analysis page to home
    // Show review prompt every 3rd analysis (1st, 4th, 7th, etc.)
    if (currentPage === 'upload' && page === 'analysis' && analysisCount > 0 && (analysisCount - 1) % 3 === 0) {
      setShowReviewPrompt(true);
    }
    setCurrentPage(page);
  };

  const handleAnalysisComplete = () => {
    setAnalysisCount(prev => prev + 1);
  };

  const handleLogoTap = () => {
    setLogoTapCount(prev => prev + 1);
    
    // Clear existing timer
    if (logoTapTimer) {
      clearTimeout(logoTapTimer);
    }
    
    // Set new timer to reset count after 20 seconds
    const newTimer = setTimeout(() => {
      setLogoTapCount(0);
    }, 20000);
    setLogoTapTimer(newTimer);
    
    // Check if we've reached 10 taps
    if (logoTapCount + 1 >= 10) {
      setShowCreatorCodeModal(true);
      setLogoTapCount(0);
      if (logoTapTimer) {
        clearTimeout(logoTapTimer);
      }
    }
  };

  const renderPage = () => {
    let page;
    switch (currentPage) {
      case 'analysis':
        page = <HomePage onNavigate={handleNavigate} />;
        break;
      case 'upload':
        page = <AnalysisPage onBack={() => handleNavigate('analysis')} onNavigate={handleNavigate} onAnalysisComplete={handleAnalysisComplete} />;
        break;
      case 'profile':
        page = <ProfilePage onBack={() => setCurrentPage('home')} onNavigate={setCurrentPage} />;
        break;
      case 'results':
        page = <ResultsPage onNavigate={handleNavigateWithData} />;
        break;
      case 'analysis-view':
        page = <AnalysisViewPage onBack={() => setCurrentPage('results')} analysisData={analysisData} />;
        break;
      case 'previous-analyses':
        page = <PreviousAnalysesPage onBack={() => setCurrentPage('analysis')} />;
        break;
      case 'glowup-map':
        page = <GlowupMapPage onBack={() => setCurrentPage('home')} />;
        break;
      default:
        page = <HomePage onNavigate={setCurrentPage} />;
    }
    
    return (
      <div key={currentPage} className="animate-fade-in">
        {page}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-black">
      {/* Top Navigation Bar */}
      {(['analysis', 'home', 'glowup-map', 'results', 'profile'].includes(currentPage)) && (
        <div className="flex justify-between items-center mb-4 pt-4 px-4">
          {/* App Name - Top Left */}
          <div>
            <h1 className="text-xl font-bold">
              <span 
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent cursor-pointer select-none"
                onClick={handleLogoTap}
              >
                Next
              </span>
              <span className="text-white">Face AI</span>
            </h1>
          </div>
          
          {/* Top Right Buttons */}
          <div className="flex items-center space-x-2">
            {/* Premium Button */}
            <button
              onClick={() => setShowPremiumModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm rounded-full shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <Crown className="w-4 h-4" />
              <span>Premium</span>
            </button>
          </div>
        </div>
      )}

      {renderPage()}
      
      {/* Static Bottom Navigation - Only show on main pages, not on special pages */}
      {!['upload', 'previous-analyses'].includes(currentPage) && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-black/20 backdrop-blur-sm z-50 pointer-events-none">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-1 border border-slate-700/50 pointer-events-auto">
                <button
                  onClick={() => setCurrentPage('analysis')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    currentPage === 'analysis' || currentPage === 'home'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Scan className="w-4 h-4 inline mr-1" />
                  Analysis
                </button>
                <button
                  onClick={() => setCurrentPage('glowup-map')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    currentPage === 'glowup-map'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Glowup
                </button>
                <button
                  onClick={() => setCurrentPage('results')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    currentPage === 'results'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4 inline mr-1" />
                  Results
                </button>
                <button
                  onClick={() => setCurrentPage('profile')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    currentPage === 'profile'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-1" />
                  Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
      />

      {/* Creator Code Modal */}
      <CreatorCodeModal 
        isOpen={showCreatorCodeModal} 
        onClose={() => setShowCreatorCodeModal(false)} 
      />

      {/* Review Prompt Modal */}
      <ReviewPromptModal 
        isOpen={showReviewPrompt} 
        onClose={() => setShowReviewPrompt(false)} 
      />
    </div>
  );
}

export default App;