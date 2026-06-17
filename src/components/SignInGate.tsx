import Link from "next/link";

export function SignInGate({
  title,
  configured,
}: {
  title: string;
  configured: boolean;
}) {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">
        {configured
          ? "Sign in with your email to join the ECCE community."
          : "Accounts aren't enabled in this environment yet. Browse the demo content below, or configure Supabase to turn on sign-in."}
      </p>
      {configured && (
        <Link
          href="/login"
          className="mt-6 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Go to sign in
        </Link>
      )}
    </div>
  );
}
