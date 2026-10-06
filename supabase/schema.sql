-- =============================================================================
-- Sims Storybook — database schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- It is safe to re-run: every statement is idempotent.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Admin allowlist
-- Only users listed here can read or write anything. This protects the archive
-- even if public sign-ups are accidentally left enabled in Supabase Auth.
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Keeps updated_at current on every row update.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Site settings (single row) — the storybook title shown on the home page
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id boolean primary key default true check (id), -- enforces a single row
  title text not null default 'The Storybook',
  subtitle text,
  epigraph text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Generations — exactly the three generation cards on the home page
-- -----------------------------------------------------------------------------
create table if not exists public.generations (
  number smallint primary key check (number between 1 and 3),
  name text not null,
  tagline text,
  description text,
  cover_image_url text,
  updated_at timestamptz not null default now()
);

insert into public.generations (number, name) values
  (1, 'The First Generation'),
  (2, 'The Second Generation'),
  (3, 'The Third Generation')
on conflict (number) do nothing;

-- -----------------------------------------------------------------------------
-- Characters
-- Family connections: parent_one_id / parent_two_id reference other characters.
-- Children and siblings are derived from these, so you only ever enter parents.
-- Partners can be another character (current_partner_id) or just a name, for
-- townies who don't have their own page. Friends, rivals etc. live in the
-- relationships table.
-- -----------------------------------------------------------------------------
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  generation smallint not null references public.generations (number),
  photo_url text,
  tagline text,                 -- optional one-liner for character cards
  moral_alignment text,         -- e.g. 'Lawful Good', 'Chaotic Neutral'
  career_current text,
  career_position text,         -- their level/title within the current career
  career_endgame text,
  past_jobs text[] not null default '{}',
  life_status text not null default 'alive' check (life_status in ('alive', 'dead')),
  cause_of_death text,
  death_note text,
  relationship_status text,
  current_partner_id uuid references public.characters (id) on delete set null,
  current_partner_name text,    -- used when the partner has no character page
  past_partners jsonb not null default '[]', -- [{ "name", "character_id", "note" }]
  traits text[] not null default '{}',
  hobbies text[] not null default '{}',
  parent_one_id uuid references public.characters (id) on delete set null,
  parent_two_id uuid references public.characters (id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint characters_not_own_parent check (
    parent_one_id is distinct from id and parent_two_id is distinct from id
  )
);

-- Columns added after the first version of this schema (safe to re-run).
alter table public.characters add column if not exists past_jobs text[] not null default '{}';
alter table public.characters add column if not exists current_partner_id uuid references public.characters (id) on delete set null;
alter table public.characters add column if not exists current_partner_name text;
alter table public.characters add column if not exists past_partners jsonb not null default '[]';
alter table public.characters add column if not exists hobbies text[] not null default '{}';
alter table public.characters add column if not exists career_position text;
alter table public.characters add column if not exists life_status text not null default 'alive' check (life_status in ('alive', 'dead'));
alter table public.characters add column if not exists cause_of_death text;
alter table public.characters add column if not exists death_note text;

create index if not exists characters_generation_idx on public.characters (generation, sort_order);
create index if not exists characters_parent_one_idx on public.characters (parent_one_id);
create index if not exists characters_parent_two_idx on public.characters (parent_two_id);

-- -----------------------------------------------------------------------------
-- Storylines
-- era_label is what readers see ("Spring, Year 3"); timeline_position is a
-- number used purely for ordering (use decimals to slot things in between).
-- -----------------------------------------------------------------------------
create table if not exists public.storylines (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  content text not null default '',   -- rich text, stored as HTML
  generation smallint not null references public.generations (number),
  era_label text,
  timeline_position numeric not null default 0,
  category text,                        -- romance, career, family, conflict, …
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists storylines_generation_idx on public.storylines (generation, timeline_position);

create table if not exists public.storyline_characters (
  storyline_id uuid not null references public.storylines (id) on delete cascade,
  character_id uuid not null references public.characters (id) on delete cascade,
  primary key (storyline_id, character_id)
);

create index if not exists storyline_characters_character_idx on public.storyline_characters (character_id);

-- -----------------------------------------------------------------------------
-- Relationships between two characters
-- -----------------------------------------------------------------------------
create table if not exists public.relationships (
  id uuid primary key default gen_random_uuid(),
  character_one_id uuid not null references public.characters (id) on delete cascade,
  character_two_id uuid not null references public.characters (id) on delete cascade,
  relationship_type text not null,      -- romantic, sibling, parent, friends, enemies, …
  status text not null default 'active',-- active, ended, complicated
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint relationships_distinct_characters check (character_one_id <> character_two_id)
);

create index if not exists relationships_one_idx on public.relationships (character_one_id);
create index if not exists relationships_two_idx on public.relationships (character_two_id);

-- -----------------------------------------------------------------------------
-- Timeline events
-- -----------------------------------------------------------------------------
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  era_label text,
  timeline_position numeric not null default 0,
  generation smallint not null references public.generations (number),
  storyline_id uuid references public.storylines (id) on delete set null,
  is_key_event boolean not null default true, -- shown on the generation page
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists timeline_events_generation_idx on public.timeline_events (generation, timeline_position);

create table if not exists public.timeline_event_characters (
  event_id uuid not null references public.timeline_events (id) on delete cascade,
  character_id uuid not null references public.characters (id) on delete cascade,
  primary key (event_id, character_id)
);

create index if not exists timeline_event_characters_character_idx on public.timeline_event_characters (character_id);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['site_settings','generations','characters','storylines','relationships','timeline_events']
  loop
    execute format('drop trigger if exists %I_touch on public.%I', t, t);
    execute format('create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- Row level security: admins only, for everything
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','generations','characters','storylines','storyline_characters',
    'relationships','timeline_events','timeline_event_characters'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "admin full access" on public.%I', t);
    execute format(
      'create policy "admin full access" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end $$;

alter table public.admins enable row level security;
drop policy if exists "admins can see themselves" on public.admins;
create policy "admins can see themselves" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Storage: photo uploads
-- The bucket is public-read so images load fast and can be cached; file names
-- are random UUIDs, so they can't be guessed. Only the admin can upload/delete.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "admin can upload photos" on storage.objects;
create policy "admin can upload photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'photos' and public.is_admin());

drop policy if exists "admin can update photos" on storage.objects;
create policy "admin can update photos" on storage.objects
  for update to authenticated using (bucket_id = 'photos' and public.is_admin());

drop policy if exists "admin can delete photos" on storage.objects;
create policy "admin can delete photos" on storage.objects
  for delete to authenticated using (bucket_id = 'photos' and public.is_admin());
