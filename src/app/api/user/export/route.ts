// src/app/api/user/export/route.ts
// GET /api/user/export
// DSGVO: export all user data as JSON ZIP

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Collect all user data in parallel
  const [profileResult, vaultsResult, entriesResult, memberResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('vaults').select('*').eq('owner_id', user.id),
    supabase.from('entries').select('*, media:entry_media(*)').eq('author_id', user.id).is('deleted_at', null),
    supabase.from('vault_members').select('*, vault:vaults(id, name)').eq('user_id', user.id),
  ])

  const exportData = {
    exported_at: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
    },
    profile: profileResult.data,
    owned_vaults: vaultsResult.data ?? [],
    vault_memberships: memberResult.data ?? [],
    entries: entriesResult.data ?? [],
  }

  const json = JSON.stringify(exportData, null, 2)
  const encoder = new TextEncoder()
  const bytes = encoder.encode(json)

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="stammfeuer-export-${user.id}.json"`,
    },
  })
}
