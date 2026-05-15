import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { CategoryIcon } from '@/components/vault/CategoryIcon'
import { EntryCard } from '@/components/entries/EntryCard'
import { Avatar } from '@/components/ui/Avatar'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Users, Plus, Settings, BookOpen, ArrowRight } from 'lucide-react'
import type { Category, Entry, VaultMember } from '@/types/database'

interface VaultPageProps {
  params: Promise<{ locale: string; vaultId: string }>
}

export default async function VaultPage({ params }: VaultPageProps) {
  const { locale, vaultId } = await params

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

  // Fetch categories, entries count per category, members, recent entries
  const [{ data: categories }, { data: allEntries }, { data: members }] = await Promise.all([
    supabase.from('categories').select('*').eq('vault_id', vaultId).order('sort_order'),
    supabase.from('entries').select('category_slug, id, title, created_at, body, author_id, vault_id, lang, metadata, on_behalf_of, translation_de, translation_en, translation_requested_at, deleted_at, updated_at').eq('vault_id', vaultId).is('deleted_at', null).order('created_at', { ascending: false }),
    supabase.from('vault_members').select('*, profile:profiles(*)').eq('vault_id', vaultId),
  ])

  const typedCategories = (categories ?? []) as Category[]
  const entries = (allEntries ?? []) as Entry[]
  const typedMembers = (members ?? []) as VaultMember[]
  const recentEntries = entries.slice(0, 6)

  // Count entries per category
  const countBySlug: Record<string, number> = {}
  entries.forEach((e) => { countBySlug[e.category_slug] = (countBySlug[e.category_slug] ?? 0) + 1 })

  const filledCategories = typedCategories.filter((c) => (countBySlug[c.slug] ?? 0) > 0).length
  const isNewArchive = entries.length === 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Dashboard', href: `/${locale}/dashboard` }, { label: vault.name }]} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{vault.name}</h1>
          {vault.description && (
            <p className="text-sm leading-relaxed text-muted-foreground mt-1 max-w-xl">{vault.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/${locale}/vault/${vaultId}/entries/new`}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} strokeWidth={2} />
            Eintrag hinzufügen
          </Link>
          {membership.role === 'initiator' && (
            <Link
              href={`/${locale}/vault/${vaultId}/settings`}
              className="p-2 rounded-lg text-gray-400 hover:text-amber-600 dark:text-stone-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
              aria-label="Einstellungen"
            >
              <Settings size={18} strokeWidth={1.5} />
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Einträge', value: entries.length, href: `/${locale}/vault/${vaultId}/entries` },
          { label: 'Mitglieder', value: typedMembers.length, href: `/${locale}/vault/${vaultId}/family?tab=members` },
          { label: 'Kategorien', value: `${filledCategories}/${typedCategories.length}` },
        ].map(({ label, value, href }) => {
          const content = (
            <div className="bg-card border border-border rounded-xl p-4 text-center hover:border-amber-400 dark:hover:border-amber-600 transition-colors">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          )
          return href ? <Link key={label} href={href}>{content}</Link> : <div key={label}>{content}</div>
        })}
      </div>

      {/* New archive getting-started state */}
      {isNewArchive && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <h2 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">Fang jetzt an</h2>
          <p className="text-sm text-amber-800 dark:text-amber-300 mb-4">
            Dein Archiv ist bereit. Wähle eine Kategorie und schreibe deinen ersten Eintrag.
          </p>
          <div className="flex flex-wrap gap-2">
            {typedCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/vault/${vaultId}/entries/new?category=${cat.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-card border border-amber-200 dark:border-stone-600 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-stone-700 transition-colors"
              >
                <CategoryIcon slug={cat.slug} size={14} />
                {locale === 'de' ? cat.name_de : cat.name_en}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Kategorien</h2>
          <Link
            href={`/${locale}/vault/${vaultId}/entries`}
            className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
          >
            Alle Einträge
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {typedCategories.map((cat) => {
            const count = countBySlug[cat.slug] ?? 0
            return (
              <Link
                key={cat.id}
                href={`/${locale}/vault/${vaultId}/entries?category=${cat.slug}`}
                className="group relative flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-amber-400 dark:hover:border-amber-600 transition-colors"
              >
                <CategoryIcon slug={cat.slug} size={22} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {locale === 'de' ? cat.name_de : cat.name_en}
                  </p>
                  <p className="text-xs text-muted-foreground">{count} {count === 1 ? 'Eintrag' : 'Einträge'}</p>
                </div>
                <ArrowRight size={14} className="text-gray-300 dark:text-stone-600 group-hover:text-amber-500 transition-colors shrink-0" strokeWidth={1.5} />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent entries */}
      {recentEntries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <BookOpen size={16} className="text-amber-600" strokeWidth={1.5} />
              Zuletzt hinzugefügt
            </h2>
            <Link href={`/${locale}/vault/${vaultId}/entries`} className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium">
              Alle anzeigen
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} locale={locale} vaultId={vaultId} />
            ))}
          </div>
        </div>
      )}

      {/* Members strip */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {typedMembers.slice(0, 6).map((m) => (
              <Avatar
                key={m.id}
                name={(m.profile as { full_name?: string } | null)?.full_name ?? '?'}
                src={(m.profile as { avatar_url?: string | null } | null)?.avatar_url ?? undefined}
                size="sm"
                className="ring-2 ring-white dark:ring-stone-900"
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {typedMembers.length} {typedMembers.length === 1 ? 'Mitglied' : 'Mitglieder'}
          </span>
        </div>
        {(membership.role === 'initiator') && (
          <Link
            href={`/${locale}/vault/${vaultId}/family?tab=members`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
          >
            <Users size={14} strokeWidth={1.5} />
            Mitglied einladen
          </Link>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-30">
        <Link
          href={`/${locale}/vault/${vaultId}/entries/new`}
          className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-3 rounded-xl shadow-lg transition-colors"
        >
          <Plus size={18} strokeWidth={2} />
          Eintrag hinzufügen
        </Link>
      </div>
    </div>
  )
}
