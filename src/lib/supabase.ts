import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase is optional in development. When env vars are absent the data layer
 * (lib/reports.ts) transparently falls back to bundled seed data, so the app
 * runs with zero configuration.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Browser/anon client — safe for read access governed by row-level security. */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

/**
 * Service-role client — server-only. Used by the agent and privileged API
 * routes to write reports / manage subscribers. Throws if misconfigured so we
 * never silently fail a write.
 */
export function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase service client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
