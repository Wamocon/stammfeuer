// src/app/api/invite/[token]/route.ts
// GET  /api/invite/[token] - validate token and return invite info
// POST /api/invite/[token] - accept the invitation (must be authenticated)

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ token: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { token } = await params
  const supabase = await createSupabaseServerClient()

  const { data: rawData, error } = await supabase
    .from('vault_members')
    .select(`
      id,
      role,
      family_role,
      invite_email,
      invite_accepted_at,
      vault:vaults (
        id, name, description, cover_url
      )
    `)
    .eq('invite_token', token)
    .single()

  const data = rawData as {
    id: string; role: string; family_role: string | null
    invite_email: string | null; invite_accepted_at: string | null
    vault: { id: string; name: string; description: string | null; cover_url: string | null } | null
  } | null

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid or expired invite link.' }, { status: 404 })
  }

  if (data.invite_accepted_at) {
    return NextResponse.json({ error: 'Invite already accepted.' }, { status: 410 })
  }

  return NextResponse.json({ invite: data })
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { token } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'You must be logged in to accept an invitation.' }, { status: 401 })
  }

  const { data: inviteRaw, error: inviteError } = await supabase
    .from('vault_members')
    .select('id, invite_accepted_at, vault_id')
    .eq('invite_token', token)
    .single()

  const invite = inviteRaw as { id: string; invite_accepted_at: string | null; vault_id: string } | null

  if (inviteError || !invite) {
    return NextResponse.json({ error: 'Invalid invite token.' }, { status: 404 })
  }

  if (invite.invite_accepted_at) {
    return NextResponse.json({ error: 'Invite already accepted.' }, { status: 410 })
  }

  // Check not already a member via another route
  const { data: existing } = await supabase
    .from('vault_members')
    .select('id')
    .eq('vault_id', invite.vault_id)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Already a member of this vault.' }, { status: 409 })
  }

  const { error: updateError } = await supabase
    .from('vault_members')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update({
      user_id: user.id,
      invite_accepted_at: new Date().toISOString(),
      invite_token: null,
    } as never)
    .eq('id', invite.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ vault_id: invite.vault_id })
}
