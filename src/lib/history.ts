// src/lib/history.ts
import { supabase } from "./supabaseClient";

const TABLE = "facial_analyses";
const MAX_STORED_ANALYSES = 10;

export type AnalysisRow = {
  id: string;
  user_id: string;
  created_at: string;
  image_url: string | null;
  storage_path?: string | null; // Preferred: path in bucket
  analysis: any;          // JSONB payload we store
  overall_score: number;  // integer 0..100 (NOT NULL in DB)
};

// Clamp to 0..100, fallback to 0 if missing
const toScore = (n: unknown) => {
  const v = Number(n);
  return Number.isFinite(v) ? Math.min(100, Math.max(0, Math.round(v))) : 0;
};

export async function saveAnalysis(opts: { userId: string; imageUrl?: string | null; analysis: any }) {
  const { userId, imageUrl = null, analysis } = opts;

  // ✅ send an explicit integer for overall_score
  const overall = toScore(analysis?.overall);

  const { error: insertErr } = await supabase
    .from(TABLE)
    .insert([{ user_id: userId, image_url: imageUrl, analysis, overall_score: overall }]);

  if (insertErr) {
    console.error("Failed to save analysis to history:", insertErr);
    return { ok: false, error: insertErr.message };
  }

  // Keep only the newest 10 rows for this user
  const { data: rows } = await supabase
    .from(TABLE)
    .select("id,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const toDelete = (rows ?? []).slice(10).map(r => r.id);
  if (toDelete.length) {
    const { error: delErr } = await supabase.from(TABLE).delete().in("id", toDelete);
    if (delErr) console.error("history cleanup error:", delErr);
  }

  return { ok: true };
}

export async function checkStorageLimit(opts: { userId: string }): Promise<{ atLimit: boolean; count: number }> {
  const { userId } = opts;
  const { data, error } = await supabase
    .from(TABLE)
    .select("id", { count: 'exact' })
    .eq("user_id", userId);

  if (error) {
    console.error("Error checking storage limit:", error);
    return { atLimit: false, count: 0 };
  }

  const count = data?.length || 0;
  return { atLimit: count >= MAX_STORED_ANALYSES, count };
}

export async function getHistory(opts: { userId: string; limit?: number }) {
  const { userId, limit = 10 } = opts;
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, user_id, created_at, image_url, storage_path, analysis, overall_score")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error loading analysis history:", error);
    return { ok: false, error: error.message, data: [] as AnalysisRow[] };
  }
  return { ok: true, data: data ?? [] };
}

export async function deleteAnalysis(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) {
    console.error("deleteAnalysis error:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
