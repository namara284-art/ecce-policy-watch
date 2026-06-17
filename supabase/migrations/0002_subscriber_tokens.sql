-- ECCE Policy Watch — Phase 2: email engine support
-- Adds a stable unsubscribe token so every email can carry a one-click
-- unsubscribe link, and a record of when a digest was last sent.

alter table public.subscribers
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid(),
  add column if not exists last_sent_at timestamptz;

create index if not exists subscribers_confirmed_cadence_idx
  on public.subscribers (confirmed, cadence);
