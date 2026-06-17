# Deploying Global ECCE Policy Watch

This guide takes the platform from the repo to a live product. It has four parts:

1. **Supabase** — database, auth, and stored reports/subscribers/community data
2. **Resend** — confirmation + digest emails
3. **Vercel** — hosting the Next.js web app
4. **GitHub Actions** — scheduled report generation and email digests

Total setup is ~30–45 minutes. Everything has a free tier to start.

---

## 0. Prerequisites

- A GitHub repo (this one) you can add secrets to.
- Accounts: [Supabase](https://supabase.com), [Resend](https://resend.com),
  [Vercel](https://vercel.com), and an [Anthropic API key](https://console.anthropic.com).

---

## 1. Supabase (database + auth)

1. **Create a project** at supabase.com. Note the project URL and keys from
   *Project Settings → API*:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**secret — server only**)

2. **Apply the schema.** In *SQL Editor*, run each migration in order:
   - `supabase/migrations/0001_init.sql` (reports + subscribers)
   - `supabase/migrations/0002_subscriber_tokens.sql` (email tokens)
   - `supabase/migrations/0003_community.sql` (profiles, posts, events, RLS)

   Or, with the [Supabase CLI](https://supabase.com/docs/guides/cli):
   ```bash
   supabase link --project-ref <your-ref>
   supabase db push
   ```

3. **Configure auth redirect URLs.** Magic-link sign-in needs your domain
   allow-listed. In *Authentication → URL Configuration*:
   - **Site URL:** `https://your-domain.com`
   - **Redirect URLs:** add `https://your-domain.com/auth/callback`
     (and `http://localhost:3000/auth/callback` for local testing).

4. **(Optional) Make yourself an admin** for moderation — in SQL Editor after
   your first sign-in:
   ```sql
   update public.profiles set is_admin = true where email = 'you@example.org';
   ```

---

## 2. Resend (email)

1. Create an API key → `RESEND_API_KEY`.
2. **Verify a sending domain** (*Domains → Add Domain*, then add the DNS
   records). Until you do, you can only send to your own address from
   `onboarding@resend.dev`.
3. Set `ECCE_FROM_EMAIL`, e.g. `ECCE Policy Watch <reports@your-domain.com>`.

> Confirmation and digest emails include a one-click unsubscribe link and use
> double opt-in — both important for deliverability and compliance with a global
> audience.

---

## 3. Vercel (web app)

1. *Add New → Project* → import this repo. Vercel auto-detects Next.js.
2. Add **Environment Variables** (Production + Preview):

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | from Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Supabase (secret) |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
   | `RESEND_API_KEY` | from Resend |
   | `ECCE_FROM_EMAIL` | your verified sender |

   > `ANTHROPIC_API_KEY` is **not** needed on Vercel — report generation runs in
   > GitHub Actions, not in the web app.

3. Deploy. Then set your custom domain and make sure `NEXT_PUBLIC_SITE_URL` and
   the Supabase redirect URLs match it exactly.

---

## 4. GitHub Actions (scheduled jobs)

Two workflows are included:

- `.github/workflows/generate-reports.yml` — daily report generation (05:00 UTC)
  and monthly synthesis (1st, 06:00 UTC).
- `.github/workflows/send-digests.yml` — daily/weekly/monthly email digests.

> **Important:** scheduled workflows only run from the repository's **default
> branch**. Merge this branch into `main` for the crons to activate.

Add these as repository secrets (*Settings → Secrets and variables → Actions*):

| Secret | Used by |
|---|---|
| `ANTHROPIC_API_KEY` | report generation |
| `NEXT_PUBLIC_SUPABASE_URL` | both |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | both |
| `SUPABASE_SERVICE_ROLE_KEY` | both |
| `RESEND_API_KEY` | digests |
| `ECCE_FROM_EMAIL` | digests |
| `NEXT_PUBLIC_SITE_URL` | digests (email links) |

**Test without waiting for the schedule:** each workflow has a
`workflow_dispatch` trigger — run it manually from the *Actions* tab and pick the
report type / cadence.

To seed initial content immediately, run report generation once (Actions →
*Generate ECCE reports* → Run workflow → `daily`).

---

## 5. Go-live checklist

- [ ] Migrations 0001–0003 applied; RLS shows enabled on all tables.
- [ ] Supabase Site URL + redirect URLs match your domain.
- [ ] Resend domain verified; a test confirmation email arrives.
- [ ] Vercel env vars set; site loads with live (not demo) data after the first
      generation run.
- [ ] GitHub secrets set; **branch merged to `main`** so crons run.
- [ ] Manually dispatched a generation run and confirmed reports appear on the site.
- [ ] Signed in via magic link, completed a profile, posted to the community.

---

## Operating notes

- **Regions / coverage:** edit `src/lib/regions.ts` and flip `active: true`. The
  agent, site, filters and subscribe form all pick it up automatically. Each
  active region adds one Claude call per generation run (cost scales with regions).
- **Models:** `ECCE_DAILY_MODEL` (default `claude-sonnet-4-6`) and
  `ECCE_MONTHLY_MODEL` (default `claude-opus-4-8`) are overridable via env.
- **Moderation:** flagged content lands in `content_flags`. Until an in-app admin
  dashboard exists, review it in the Supabase table editor and set
  `posts.is_hidden = true` / `events.is_hidden = true` to remove items.
- **Cost control:** start with 5–8 active regions and expand as the audience grows.
