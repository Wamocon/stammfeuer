// src/app/api/vaults/[vaultId]/family/route.ts
// GET  /api/vaults/[vaultId]/family  - list all family persons + relationships
// POST /api/vaults/[vaultId]/family  - create a family person

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ vaultId: string }>
}

// -------------------------------------------------------------------------
// GET - list persons and relationships for the vault
// -------------------------------------------------------------------------
export async function GET(_req: Request, { params }: RouteContext) {
  const { vaultId } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify membership (RLS will also enforce this, belt-and-suspenders)
  const { data: membership } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [{ data: persons, error: pErr }, { data: relationships, error: rErr }] =
    await Promise.all([
      supabase
        .from('family_persons')
        .select('*, member:vault_members(id, user_id, display_name, family_role, profile:profiles(*))')
        .eq('vault_id', vaultId)
        .order('created_at', { ascending: true }),
      supabase
        .from('family_relationships')
        .select('*')
        .eq('vault_id', vaultId),
    ])

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })
  if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 })

  return NextResponse.json({ persons: persons ?? [], relationships: relationships ?? [] })
}

// -------------------------------------------------------------------------
// POST - create a family person
// -------------------------------------------------------------------------
export async function POST(req: Request, { params }: RouteContext) {
  const { vaultId } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { full_name, birth_year, death_year, gender, bio, pos_x, pos_y } = body

  if (!full_name || String(full_name).trim().length < 1) {
    return NextResponse.json({ error: 'full_name is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('family_persons')
    .insert({
      vault_id: vaultId,
      full_name: String(full_name).trim(),
      birth_year: birth_year ?? null,
      death_year: death_year ?? null,
      gender: gender ?? null,
      bio: bio ?? null,
      pos_x: pos_x ?? 0,
      pos_y: pos_y ?? 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ person: data }, { status: 201 })
}
