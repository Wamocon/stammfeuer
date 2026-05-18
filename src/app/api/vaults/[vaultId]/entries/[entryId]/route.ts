// src/app/api/vaults/[vaultId]/entries/[entryId]/route.ts
// GET    /api/vaults/[vaultId]/entries/[entryId]  - get single entry
// PATCH  /api/vaults/[vaultId]/entries/[entryId]  - update entry
// DELETE /api/vaults/[vaultId]/entries/[entryId]  - soft-delete entry

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { MemberRole } from '@/types/database'

interface RouteParams {
  params: Promise<{ vaultId: string; entryId: string }>
}

async function getAuthorizedEntry(vaultId: string, entryId: string) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Unauthorized', status: 401, supabase, user: null, entry: null, membership: null }

  const [{ data: entry }, { data: membershipRaw }] = await Promise.all([
    supabase.from('entries').select('*, media:entry_media(*)').eq('id', entryId).eq('vault_id', vaultId).is('deleted_at', null).single(),
    supabase.from('vault_members').select('role').eq('vault_id', vaultId).eq('user_id', user.id).single(),
  ])

  if (!membershipRaw) return { error: 'Not a member of this vault.', status: 403, supabase, user, entry: null, membership: null }
  if (!entry) return { error: 'Entry not found.', status: 404, supabase, user, entry: null, membership: null }

  return { error: null, status: 200, supabase, user, entry, membership: membershipRaw as { role: MemberRole } }
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { vaultId, entryId } = await params
  const { error, status, entry } = await getAuthorizedEntry(vaultId, entryId)
  if (error) return NextResponse.json({ error }, { status })
  return NextResponse.json({ entry })
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { vaultId, entryId } = await params
  const { error, status, supabase, user, entry, membership } = await getAuthorizedEntry(vaultId, entryId)
  if (error || !user || !entry || !membership) return NextResponse.json({ error }, { status })

  // Only initiator, contributor, or the author can edit
  const canEdit =
    membership.role === 'initiator' ||
    membership.role === 'contributor' ||
    entry.author_id === user.id

  if (!canEdit) return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 })

  const body = await request.json()
  const { title, body: entryBody, category_slug, lang, metadata, on_behalf_of, media_paths } = body

  if (title !== undefined && !title?.trim()) {
    return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  if (title !== undefined) updates.title = title.trim()
  if (entryBody !== undefined) updates.body = entryBody?.trim() || null
  if (category_slug !== undefined) updates.category_slug = category_slug
  if (lang !== undefined) updates.lang = lang
  if (metadata !== undefined) updates.metadata = metadata
  if (on_behalf_of !== undefined) updates.on_behalf_of = on_behalf_of || null

  const { data, error: updateError } = await supabase
    .from('entries')
    .update(updates as never)
    .eq('id', entryId)
    .select()
    .single()

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  // Replace media if new paths provided
  if (Array.isArray(media_paths)) {
    // Remove old media rows
    await supabase.from('entry_media').delete().eq('entry_id', entryId)

    if (media_paths.length > 0) {
      const extToMime: Record<string, string> = {
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
        gif: 'image/gif', webp: 'image/webp', heic: 'image/heic',
      }
      const mediaRows = media_paths.map((storage_path: string, idx: number) => {
        const ext = storage_path.split('.').pop()?.toLowerCase() ?? 'jpg'
        return {
          entry_id: entryId,
          vault_id: vaultId,
          uploader_id: user.id,
          storage_path,
          mime_type: extToMime[ext] ?? 'image/jpeg',
          sort_order: idx,
        }
      })
      await supabase.from('entry_media').insert(mediaRows)
    }
  }

  return NextResponse.json({ entry: data })
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const { vaultId, entryId } = await params
  const { error, status, supabase, user, entry, membership } = await getAuthorizedEntry(vaultId, entryId)
  if (error || !user || !entry || !membership) return NextResponse.json({ error }, { status })

  // Only initiator or the author can delete
  const canDelete = membership.role === 'initiator' || entry.author_id === user.id
  if (!canDelete) return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 })

  const { error: deleteError } = await supabase
    .from('entries')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', entryId)

  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 })

  return NextResponse.json({ deleted: true })
}
