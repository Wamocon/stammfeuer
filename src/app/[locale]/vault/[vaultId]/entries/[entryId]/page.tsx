import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CategoryIcon } from '@/components/vault/CategoryIcon'
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

  const { data: entryRaw } = await supabase
    .from('entries')
    .select('*, author:profiles(*), media:entry_media(*)')
    .eq('id', entryId)
    .eq('vault_id', vaultId)
    .is('deleted_at', null)
    .single()

  if (!entryRaw) notFound()

  const entry = entryRaw as Entry
  const { data: vault } = await supabase.from('vaults').select('name').eq('id', vaultId).single()

  const formattedDate = new Date(entry.created_at).toLocaleDateString(
    locale === 'de' ? 'de-DE' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/${locale}/dashboard` },
          { label: vault?.name ?? 'Vault', href: `/${locale}/vault/${vaultId}` },
          { label: 'Einträge', href: `/${locale}/vault/${vaultId}/entries` },
          { label: entry.title },
        ]}
      />

      {/* Header */}
      <div className="space-y-3">
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

      {/* Body */}
      {entry.body && (
        <div className="prose prose-gray dark:prose-invert max-w-none">
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

      {/* Translation tab placeholder */}
      <div className="border-t border-border pt-6">
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg p-4 text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
          {t('translationComingSoon')}
        </div>
      </div>

      <div>
        <Link
          href={`/${locale}/vault/${vaultId}/entries`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Zurück zu den Einträgen
        </Link>
      </div>
    </div>
  )
}
