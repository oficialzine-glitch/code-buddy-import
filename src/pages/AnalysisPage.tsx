import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResults from '../components/AnalysisResults';
import PremiumModal from '../components/PremiumModal';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { saveAnalysis } from '../lib/history';
import exampleSelfie from '../assets/example-selfie.png';
import exampleSelfieBad from '../assets/example-selfie-bad.png';

interface AnalysisPageProps {
  onBack: () => void;
  onNavigate?: (page: PageType) => void;
}

type PageType = 'intro' | 'onboarding' | 'home' | 'analysis' | 'upload' | 'results' | 'profile' | 'auth' | 'analysis-view' | 'previous-analyses' | 'glowup-map' | 'hairstyles';

export default function AnalysisPage({ onBack, onNavigate }: AnalysisPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPremium, user } = useAuth();
  const { isAnalyzing, analysis, analyzeImage } = useImageProcessing();
  const { t } = useLanguage();

  const exampleImages = [
    { src: exampleSelfie, icon: Check, color: 'text-green-500' },
    { src: exampleSelfieBad, icon: X, color: 'text-red-500' }
  ];

  useEffect(() => { console.log("MOUNT:", "src/pages/AnalysisPage.tsx"); }, []);

  useEffect(() => {
    if (!selectedImage) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % exampleImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedImage, exampleImages.length]);

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

  const CurrentIcon = exampleImages[currentImageIndex].icon;

  return (
    <div className="min-h-screen bg-black p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Upload Section */}
        {!selectedImage && (
          <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
            {/* Image Placeholder with Overlay */}
            <div className="relative max-w-sm w-full">
              <img
                src={exampleImages[currentImageIndex].src}
                alt="Example selfie"
                className="w-full h-auto object-contain rounded-2xl transition-opacity duration-500"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-3">
                <CurrentIcon className={`w-8 h-8 ${exampleImages[currentImageIndex].color}`} strokeWidth={3} />
              </div>
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