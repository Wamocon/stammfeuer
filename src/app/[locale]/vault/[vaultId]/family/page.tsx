import { redirect, notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import FamilyPageClient from './_FamilyPageClient'
import type { FamilyPerson, FamilyRelationship, VaultMember, MemberRole } from '@/types/database'

interface FamilyPageProps {
  params: Promise<{ locale: string; vaultId: string }>
  searchParams: Promise<{ tab?: string }>
}

export default async function FamilyPage({ params, searchParams }: FamilyPageProps) {
  const { locale, vaultId } = await params
  const { tab } = await searchParams
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const [{ data: vault }, { data: membership }] = await Promise.all([
    supabase.from('vaults').select('id, name').eq('id', vaultId).single(),
    supabase
      .from('vault_members')
      .select('role')
      .eq('vault_id', vaultId)
      .eq('user_id', user.id)
      .single(),
  ])

  if (!vault) notFound()
  if (!membership) redirect(`/${locale}/dashboard`)

  const [{ data: personsRaw }, { data: relationshipsRaw }, { data: membersRaw }] =
    await Promise.all([
      supabase
        .from('family_persons')
        .select('*, member:vault_members(id, user_id, display_name, family_role, profile:profiles(*))')
        .eq('vault_id', vaultId)
        .order('created_at', { ascending: true }),
      supabase.from('family_relationships').select('*').eq('vault_id', vaultId),
      supabase.from('vault_members').select('*, profile:profiles(*)').eq('vault_id', vaultId),
    ])

  const persons = (personsRaw ?? []) as FamilyPerson[]
  const relationships = (relationshipsRaw ?? []) as FamilyRelationship[]
  const members = (membersRaw ?? []) as VaultMember[]

  return (
    <FamilyPageClient
      locale={locale}
      vaultId={vaultId}
      vaultName={vault.name}
      persons={persons}
      relationships={relationships}
      members={members}
      currentUserId={user.id}
      currentRole={membership.role as MemberRole}
      defaultTab={tab === 'members' ? 'members' : 'tree'}
    />
  )
}
