import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import CreateVaultForm from './_CreateVaultForm'
import type { CategorySlug } from '@/types/database'

interface CreateVaultPageProps {
  params: Promise<{ locale: string }>
}

const CATEGORIES: { slug: CategorySlug; color: string }[] = [
  { slug: 'stories', color: 'bg-amber-100 text-amber-700' },
  { slug: 'recipes', color: 'bg-orange-100 text-orange-700' },
  { slug: 'traditions', color: 'bg-yellow-100 text-yellow-700' },
  { slug: 'wisdom', color: 'bg-emerald-100 text-emerald-700' },
  { slug: 'places', color: 'bg-blue-100 text-blue-700' },
  { slug: 'photos', color: 'bg-purple-100 text-purple-700' },
]

export default async function CreateVaultPage({ params }: CreateVaultPageProps) {
  const { locale } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  return <CreateVaultForm locale={locale} categories={CATEGORIES} />
}
