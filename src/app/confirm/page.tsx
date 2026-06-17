import Link from "next/link";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Outcome = "confirmed" | "already" | "invalid" | "unconfigured" | "error";

async function confirm(token: string | undefined): Promise<Outcome> {
  if (!token) return "invalid";
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return "unconfigured";

  try {
    const supabase = getServiceClient();
    const { data: sub, error } = await supabase
      .from("subscribers")
      .select("id, confirmed")
      .eq("confirm_token", token)
      .maybeSingle();
    if (error) throw error;
    if (!sub) return "invalid";
    if (sub.confirmed) return "already";

    const { error: updErr } = await supabase
      .from("subscribers")
      .update({ confirmed: true, confirmed_at: new Date().toISOString() })
      .eq("id", sub.id);
    if (updErr) throw updErr;
    return "confirmed";
  } catch {
    return "error";
  }
}

const COPY: Record<Outcome, { title: string; body: string }> = {
  confirmed: {
    title: "You're subscribed! 🎉",
    body: "Your email is confirmed. You'll start receiving ECCE Policy Watch reports for your selected regions.",
  },
  already: {
    title: "Already confirmed",
    body: "This subscription was already confirmed. Nothing more to do.",
  },
  invalid: {
    title: "Invalid or expired link",
    body: "We couldn't match this confirmation link. Try subscribing again from the home page.",
  },
  unconfigured: {
    title: "Email not configured",
    body: "This environment has no database configured, so confirmation can't be recorded.",
  },
  error: {
    title: "Something went wrong",
    body: "We hit an error confirming your subscription. Please try again shortly.",
  },
};

export default async function ConfirmPage({ searchParams }: { searchParams: { token?: string } }) {
  const outcome = await confirm(searchParams.token);
  const { title, body } = COPY[outcome];

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-slate-600">{body}</p>
      <Link
        href="/reports"
        className="mt-6 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Browse reports
      </Link>
    </div>
  );
}
