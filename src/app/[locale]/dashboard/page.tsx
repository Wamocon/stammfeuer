import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { VaultCard } from '@/components/vault/VaultCard'
import { VaultHealthChart } from '@/components/vault/VaultHealthChart'
import { PromptWidget } from '@/components/prompts/PromptWidget'
import { EntryCard } from '@/components/entries/EntryCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Flame, Plus } from 'lucide-react'
import type { VaultWithStats, Entry, MemberPrompt } from '@/types/database'

interface DashboardPageProps {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params
  const t = await getTranslations('dashboard')
  const tVault = await getTranslations('vault')

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/auth/login`)

  // Fetch vaults
  const { data: vaultsRaw } = await supabase
    .from('vault_members')
    .select(`
      role,
      vault:vaults (
        id, name, description, cover_url, plan, owner_id, created_at, updated_at
      )
    `)
    .eq('user_id', user.id)

  const vaults: VaultWithStats[] = (vaultsRaw ?? []).map((row) => {
    const vault = Array.isArray(row.vault) ? row.vault[0] : row.vault
    return {
      ...(vault as object),
      user_role: row.role,
      member_count: 0,
      entry_count: 0,
      last_entry_at: null,
    } as VaultWithStats
  })

  const primaryVault = vaults[0] ?? null

  // If no vault - show empty state
  if (!primaryVault) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="text-center max-w-sm">
          <div className="mb-6 flex justify-center">
            <svg viewBox="0 0 40 48" className="w-20 h-20 animate-pulse" fill="none">
              <path d="M20 4C20 4 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 14 20 4 20 4Z" fill="#d97706" opacity="0.9" />
              <path d="M20 16C20 16 14 22 14 28C14 31.9 16.7 35 20 35C23.3 35 26 31.9 26 28C26 22 20 16 20 16Z" fill="#b91c1c" opacity="0.85" />
              <path d="M20 24C20 24 17 27 17 30C17 31.7 18.3 33 20 33C21.7 33 23 31.7 23 30C23 27 20 24 20 24Z" fill="#fbbf24" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-50 mb-2">
            Willkommen bei Stammfeuer
          </h1>
          <p className="text-base leading-relaxed text-gray-600 dark:text-stone-400 mb-6">
            {tVault('createFirst')}
          </p>
          <Link
            href={`/${locale}/vault/create`}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Plus size={18} strokeWidth={1.5} />
            {tVault('create')}
          </Link>
        </div>
      </div>
    )
  }

  // Fetch health data for primary vault
  let healthData: { score: number; categories: { slug: string; entry_count: number }[] } = { score: 0, categories: [] }
  let prompt: MemberPrompt | null = null
  let recentEntries: Entry[] = []

  try {
    const [healthRes, promptRes, entriesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vaults/${primaryVault.id}/health`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vaults/${primaryVault.id}/prompts`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vaults/${primaryVault.id}/entries?limit=5`, { cache: 'no-store' }),
    ])
    if (healthRes.ok) healthData = await healthRes.json()
    if (promptRes.ok) { const d = await promptRes.json(); prompt = d.prompt ?? null }
    if (entriesRes.ok) { const d = await entriesRes.json(); recentEntries = d.entries ?? [] }
  } catch {
    // API calls may fail if Supabase isn't running locally - graceful fallback
  }

  const displayName = (user.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? 'Familie'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-50">
          Willkommen, {displayName}
        </h1>
        <p className="text-base text-gray-600 dark:text-stone-400 mt-1">{primaryVault.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vault Health */}
        <div className="bg-white dark:bg-stone-800 border border-[var(--color-border)] dark:border-stone-700 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-stone-50 mb-1">{t('health')}</h2>
          <p className="text-sm text-gray-500 dark:text-stone-400 mb-4">{t('healthDescription')}</p>
          <VaultHealthChart
            score={healthData.score}
            categories={(healthData.categories ?? []) as { slug: 'stories' | 'recipes' | 'traditions' | 'wisdom' | 'places' | 'photos'; entry_count: number }[]}
          />
        </div>

        {/* Prompt widget */}
        <div className="flex flex-col gap-4">
          <PromptWidget prompt={prompt} locale={locale} vaultId={primaryVault.id} />

          {/* Your vaults */}
          {vaults.length > 1 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-stone-400 mb-2">Deine Vaults</h2>
              <div className="space-y-2">
                {vaults.slice(0, 3).map((v) => (
                  <VaultCard key={v.id} vault={v} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent entries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50">{t('recentEntries')}</h2>
          <Link
            href={`/${locale}/vault/${primaryVault.id}/entries`}
            className="text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium"
          >
            Alle Einträge
          </Link>
        </div>
        {recentEntries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-stone-400">{t('noEntries')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} locale={locale} vaultId={primaryVault.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
