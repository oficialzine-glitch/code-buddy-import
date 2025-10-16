import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResults from '../components/AnalysisResults';
import PremiumModal from '../components/PremiumModal';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { saveAnalysis } from '../lib/history';
import exampleSelfie from '../assets/example-selfie.png';

interface AnalysisPageProps {
  onBack: () => void;
  onNavigate?: (page: PageType) => void;
}

type PageType = 'intro' | 'onboarding' | 'home' | 'analysis' | 'upload' | 'results' | 'profile' | 'auth' | 'analysis-view' | 'previous-analyses' | 'glowup-map' | 'hairstyles';

export default function AnalysisPage({ onBack, onNavigate }: AnalysisPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 pt-4">
          <button
            onClick={onBack}
            className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-700/60 transition-all duration-300 mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Upload Section */}
        {!selectedImage && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] space-y-4">
            <h1 className="text-2xl font-bold text-white">Take a front selfie</h1>
            
            {/* Image Placeholder */}
            <div className="relative max-w-sm w-full">
              <img
                src={exampleSelfie}
                alt="Example selfie"
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-sm py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg font-bold rounded-full transition-all duration-300 shadow-lg"
            >
              Pick an image
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />
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
          </div>
        )}
      </div>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  );
}