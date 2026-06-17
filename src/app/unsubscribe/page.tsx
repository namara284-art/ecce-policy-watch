import Link from "next/link";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Outcome = "done" | "invalid" | "unconfigured" | "error";

async function unsubscribe(token: string | undefined): Promise<Outcome> {
  if (!token) return "invalid";
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return "unconfigured";

  try {
    const supabase = getServiceClient();
    const { data: sub, error } = await supabase
      .from("subscribers")
      .select("id")
      .eq("unsubscribe_token", token)
      .maybeSingle();
    if (error) throw error;
    if (!sub) return "invalid";

    const { error: delErr } = await supabase.from("subscribers").delete().eq("id", sub.id);
    if (delErr) throw delErr;
    return "done";
  } catch {
    return "error";
  }
}

const COPY: Record<Outcome, { title: string; body: string }> = {
  done: {
    title: "You've been unsubscribed",
    body: "You won't receive any more ECCE Policy Watch emails. You can resubscribe any time.",
  },
  invalid: {
    title: "Invalid link",
    body: "We couldn't match this unsubscribe link. You may already have been removed.",
  },
  unconfigured: {
    title: "Not configured",
    body: "This environment has no database configured.",
  },
  error: {
    title: "Something went wrong",
    body: "We hit an error processing your request. Please try again shortly.",
  },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const outcome = await unsubscribe(searchParams.token);
  const { title, body } = COPY[outcome];

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-slate-600">{body}</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-500"
      >
        Back to home
      </Link>
    </div>
  );
}
