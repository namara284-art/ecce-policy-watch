import { createSupabaseServerClient } from "./supabase-server";
import { SEED_POSTS, SEED_EVENTS, SEED_MEMBERS } from "./seed-community";
import type { Post, EventItem, Profile, MemberRole, PostKind } from "./types";

/**
 * Read-side access for community content. Reads from Supabase when a session is
 * available; otherwise serves demo seed content so the pages render for visitors
 * exploring the platform before it's fully configured.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPost(row: any): Post {
  const author = row.author ?? {};
  return {
    id: row.id,
    authorName: author.full_name ?? "Member",
    authorRole: (author.role ?? "other") as MemberRole,
    authorOrg: author.organization ?? null,
    kind: (row.kind ?? "update") as PostKind,
    title: row.title,
    body: row.body,
    reportId: row.report_id ?? null,
    createdAt: row.created_at,
  };
}

export async function listPosts(): Promise<{ posts: Post[]; demo: boolean }> {
  const supabase = createSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("posts")
      .select("*, author:profiles!posts_author_id_fkey(full_name, role, organization)")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) return { posts: data.map(rowToPost), demo: false };
  }
  return { posts: SEED_POSTS, demo: true };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToEvent(row: any): EventItem {
  return {
    id: row.id,
    hostName: row.host?.full_name ?? row.host?.organization ?? "Host",
    title: row.title,
    description: row.description ?? "",
    startsAt: row.starts_at,
    location: row.location ?? null,
    url: row.url ?? null,
    rsvpCount: row.event_rsvps?.[0]?.count ?? 0,
  };
}

export async function listEvents(): Promise<{ events: EventItem[]; demo: boolean }> {
  const supabase = createSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("events")
      .select(
        "*, host:profiles!events_host_id_fkey(full_name, organization), event_rsvps(count)"
      )
      .eq("is_hidden", false)
      .gte("starts_at", new Date(Date.now() - 86400000).toISOString())
      .order("starts_at", { ascending: true })
      .limit(50);
    if (!error && data) return { events: data.map(rowToEvent), demo: false };
  }
  return { events: SEED_EVENTS, demo: true };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProfile(row: any): Profile {
  return {
    id: row.id,
    email: null,
    fullName: row.full_name,
    role: (row.role ?? "other") as MemberRole,
    organization: row.organization,
    country: row.country,
    bio: row.bio,
    website: row.website,
    onboarded: Boolean(row.onboarded),
  };
}

export async function listMembers(): Promise<{ members: Profile[]; demo: boolean }> {
  const supabase = createSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, organization, country, bio, website, onboarded")
      .eq("onboarded", true)
      .order("created_at", { ascending: false })
      .limit(100);
    if (!error && data) return { members: data.map(rowToProfile), demo: false };
  }
  return { members: SEED_MEMBERS, demo: true };
}
