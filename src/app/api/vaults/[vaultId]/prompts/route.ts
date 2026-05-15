// src/app/api/vaults/[vaultId]/prompts/route.ts
// GET  /api/vaults/[vaultId]/prompts - get active prompts for vault members
// POST /api/vaults/[vaultId]/prompts/assign - assign this week's prompt to a member

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ vaultId: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { vaultId } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: membershipRaw } = await supabase
    .from('vault_members')
    .select('id, role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  const membership = membershipRaw as { id: string; role: string } | null
  if (!membership) {
    return NextResponse.json({ error: 'Not a member.' }, { status: 403 })
  }

  // Get this week's prompt for the current user's membership
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  const { data: prompts, error } = await supabase
    .from('member_prompts')
    .select(`
      *,
      prompt:prompt_library (*)
    `)
    .eq('vault_id', vaultId)
    .eq('member_id', membership.id)
    .gte('scheduled_for', weekStart.toISOString().split('T')[0])
    .is('answered_at', null)
    .order('scheduled_for', { ascending: false })
    .limit(5)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ prompts: prompts ?? [] })
}
