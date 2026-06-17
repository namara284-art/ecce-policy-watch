import Link from "next/link";
import { listMembers } from "@/lib/community";
import { isSupabaseConfigured } from "@/lib/supabase";
import { ROLE_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const { members, demo } = await listMembers();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Members</h1>
          <p className="mt-1 text-slate-600">
            Practitioners, donors, philanthropies and experts advancing ECCE worldwide.
          </p>
        </div>
        <Link href="/community" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          ← Community
        </Link>
      </div>

      {demo && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Demo member profiles shown.{" "}
          {isSupabaseConfigured() ? (
            <Link href="/login" className="font-semibold underline">
              Sign in
            </Link>
          ) : (
            "Configure Supabase to enable real profiles."
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <div key={m.id} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                {(m.fullName ?? "?").slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="font-semibold text-slate-900">{m.fullName ?? "Member"}</p>
                <p className="text-xs text-slate-400">{ROLE_LABELS[m.role]}</p>
              </div>
            </div>
            {m.organization && <p className="mt-2 text-sm text-slate-600">{m.organization}</p>}
            {m.country && <p className="text-xs text-slate-400">{m.country}</p>}
            {m.bio && <p className="mt-2 text-sm text-slate-500">{m.bio}</p>}
            {m.website && (
              <a
                href={m.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-brand-600 hover:text-brand-700"
              >
                Website →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
