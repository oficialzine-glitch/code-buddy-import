import React, { useState } from 'react';
import { useEffect } from 'react';
import { ArrowLeft, Crown, Calendar, X, Eye, Star, Sparkles } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResults from '../components/AnalysisResults';
import PremiumModal from '../components/PremiumModal';
import GradientButton from '../components/GradientButton';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { saveAnalysis } from '../lib/history';

interface AnalysisPageProps {
  onBack: () => void;
  onNavigate?: (page: PageType) => void;
}

type PageType = 'intro' | 'onboarding' | 'home' | 'analysis' | 'upload' | 'results' | 'profile' | 'auth' | 'analysis-view' | 'previous-analyses' | 'glowup-map' | 'hairstyles';

export default function AnalysisPage({ onBack, onNavigate }: AnalysisPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { isPremium, user } = useAuth();
  const { isAnalyzing, analysis, analyzeImage } = useImageProcessing();
  const { t } = useLanguage();

  useEffect(() => { console.log("MOUNT:", "src/pages/AnalysisPage.tsx"); }, []);

  const handleImageSelect = async (file: File) => {
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    
    try {
      const result = await analyzeImage(file, isPremium);
      
      // Save analysis to history after successful completion
      if (result && user) {
        try {
          const saveResult = await saveAnalysis({
            userId: user.id,
            imageUrl: url,
            analysis: result
          });
          if (saveResult.ok) {
            console.log('Analysis saved to history successfully');
          } else {
            console.error('Failed to save analysis:', saveResult.error);
          }
        } catch (error) {
          console.error('Failed to save analysis to history:', error);
          // Don't block UI - just log the error
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handlePremiumFeatureClick = () => setShowPremiumModal(true);

  const handleClearImage = () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage);
    setSelectedImage(null);
  };

  const getOverallGrade = (score: number) => {
    if (score >= 9) return { grade: 'A+', color: 'text-emerald-400' };
    if (score >= 8) return { grade: 'A', color: 'text-emerald-400' };
    if (score >= 7) return { grade: 'B+', color: 'text-yellow-400' };
    if (score >= 6) return { grade: 'B', color: 'text-yellow-400' };
    if (score >= 5) return { grade: 'C+', color: 'text-orange-400' };
    return { grade: 'C', color: 'text-red-400' };
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-4 pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-600/10 via-transparent to-transparent"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 pt-4 animate-fade-in">
          <button
            onClick={onBack}
            className="p-3 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-blue-400/50 hover:bg-slate-700/80 transition-all duration-300 group shadow-lg hover:shadow-blue-500/25"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors duration-300" />
          </button>
          {selectedImage && analysis && (
            <div className="px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-full flex items-center space-x-2 border border-blue-400/40 shadow-lg shadow-blue-500/20">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-semibold">AI Analysis</span>
            </div>
          )}
        </div>

        {/* Upload Section */}
        {!selectedImage && (
          <div className="relative animate-slide-up">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative bg-gradient-to-br from-slate-800/80 via-blue-900/30 to-slate-800/80 backdrop-blur-xl rounded-3xl p-10 border border-blue-400/30 shadow-2xl shadow-blue-500/20">
              {/* Title Section */}
              <div className="text-center mb-8 space-y-3">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-400/30 mb-4">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 text-sm font-medium">AI-Powered Analysis</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Upload Your Photo
                </h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Get instant AI-powered facial analysis with detailed insights and recommendations
                </p>
              </div>
              
              <ImageUpload onImageSelect={handleImageSelect} selectedImage={selectedImage} onClear={handleClearImage} />
              
              {/* Features */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center space-y-2 p-4 bg-slate-900/40 rounded-xl border border-slate-700/50">
                  <Eye className="w-5 h-5 text-cyan-400 mx-auto" />
                  <p className="text-xs text-slate-400">Face Detection</p>
                </div>
                <div className="text-center space-y-2 p-4 bg-slate-900/40 rounded-xl border border-slate-700/50">
                  <Sparkles className="w-5 h-5 text-blue-400 mx-auto" />
                  <p className="text-xs text-slate-400">AI Analysis</p>
                </div>
                <div className="text-center space-y-2 p-4 bg-slate-900/40 rounded-xl border border-slate-700/50">
                  <Star className="w-5 h-5 text-cyan-400 mx-auto" />
                  <p className="text-xs text-slate-400">Instant Results</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {selectedImage && (
          <div className="space-y-8 animate-fade-in">
            {isAnalyzing ? (
              <LoadingSpinner 
                message="Analyzing facial features and calculating scores…"
                imageSrc={selectedImage}
              />
            ) : analysis && (
              <AnalysisResults
                analysis={analysis}
                imageUrl={selectedImage}
                isPremium={isPremium}
              />
            )}

            {/* Detailed Feature Analysis (kept) */}
            {analysis && (
              <>
                {isPremium ? <></> : <></>}
              </>
            )}
          </div>
        )}
      </div>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  );
}