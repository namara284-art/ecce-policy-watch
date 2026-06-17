import { regionName } from "./regions";
import type { Report } from "./types";

/**
 * Inline-styled HTML email templates. Kept deliberately simple and table-free
 * but inline-styled for broad client support. Swap for react-email if the
 * design needs to grow.
 */
function layout(title: string, inner: string, footer?: string): string {
  return `<!doctype html>
<html><body style="margin:0;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#1659b3;color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;font-weight:700;font-size:18px;">
      ECCE Policy Watch
    </div>
    <div style="background:#fff;padding:24px 20px;border-radius:0 0 8px 8px;">
      <h1 style="font-size:20px;margin:0 0 12px;">${title}</h1>
      ${inner}
    </div>
    <p style="color:#94a3b8;font-size:12px;margin:16px 4px;">
      Global ECCE Policy Watch — AI-assisted Early Childhood Care &amp; Education policy intelligence.
      ${footer ?? ""}
    </p>
  </div>
</body></html>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#1659b3;color:#fff;text-decoration:none;padding:10px 18px;border-radius:6px;font-weight:600;">${label}</a>`;
}

export function confirmationEmail(confirmUrl: string): { subject: string; html: string } {
  return {
    subject: "Confirm your ECCE Policy Watch subscription",
    html: layout(
      "Confirm your subscription",
      `<p style="color:#475569;line-height:1.6;">Thanks for subscribing to Global ECCE Policy Watch. Please confirm your email to start receiving reports.</p>
       <p style="margin:20px 0;">${button(confirmUrl, "Confirm subscription")}</p>
       <p style="color:#94a3b8;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>`
    ),
  };
}

function reportBlock(report: Report): string {
  const url = report.sources[0]?.url;
  const headline = url
    ? `<a href="${url}" style="color:#1659b3;text-decoration:none;">${report.headline}</a>`
    : report.headline;
  return `<div style="border-left:3px solid #1659b3;padding:4px 0 4px 12px;margin:0 0 16px;">
    <div style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.04em;">${regionName(
      report.regionSlug
    )} · ${report.reportDate}</div>
    <div style="font-weight:600;font-size:15px;margin:2px 0;">${headline}</div>
    <div style="color:#475569;font-size:14px;line-height:1.5;">${report.summary}</div>
  </div>`;
}

export function digestEmail(args: {
  reports: Report[];
  cadence: string;
  unsubscribeUrl: string;
  webUrl: string;
}): { subject: string; html: string } {
  const { reports, cadence, unsubscribeUrl, webUrl } = args;
  const date = new Date().toISOString().slice(0, 10);
  const label = cadence === "monthly" ? "Monthly" : cadence === "weekly" ? "Weekly" : "Daily";
  const inner =
    reports.length === 0
      ? `<p style="color:#475569;">No new developments in your selected regions today. We'll be back with more.</p>`
      : reports.map(reportBlock).join("\n") +
        `<p style="margin-top:8px;">${button(webUrl, "Read all reports on the web")}</p>`;

  return {
    subject: `${label} ECCE Policy Watch — ${date}`,
    html: layout(
      `${label} policy briefing`,
      inner,
      `&nbsp;·&nbsp;<a href="${unsubscribeUrl}" style="color:#94a3b8;">Unsubscribe</a>`
    ),
  };
}
