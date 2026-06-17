import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { SignInGate } from "@/components/SignInGate";
import { ROLE_LABELS, type MemberRole } from "@/lib/types";
import { updateProfile } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <SignInGate title="Sign in to view your profile" configured={isSupabaseConfigured()} />;
  }

  const roles = Object.keys(ROLE_LABELS) as MemberRole[];

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900">Your profile</h1>
      <p className="mt-1 text-sm text-slate-600">
        This is how other members see you in the directory. Complete it to join the community.
      </p>

      <form action={updateProfile} className="mt-6 space-y-4">
        <Field label="Full name" name="full_name" defaultValue={profile.fullName ?? ""} required />
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-700">
            I am a…
          </label>
          <select
            id="role"
            name="role"
            defaultValue={profile.role}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
        <Field label="Organisation" name="organization" defaultValue={profile.organization ?? ""} />
        <Field label="Country" name="country" defaultValue={profile.country ?? ""} />
        <Field label="Website" name="website" defaultValue={profile.website ?? ""} type="url" />
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
            Short bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={profile.bio ?? ""}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Save profile
          </button>
          <Link href="/community" className="text-sm text-slate-500 hover:text-slate-700">
            Back to community
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}

