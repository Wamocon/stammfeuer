import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { EntryForm } from '@/components/entries/EntryForm'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import type { CategorySlug } from '@/types/database'

interface NewEntryPageProps {
  params: Promise<{ locale: string; vaultId: string }>
  searchParams: Promise<{ category?: string; prompt?: string; voice?: string }>
}

export default async function NewEntryPage({ params, searchParams }: NewEntryPageProps) {
  const { locale, vaultId } = await params
  const { category, prompt } = await searchParams
  const t = await getTranslations('entries')

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const { data: vault } = await supabase.from('vaults').select('name').eq('id', vaultId).single()
  if (!vault) notFound()

  const validCategories: CategorySlug[] = ['stories', 'recipes', 'traditions', 'wisdom', 'places', 'photos']
  const defaultCategory = validCategories.includes(category as CategorySlug)
    ? (category as CategorySlug)
    : undefined

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/${locale}/dashboard` },
          { label: vault.name, href: `/${locale}/vault/${vaultId}` },
          { label: 'Einträge', href: `/${locale}/vault/${vaultId}/entries` },
          { label: t('new') },
        ]}
      />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-50">{t('new')}</h1>
      <EntryForm
        vaultId={vaultId}
        locale={locale}
        defaultCategory={defaultCategory}
        defaultPromptId={prompt}
      />
    </div>
  )
}
