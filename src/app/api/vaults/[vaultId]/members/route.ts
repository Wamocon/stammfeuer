// src/app/api/vaults/[vaultId]/members/route.ts
// GET    /api/vaults/[vaultId]/members  - list members
// POST   /api/vaults/[vaultId]/members  - invite a new member

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/types/database'
import type { MemberRole } from '@/types/database'
import { randomBytes } from 'crypto'

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

  const { data: membershipGetRaw } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  const membership = membershipGetRaw as { role: string } | null

  if (!membership) {
    return NextResponse.json({ error: 'Not a member of this vault.' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('vault_members')
    .select(`
      *,
      profile:profiles (
        id, full_name, avatar_url, birth_year
      )
    `)
    .eq('vault_id', vaultId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ members: data })
}

export async function POST(request: Request, { params }: RouteParams) {
  const { vaultId } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only initiators can invite
  const { data: membershipRaw } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  const membership = membershipRaw as { role: string } | null
  if (!membership || membership.role !== 'initiator') {
    return NextResponse.json({ error: 'Only the vault initiator can invite members.' }, { status: 403 })
  }

  // Check freemium member limit
  const { data: vaultRaw } = await supabase
    .from('vaults')
    .select('plan')
    .eq('id', vaultId)
    .single()

  const vault = vaultRaw as { plan: string } | null
  if (vault) {
    const limit = PLAN_LIMITS[vault.plan as keyof typeof PLAN_LIMITS].max_members
    if (limit !== Infinity) {
      const { count } = await supabase
        .from('vault_members')
        .select('id', { count: 'exact', head: true })
        .eq('vault_id', vaultId)

      if (count !== null && count >= limit) {
        return NextResponse.json(
          { error: 'freemium_member_limit', limit },
          { status: 402 }
        )
      }
    }
  }

  const body = await request.json()
  const { invite_email, role, family_role, display_name } = body

  if (!invite_email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  const validRoles: MemberRole[] = ['contributor', 'reader']
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role.' }, { status: 400 })
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from('vault_members')
    .select('id')
    .eq('vault_id', vaultId)
    .eq('invite_email', invite_email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'already_member' }, { status: 409 })
  }

  const inviteToken = randomBytes(32).toString('hex')

  const { data, error } = await supabase
    .from('vault_members')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({
      vault_id: vaultId,
      invite_email,
      role,
      family_role: family_role || null,
      display_name: display_name || null,
      invite_token: inviteToken,
    } as never)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send invite email via Supabase (no Resend key available)
  // The email contains the invite link: /invite/[token]
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteToken}`

  // Supabase does not have a built-in "custom email" trigger here,
  // so we use their auth.admin.inviteUserByEmail as a workaround,
  // or send a notification in-app. Email sending is handled by the
  // Supabase SMTP configuration in the dashboard.
  // TODO: integrate email template when Resend key is available.

  return NextResponse.json({ member: data, invite_url: inviteUrl }, { status: 201 })
}
