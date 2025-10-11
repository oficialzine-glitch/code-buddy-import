import React from "react";
import type { AgeEstimateBlock } from "../lib/faceAnalysis";

export default function AgeEstimateCard({ data }: { data?: AgeEstimateBlock }) {
  if (!data?.years) return null;
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Estimated Age</div>
        <div className="text-lg font-bold">{data.years} yrs</div>
      </div>
      <div className="mt-1 text-sm text-white/80">
        {data.range ? `Range: ${data.range}` : "Range: —"}
        {data.confidence ? ` • Confidence: ${data.confidence}` : ""}
      </div>
    </div>
  );
}