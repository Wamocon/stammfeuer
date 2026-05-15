import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { CategoryIcon } from '@/components/vault/CategoryIcon'
import { EntryCard } from '@/components/entries/EntryCard'
import { Avatar } from '@/components/ui/Avatar'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Users, Plus, Settings } from 'lucide-react'
import type { Category, Entry, VaultMember } from '@/types/database'

interface VaultPageProps {
  params: Promise<{ locale: string; vaultId: string }>
}

export default async function VaultPage({ params }: VaultPageProps) {
  const { locale, vaultId } = await params
  const tCat = await getTranslations('categories')
  const t = await getTranslations('vault')

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  // Fetch vault
  const { data: vault } = await supabase
    .from('vaults')
    .select('*')
    .eq('id', vaultId)
    .single()

  if (!vault) notFound()

  // Verify membership
  const { data: membership } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  if (!membership) redirect(`/${locale}/dashboard`)

  // Fetch categories, recent entries, members
  const [{ data: categories }, { data: entriesRaw }, { data: members }] = await Promise.all([
    supabase.from('categories').select('*, entry_count:entries(count)').eq('vault_id', vaultId).order('sort_order'),
    supabase
      .from('entries')
      .select('*, author:profiles(*)')
      .eq('vault_id', vaultId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('vault_members')
      .select('*, profile:profiles(*)')
      .eq('vault_id', vaultId)
      .limit(10),
  ])

  const typedCategories = (categories ?? []) as (Category & { entry_count: { count: number }[] })[]
  const entries = (entriesRaw ?? []) as Entry[]
  const typedMembers = (members ?? []) as VaultMember[]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Dashboard', href: `/${locale}/dashboard` }, { label: vault.name }]} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-50">{vault.name}</h1>
          {vault.description && (
            <p className="text-base leading-relaxed text-gray-600 dark:text-stone-400 mt-1">{vault.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {membership.role === 'initiator' && (
            <Link
              href={`/${locale}/vault/${vaultId}/settings`}
              className="p-2 rounded-lg text-gray-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
              aria-label="Einstellungen"
            >
              <Settings size={20} strokeWidth={1.5} />
            </Link>
          )}
          <Link
            href={`/${locale}/vault/${vaultId}/members`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400"
          >
            <Users size={16} strokeWidth={1.5} />
            {typedMembers.length} {t('members')}
          </Link>
        </div>
      </div>

      {/* Members preview */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {typedMembers.slice(0, 5).map((m) => (
            <Avatar
              key={m.id}
              name={m.profile?.full_name ?? m.display_name}
              src={m.profile?.avatar_url}
              size="sm"
              className="ring-2 ring-white dark:ring-stone-900"
            />
          ))}
        </div>
        {typedMembers.length > 5 && (
          <span className="text-sm text-gray-500 dark:text-stone-400">+{typedMembers.length - 5} weitere</span>
        )}
        <Link
          href={`/${locale}/vault/${vaultId}/members`}
          className="ml-2 text-sm text-amber-600 dark:text-amber-400 hover:underline"
        >
          Mitglied einladen
        </Link>
      </div>

      {/* Category grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-4">Kategorien</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {typedCategories.map((cat) => {
            const count = cat.entry_count?.[0]?.count ?? 0
            return (
              <div
                key={cat.id}
                className={`rounded-xl border p-5 flex flex-col gap-3 transition-shadow duration-200 hover:shadow-md ${
                  count === 0
                    ? 'border-dashed border-[var(--color-border)] dark:border-stone-700 bg-white dark:bg-stone-800'
                    : 'border-[var(--color-border)] dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CategoryIcon slug={cat.slug} size={28} />
                  <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-stone-50">{count}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-stone-50">{tCat(cat.slug)}</p>
                  {count === 0 && (
                    <p className="text-xs text-gray-400 dark:text-stone-500 mt-0.5">Noch keine Einträge</p>
                  )}
                </div>
                <Link
                  href={`/${locale}/vault/${vaultId}/entries/new?category=${cat.slug}`}
                  className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <Plus size={14} strokeWidth={1.5} />
                  Eintrag hinzufügen
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent activity */}
      {entries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50">Letzte Aktivität</h2>
            <Link href={`/${locale}/vault/${vaultId}/entries`} className="text-sm text-amber-600 dark:text-amber-400 hover:underline">
              Alle Einträge
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.slice(0, 6).map((entry) => (
              <EntryCard key={entry.id} entry={entry} locale={locale} vaultId={vaultId} />
            ))}
          </div>
        </div>
      )}

      {/* Quick actions - mobile sticky */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden flex gap-2 z-30">
        <Link
          href={`/${locale}/vault/${vaultId}/entries/new`}
          className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-3 rounded-xl text-center shadow-lg transition-colors"
        >
          Eintrag hinzufügen
        </Link>
        <Link
          href={`/${locale}/vault/${vaultId}/members`}
          className="bg-white dark:bg-stone-800 border border-[var(--color-border)] dark:border-stone-700 text-amber-600 dark:text-amber-400 font-semibold px-4 py-3 rounded-xl text-center shadow-lg"
        >
          Einladen
        </Link>
      </div>
    </div>
  )
}
