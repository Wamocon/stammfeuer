import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { EntryCard } from '@/components/entries/EntryCard'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Badge } from '@/components/ui/Badge'
import { Plus } from 'lucide-react'
import type { Entry, CategorySlug } from '@/types/database'

interface EntriesPageProps {
  params: Promise<{ locale: string; vaultId: string }>
  searchParams: Promise<{ category?: string; year?: string }>
}

const SLUGS: CategorySlug[] = ['stories', 'recipes', 'traditions', 'wisdom', 'places', 'photos']

export default async function EntriesPage({ params, searchParams }: EntriesPageProps) {
  const { locale, vaultId } = await params
  const { category: catFilter, year: yearFilter } = await searchParams
  const tCat = await getTranslations('categories')

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const { data: vault } = await supabase.from('vaults').select('name').eq('id', vaultId).single()
  if (!vault) notFound()

  let query = supabase
    .from('entries')
    .select('*, author:profiles(*)')
    .eq('vault_id', vaultId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (catFilter && SLUGS.includes(catFilter as CategorySlug)) {
    query = query.eq('category_slug', catFilter)
  }

  const { data: entriesRaw } = await query
  const entries = (entriesRaw ?? []) as Entry[]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/${locale}/dashboard` },
          { label: vault.name, href: `/${locale}/vault/${vaultId}` },
          { label: 'Einträge' },
        ]}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-50">Einträge</h1>
        <Link
          href={`/${locale}/vault/${vaultId}/entries/new`}
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} strokeWidth={1.5} />
          Neuer Eintrag
        </Link>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/${locale}/vault/${vaultId}/entries`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !catFilter ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-400 hover:bg-amber-50 dark:hover:bg-stone-700'
          }`}
        >
          Alle
        </Link>
        {SLUGS.map((slug) => (
          <Link
            key={slug}
            href={`/${locale}/vault/${vaultId}/entries?category=${slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              catFilter === slug
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-400 hover:bg-amber-50 dark:hover:bg-stone-700'
            }`}
          >
            {tCat(slug)}
          </Link>
        ))}
      </div>

      {/* Entries grid */}
      {entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-base text-gray-500 dark:text-stone-400 mb-4">
            {catFilter ? `Noch keine Einträge in "${tCat(catFilter as CategorySlug)}".` : 'Noch keine Einträge im Vault.'}
          </p>
          <Link
            href={`/${locale}/vault/${vaultId}/entries/new${catFilter ? `?category=${catFilter}` : ''}`}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Plus size={16} strokeWidth={1.5} />
            Ersten Eintrag hinzufügen
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} locale={locale} vaultId={vaultId} />
          ))}
        </div>
      )}

      {/* FAB mobile */}
      <Link
        href={`/${locale}/vault/${vaultId}/entries/new`}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-amber-600 hover:bg-amber-500 text-white rounded-full flex items-center justify-center shadow-xl transition-colors z-30"
        aria-label="Neuer Eintrag"
      >
        <Plus size={24} strokeWidth={2} />
      </Link>
    </div>
  )
}
