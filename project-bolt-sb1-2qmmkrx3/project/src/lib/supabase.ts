import { createClient } from "@supabase/supabase-js";
import { readEnv } from "./envDebug";

const { url, anon, ok } = readEnv();

// Simple console hints so we SEE what the app read from .env
console.log("SUPABASE_URL =", url || "(empty)");
console.log("SUPABASE_KEY starts with =", (anon || "").slice(0, 10) || "(empty)");

if (!ok) {
  // Fail fast with a friendly error if envs look wrong
  throw new Error("Missing or invalid Supabase .env values. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});