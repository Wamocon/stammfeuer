// src/app/api/vaults/[vaultId]/family/relationships/route.ts
// POST /api/vaults/[vaultId]/family/relationships - create a relationship

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ vaultId: string }>
}

export async function POST(req: Request, { params }: RouteContext) {
  const { vaultId } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { person_a_id, person_b_id, relationship_type } = body

  if (!person_a_id || !person_b_id || !relationship_type) {
    return NextResponse.json({ error: 'person_a_id, person_b_id, and relationship_type are required' }, { status: 400 })
  }

  if (!['parent_child', 'partner'].includes(relationship_type)) {
    return NextResponse.json({ error: 'Invalid relationship_type' }, { status: 400 })
  }

  if (person_a_id === person_b_id) {
    return NextResponse.json({ error: 'A person cannot be related to themselves' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('family_relationships')
    .insert({ vault_id: vaultId, person_a_id, person_b_id, relationship_type })
    .select()
    .single()

  if (error) {
    // unique violation = relationship already exists
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Relationship already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ relationship: data }, { status: 201 })
}
