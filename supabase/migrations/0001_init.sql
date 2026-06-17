-- ECCE Policy Watch — initial schema (Phase 1)
-- Run in the Supabase SQL editor, or via `supabase db push`.

-- ---------------------------------------------------------------------------
-- reports: one row per region per run (daily or monthly synthesis)
-- ---------------------------------------------------------------------------
create table if not exists public.reports (
  id                text primary key,
  region_slug       text not null,
  type              text not null check (type in ('daily', 'monthly')),
  report_date       date not null,
  headline          text not null,
  summary           text not null,
  key_developments  jsonb not null default '[]'::jsonb,
  sources           jsonb not null default '[]'::jsonb,
  body_markdown     text not null default '',
  created_at        timestamptz not null default now()
);

create index if not exists reports_region_date_idx
  on public.reports (region_slug, report_date desc);
create index if not exists reports_type_date_idx
  on public.reports (type, report_date desc);

-- One report per region/type/date keeps re-runs idempotent.
create unique index if not exists reports_region_type_date_uq
  on public.reports (region_slug, type, report_date);

-- ---------------------------------------------------------------------------
-- subscribers: email list with per-region preferences and cadence
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  regions       text[] not null default '{}',
  cadence       text not null default 'daily' check (cadence in ('daily', 'weekly', 'monthly')),
  confirmed     boolean not null default false,
  confirm_token uuid not null default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  confirmed_at  timestamptz
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.reports enable row level security;
alter table public.subscribers enable row level security;

-- Reports are public to read; writes happen via the service role (which
-- bypasses RLS), so no write policy is granted to anon/authenticated.
drop policy if exists "reports are publicly readable" on public.reports;
create policy "reports are publicly readable"
  on public.reports for select
  using (true);

-- Subscribers table is not readable by anon clients; inserts/updates go
-- through the service-role API route. No anon policies = locked down.
