import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { MemberList } from '@/components/members/MemberList'
import { InviteForm } from '@/components/members/InviteForm'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Modal } from '@/components/ui/Modal'
import MembersPageClient from './_MembersPageClient'
import type { VaultMember } from '@/types/database'

interface MembersPageProps {
  params: Promise<{ locale: string; vaultId: string }>
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { locale, vaultId } = await params
  const t = await getTranslations('members')

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const { data: vault } = await supabase.from('vaults').select('name').eq('id', vaultId).single()
  if (!vault) notFound()

  const { data: membership } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()
  if (!membership) redirect(`/${locale}/dashboard`)

  const { data: membersRaw } = await supabase
    .from('vault_members')
    .select('*, profile:profiles(*)')
    .eq('vault_id', vaultId)
    .order('created_at')

  const members = (membersRaw ?? []) as VaultMember[]

  return (
    <MembersPageClient
      locale={locale}
      vaultId={vaultId}
      vaultName={vault.name}
      members={members}
      currentUserId={user.id}
      currentRole={membership.role}
    />
  )
}
