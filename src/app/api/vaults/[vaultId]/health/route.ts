// src/app/api/vaults/[vaultId]/health/route.ts
// GET /api/vaults/[vaultId]/health
// Returns vault health stats: entries per category, inactive members, timeline gaps

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { VaultHealth, CategorySlug, VaultMember } from '@/types/database'

const ALL_CATEGORIES: CategorySlug[] = ['stories', 'recipes', 'traditions', 'wisdom', 'places', 'photos']

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

  const { data: membership } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return NextResponse.json({ error: 'Not a member of this vault.' }, { status: 403 })
  }

  // Parallel queries
  const [entriesResult, membersResult] = await Promise.all([
    supabase
      .from('entries')
      .select('id, category_slug, created_at')
      .eq('vault_id', vaultId)
      .is('deleted_at', null),
    supabase
      .from('vault_members')
      .select('*, profile:profiles(id, full_name, avatar_url)')
      .eq('vault_id', vaultId),
  ])

  if (entriesResult.error || membersResult.error) {
    return NextResponse.json({ error: 'Failed to load vault data.' }, { status: 500 })
  }

  const entries = (entriesResult.data ?? []) as Array<{ id: string; category_slug: string; created_at: string }>
  const members = (membersResult.data ?? []) as unknown as VaultMember[]

  // Entries per category
  const entriesPerCategory = ALL_CATEGORIES.reduce((acc, slug) => {
    acc[slug] = entries.filter(e => e.category_slug === slug).length
    return acc
  }, {} as Record<CategorySlug, number>)

  // Missing categories (zero entries)
  const missingCategories = ALL_CATEGORIES.filter(slug => entriesPerCategory[slug] === 0)

  // Active member IDs (members who have at least 1 entry)
  // Re-query for author_id stats
  const { data: authorIdsRaw } = await supabase
    .from('entries')
    .select('author_id')
    .eq('vault_id', vaultId)
    .is('deleted_at', null)
    .not('author_id', 'is', null)

  const authorIds = (authorIdsRaw ?? []) as Array<{ author_id: string }>
  const activeAuthors = new Set(authorIds.map(r => r.author_id))

  const inactiveMembers = members.filter(
    m => m.user_id && !activeAuthors.has(m.user_id)
  )

  // Timeline gaps: years with no entries
  const currentYear = new Date().getFullYear()
  const entryYears = new Set(
    entries.map(e => new Date(e.created_at).getFullYear())
  )

  const timelineGaps: Array<{ start_year: number; end_year: number }> = []
  if (entries.length > 0) {
    const minYear = Math.min(...Array.from(entryYears))
    let gapStart: number | null = null

    for (let year = minYear; year <= currentYear; year++) {
      if (!entryYears.has(year)) {
        if (gapStart === null) gapStart = year
      } else {
        if (gapStart !== null) {
          timelineGaps.push({ start_year: gapStart, end_year: year - 1 })
          gapStart = null
        }
      }
    }
    if (gapStart !== null) {
      timelineGaps.push({ start_year: gapStart, end_year: currentYear })
    }
  }

  // Health score: simple weighted formula
  const categoryCoverage = (ALL_CATEGORIES.length - missingCategories.length) / ALL_CATEGORIES.length
  const memberActivity = members.length > 0
    ? (members.length - inactiveMembers.length) / members.length
    : 1
  const entryVolume = Math.min(entries.length / 20, 1) // 20 entries = full score
  const healthScore = Math.round((categoryCoverage * 0.4 + memberActivity * 0.3 + entryVolume * 0.3) * 100)

  const health: VaultHealth = {
    vault_id: vaultId,
    total_entries: entries.length,
    entries_per_category: entriesPerCategory,
    active_members: members.length - inactiveMembers.length,
    inactive_members: inactiveMembers,
    missing_categories: missingCategories,
    timeline_gaps: timelineGaps,
    health_score: healthScore,
  }

  return NextResponse.json({ health })
}
