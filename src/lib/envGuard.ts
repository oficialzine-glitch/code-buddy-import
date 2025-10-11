export function readEnv() {
  const url = (import.meta.env.VITE_SUPABASE_URL || "").trim();
  const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
  const looksOk =
    url.startsWith("https://") &&
    url.includes(".supabase.co") &&
    anon.length > 40;
  return { url, anon, looksOk };
}

export async function pingSupabase(url: string, anon: string) {
  // Minimal reachability checks (no auth required)
  try {
    const r = await fetch(`${url}/auth/v1/health`, { method: "GET" });
    const txt = await r.text();
    return { ok: r.ok || txt === "ok", status: r.status, body: txt };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}

export function humanReadableConnectivityError(envOk: boolean) {
  if (!envOk) {
    return "Config error: Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (no quotes/spaces, with https://).";
  }
  return "Could not connect to Supabase. Try in private window (no extensions), or enable CORS=* in Supabase (Settings → API → CORS).";
}