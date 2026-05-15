// src/app/api/vaults/route.ts
// GET  /api/vaults - list vaults for current user
// POST /api/vaults - create a new vault

import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

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

  // Use service role to bypass RLS - the vault_members INSERT policy blocks
  // the handle_vault_created trigger because the owner is not yet a member
  // when the trigger fires. Service role bypasses RLS entirely.
  const service = createSupabaseServiceClient()

  // Ensure profile exists (in case handle_new_user trigger didn't fire)
  await service
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || '',
    })

  const { data, error } = await service
    .from('vaults')
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      cover_url: cover_url || null,
      owner_id: user.id,
      plan: 'free',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vault: data }, { status: 201 })
}
