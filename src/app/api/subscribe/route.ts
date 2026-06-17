import { NextResponse } from "next/server";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import { sendEmail, siteUrl } from "@/lib/email";
import { confirmationEmail } from "@/lib/email-templates";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_CADENCE = new Set(["daily", "weekly", "monthly"]);

/**
 * Double opt-in subscribe. New/unconfirmed subscribers get a confirmation
 * email; already-confirmed subscribers simply have their preferences updated
 * (re-subscribing never silently un-confirms them).
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
    return NextResponse.json({
      message:
        "Subscription received (demo mode — configure Supabase + Resend to persist and send confirmation emails).",
    });
  }

  try {
    const supabase = getServiceClient();

    const { data: existing, error: readErr } = await supabase
      .from("subscribers")
      .select("id, confirmed, confirm_token")
      .eq("email", email)
      .maybeSingle();
    if (readErr) throw readErr;

    // Already confirmed: just update preferences, no re-confirmation needed.
    if (existing?.confirmed) {
      const { error } = await supabase
        .from("subscribers")
        .update({ regions, cadence })
        .eq("email", email);
      if (error) throw error;
      return NextResponse.json({ message: "Your subscription preferences have been updated." });
    }

    // New or unconfirmed: upsert and (re)send confirmation.
    const { data: row, error: upsertErr } = await supabase
      .from("subscribers")
      .upsert({ email, regions, cadence, confirmed: false }, { onConflict: "email" })
      .select("confirm_token")
      .single();
    if (upsertErr) throw upsertErr;

    const confirmUrl = `${siteUrl()}/confirm?token=${row.confirm_token}`;
    const { subject, html } = confirmationEmail(confirmUrl);
    await sendEmail({ to: email, subject, html });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Could not save subscription: ${detail}` }, { status: 500 });
  }

  return NextResponse.json({
    message: "Almost there — check your inbox and click the confirmation link.",
  });
}
