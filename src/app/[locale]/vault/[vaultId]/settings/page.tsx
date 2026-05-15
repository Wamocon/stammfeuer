import { redirect, notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import VaultSettingsForm from './_VaultSettingsForm'

interface VaultSettingsPageProps {
  params: Promise<{ locale: string; vaultId: string }>
}

export default async function VaultSettingsPage({ params }: VaultSettingsPageProps) {
  const { locale, vaultId } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const { data: vault } = await supabase.from('vaults').select('*').eq('id', vaultId).single()
  if (!vault) notFound()

  const { data: membership } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()
  if (!membership || membership.role !== 'initiator') redirect(`/${locale}/vault/${vaultId}`)

  return <VaultSettingsForm locale={locale} vault={vault} />
}
