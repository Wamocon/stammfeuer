import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Avatar } from '@/components/ui/Avatar'
import { CategoryIcon } from '@/components/vault/CategoryIcon'
import type { CategorySlug } from '@/types/database'

interface TimelinePageProps {
  params: Promise<{ locale: string; vaultId: string }>
  searchParams: Promise<{ tab?: string }>
}

// Category dot + left-border colours, matching CategoryIcon colour tokens
const CATEGORY_STYLE: Record<string, { dot: string; border: string }> = {
  stories:    { dot: 'bg-amber-500',   border: 'border-l-amber-400' },
  recipes:    { dot: 'bg-orange-500',  border: 'border-l-orange-400' },
  traditions: { dot: 'bg-yellow-500',  border: 'border-l-yellow-400' },
  wisdom:     { dot: 'bg-emerald-500', border: 'border-l-emerald-400' },
  places:     { dot: 'bg-blue-500',    border: 'border-l-blue-400' },
  photos:     { dot: 'bg-purple-500',  border: 'border-l-purple-400' },
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthorShape = { full_name: string; avatar_url: string | null }
type BehalfShape = { display_name: string | null; family_role: string | null }

type RawEntry = {
  id: string
  title: string
  body: string | null
  category_slug: string
  created_at: string
  author_id: string | null
  on_behalf_of: string | null
  metadata: Record<string, unknown>
  author: AuthorShape | AuthorShape[] | null
  behalf: BehalfShape | BehalfShape[] | null
}

type TimelineEntry = {
  id: string
  title: string
  body: string | null
  category_slug: CategorySlug
  created_at: string
  authorName: string
  authorAvatar: string | null
  behalfName: string | null
  periodYear: number | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveOne<T>(v: T | T[] | null): T | null {
  if (!v) return null
  return Array.isArray(v) ? (v[0] ?? null) : v
}

/** Extract the representative year from entry metadata (stories + traditions). */
function getPeriodYear(slug: string, meta: Record<string, unknown>): number | null {
  const raw = meta?.period_start ?? meta?.since_year
  if (!raw) return null
  const n = Number(raw)
  return isNaN(n) ? null : n
}

function toDecadeLabel(year: number, locale: string): string {
  const decade = Math.floor(year / 10) * 10
  return locale === 'de' ? `${decade}er Jahre` : `${decade}s`
}

function toMonthLabel(isoDate: string, locale: string): string {
  return new Date(isoDate).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
    month: 'long',
    year: 'numeric',
  })
}

function formatDate(isoDate: string, locale: string): string {
  return new Date(isoDate).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Grouping ─────────────────────────────────────────────────────────────────

type Group = { label: string; entries: TimelineEntry[] }

function groupByMonth(entries: TimelineEntry[], locale: string): Group[] {
  const groups: Group[] = []
  let currentKey = ''
  for (const entry of entries) {
    const date = new Date(entry.created_at)
    const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`
    if (key !== currentKey) {
      currentKey = key
      groups.push({ label: toMonthLabel(entry.created_at, locale), entries: [] })
    }
    groups[groups.length - 1].entries.push(entry)
  }
  return groups
}

function groupByDecade(entries: TimelineEntry[], locale: string): { dated: Group[]; undated: TimelineEntry[] } {
  const sorted = [...entries].sort((a, b) => (a.periodYear ?? 99999) - (b.periodYear ?? 99999))
  const undated: TimelineEntry[] = []
  const groups: Group[] = []
  let currentDecade = -1

  for (const entry of sorted) {
    if (entry.periodYear === null) {
      undated.push(entry)
      continue
    }
    const decade = Math.floor(entry.periodYear / 10) * 10
    if (decade !== currentDecade) {
      currentDecade = decade
      groups.push({ label: toDecadeLabel(entry.periodYear, locale), entries: [] })
    }
    groups[groups.length - 1].entries.push(entry)
  }

  return { dated: groups, undated }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TabSwitcher({
  activeTab,
  baseUrl,
  activityLabel,
  historyLabel,
}: {
  activeTab: string
  baseUrl: string
  activityLabel: string
  historyLabel: string
}) {
  const tabs = [
    { key: 'activity', label: activityLabel, href: baseUrl },
    { key: 'history', label: historyLabel, href: `${baseUrl}?tab=history` },
  ]
  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.key
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}

function EntryCard({
  entry,
  locale,
  vaultId,
  onBehalfOfLabel,
  showYear,
}: {
  entry: TimelineEntry
  locale: string
  vaultId: string
  onBehalfOfLabel: (name: string) => string
  showYear?: boolean
}) {
  const style = CATEGORY_STYLE[entry.category_slug] ?? CATEGORY_STYLE.stories
  const excerpt = entry.body ? entry.body.slice(0, 160).trimEnd() + (entry.body.length > 160 ? '…' : '') : null

  return (
    <div className="relative flex gap-3 sm:gap-5 mb-5">
      {/* Dot - desktop only, sits on the line */}
      <div className="hidden sm:flex w-10 shrink-0 justify-center pt-5">
        <div className={`w-3 h-3 rounded-full ring-2 ring-background shrink-0 ${style.dot}`} />
      </div>

      {/* Card */}
      <div className={`flex-1 bg-card border border-border border-l-4 ${style.border} rounded-xl p-4 hover:shadow-sm transition-shadow`}>
        {/* Header row: author + date */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar name={entry.authorName} src={entry.authorAvatar} size="sm" />
            <div className="min-w-0">
              <span className="text-sm font-semibold text-foreground truncate block">{entry.authorName}</span>
              {entry.behalfName && (
                <span className="text-xs text-muted-foreground">{onBehalfOfLabel(entry.behalfName)}</span>
              )}
            </div>
          </div>
          <time className="text-xs text-muted-foreground shrink-0 tabular-nums">
            {showYear && entry.periodYear ? String(entry.periodYear) : formatDate(entry.created_at, locale)}
          </time>
        </div>

        {/* Category badge */}
        <div className="flex items-center gap-1.5 mb-2">
          <CategoryIcon slug={entry.category_slug as CategorySlug} size={13} />
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{entry.category_slug}</span>
        </div>

        {/* Title */}
        <Link
          href={`/${locale}/vault/${vaultId}/entries/${entry.id}`}
          className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 block"
        >
          {entry.title}
        </Link>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{excerpt}</p>
        )}
      </div>
    </div>
  )
}

function TimelineGroup({
  group,
  locale,
  vaultId,
  onBehalfOfLabel,
  showYear,
}: {
  group: Group
  locale: string
  vaultId: string
  onBehalfOfLabel: (name: string) => string
  showYear?: boolean
}) {
  return (
    <div>
      {/* Month / Decade header */}
      <div className="sticky top-16 z-10 -mx-1 mb-4">
        <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg inline-block">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{group.label}</h2>
        </div>
      </div>

      {/* Timeline entries with vertical line on desktop */}
      <div className="relative sm:before:absolute sm:before:left-[34px] sm:before:top-0 sm:before:bottom-0 sm:before:w-px sm:before:bg-border">
        {group.entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            locale={locale}
            vaultId={vaultId}
            onBehalfOfLabel={onBehalfOfLabel}
            showYear={showYear}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TimelinePage({ params, searchParams }: TimelinePageProps) {
  const { locale, vaultId } = await params
  const { tab } = await searchParams
  const activeTab = tab === 'history' ? 'history' : 'activity'

  const t = await getTranslations('timeline')
  const tNav = await getTranslations('nav')
  const tCat = await getTranslations('categories')

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  // Verify vault + membership
  const { data: vault } = await supabase.from('vaults').select('name').eq('id', vaultId).single()
  if (!vault) notFound()

  const { data: membership } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()
  if (!membership) redirect(`/${locale}/dashboard`)

  // Fetch entries with author profile + behalf member
  const { data: raw } = await supabase
    .from('entries')
    .select(`
      id,
      title,
      body,
      category_slug,
      created_at,
      author_id,
      on_behalf_of,
      metadata,
      author:profiles!author_id ( full_name, avatar_url ),
      behalf:vault_members!on_behalf_of ( display_name, family_role )
    `)
    .eq('vault_id', vaultId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  const entries: TimelineEntry[] = (raw as RawEntry[] ?? []).map((r) => {
    const author = resolveOne(r.author)
    const behalf = resolveOne(r.behalf)
    return {
      id: r.id,
      title: r.title,
      body: r.body,
      category_slug: r.category_slug as CategorySlug,
      created_at: r.created_at,
      authorName: author?.full_name ?? user.email ?? '?',
      authorAvatar: author?.avatar_url ?? null,
      behalfName: behalf?.display_name ?? null,
      periodYear: getPeriodYear(r.category_slug, r.metadata ?? {}),
    }
  })

  const baseUrl = `/${locale}/vault/${vaultId}/timeline`

  const onBehalfOfLabel = (name: string) => t('onBehalfOf', { name })

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: tNav('dashboard'), href: `/${locale}/dashboard` },
          { label: vault.name, href: `/${locale}/vault/${vaultId}` },
          { label: t('title') },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <TabSwitcher
          activeTab={activeTab}
          baseUrl={baseUrl}
          activityLabel={t('activity')}
          historyLabel={t('history')}
        />
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="text-center py-20 text-muted-foreground text-sm">
          {t('noEntries')}
        </div>
      )}

      {/* ── ACTIVITY TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'activity' && entries.length > 0 && (
        <div className="space-y-8">
          {groupByMonth(entries, locale).map((group) => (
            <TimelineGroup
              key={group.label}
              group={group}
              locale={locale}
              vaultId={vaultId}
              onBehalfOfLabel={onBehalfOfLabel}
            />
          ))}
        </div>
      )}

      {/* ── HISTORY TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'history' && entries.length > 0 && (() => {
        const { dated, undated } = groupByDecade(entries, locale)
        return (
          <div className="space-y-8">
            {dated.map((group) => (
              <TimelineGroup
                key={group.label}
                group={group}
                locale={locale}
                vaultId={vaultId}
                onBehalfOfLabel={onBehalfOfLabel}
                showYear
              />
            ))}
            {undated.length > 0 && (
              <TimelineGroup
                group={{ label: t('noYear'), entries: undated }}
                locale={locale}
                vaultId={vaultId}
                onBehalfOfLabel={onBehalfOfLabel}
              />
            )}
          </div>
        )
      })()}
    </div>
  )
}
