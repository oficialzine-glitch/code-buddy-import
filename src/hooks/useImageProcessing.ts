// src/hooks/useImageProcessing.ts
import { useState } from "react";
import {
  analyzeFacialFeatures,
  generatePersonalizedTips,
  type AnalysisResult,
  type SymmetryBlock,
  type ProportionsBlock,
  type NoseBlock,
  type LipsMouthBlock,
  type AgeEstimateBlock,
  type SkinReportBlock
} from "../lib/faceAnalysis";

// Match your existing UI types
export interface FacialAnalysis {
  overall?: number;
  jawline?: number;
  cheekbones?: number;
  eyeArea?: number;
  skin?: number;
  attractiveness?: number;
  faceShape?: string;
  age?: number;
  recommendations?: string[];
  ageFactors?: string[];
  percentile?: number;
  facialHarmony?: number;
  featureBalance?: number;

  // Legacy UI compatibility fields
  overallScore?: number;
  scores?: Array<{ key: string; label: string; score: number; raw?: number }>;

  // Existing advanced blocks
  symmetryBlock?: {
    score?: number;
    faceSymmetryPct?: number;
    eyeHeightDiffPx?: number;
    mouthCornerTiltDeg?: number;
  };

  goldenRatioBlock?: {
    score?: number;
    matchPct?: number;
    note?: string;
  };
  
  // Other analysis blocks from Edge Function
  proportions?: ProportionsBlock;
  nose?: NoseBlock;
  lipsMouth?: LipsMouthBlock;
  ageEstimate?: AgeEstimateBlock;
  skinReport?: SkinReportBlock;
  
}

const safe = (n: unknown, fallback = 0) =>
  Number.isFinite(n as number) ? (n as number) : fallback;

export function useImageProcessing() {               // ← named export (required)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FacialAnalysis | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function analyzeImage(file: File, isPremium: boolean = false) {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      let localPreview: string | null = null;
      try { 
        localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);
      } catch {}

      const result: AnalysisResult = await analyzeFacialFeatures(file, isPremium);

      // ❌ avoid: setAnalysis(transform(result)) or setAnalysis({ overall: result.overall, ... })
      setAnalysis(result); // ✅ keep all keys untouched

      // Temporary logs to verify (remove later if desired)
      console.log('ANALYSIS KEYS:', Object.keys(result));
      console.log('symmetry:', result.symmetry);
      console.log('goldenRatio:', result.goldenRatio);
      
      // Clean up preview blob URL once the edge function returns
      if (localPreview) {
        try { URL.revokeObjectURL(localPreview); } catch {}
        setPreviewUrl(null);
        localPreview = null;
      }

      return result;
    } catch (e: any) {
      const msg = e?.message || "Face analysis failed";
      setError(msg);
      throw e;
    } finally {
      setIsAnalyzing(false);
    }
  }

  return { isAnalyzing, error, analysis, previewUrl, analyzeImage };
}

export default useImageProcessing;                    // ← default export too

