import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { EntryForm } from '@/components/entries/EntryForm'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import type { Entry, MemberRole } from '@/types/database'

interface EditEntryPageProps {
  params: Promise<{ locale: string; vaultId: string; entryId: string }>
}

export default async function EditEntryPage({ params }: EditEntryPageProps) {
  const { locale, vaultId, entryId } = await params
  const t = await getTranslations('entries')

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const [{ data: entryRaw }, { data: vault }, { data: membershipRaw }] = await Promise.all([
    supabase
      .from('entries')
      .select('*')
      .eq('id', entryId)
      .eq('vault_id', vaultId)
      .is('deleted_at', null)
      .single(),
    supabase.from('vaults').select('name').eq('id', vaultId).single(),
    supabase
      .from('vault_members')
      .select('role')
      .eq('vault_id', vaultId)
      .eq('user_id', user.id)
      .single(),
  ])

  if (!entryRaw || !vault) notFound()

  const entry = entryRaw as Entry
  const membership = membershipRaw as { role: MemberRole } | null

  const canEdit =
    membership?.role === 'initiator' ||
    membership?.role === 'contributor' ||
    entry.author_id === user.id

  if (!canEdit) redirect(`/${locale}/vault/${vaultId}/entries/${entryId}`)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/${locale}/dashboard` },
          { label: vault.name, href: `/${locale}/vault/${vaultId}` },
          { label: 'Einträge', href: `/${locale}/vault/${vaultId}/entries` },
          { label: entry.title, href: `/${locale}/vault/${vaultId}/entries/${entryId}` },
          { label: t('edit') },
        ]}
      />
      <h1 className="text-3xl font-bold text-foreground">{t('edit')}</h1>
      <EntryForm
        vaultId={vaultId}
        locale={locale}
        entryId={entryId}
        initialData={{
          title: entry.title,
          body: entry.body ?? '',
          category_slug: entry.category_slug,
          lang: entry.lang,
          metadata: entry.metadata ?? {},
        }}
      />
    </div>
  )
}
