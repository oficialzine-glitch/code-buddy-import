import React, { useState } from "react";
import { readEnv, testHealth, testSignInRaw } from "../lib/envDebug";

export default function SupabaseDebug() {
  const { url, anon, ok } = readEnv();
  const [out, setOut] = useState<string>("");

  async function run() {
    const lines: string[] = [];
    lines.push(`URL: ${url || "(empty)"}`);
    lines.push(`KEY starts: ${(anon || "").slice(0, 10) || "(empty)"}...`);
    lines.push(`ENV looks: ${ok ? "OK" : "BAD"}`);

    const h = await testHealth(url, anon);
    lines.push(`Health -> status: ${h.status}, ok: ${h.ok}, body/error: ${h.body || h.error}`);

    const s = await testSignInRaw(url, anon);
    lines.push(`Raw sign-in -> status: ${s.status}, ok: ${s.ok}, body/error: ${s.body || s.error}`);

    setOut(lines.join("\n"));
  }

  return (
    <div className="p-3 rounded-lg border border-white/10 bg-white/5 text-xs text-white space-y-2">
      <div className="font-semibold">Supabase Debug</div>
      <button onClick={run} className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500">Run tests</button>
      <pre className="whitespace-pre-wrap break-words max-h-60 overflow-auto">{out}</pre>
      {!ok && (
        <div className="text-amber-300">
          Config error: Revisa tu archivo <code>.env</code> (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).
          Sin comillas, sin espacios, con <code>https://</code>.
        </div>
      )}
    </div>
  );
}