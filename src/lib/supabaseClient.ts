// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Use external Supabase project via environment variables
const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string;

if (!url || !anon) {
  // Fail fast to make configuration issues obvious during build/runtime
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.");
}

export const supabase = createClient(url, anon, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
