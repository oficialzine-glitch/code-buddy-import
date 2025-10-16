import React, { useState, useRef, useEffect } from 'react';
import { Camera, Info, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResults from '../components/AnalysisResults';
import PremiumModal from '../components/PremiumModal';
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
  const [isDragging, setIsDragging] = useState(false);
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
    <div className="min-h-screen bg-black p-6 pb-20">
      <div className="max-w-2xl mx-auto">
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
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-cyan-400">Take a front selfie</h1>
              <p className="text-slate-400">For best results, face the camera directly in good lighting</p>
            </div>

            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-12 transition-all ${
                isDragging ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-600'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-cyan-400" />
                </div>
                <p className="text-slate-400 text-lg">No image selected</p>
                <p className="text-slate-500 text-sm">Drag and drop or use the button below</p>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-cyan-400 font-semibold text-lg mb-3">Tips for best results:</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Face the camera directly</li>
                    <li>• Ensure good, even lighting</li>
                    <li>• Keep a neutral expression</li>
                    <li>• Remove glasses or accessories</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg font-bold rounded-full transition-all duration-300 shadow-lg"
            >
              Select Image
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