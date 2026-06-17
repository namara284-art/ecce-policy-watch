export type ReportType = "daily" | "monthly";

export interface Region {
  /** URL-safe identifier, e.g. "uganda" or "east-africa". */
  slug: string;
  name: string;
  /** ISO 3166-1 alpha-2 where applicable; null for multi-country regions. */
  countryCode: string | null;
  continent: string;
  /** Whether the agent currently generates reports for this region. */
  active: boolean;
}

export interface KeyDevelopment {
  title: string;
  detail: string;
  /** Optional impact tag to help readers triage. */
  impact?: "high" | "medium" | "low";
}

export interface Source {
  title: string;
  url: string;
  publisher?: string;
}

export interface Report {
  id: string;
  regionSlug: string;
  type: ReportType;
  /** ISO date (YYYY-MM-DD). For monthly reports this is the first of the month. */
  reportDate: string;
  headline: string;
  summary: string;
  keyDevelopments: KeyDevelopment[];
  sources: Source[];
  bodyMarkdown: string;
  createdAt: string;
}

// --- Community (Phase 3 & 4) ---

export type MemberRole = "practitioner" | "donor" | "philanthropy" | "expert" | "other";

export const ROLE_LABELS: Record<MemberRole, string> = {
  practitioner: "Practitioner",
  donor: "Donor",
  philanthropy: "Philanthropy",
  expert: "Expert / Researcher",
  other: "Member",
};

export interface Profile {
  id: string;
  email: string | null;
  fullName: string | null;
  role: MemberRole;
  organization: string | null;
  country: string | null;
  bio: string | null;
  website: string | null;
  onboarded: boolean;
}

export type PostKind = "update" | "activity" | "invitation";

export const POST_KIND_LABELS: Record<PostKind, string> = {
  update: "Update",
  activity: "Activity",
  invitation: "Invitation",
};

export interface Post {
  id: string;
  authorName: string;
  authorRole: MemberRole;
  authorOrg: string | null;
  kind: PostKind;
  title: string;
  body: string;
  reportId: string | null;
  createdAt: string;
}

export interface EventItem {
  id: string;
  hostName: string;
  title: string;
  description: string;
  startsAt: string;
  location: string | null;
  url: string | null;
  rsvpCount: number;
}
