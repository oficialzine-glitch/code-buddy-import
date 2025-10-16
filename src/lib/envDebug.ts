export function readEnv() {
  const url = (import.meta.env.VITE_SUPABASE_URL || "").trim();
  const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
  const ok = url.startsWith("https://") && url.includes(".supabase.co") && anon.length > 40;
  return { url, anon, ok };
}

// Test 1: /auth/v1/health (with apikey header so it never 401s)
export async function testHealth(url: string, anon: string) {
  try {
    const r = await fetch(`${url}/auth/v1/health`, {
      method: "GET",
      headers: { apikey: anon, Authorization: `Bearer ${anon}` }
    });
    const text = await r.text();
    return { ok: r.ok, status: r.status, body: text };
  } catch (e: any) {
    return { ok: false, status: 0, error: String(e?.message || e) };
  }
}

// Test 2: /auth/v1/token?grant_type=password (dummy creds, we just want a response)
export async function testSignInRaw(url: string, anon: string) {
  try {
    const r = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anon,
        Authorization: `Bearer ${anon}`,
      },
      body: JSON.stringify({ email: "dummy@example.com", password: "not-used" })
    });
    const text = await r.text();
    return { ok: r.ok, status: r.status, body: text.slice(0, 200) };
  } catch (e: any) {
    return { ok: false, status: 0, error: String(e?.message || e) };
  }
}