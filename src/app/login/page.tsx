import { LoginForm } from "@/components/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const configured = isSupabaseConfigured();

  return (
    <div className="mx-auto max-w-md py-8">
      <h1 className="text-2xl font-bold text-slate-900">Sign in to the ECCE community</h1>
      <p className="mt-2 text-sm text-slate-600">
        Connect with practitioners, donors, philanthropies and experts. Share your work, discover
        events, and join the conversation.
      </p>

      {searchParams.error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          That sign-in link was invalid or expired. Please request a new one.
        </p>
      )}

      <div className="mt-6">
        {configured ? (
          <LoginForm />
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            <p className="font-semibold">Accounts aren&apos;t enabled in this environment.</p>
            <p className="mt-1">
              Configure Supabase (URL + anon key) to turn on sign-in, profiles and the community
              space. You can still browse reports and the demo community content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
