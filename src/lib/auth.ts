import { createSupabaseServerClient } from "./supabase-server";
import type { Profile, MemberRole } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProfile(row: any): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: (row.role ?? "other") as MemberRole,
    organization: row.organization,
    country: row.country,
    bio: row.bio,
    website: row.website,
    onboarded: Boolean(row.onboarded),
  };
}

/** The signed-in user's profile, or null in demo mode / when logged out. */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!data) {
    // Profile row may not exist yet (trigger lag); return a minimal shell.
    return {
      id: user.id,
      email: user.email ?? null,
      fullName: null,
      role: "other",
      organization: null,
      country: null,
      bio: null,
      website: null,
      onboarded: false,
    };
  }
  return rowToProfile(data);
}
