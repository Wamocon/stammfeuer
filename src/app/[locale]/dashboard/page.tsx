import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { EntryCard } from '@/components/entries/EntryCard'
import { PromptWidget } from '@/components/prompts/PromptWidget'
import { Plus, BookOpen, Users, Archive, Clock, ArrowRight } from 'lucide-react'
import type { VaultWithStats, Entry, MemberPrompt } from '@/types/database'

interface DashboardPageProps {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/auth/login`)

  // Fetch all archives with member counts and entry counts
  const { data: vaultsRaw } = await supabase
    .from('vault_members')
    .select(`
      role,
      vault:vaults (
        id, name, description, cover_url, plan, owner_id, created_at, updated_at
      )
    `)
    .eq('user_id', user.id)

  const vaultIds: string[] = []
  const vaults: VaultWithStats[] = (vaultsRaw ?? []).map((row) => {
    const vault = (Array.isArray(row.vault) ? row.vault[0] : row.vault) as VaultWithStats
    vaultIds.push(vault.id)
    return { ...vault, user_role: row.role, member_count: 0, entry_count: 0, last_entry_at: null }
  })

  // Fetch member counts per vault
  if (vaultIds.length > 0) {
    const { data: memberCounts } = await supabase
      .from('vault_members')
      .select('vault_id')
      .in('vault_id', vaultIds)
    if (memberCounts) {
      const countMap: Record<string, number> = {}
      memberCounts.forEach((r) => { countMap[r.vault_id] = (countMap[r.vault_id] ?? 0) + 1 })
      vaults.forEach((v) => { v.member_count = countMap[v.id] ?? 0 })
    }
  }

  // Fetch recent entries across ALL archives
  let recentEntries: (Entry & { vault_name: string })[] = []
  if (vaultIds.length > 0) {
    const { data: entriesRaw } = await supabase
      .from('entries')
      .select('*')
      .in('vault_id', vaultIds)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(6)
    if (entriesRaw) {
      const vaultMap = Object.fromEntries(vaults.map((v) => [v.id, v.name]))
      recentEntries = (entriesRaw as Entry[]).map((e) => ({ ...e, vault_name: vaultMap[e.vault_id] ?? '' }))
      // Update entry counts
      const entryCountMap: Record<string, number> = {}
      entriesRaw.forEach((e: Entry) => { entryCountMap[e.vault_id] = (entryCountMap[e.vault_id] ?? 0) + 1 })
      const { data: allEntriesCount } = await supabase
        .from('entries')
        .select('vault_id')
        .in('vault_id', vaultIds)
        .is('deleted_at', null)
      if (allEntriesCount) {
        const fullMap: Record<string, number> = {}
        allEntriesCount.forEach((e: { vault_id: string }) => { fullMap[e.vault_id] = (fullMap[e.vault_id] ?? 0) + 1 })
        vaults.forEach((v) => { v.entry_count = fullMap[v.id] ?? 0 })
      }
    }
  }

  // Fetch open prompt for first vault
  let prompt: MemberPrompt | null = null
  const primaryVault = vaults[0] ?? null
  if (primaryVault) {
    const { data: promptData } = await supabase
      .from('member_prompts')
      .select('*')
      .eq('vault_id', primaryVault.id)
      .eq('user_id', user.id)
      .is('answered_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (promptData) prompt = promptData as MemberPrompt
  }

  const t = await getTranslations('dashboard')

  const displayName = (user.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? 'Familie'
  const totalEntries = vaults.reduce((sum, v) => sum + v.entry_count, 0)
  const totalMembers = vaults.reduce((sum, v) => sum + v.member_count, 0)

  // No archives yet
  if (vaults.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="text-center max-w-sm">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Archive size={40} className="text-amber-600" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t('welcomeTitle')}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground mb-6">
            {t('welcomeSubtitle')}
          </p>
          <Link
            href={`/${locale}/vault/create`}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Plus size={18} strokeWidth={1.5} />
            {t('newArchiveBtn')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('greeting', { name: displayName })}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats bar - 3 cols, compact on mobile */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: t('archives'), value: vaults.length, icon: Archive },
          { label: t('entriesCount'), value: totalEntries, icon: BookOpen },
          { label: t('membersCount'), value: totalMembers, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-amber-600 sm:hidden" strokeWidth={1.5} />
              <Icon size={20} className="text-amber-600 hidden sm:block" strokeWidth={1.5} />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Archives list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">{t('yourArchives')}</h2>
            <Link
              href={`/${locale}/vault/create`}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
            >
              <Plus size={14} strokeWidth={2} />
              {t('newArchiveLink')}
            </Link>
          </div>
          <div className="space-y-2">
            {vaults.map((vault) => (
              <Link
                key={vault.id}
                href={`/${locale}/vault/${vault.id}`}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-amber-400 dark:hover:border-amber-600 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{vault.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} strokeWidth={1.5} />
                      {vault.entry_count} {t('entriesCount')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} strokeWidth={1.5} />
                      {vault.member_count} {t('membersCount')}
                    </span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors shrink-0 ml-3" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </div>

        {/* Prompt widget */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">{t('openQuestion')}</h2>
          <PromptWidget prompt={prompt} locale={locale} vaultId={primaryVault?.id ?? ''} />
        </div>
      </div>

      {/* Recent entries across all archives */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Clock size={16} className="text-amber-600" strokeWidth={1.5} />
            {t('recentlyAdded')}
          </h2>
          {primaryVault && (
            <Link
              href={`/${locale}/vault/${primaryVault.id}/entries`}
              className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
            >
              {t('allEntries')}
            </Link>
          )}
        </div>
        {recentEntries.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <BookOpen size={32} className="mx-auto text-gray-300 dark:text-stone-600 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">{t('noEntriesMsg')}</p>
            {primaryVault && (
              <Link
                href={`/${locale}/vault/${primaryVault.id}/entries/new`}
                className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
              >
                <Plus size={14} strokeWidth={2} />
                {t('createFirstEntry')}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="relative">
                {vaults.length > 1 && (
                  <span className="absolute -top-2 left-3 z-10 text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                    {entry.vault_name}
                  </span>
                )}
                <EntryCard entry={entry} locale={locale} vaultId={entry.vault_id} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
