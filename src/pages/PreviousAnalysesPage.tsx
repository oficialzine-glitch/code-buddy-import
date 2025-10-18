import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Eye, Trash2, User } from 'lucide-react';
import { getHistory, deleteAnalysis, AnalysisRow } from '../lib/history';
import { useAuth } from '../contexts/AuthContext';
import AnalysisResults from '../components/AnalysisResults';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveImageSrc, publicUrlFromPath } from '../lib/storageHelpers';

interface PreviousAnalysesPageProps {
  onBack: () => void;
}

export default function PreviousAnalysesPage({ onBack }: PreviousAnalysesPageProps) {
  const [analyses, setAnalyses] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRow | null>(null);
  const { user, isPremium } = useAuth();

  useEffect(() => {
    loadAnalyses();
  }, [user]);

  const loadAnalyses = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { ok, data } = await getHistory({ userId: user.id, limit: 10 });
      if (ok) {
        setAnalyses(data);
      }
    } catch (error) {
      console.error('Error loading analysis history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await deleteAnalysis(analysisId);
        setAnalyses(prev => prev.filter(analysis => analysis.id !== analysisId));
      } catch (error) {
        console.error('Error deleting analysis:', error);
      }
    }
  };

  const handleViewAnalysis = (analysis: AnalysisRow) => {
    setSelectedAnalysis(analysis);
  };

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center">
        <LoadingSpinner message="Loading your analysis history..." />
      </div>
    );
  }

  // Show individual analysis view
  if (selectedAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8 pt-4 animate-fade-in">
            <button
              onClick={handleBackToList}
              className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-700/60 transition-all duration-300 mr-4 group"
            >
              <ArrowLeft className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors duration-300" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Analysis Details</h1>
              <p className="text-slate-400">
                {new Date(selectedAnalysis.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="animate-fade-in">
            <AnalysisResults
              analysis={selectedAnalysis.analysis}
              imageUrl={
                selectedAnalysis.storage_path
                  ? publicUrlFromPath(selectedAnalysis.storage_path)
                  : resolveImageSrc(selectedAnalysis.image_url)
              }
              isPremium={isPremium}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show analyses list
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4 animate-fade-in">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-700/60 transition-all duration-300 mr-4 group"
            >
              <ArrowLeft className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors duration-300" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Previous Analyses</h1>
              <p className="text-slate-400">View your facial analysis history</p>
            </div>
          </div>
          {analyses.length > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{analyses.length}</div>
              <div className="text-slate-400 text-sm">Total Analyses</div>
            </div>
          )}
        </div>

        {analyses.length === 0 ? (
          /* No Results State */
          <div className="text-center py-16 animate-slide-up">
            <div className="w-24 h-24 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No Analysis History</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
              You haven't completed any facial analyses yet. Start your first analysis to see your results here.
            </p>
            <button
              onClick={onBack}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Start First Analysis
            </button>
          </div>
        ) : (
          /* Analyses List */
          <div className="space-y-4 animate-slide-up">
            {analyses.map((analysis, index) => (
              <div
                key={analysis.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:scale-102"
              >
                <div className="flex items-center space-x-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    {analysis.image_url || analysis.storage_path ? (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 p-1 shadow-lg shadow-cyan-500/40">
                        <img 
                          src={
                            analysis.storage_path
                              ? publicUrlFromPath(analysis.storage_path)
                              : resolveImageSrc(analysis.image_url)
                          }
                          alt="Analysis thumbnail"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-lg">Facial Analysis</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-400">
                          {Math.round(analysis.analysis?.overall || 0)}
                        </div>
                        <div className="text-slate-400 text-xs">Overall Score</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-slate-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(analysis.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Mini score preview */}
                    {analysis.analysis?.scores && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {analysis.analysis.scores.slice(0, 3).map((score: any, scoreIndex: number) => (
                          <div key={scoreIndex} className="bg-slate-700/30 rounded-lg p-2">
                            <div className="text-white text-xs font-medium mb-1 truncate">
                              {score.label}
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                                style={{ width: `${Math.max(0, Math.min(100, score.score || 0))}%` }}
                              />
                            </div>
                            <div className="text-cyan-400 text-xs font-bold mt-1">
                              {Math.round(score.score || 0)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
                  <button
                    onClick={() => handleViewAnalysis(analysis)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteAnalysis(analysis.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 hover:text-red-300 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}