import { NextResponse } from "next/server";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_CADENCE = new Set(["daily", "weekly", "monthly"]);

/**
 * Phase 1 captures subscribers. Phase 2 will add the confirmation email
 * (double opt-in) and the digest sender. We persist with `confirmed: false`
 * now so the opt-in flow can flip it later.
 */
export async function POST(request: Request) {
  let body: { email?: string; regions?: string[]; cadence?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const regions = Array.isArray(body.regions) ? body.regions : [];
  const cadence = body.cadence ?? "daily";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (regions.length === 0) {
    return NextResponse.json({ error: "Select at least one region." }, { status: 400 });
  }
  if (!VALID_CADENCE.has(cadence)) {
    return NextResponse.json({ error: "Invalid frequency." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    // No DB configured (e.g. local dev): accept gracefully so the UI works.
    return NextResponse.json({
      message:
        "Subscription received (demo mode — configure Supabase to persist and send confirmation emails).",
    });
  }

  try {
    const supabase = getServiceClient();
    const { error } = await supabase
      .from("subscribers")
      .upsert(
        { email, regions, cadence, confirmed: false },
        { onConflict: "email" }
      );
    if (error) throw error;
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Could not save subscription: ${detail}` }, { status: 500 });
  }

  return NextResponse.json({
    message: "Subscription received. Check your inbox to confirm (coming in Phase 2).",
  });
}
