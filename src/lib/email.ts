import { Resend } from "resend";

/**
 * Thin email wrapper around Resend. Email is optional in development: with no
 * RESEND_API_KEY the functions become no-ops that log what *would* have been
 * sent, so the subscribe/confirm flows work end-to-end without external setup.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Public base URL used to build confirm/unsubscribe links. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

const FROM = process.env.ECCE_FROM_EMAIL || "ECCE Policy Watch <onboarding@resend.dev>";

export interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendArgs): Promise<{ id?: string; dryRun?: boolean }> {
  if (!isEmailConfigured()) {
    console.log(`[email dry-run] to=${to} subject="${subject}" (${html.length} bytes)`);
    return { dryRun: true };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) throw new Error(`Resend error: ${error.message ?? String(error)}`);
  return { id: data?.id };
}
