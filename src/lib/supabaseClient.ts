// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Use your external Supabase project
const SUPABASE_URL = "https://hebwatwkpszebonmrige.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYndhdHdrcHN6ZWJvbm1yaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjkyNzQsImV4cCI6MjA3MDgwNTI3NH0.8nzmRDHCn5Z8deJ5hHOAeSf4K80GkzXd-sisVLikE64";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
