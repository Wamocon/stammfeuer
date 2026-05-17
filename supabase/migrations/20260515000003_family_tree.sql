-- =============================================================================
-- Migration: 20260515000003_family_tree.sql
-- Stammfeuer - Family tree data model
-- =============================================================================

-- =============================================================================
-- FAMILY PERSONS
-- Represents a person in the family tree. Can exist without an app account.
-- Optionally linked to a vault_member once they join the app.
-- =============================================================================
create table public.family_persons (
  id          uuid primary key default gen_random_uuid(),
  vault_id    uuid not null references public.vaults(id) on delete cascade,
  -- Optional link to a vault member (set when the person has an app account)
  member_id   uuid references public.vault_members(id) on delete set null,
  full_name   text not null,
  birth_year  smallint,
  death_year  smallint,
  avatar_url  text,
  bio         text,
  gender      text check (gender in ('male', 'female', 'other')),
  -- Canvas position persisted per person so layout survives page reload
  pos_x       float not null default 0,
  pos_y       float not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index on public.family_persons(vault_id);
create index on public.family_persons(member_id);

alter table public.family_persons enable row level security;

create policy "Vault members can view family persons"
  on public.family_persons for select
  using (public.vault_member_role(vault_id, auth.uid()) is not null);

create policy "Contributors and initiators can insert family persons"
  on public.family_persons for insert
  with check (public.vault_member_role(vault_id, auth.uid()) in ('initiator', 'contributor'));

create policy "Contributors and initiators can update family persons"
  on public.family_persons for update
  using (public.vault_member_role(vault_id, auth.uid()) in ('initiator', 'contributor'));

create policy "Initiators can delete family persons"
  on public.family_persons for delete
  using (public.vault_member_role(vault_id, auth.uid()) = 'initiator');

-- =============================================================================
-- FAMILY RELATIONSHIPS
-- Edges in the family graph.
-- relationship_type:
--   'parent_child'  -> person_a is the parent, person_b is the child
--   'partner'       -> person_a and person_b are partners/spouses
-- =============================================================================
create table public.family_relationships (
  id                uuid primary key default gen_random_uuid(),
  vault_id          uuid not null references public.vaults(id) on delete cascade,
  person_a_id       uuid not null references public.family_persons(id) on delete cascade,
  person_b_id       uuid not null references public.family_persons(id) on delete cascade,
  relationship_type text not null check (relationship_type in ('parent_child', 'partner')),
  created_at        timestamptz not null default now(),

  -- Prevent duplicate relationships in either direction
  unique (person_a_id, person_b_id, relationship_type),
  -- Self-relationships are not allowed
  check (person_a_id <> person_b_id)
);

create index on public.family_relationships(vault_id);
create index on public.family_relationships(person_a_id);
create index on public.family_relationships(person_b_id);

alter table public.family_relationships enable row level security;

create policy "Vault members can view family relationships"
  on public.family_relationships for select
  using (public.vault_member_role(vault_id, auth.uid()) is not null);

create policy "Contributors and initiators can insert family relationships"
  on public.family_relationships for insert
  with check (public.vault_member_role(vault_id, auth.uid()) in ('initiator', 'contributor'));

create policy "Contributors and initiators can delete family relationships"
  on public.family_relationships for delete
  using (public.vault_member_role(vault_id, auth.uid()) in ('initiator', 'contributor'));
