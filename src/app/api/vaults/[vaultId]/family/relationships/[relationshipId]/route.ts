// src/app/api/vaults/[vaultId]/family/relationships/[relationshipId]/route.ts
// DELETE /api/vaults/[vaultId]/family/relationships/[relationshipId]

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ vaultId: string; relationshipId: string }>
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { vaultId, relationshipId } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('family_relationships')
    .delete()
    .eq('id', relationshipId)
    .eq('vault_id', vaultId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return new NextResponse(null, { status: 204 })
}
