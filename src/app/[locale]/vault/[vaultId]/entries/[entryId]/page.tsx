import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CategoryIcon } from '@/components/vault/CategoryIcon'
import { EntryActions } from './_EntryActions'
import type { Entry } from '@/types/database'
import { ArrowLeft } from 'lucide-react'

interface EntryPageProps {
  params: Promise<{ locale: string; vaultId: string; entryId: string }>
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { locale, vaultId, entryId } = await params
  const tCat = await getTranslations('categories')
  const t = await getTranslations('entries')

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const [{ data: entryRaw }, { data: vault }, { data: membership }] = await Promise.all([
    supabase
      .from('entries')
      .select('*, author:profiles(*), media:entry_media(*)')
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

  if (!entryRaw) notFound()

  const entry = entryRaw as Entry
  const canEdit =
    membership?.role === 'initiator' ||
    membership?.role === 'contributor' ||
    entry.author_id === user.id

  const formattedDate = new Date(entry.created_at).toLocaleDateString(
    locale === 'de' ? 'de-DE' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/${locale}/dashboard` },
          { label: vault?.name ?? 'Archiv', href: `/${locale}/vault/${vaultId}` },
          { label: 'Einträge', href: `/${locale}/vault/${vaultId}/entries` },
          { label: entry.title },
        ]}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <CategoryIcon slug={entry.category_slug} size={20} />
            <Badge variant={entry.category_slug}>{tCat(entry.category_slug)}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground leading-tight">{entry.title}</h1>
          <div className="flex items-center gap-3">
            <Avatar name={entry.author?.full_name} src={entry.author?.avatar_url} size="md" />
            <div>
              <p className="text-sm font-medium text-foreground">{entry.author?.full_name ?? '—'}</p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
        </div>
        {canEdit && (
          <EntryActions
            locale={locale}
            vaultId={vaultId}
            entryId={entryId}
            editHref={`/${locale}/vault/${vaultId}/entries/${entryId}/edit`}
          />
        )}
      </div>

      {/* Body */}
      {entry.body && (
        <div className="border-t border-border pt-6">
          <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">{entry.body}</p>
        </div>
      )}

      {/* Media */}
      {entry.media && entry.media.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {entry.media.map((m) => (
            m.public_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={m.id}
                src={m.public_url}
                alt={m.caption ?? 'Foto'}
                className="rounded-xl w-full object-cover aspect-square"
              />
            )
          ))}
        </div>
      )}

      {/* Translation hint */}
      <div className="border-t border-border pt-6">
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg p-4 text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
          {t('translationComingSoon')}
        </div>
      </div>

      <div>
        <Link
          href={`/${locale}/vault/${vaultId}/entries`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-600 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Zurück zu den Einträgen
        </Link>
      </div>
    </div>
  )
}
