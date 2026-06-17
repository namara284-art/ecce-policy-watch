# Global ECCE Policy Watch

A global platform for **Early Childhood Care & Education (ECCE) policy intelligence**.
It turns the Claude-powered ECCE Policy Intelligence Agent into a public product:
daily and monthly policy reports across many countries and regions, an email
subscription system, and (coming) a community space for practitioners, donors,
philanthropies and experts.

> **Status — Phase 1 (this scaffold):** multi-region report generation + the
> public website to browse them, plus subscriber capture. Email digests (Phase 2)
> and the community/events space (Phase 4) are stubbed and planned.

> **Deploying?** See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full
> Supabase + Resend + Vercel + GitHub Actions setup.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

The site runs with **zero configuration** — with no database it serves bundled
sample reports (`src/lib/seed-reports.ts`) so you can see the full UI immediately.

## How it works

```
Scheduler (GitHub Actions cron)
        │
        ▼
agent/generate-reports.ts  ──loops over active regions──▶  Claude
        │                                                    │
        │  structured reports (headline, summary,            │
        │  key developments, sources, body)                  │
        ▼                                                    ▼
   Supabase `reports` table  ◀───────────────────────────────
        │
        ▼
   Next.js website  ──▶  browse by region, daily vs monthly, single report pages
        │
        ▼
   Subscribers (`/api/subscribe`)  ──▶  Phase 2: email digests
```

### Going from "Uganda only" to global

The single seam is **`src/lib/regions.ts`**. The agent loops over
`activeRegions()` and produces one report per region per run. Add a region (or
flip `active: true`) and it's covered everywhere — site, filters, subscribe form.

## Project layout

| Path | What |
|---|---|
| `src/app` | Next.js App Router pages (home, reports, monthly, regions, community) |
| `src/lib/regions.ts` | The list of tracked jurisdictions — **edit here to expand coverage** |
| `src/lib/reports.ts` | Read-side data access (Supabase, with seed fallback) |
| `src/lib/types.ts` | The structured `Report` contract |
| `src/app/api/subscribe` | Subscriber capture endpoint |
| `agent/generate-reports.ts` | The multi-region report generation agent |
| `supabase/migrations` | Database schema (reports, subscribers, RLS) |
| `.github/workflows` | Scheduled daily/monthly generation |

## Configuration

Copy `.env.example` to `.env.local` and fill in what you need:

- **Supabase** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`) — persist reports and subscribers. Apply
  `supabase/migrations/0001_init.sql` first.
- **Claude** (`ANTHROPIC_API_KEY`) — required to generate reports. Models default
  to `claude-sonnet-4-6` (daily) and `claude-opus-4-8` (monthly synthesis).

## Generating reports

```bash
npm run agent:generate                  # daily, all active regions
npm run agent:generate -- --type monthly   # monthly syntheses
npm run agent:generate -- --region kenya   # a single region
```

Without Supabase configured the agent does a dry run and prints results.

## Accounts & community (Phase 3 & 4)

Sign-in uses **Supabase Auth** (passwordless magic links). Apply
`supabase/migrations/0003_community.sql` to enable it. When Supabase isn't
configured the community pages still render with demo content.

- **Accounts:** `/login` emails a magic link; new users land on `/profile` to set
  their role (practitioner / donor / philanthropy / expert), organisation and bio.
- **Members:** `/members` directory of onboarded profiles.
- **Community:** `/community` feed — post updates, activities and invitations,
  optionally linking a report. Members can flag content for moderation.
- **Events:** `/events` calendar — add events and RSVP.
- Row-level security restricts writes to the owner; flagged content is reviewable
  by admins (`profiles.is_admin`).

## Roadmap

1. **Phase 1 (done):** multi-region reports + public website + subscriber capture.
2. **Phase 2 (done):** email engine — double opt-in confirmation + daily/weekly/monthly digests.
3. **Phase 3 (done):** user accounts with roles (practitioner, donor, philanthropy, expert).
4. **Phase 4 (done):** community — profiles, posts, sharing, invitations, events calendar, moderation.

### Possible next steps
- Admin moderation dashboard (review flags, hide content) beyond the Supabase dashboard.
- Event RSVPs visible to hosts; calendar export (iCal).
- Per-member report bookmarks and email preferences in-app.
