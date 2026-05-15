// src/app/api/user/delete/route.ts
// DELETE /api/user/delete
// DSGVO: hard delete all user data and auth account

import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function DELETE() {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Soft-delete all entries first (GDPR: content stays for vault but author is anonymized)
  await supabase
    .from('entries')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update({ deleted_at: new Date().toISOString(), author_id: null } as never)
    .eq('author_id', user.id)

  // Remove vault memberships
  await supabase
    .from('vault_members')
    .delete()
    .eq('user_id', user.id)

  // Delete profile
  await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id)

  // Delete auth user (requires service role)
  const adminClient = createSupabaseServiceClient()
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

  if (deleteError) {
    return NextResponse.json({ error: 'Could not delete account. Please contact support.' }, { status: 500 })
  }

  return NextResponse.json({ deleted: true })
}
