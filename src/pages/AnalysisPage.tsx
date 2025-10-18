import React, { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft, Upload } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResults from '../components/AnalysisResults';
import PremiumModal from '../components/PremiumModal';
import StorageWarningModal from '../components/StorageWarningModal';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { saveAnalysis, checkStorageLimit } from '../lib/history';

interface AnalysisPageProps {
  onBack: () => void;
  onNavigate?: (page: PageType) => void;
  onAnalysisComplete?: () => void;
}

type PageType = 'intro' | 'onboarding' | 'home' | 'analysis' | 'upload' | 'results' | 'profile' | 'auth' | 'analysis-view' | 'previous-analyses' | 'glowup-map' | 'hairstyles';

export default function AnalysisPage({ onBack, onNavigate, onAnalysisComplete }: AnalysisPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showStorageWarning, setShowStorageWarning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPremium, user, canStartAnalysis, incrementAnalysisCount } = useAuth();
  const { isAnalyzing, analysis, analyzeImage } = useImageProcessing();
  const { t } = useLanguage();

  useEffect(() => { console.log("MOUNT:", "src/pages/AnalysisPage.tsx"); }, []);

  const handleImageSelect = async (file: File) => {
    // Create temporary blob URL for preview only - NOT persisted
    const tempUrl = URL.createObjectURL(file);
    setSelectedImage(tempUrl);
    
    try {
      // Check storage limit for premium users before analysis
      if (user && isPremium) {
        const { atLimit } = await checkStorageLimit({ userId: user.id });
        if (atLimit) {
          setShowStorageWarning(true);
        }
      }

      const result = await analyzeImage(file, isPremium);
      
      // Increment analysis count for free users
      if (result && !isPremium) {
        incrementAnalysisCount();
      }
      
      // Mark first analysis as complete
      if (result && onAnalysisComplete) {
        onAnalysisComplete();
      }
      
      // Save analysis to history after successful completion
      if (result && user) {
        try {
          // Check storage limit before saving
          const { atLimit } = await checkStorageLimit({ userId: user.id });
          
          if (!atLimit) {
            const saveResult = await saveAnalysis({
              userId: user.id,
              imageUrl: tempUrl, // temporary blob URL - edge function will replace with storage path
              analysis: result
            });
            if (saveResult.ok) {
              console.log('Analysis saved to history successfully');
            } else {
              console.error('Failed to save analysis:', saveResult.error);
            }
          } else {
            // Show warning if at limit (analysis still shown, just not saved)
            setShowStorageWarning(true);
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
      // Check if user can start analysis (free users limited to 3)
      const canAnalyze = canStartAnalysis();
      
      if (!canAnalyze) {
        // Show premium modal if limit reached
        setShowPremiumModal(true);
        return;
      }
      
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 pt-4 animate-fade-in">
          <button
            onClick={onBack}
            className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-700/60 transition-all duration-300 mr-4 group"
          >
            <ArrowLeft className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors duration-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{t.facialAnalysis}</h1>
            <p className="text-slate-400">{t.aiPoweredAssessment}</p>
          </div>
        </div>

        {/* Upload Section */}
        {!selectedImage && (
          <div className="bg-gradient-to-br from-slate-800/60 via-blue-900/20 to-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-blue-500/20 mb-8 animate-slide-up shadow-lg shadow-blue-500/10">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 transition-all ${
                isDragging ? 'border-blue-400 bg-blue-400/10' : 'border-slate-600/50'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                {/* Camera Icon with Gradient Circle */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                    <Camera className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Upload Text */}
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold text-white">Upload Your Photo</h2>
                  <p className="text-slate-300 max-w-md text-sm leading-relaxed">
                    Tips for best results:<br />
                    <br />
                    • Face the camera directly<br />
                    • Ensure good, even lighting<br />
                    • Keep a neutral expression<br />
                    • Remove glasses or accessories
                  </p>
                </div>

                {/* Choose File Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/50"
                >
                  <Upload className="w-4 h-4 animate-bounce" />
                  Choose File
                </button>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
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
                showPremiumButton={true}
              />
            )}
          </div>
        )}
      </div>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      <StorageWarningModal isOpen={showStorageWarning} onClose={() => setShowStorageWarning(false)} />
    </div>
  );
}