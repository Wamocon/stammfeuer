// src/app/api/vaults/[vaultId]/entries/route.ts
// GET  /api/vaults/[vaultId]/entries  - list entries (with filters)
// POST /api/vaults/[vaultId]/entries  - create a new entry

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/types/database'
import type { CategorySlug, MemberRole, Plan } from '@/types/database'

interface RouteParams {
  params: Promise<{ vaultId: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { vaultId } = await params
  const { searchParams } = new URL(request.url)

  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify membership
  const { data: membershipRaw } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  const membership = membershipRaw as { role: MemberRole } | null
  if (!membership) {
    return NextResponse.json({ error: 'Not a member of this vault.' }, { status: 403 })
  }

  let query = supabase
    .from('entries')
    .select(`
      *,
      author:profiles!entries_author_id_fkey (
        id, full_name, avatar_url
      ),
      media:entry_media (
        id, storage_path, mime_type, caption, sort_order
      )
    `)
    .eq('vault_id', vaultId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  // Filters
  const category = searchParams.get('category') as CategorySlug | null
  const memberId = searchParams.get('member_id')
  const search = searchParams.get('q')
  const yearFrom = searchParams.get('year_from')
  const yearTo = searchParams.get('year_to')

  if (category) query = query.eq('category_slug', category)
  if (memberId) query = query.eq('author_id', memberId)
  if (search) query = query.textSearch('title', search, { type: 'websearch' })
  if (yearFrom) query = query.gte('created_at', `${yearFrom}-01-01`)
  if (yearTo) query = query.lte('created_at', `${yearTo}-12-31`)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ entries: data })
}

export async function POST(request: Request, { params }: RouteParams) {
  const { vaultId } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify contributor role
  const { data: membershipRaw2 } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  const membership2 = membershipRaw2 as { role: MemberRole } | null
  if (!membership2 || !(['initiator', 'contributor'] as MemberRole[]).includes(membership2.role)) {
    return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 })
  }

  // Check freemium entry limit
  const { data: vaultRaw } = await supabase
    .from('vaults')
    .select('plan')
    .eq('id', vaultId)
    .single()

  const vault = vaultRaw as { plan: Plan } | null

  if (vault) {
    const limit = PLAN_LIMITS[vault.plan].max_entries
    if (limit !== Infinity) {
      const { count } = await supabase
        .from('entries')
        .select('id', { count: 'exact', head: true })
        .eq('vault_id', vaultId)
        .is('deleted_at', null)

      if (count !== null && count >= limit) {
        return NextResponse.json(
          { error: 'freemium_entry_limit', limit },
          { status: 402 }
        )
      }
    }
  }

  const body = await request.json()
  const { title, body: entryBody, category_slug, lang, metadata, on_behalf_of } = body

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
  }

  if (category_slug === 'photos' && !metadata?.description) {
    return NextResponse.json({ error: 'Photo description is required.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('entries')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({
      vault_id: vaultId,
      author_id: user.id,
      title: title.trim(),
      body: entryBody?.trim() || null,
      category_slug,
      lang: lang || 'de',
      metadata: metadata || {},
      on_behalf_of: on_behalf_of || null,
    } as never)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ entry: data }, { status: 201 })
}
