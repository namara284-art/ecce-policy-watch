import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { siteUrl } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sends a passwordless magic-link / OTP email to start a session. */
export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Accounts require Supabase to be configured for this deployment." },
      { status: 503 }
    );
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${siteUrl()}/auth/callback` },
    });
    if (error) {
      // Surface a useful message — Supabase AuthError props aren't enumerable,
      // so naive serialization yields "{}". Log the full error for Vercel logs.
      console.error("signInWithOtp failed:", error);
      const detail =
        error.message?.trim() ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).code ||
        error.name ||
        `Sign-in failed (status ${error.status ?? "unknown"})`;
      return NextResponse.json({ error: detail }, { status: error.status || 500 });
    }
  } catch (e) {
    console.error("signInWithOtp threw:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unexpected error sending the sign-in link." },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Check your inbox for a sign-in link." });
}
