import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options: CookieOptions };
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./supabase";

/**
 * Cookie-bound Supabase client for App Router server components / route
 * handlers. Returns null when Supabase isn't configured so the app keeps
 * running in demo mode (read views fall back to seed data, writes are gated).
 */
export function createSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component where cookies are read-only — the
            // middleware refreshes the session, so this is safe to ignore.
          }
        },
      },
    }
  );
}
