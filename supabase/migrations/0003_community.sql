-- ECCE Policy Watch — Phase 3 & 4: accounts, community, events
-- Profiles (with roles), community posts, events + RSVPs, and content flags.

-- ---------------------------------------------------------------------------
-- profiles: one row per authenticated user, created on first login
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  full_name    text,
  role         text not null default 'other'
                 check (role in ('practitioner', 'donor', 'philanthropy', 'expert', 'other')),
  organization text,
  country      text,
  bio          text,
  website      text,
  is_admin     boolean not null default false,
  onboarded    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- posts: community feed — share updates, activities, invitations
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references public.profiles (id) on delete cascade,
  kind       text not null default 'update'
               check (kind in ('update', 'activity', 'invitation')),
  title      text not null,
  body       text not null,
  report_id  text references public.reports (id) on delete set null,
  is_hidden  boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists posts_created_idx on public.posts (created_at desc);

-- ---------------------------------------------------------------------------
-- events: shared ECCE events calendar
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  host_id     uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  description text not null default '',
  starts_at   timestamptz not null,
  location    text,
  url         text,
  is_hidden   boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists events_starts_idx on public.events (starts_at);

create table if not exists public.event_rsvps (
  event_id   uuid not null references public.events (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, profile_id)
);

-- ---------------------------------------------------------------------------
-- content_flags: lightweight moderation — members report content for review
-- ---------------------------------------------------------------------------
create table if not exists public.content_flags (
  id           uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('post', 'event')),
  content_id   uuid not null,
  reporter_id  uuid references public.profiles (id) on delete set null,
  reason       text,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.content_flags enable row level security;

-- Profiles: any signed-in member can view the directory; you edit only your own.
drop policy if exists "profiles readable by members" on public.profiles;
create policy "profiles readable by members"
  on public.profiles for select to authenticated using (true);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Posts: members read non-hidden posts; authors manage their own.
drop policy if exists "posts readable by members" on public.posts;
create policy "posts readable by members"
  on public.posts for select to authenticated using (not is_hidden);

drop policy if exists "insert own posts" on public.posts;
create policy "insert own posts"
  on public.posts for insert to authenticated with check (auth.uid() = author_id);

drop policy if exists "modify own posts" on public.posts;
create policy "modify own posts"
  on public.posts for all to authenticated
  using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- Events: members read non-hidden events; hosts manage their own.
drop policy if exists "events readable by members" on public.events;
create policy "events readable by members"
  on public.events for select to authenticated using (not is_hidden);

drop policy if exists "insert own events" on public.events;
create policy "insert own events"
  on public.events for insert to authenticated with check (auth.uid() = host_id);

drop policy if exists "modify own events" on public.events;
create policy "modify own events"
  on public.events for all to authenticated
  using (auth.uid() = host_id) with check (auth.uid() = host_id);

-- RSVPs: members read all, manage only their own.
drop policy if exists "rsvps readable by members" on public.event_rsvps;
create policy "rsvps readable by members"
  on public.event_rsvps for select to authenticated using (true);

drop policy if exists "manage own rsvps" on public.event_rsvps;
create policy "manage own rsvps"
  on public.event_rsvps for all to authenticated
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- Flags: members can file them; only the service role / admins read them.
drop policy if exists "members can flag" on public.content_flags;
create policy "members can flag"
  on public.content_flags for insert to authenticated with check (auth.uid() = reporter_id);
