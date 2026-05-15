import { redirect } from 'next/navigation'

interface MembersPageProps {
  params: Promise<{ locale: string; vaultId: string }>
}

// Members management has been merged into the Family page (Stammbaum + Mitglieder tabs).
// Redirect anyone arriving at the old URL to the new unified page.
export default async function MembersPage({ params }: MembersPageProps) {
  const { locale, vaultId } = await params
  redirect(`/${locale}/vault/${vaultId}/family?tab=members`)
}

