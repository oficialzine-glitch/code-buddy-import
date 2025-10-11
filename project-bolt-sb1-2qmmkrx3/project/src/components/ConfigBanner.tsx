import React from "react";
import { readEnv } from "../lib/envGuard";

export default function ConfigBanner() {
  const { url, anon, looksOk } = readEnv();
  return (
    <div className="text-xs bg-white/5 border border-white/10 text-white rounded-lg p-2">
      <div>SUPABASE_URL: {url || "(empty)"}</div>
      <div>SUPABASE_KEY starts: {(anon || "").slice(0, 10) || "(empty)"}…</div>
      <div>Config status: {looksOk ? "OK" : "POSSIBLE ERROR"}</div>
    </div>
  );
}