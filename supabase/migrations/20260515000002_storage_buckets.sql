-- =============================================================================
-- Migration: 20260515000002_storage_buckets.sql
-- Stammfeuer - Storage bucket configuration
-- =============================================================================

-- Vault cover images + entry photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vault-media',
  'vault-media',
  false,
  10485760, -- 10 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Avatar photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  false,
  2097152, -- 2 MB
  array['image/jpeg', 'image/png', 'image/webp']
);

-- Audio recordings from voice input (stored temporarily, transcribed, then discarded)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'audio-temp',
  'audio-temp',
  false,
  52428800, -- 50 MB
  array['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/wav']
);

-- =============================================================================
-- Storage RLS policies
-- =============================================================================

-- vault-media: vault members can read, contributors can upload
create policy "Vault members can read vault media"
  on storage.objects for select
  using (
    bucket_id = 'vault-media'
    and auth.uid() is not null
    and exists (
      select 1 from public.vault_members vm
      join public.entries e on e.vault_id = vm.vault_id
      join public.entry_media em on em.entry_id = e.id
      where vm.user_id = auth.uid()
        and em.storage_path = name
    )
  );

create policy "Contributors can upload vault media"
  on storage.objects for insert
  with check (
    bucket_id = 'vault-media'
    and auth.uid() is not null
    -- path format: vault-media/{vault_id}/{entry_id}/{filename}
    and exists (
      select 1 from public.vault_members
      where user_id = auth.uid()
        and role in ('initiator', 'contributor')
        and vault_id = (string_to_array(name, '/'))[1]::uuid
    )
  );

-- avatars: users can manage their own avatar
create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    -- path format: avatars/{user_id}/{filename}
    and (string_to_array(name, '/'))[1]::uuid = auth.uid()
  );

create policy "Users can update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (string_to_array(name, '/'))[1]::uuid = auth.uid()
  );

create policy "Authenticated users can read avatars"
  on storage.objects for select
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
  );

-- audio-temp: user can upload and delete their own temp audio
create policy "Users can upload own temp audio"
  on storage.objects for insert
  with check (
    bucket_id = 'audio-temp'
    and auth.uid() is not null
    and (string_to_array(name, '/'))[1]::uuid = auth.uid()
  );

create policy "Users can delete own temp audio"
  on storage.objects for delete
  using (
    bucket_id = 'audio-temp'
    and (string_to_array(name, '/'))[1]::uuid = auth.uid()
  );
