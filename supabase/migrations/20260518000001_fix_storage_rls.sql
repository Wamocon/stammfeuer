-- =============================================================================
-- Migration: 20260518000001_fix_storage_rls.sql
-- Fix storage SELECT policy - simplify to check vault membership via path prefix
-- The old policy required an entry_media record to exist, which blocks upload preview
-- =============================================================================

-- Drop overly restrictive policy that requires entry_media record at read time
drop policy if exists "Vault members can read vault media" on storage.objects;

-- New policy: vault members can read any file stored under their vault's folder
-- Path format: {vault_id}/{filename}
create policy "Vault members can read vault media"
  on storage.objects for select
  using (
    bucket_id = 'vault-media'
    and auth.uid() is not null
    and exists (
      select 1 from public.vault_members
      where user_id = auth.uid()
        and vault_id = (string_to_array(name, '/'))[1]::uuid
    )
  );

-- Also fix the delete policy (contributors should be able to delete their own uploads)
drop policy if exists "Contributors can delete vault media" on storage.objects;

create policy "Contributors can delete vault media"
  on storage.objects for delete
  using (
    bucket_id = 'vault-media'
    and auth.uid() is not null
    and exists (
      select 1 from public.vault_members
      where user_id = auth.uid()
        and role in ('initiator', 'contributor')
        and vault_id = (string_to_array(name, '/'))[1]::uuid
    )
  );
