/**
 * Global ECCE Policy Watch — email digest sender (Phase 2).
 *
 * Builds one email per confirmed subscriber from the latest reports in their
 * selected regions, and sends it via Resend. Run on a schedule, one cadence at
 * a time:
 *
 *   npm run digest:daily      # confirmed subscribers with cadence=daily
 *   npm run digest:weekly     # cadence=weekly (last 7 days of reports)
 *   npm run digest:monthly    # cadence=monthly (this month's syntheses)
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (subscribers/reports),
 *      RESEND_API_KEY (to actually send; otherwise a dry run),
 *      NEXT_PUBLIC_SITE_URL (links in emails).
 */
import { getServiceClient, isSupabaseConfigured } from "../src/lib/supabase";
import { sendEmail, siteUrl } from "../src/lib/email";
import { digestEmail } from "../src/lib/email-templates";
import type { Report, ReportType } from "../src/lib/types";

type Cadence = "daily" | "weekly" | "monthly";

interface SubscriberRow {
  email: string;
  regions: string[];
  cadence: Cadence;
  unsubscribe_token: string;
}

function parseCadence(argv: string[]): Cadence {
  const idx = argv.indexOf("--cadence");
  const value = idx >= 0 ? argv[idx + 1] : "daily";
  if (value === "weekly" || value === "monthly") return value;
  return "daily";
}

function windowStart(cadence: Cadence): { cutoff: string; type: ReportType } {
  const now = new Date();
  if (cadence === "monthly") {
    return {
      cutoff: `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`,
      type: "monthly",
    };
  }
  if (cadence === "weekly") {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - 7);
    return { cutoff: d.toISOString().slice(0, 10), type: "daily" };
  }
  return { cutoff: now.toISOString().slice(0, 10), type: "daily" };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReport(row: any): Report {
  return {
    id: row.id,
    regionSlug: row.region_slug,
    type: row.type,
    reportDate: row.report_date,
    headline: row.headline,
    summary: row.summary,
    keyDevelopments: row.key_developments ?? [],
    sources: row.sources ?? [],
    bodyMarkdown: row.body_markdown ?? "",
    createdAt: row.created_at,
  };
}

async function main() {
  const cadence = parseCadence(process.argv.slice(2));

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase is required to send digests (subscribers + reports live there).");
    process.exit(1);
  }

  const supabase = getServiceClient();
  const { cutoff, type } = windowStart(cadence);

  const { data: subs, error: subErr } = await supabase
    .from("subscribers")
    .select("email, regions, cadence, unsubscribe_token")
    .eq("confirmed", true)
    .eq("cadence", cadence);
  if (subErr) throw new Error(`Failed to load subscribers: ${subErr.message}`);

  const subscribers = (subs ?? []) as SubscriberRow[];
  if (subscribers.length === 0) {
    console.log(`No confirmed subscribers with cadence="${cadence}".`);
    return;
  }

  // Fetch the relevant reports once, then fan out per subscriber in memory.
  const { data: reportRows, error: repErr } = await supabase
    .from("reports")
    .select("*")
    .eq("type", type)
    .gte("report_date", cutoff)
    .order("report_date", { ascending: false });
  if (repErr) throw new Error(`Failed to load reports: ${repErr.message}`);
  const reports = (reportRows ?? []).map(rowToReport);

  const base = siteUrl();
  let sent = 0;
  let skipped = 0;

  for (const sub of subscribers) {
    const wanted = new Set(sub.regions);
    const relevant = reports.filter((r) => wanted.has(r.regionSlug));

    // Don't send an empty daily email; weekly/monthly always go out as a touchpoint.
    if (relevant.length === 0 && cadence === "daily") {
      skipped++;
      continue;
    }

    const { subject, html } = digestEmail({
      reports: relevant,
      cadence,
      unsubscribeUrl: `${base}/unsubscribe?token=${sub.unsubscribe_token}`,
      webUrl: `${base}/reports${type === "monthly" ? "?type=monthly" : ""}`,
    });

    try {
      await sendEmail({ to: sub.email, subject, html });
      await supabase
        .from("subscribers")
        .update({ last_sent_at: new Date().toISOString() })
        .eq("email", sub.email);
      sent++;
    } catch (err) {
      console.error(`  ✗ ${sub.email}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(`Digest "${cadence}": sent ${sent}, skipped ${skipped} (empty), of ${subscribers.length} subscriber(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
