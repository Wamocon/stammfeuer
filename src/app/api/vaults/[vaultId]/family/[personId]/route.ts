// src/app/api/vaults/[vaultId]/family/[personId]/route.ts
// PUT    /api/vaults/[vaultId]/family/[personId]  - update person
// DELETE /api/vaults/[vaultId]/family/[personId]  - delete person

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ vaultId: string; personId: string }>
}

// -------------------------------------------------------------------------
// PUT - update a family person (including linking/unlinking a vault member)
// -------------------------------------------------------------------------
export async function PUT(req: Request, { params }: RouteContext) {
  const { vaultId, personId } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { full_name, birth_year, death_year, gender, bio, pos_x, pos_y, member_id } = body

  // Build update object - only include defined fields
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (full_name !== undefined) updates.full_name = String(full_name).trim()
  if (birth_year !== undefined) updates.birth_year = birth_year ?? null
  if (death_year !== undefined) updates.death_year = death_year ?? null
  if (gender !== undefined) updates.gender = gender ?? null
  if (bio !== undefined) updates.bio = bio ?? null
  if (pos_x !== undefined) updates.pos_x = pos_x
  if (pos_y !== undefined) updates.pos_y = pos_y
  // member_id can be set to null to unlink, or a uuid to link
  if ('member_id' in body) updates.member_id = member_id ?? null

  const { data, error } = await supabase
    .from('family_persons')
    .update(updates)
    .eq('id', personId)
    .eq('vault_id', vaultId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ person: data })
}

// -------------------------------------------------------------------------
// DELETE - remove a family person (cascade removes their relationships)
// -------------------------------------------------------------------------
export async function DELETE(_req: Request, { params }: RouteContext) {
  const { vaultId, personId } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('family_persons')
    .delete()
    .eq('id', personId)
    .eq('vault_id', vaultId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return new NextResponse(null, { status: 204 })
}
