import type { Post, EventItem, Profile } from "./types";

/** Demo content so the community + events views render without a database. */

export const SEED_MEMBERS: Profile[] = [
  {
    id: "seed-member-1",
    email: null,
    fullName: "Aisha Nakato",
    role: "practitioner",
    organization: "Kampala Community ECD Network",
    country: "Uganda",
    bio: "Running community-based early learning centres and training caregivers.",
    website: null,
    onboarded: true,
  },
  {
    id: "seed-member-2",
    email: null,
    fullName: "Daniel Otieno",
    role: "expert",
    organization: "East Africa Institute for Early Childhood",
    country: "Kenya",
    bio: "Researcher focused on pre-primary financing and equity.",
    website: null,
    onboarded: true,
  },
  {
    id: "seed-member-3",
    email: null,
    fullName: "Maria Santos",
    role: "philanthropy",
    organization: "Early Years Global Fund",
    country: "Brazil",
    bio: "Funding early childhood systems strengthening across the Global South.",
    website: null,
    onboarded: true,
  },
];

export const SEED_POSTS: Post[] = [
  {
    id: "seed-post-1",
    authorName: "Aisha Nakato",
    authorRole: "practitioner",
    authorOrg: "Kampala Community ECD Network",
    kind: "activity",
    title: "Caregiver training cohort graduating next week",
    body: "We're wrapping up a 12-week caregiver certification cohort with 40 participants. Happy to share our curriculum with anyone running similar programmes.",
    reportId: "seed-uganda-2026-06-17",
    createdAt: "2026-06-16T09:00:00Z",
  },
  {
    id: "seed-post-2",
    authorName: "Maria Santos",
    authorRole: "philanthropy",
    authorOrg: "Early Years Global Fund",
    kind: "invitation",
    title: "Inviting partners for a cross-border financing pilot",
    body: "We're scoping a pooled-financing pilot for community ECD centres and looking for practitioner and government partners in East Africa. Reach out if interested.",
    reportId: "seed-global-2026-06-17",
    createdAt: "2026-06-15T14:30:00Z",
  },
];

export const SEED_EVENTS: EventItem[] = [
  {
    id: "seed-event-1",
    hostName: "East Africa Institute for Early Childhood",
    title: "Webinar: Financing pre-primary education equitably",
    description:
      "A practitioner-focused session on closing disbursement gaps in devolved pre-primary financing.",
    startsAt: "2026-07-02T13:00:00Z",
    location: "Online",
    url: "https://example.org/webinar",
    rsvpCount: 28,
  },
  {
    id: "seed-event-2",
    hostName: "Early Years Global Fund",
    title: "Global ECCE Funders Roundtable",
    description: "Closed-door convening for donors and philanthropies on early childhood investment.",
    startsAt: "2026-07-18T15:00:00Z",
    location: "Nairobi, Kenya",
    url: null,
    rsvpCount: 12,
  },
];
