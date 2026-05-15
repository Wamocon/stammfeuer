// src/app/api/vaults/route.ts
// GET  /api/vaults - list vaults for current user
// POST /api/vaults - create a new vault

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/types/database'

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('vaults')
    .select(`
      *,
      vault_members!inner (
        role,
        user_id
      )
    `)
    .eq('vault_members.user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vaults: data })
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, cover_url } = body

  if (!name || name.trim().length < 3) {
    return NextResponse.json({ error: 'Vault name must be at least 3 characters.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('vaults')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      cover_url: cover_url || null,
      owner_id: user.id,
      plan: 'free',
    } as never)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vault: data }, { status: 201 })
}
