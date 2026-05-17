-- =============================================================================
-- Migration: 20260515000001_initial_schema.sql
-- Stammfeuer - Initial Database Schema
-- =============================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for full-text search

-- =============================================================================
-- PROFILES
-- One profile per auth user, stores display info for the family context
-- =============================================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  birth_year    smallint,
  avatar_url    text,
  bio           text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- VAULTS
-- Each vault is a family's knowledge archive
-- =============================================================================
create table public.vaults (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text,
  cover_url     text,
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  plan          text not null default 'free' check (plan in ('free', 'pro', 'family_plus')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.vaults enable row level security;

-- vault_member_role uses plpgsql so table refs are resolved at call-time, not definition time
create or replace function public.vault_member_role(p_vault_id uuid, p_user_id uuid)
returns text
language plpgsql
security definer set search_path = ''
stable
as $$
begin
  return (
    select role from public.vault_members
    where vault_id = p_vault_id and user_id = p_user_id
    limit 1
  );
end;
$$;

create policy "Vault members can view their vault"
  on public.vaults for select
  using (
    public.vault_member_role(id, auth.uid()) is not null
  );

-- Policies for vaults that don't use vault_member_role
create policy "Vault owner can update vault"
  on public.vaults for update
  using (owner_id = auth.uid());

create policy "Authenticated users can create a vault"
  on public.vaults for insert
  with check (auth.uid() = owner_id);

create policy "Owner can delete vault"
  on public.vaults for delete
  using (owner_id = auth.uid());

-- =============================================================================
-- VAULT MEMBERS
-- Roles: initiator (owner/admin), contributor (read+write), reader (read only)
-- =============================================================================
create table public.vault_members (
  id            uuid primary key default gen_random_uuid(),
  vault_id      uuid not null references public.vaults(id) on delete cascade,
  user_id       uuid references public.profiles(id) on delete set null,
  role          text not null check (role in ('initiator', 'contributor', 'reader')),
  -- Display name for members who haven't accepted yet
  display_name  text,
  -- Family relationship (e.g. "Großmutter", "Onkel", "Tochter")
  family_role   text,
  invite_email  text,
  invite_token  text unique,
  invite_accepted_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  unique (vault_id, user_id)
);

create index on public.vault_members(vault_id);
create index on public.vault_members(user_id);
create index on public.vault_members(invite_token);

alter table public.vault_members enable row level security;

create policy "Members can view other members in same vault"
  on public.vault_members for select
  using (
    public.vault_member_role(vault_id, auth.uid()) is not null
  );

create policy "Initiators can insert members"
  on public.vault_members for insert
  with check (
    public.vault_member_role(vault_id, auth.uid()) = 'initiator'
  );

create policy "Initiators can update members"
  on public.vault_members for update
  using (
    public.vault_member_role(vault_id, auth.uid()) = 'initiator'
  );

create policy "Initiators can delete members"
  on public.vault_members for delete
  using (
    public.vault_member_role(vault_id, auth.uid()) = 'initiator'
  );

-- Auto-add vault creator as initiator
create or replace function public.handle_vault_created()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.vault_members (vault_id, user_id, role, family_role)
  values (new.id, new.owner_id, 'initiator', 'Initiator');
  return new;
end;
$$;

create trigger on_vault_created
  after insert on public.vaults
  for each row execute function public.handle_vault_created();

-- =============================================================================
-- CATEGORIES
-- 6 knowledge categories per vault (seeded on vault creation)
-- =============================================================================
create table public.categories (
  id            uuid primary key default gen_random_uuid(),
  vault_id      uuid not null references public.vaults(id) on delete cascade,
  slug          text not null check (slug in (
                  'stories', 'recipes', 'traditions', 'wisdom', 'places', 'photos'
                )),
  name_de       text not null,
  name_en       text not null,
  icon          text not null,
  sort_order    smallint not null default 0,

  unique (vault_id, slug)
);

alter table public.categories enable row level security;

create policy "Vault members can view categories"
  on public.categories for select
  using (
    public.vault_member_role(vault_id, auth.uid()) is not null
  );

-- Auto-seed 6 categories on vault creation
create or replace function public.handle_vault_categories()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.categories (vault_id, slug, name_de, name_en, icon, sort_order)
  values
    (new.id, 'stories',    'Geschichten',  'Stories',    'book-open',    1),
    (new.id, 'recipes',    'Rezepte',      'Recipes',    'utensils',     2),
    (new.id, 'traditions', 'Traditionen',  'Traditions', 'star',         3),
    (new.id, 'wisdom',     'Weisheiten',   'Wisdom',     'lightbulb',    4),
    (new.id, 'places',     'Orte',         'Places',     'map-pin',      5),
    (new.id, 'photos',     'Fotos',        'Photos',     'camera',       6);
  return new;
end;
$$;

create trigger on_vault_categories
  after insert on public.vaults
  for each row execute function public.handle_vault_categories();

-- =============================================================================
-- ENTRIES
-- The core content unit - one entry per story/recipe/tradition/etc.
-- =============================================================================
create table public.entries (
  id              uuid primary key default gen_random_uuid(),
  vault_id        uuid not null references public.vaults(id) on delete cascade,
  category_slug   text not null check (category_slug in (
                    'stories', 'recipes', 'traditions', 'wisdom', 'places', 'photos'
                  )),
  author_id       uuid references public.profiles(id) on delete set null,
  -- Authored on behalf of another family member (proxy entry)
  on_behalf_of    uuid references public.vault_members(id) on delete set null,

  title           text not null,
  body            text,
  lang            text not null default 'de' check (lang in ('de', 'en')),

  -- Category-specific structured data (stored as JSONB for flexibility)
  metadata        jsonb not null default '{}',
  -- Examples:
  -- stories:    { "period_start": "1960", "period_end": "1975" }
  -- recipes:    { "ingredients": [...], "steps": [...], "origin": "..." }
  -- traditions: { "since_year": "1985", "introduced_by": "...", "frequency": "annual" }
  -- wisdom:     { "author_member_id": "uuid", "context": "..." }
  -- places:     { "address": "...", "coordinates": {...}, "meaning": "..." }
  -- photos:     { "description": "..." }  (description is mandatory for photos)

  -- AI translation stub - original is always preserved
  translation_de  text,
  translation_en  text,
  translation_requested_at timestamptz,

  -- Soft delete
  deleted_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index on public.entries(vault_id);
create index on public.entries(category_slug);
create index on public.entries(author_id);
create index on public.entries(created_at desc);
-- Full-text search index
create index on public.entries using gin(to_tsvector('german', coalesce(title, '') || ' ' || coalesce(body, '')));

alter table public.entries enable row level security;

create policy "Vault members can read entries"
  on public.entries for select
  using (
    public.vault_member_role(vault_id, auth.uid()) is not null
    and deleted_at is null
  );

create policy "Contributors and initiators can insert entries"
  on public.entries for insert
  with check (
    public.vault_member_role(vault_id, auth.uid()) in ('initiator', 'contributor')
    and author_id = auth.uid()
  );

create policy "Author or initiator can update entries"
  on public.entries for update
  using (
    author_id = auth.uid()
    or public.vault_member_role(vault_id, auth.uid()) = 'initiator'
  );

create policy "Author or initiator can soft-delete entries"
  on public.entries for delete
  using (
    author_id = auth.uid()
    or public.vault_member_role(vault_id, auth.uid()) = 'initiator'
  );

-- =============================================================================
-- ENTRY MEDIA
-- Files attached to an entry (photos, audio recordings)
-- =============================================================================
create table public.entry_media (
  id          uuid primary key default gen_random_uuid(),
  entry_id    uuid not null references public.entries(id) on delete cascade,
  vault_id    uuid not null references public.vaults(id) on delete cascade,
  uploader_id uuid references public.profiles(id) on delete set null,
  storage_path text not null,
  mime_type   text not null,
  file_size   integer,
  caption     text,
  sort_order  smallint default 0,
  created_at  timestamptz not null default now()
);

create index on public.entry_media(entry_id);

alter table public.entry_media enable row level security;

create policy "Vault members can view entry media"
  on public.entry_media for select
  using (
    public.vault_member_role(vault_id, auth.uid()) is not null
  );

create policy "Contributors can upload media"
  on public.entry_media for insert
  with check (
    public.vault_member_role(vault_id, auth.uid()) in ('initiator', 'contributor')
    and uploader_id = auth.uid()
  );

create policy "Uploader or initiator can delete media"
  on public.entry_media for delete
  using (
    uploader_id = auth.uid()
    or public.vault_member_role(vault_id, auth.uid()) = 'initiator'
  );

-- =============================================================================
-- WEEKLY PROMPTS
-- Static prompt library + per-member prompt assignments
-- =============================================================================
create table public.prompt_library (
  id            uuid primary key default gen_random_uuid(),
  category_slug text not null,
  life_phase    text not null check (life_phase in ('childhood', 'youth', 'adulthood', 'senior', 'any')),
  text_de       text not null,
  text_en       text not null,
  created_at    timestamptz not null default now()
);

-- No RLS needed - prompt library is read-only reference data
alter table public.prompt_library enable row level security;

create policy "Anyone authenticated can read prompt library"
  on public.prompt_library for select
  using (auth.uid() is not null);

create table public.member_prompts (
  id              uuid primary key default gen_random_uuid(),
  vault_id        uuid not null references public.vaults(id) on delete cascade,
  member_id       uuid not null references public.vault_members(id) on delete cascade,
  prompt_id       uuid references public.prompt_library(id) on delete set null,
  -- Custom prompt text (overrides prompt_library if set)
  custom_text_de  text,
  custom_text_en  text,
  scheduled_for   date not null,
  answered_at     timestamptz,
  entry_id        uuid references public.entries(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index on public.member_prompts(vault_id);
create index on public.member_prompts(member_id);
create index on public.member_prompts(scheduled_for);

alter table public.member_prompts enable row level security;

create policy "Vault members can view prompts in their vault"
  on public.member_prompts for select
  using (
    public.vault_member_role(vault_id, auth.uid()) is not null
  );

create policy "Initiators can manage prompts"
  on public.member_prompts for all
  using (
    public.vault_member_role(vault_id, auth.uid()) = 'initiator'
  );

-- =============================================================================
-- NOTIFICATIONS
-- In-app notification system
-- =============================================================================
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  vault_id    uuid references public.vaults(id) on delete cascade,
  type        text not null check (type in (
                'new_entry', 'new_member', 'prompt_ready', 'member_inactive', 'gap_detected'
              )),
  title_de    text not null,
  title_en    text not null,
  body_de     text,
  body_en     text,
  link        text,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index on public.notifications(user_id, read_at);

alter table public.notifications enable row level security;

create policy "Users see only own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can mark own notifications as read"
  on public.notifications for update
  using (user_id = auth.uid());

-- =============================================================================
-- SUBSCRIPTIONS
-- Track plan per vault (Stripe webhook will update this)
-- =============================================================================
create table public.subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  vault_id            uuid not null unique references public.vaults(id) on delete cascade,
  plan                text not null default 'free' check (plan in ('free', 'pro', 'family_plus')),
  stripe_customer_id  text,
  stripe_subscription_id text,
  current_period_end  timestamptz,
  cancelled_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Vault initiators can view subscription"
  on public.subscriptions for select
  using (
    public.vault_member_role(vault_id, auth.uid()) = 'initiator'
  );

-- =============================================================================
-- UPDATED_AT TRIGGER (reusable)
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_vaults_updated_at
  before update on public.vaults
  for each row execute function public.set_updated_at();

create trigger set_vault_members_updated_at
  before update on public.vault_members
  for each row execute function public.set_updated_at();

create trigger set_entries_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();

create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();
