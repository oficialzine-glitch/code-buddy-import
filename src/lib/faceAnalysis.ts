// src/lib/faceAnalysis.ts — Updated for GPT-5 analysis

import { resizeToMax1080 } from './resizeImage';

export type SymmetryBlock = {
  score: number;
  faceSymmetryPct?: number;
  eyeHeightDiffPx?: number;
  mouthCornerTiltDeg?: number;
};

export type ProportionsBlock = {
  score: number;
  thirdsBalance?: string;      // e.g., "balanced", "slightly long midface"
  widthToHeight?: number;      // e.g., 1.39
};

export type NoseBlock = {
  score: number;
  widthRel?: "narrow" | "average" | "slightly wide" | "wide";
  lengthRel?: "short" | "average" | "long";
  deviation?: "straight" | "mild left" | "mild right";
  bridgeShape?: "straight" | "slight hump" | "saddle" | "other";
};

export type LipsMouthBlock = {
  score: number;
  upperLowerRatio?: number;    // e.g., 0.6 (upper/lower or lower/upper depending on backend)
  mouthWidthRel?: "narrow" | "average" | "wide";
  philtrumLabel?: "short" | "normal" | "long";
};

export type AgeEstimateBlock = {
  years: number;
  range?: string;              // "19–23"
  confidence?: "low" | "medium" | "high";
};

export type SkinReportBlock = {
  score: number;
  acne?: "none" | "mild" | "moderate" | "severe";
  redness?: "none" | "mild" | "moderate" | "severe";
  darkCircles?: "none" | "mild" | "moderate" | "severe";
  texture?: "smooth" | "slightly uneven" | "uneven";
  oiliness?: "dry" | "balanced" | "oily" | "combination";
  toneEvenness?: "even" | "slightly uneven" | "uneven";
  areas?: Record<string, string>;
  notes?: string[];
};

export type AnalysisResult = {
  overall: number; 
  jawline: number; 
  cheekbones: number; 
  eyeArea: number; 
  skin: number;
  attractiveness: number; 
  symmetry: number; 
  age: number; 
  faceShape: string;
  ageFactors?: string[]; 
  percentile: number; 
  facialHarmony: number; 
  goldenRatio: number; 
  featureBalance: number;
  
  // New optional analysis blocks from GPT-5
  symmetryBlock?: SymmetryBlock;
  proportions?: ProportionsBlock;
  nose?: NoseBlock;
  lipsMouth?: LipsMouthBlock;
  ageEstimate?: AgeEstimateBlock;
  skinReport?: SkinReportBlock;
  
  // Index signature for future-proofing
  [key: string]: any;
};

// Use your external Supabase project
const SUPABASE_URL = "https://hebwatwkpszebonmrige.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYndhdHdrcHN6ZWJvbm1yaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjkyNzQsImV4cCI6MjA3MDgwNTI3NH0.8nzmRDHCn5Z8deJ5hHOAeSf4K80GkzXd-sisVLikE64";
const GPT5_ANALYSIS_URL = `${SUPABASE_URL}/functions/v1/gpt5-analysis`;
const GPT5_PREVIEW_URL = `${SUPABASE_URL}/functions/v1/gpt5-overall-preview`;

async function fileToBase64Data(file: File): Promise<string> {
  try {
    // Resize the image first
    const { dataUrl } = await resizeToMax1080(file);
    const idx = dataUrl.indexOf("base64,");
    return idx >= 0 ? dataUrl.slice(idx + 7) : dataUrl;
  } catch (error) {
    throw new Error("Could not process image: " + (error as Error).message);
  }
}

export async function analyzeFacialFeatures(file: File, isPremium: boolean = false): Promise<AnalysisResult> {
  const image_base64 = await fileToBase64Data(file);

  // All users now use the same full analysis endpoint
  const endpoint = GPT5_ANALYSIS_URL;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY
    },
    body: JSON.stringify({ image_base64 })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GPT-5 analysis failed: ${res.status}${text ? ` - ${text}` : ""}`);
  }

  const data = await res.json();

  // Parse GPT-5 analysis response
  const analysis = data?.analysis;
  if (!analysis || typeof analysis !== "object") {
    throw new Error("Invalid response from GPT-5 analysis. Please try again with a clear, front-facing photo.");
  }

  // Log all keys to debug what we're receiving
  console.log("GPT-5 analysis keys:", Object.keys(analysis));

  // ✅ IMPORTANT: return what the Edge Function sent, without rebuilding a subset
  console.log("Final analysis result keys:", Object.keys(analysis));
  return analysis as any;
}

/* ---------- Tips helper (exported) ---------- */
export function generatePersonalizedTips(scores: {
  skin?: number; jawline?: number; cheekbones?: number; eyeArea?: number;
  attractiveness?: number; overall?: number;
}) {
  const TIP_BANK = {
    skin: [
      "Use SPF 30+ daily to protect your skin from UV damage",
      "Stay hydrated and get 7–8 hours of quality sleep",
      "Consider a gentle vitamin C serum for brightness",
      "Moisturize consistently morning and night"
    ],
    jawline: [
      "Maintain good posture with chin parallel to ground",
      "Try facial massage to reduce puffiness",
      "Reduce sodium intake before important photos",
      "Light beard stubble can enhance jawline definition"
    ],
    cheekbones: [
      "Use subtle contouring to emphasize natural cheekbones",
      "Practice facial massage or gua sha to reduce puffiness",
      "Maintain a healthy body fat percentage for definition"
    ],
    eyeArea: [
      "Apply cool compress in the morning to reduce puffiness",
      "Use caffeine or retinol-based eye products",
      "Stick to a consistent sleep schedule for brighter eyes"
    ],
    attractiveness: [
      "Keep hair neat and well-groomed",
      "Wear clothes that fit your body type well",
      "Practice confident posture and genuine smiles"
    ],
    overall: [
      "Maintain a balanced diet and regular exercise routine",
      "Develop a consistent grooming and skincare routine",
      "Remember that confidence is your most attractive feature"
    ]
  } as const;

  const thresholds = { 
    skin: 65, 
    jawline: 65, 
    cheekbones: 65, 
    eyeArea: 65, 
    attractiveness: 70, 
    overall: 70 
  };

  const keys = (["skin","jawline","cheekbones","eyeArea","attractiveness","overall"] as const)
    .filter(k => Number(scores[k]) < (thresholds as any)[k])
    .sort((a,b) => (Number(scores[a]) || 0) - (Number(scores[b]) || 0))
    .slice(0, 3);

  const tips = keys.map(k => {
    const bank = TIP_BANK[k];
    return bank[Math.floor(Math.random() * bank.length)];
  });

  return tips.length ? tips : [
    "Your features are well balanced—maintain your current routine",
    "Stay consistent with sleep, hydration, and sun protection"
  ];
}