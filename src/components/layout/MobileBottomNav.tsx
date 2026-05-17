'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LayoutDashboard, BookOpen, Plus, User, HelpCircle, Clock, GitBranch, LayoutList, Settings } from 'lucide-react'

interface MobileBottomNavProps {
  locale: string
  activeVaultId?: string
  vaults?: { id: string; name: string }[]
}

export function MobileBottomNav({ locale, activeVaultId, vaults = [] }: MobileBottomNavProps) {
  const pathname = usePathname()
  const t = useTranslations('nav')

  const primaryVaultId = activeVaultId ?? vaults[0]?.id

  // Detect if user is currently inside a vault
  const vaultMatch = pathname.match(/\/vault\/([^/]+)/)
  const currentVaultId = vaultMatch?.[1] ?? null
  const inVaultContext = !!currentVaultId
  const navVaultId = currentVaultId ?? primaryVaultId ?? null

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const itemClass = (href: string) =>
    `flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 min-w-[56px] text-[10px] font-medium transition-colors ${
      isActive(href)
        ? 'text-primary'
        : 'text-muted-foreground'
    }`

  const pillClass = (href: string) =>
    `flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
      isActive(href)
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    }`

  const newEntryHref = navVaultId
    ? `/${locale}/vault/${navVaultId}/entries/new`
    : `/${locale}/vault/create`

  const archiveHref = primaryVaultId
    ? `/${locale}/vault/${primaryVaultId}`
    : `/${locale}/dashboard`

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom"
      aria-label="Mobile Navigation"
    >
      {/* Vault sub-navigation - visible only when inside a vault */}
      {inVaultContext && navVaultId && (
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border/60 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href={`/${locale}/vault/${navVaultId}`} className={pillClass(`/${locale}/vault/${navVaultId}`)}>
            <BookOpen size={13} strokeWidth={1.5} />
            {t('overview')}
          </Link>
          <Link href={`/${locale}/vault/${navVaultId}/entries`} className={pillClass(`/${locale}/vault/${navVaultId}/entries`)}>
            <LayoutList size={13} strokeWidth={1.5} />
            {t('entries')}
          </Link>
          <Link href={`/${locale}/vault/${navVaultId}/timeline`} className={pillClass(`/${locale}/vault/${navVaultId}/timeline`)}>
            <Clock size={13} strokeWidth={1.5} />
            {t('timeline')}
          </Link>
          <Link href={`/${locale}/vault/${navVaultId}/family`} className={pillClass(`/${locale}/vault/${navVaultId}/family`)}>
            <GitBranch size={13} strokeWidth={1.5} />
            {t('familyTree')}
          </Link>
          <Link href={`/${locale}/vault/${navVaultId}/settings`} className={pillClass(`/${locale}/vault/${navVaultId}/settings`)}>
            <Settings size={13} strokeWidth={1.5} />
            {t('settings')}
          </Link>
        </div>
      )}

      {/* Main bottom tab bar */}
      <div className="flex items-end justify-around px-2 pt-1 pb-[max(env(safe-area-inset-bottom),0.375rem)]">
        {/* Dashboard */}
        <Link href={`/${locale}/dashboard`} className={itemClass(`/${locale}/dashboard`)}>
          <LayoutDashboard size={22} strokeWidth={1.5} />
          <span>{t('dashboard')}</span>
        </Link>

        {/* Archive */}
        <Link href={archiveHref} className={itemClass(archiveHref)}>
          <BookOpen size={22} strokeWidth={1.5} />
          <span>{t('archive')}</span>
        </Link>

        {/* Primary Action - Floating FAB style */}
        <Link
          href={newEntryHref}
          className="flex flex-col items-center justify-center gap-0.5 px-2 text-[10px] font-medium"
          aria-label={t('newEntry')}
        >
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center -mt-5 shadow-lg shadow-primary/30">
            <Plus size={22} strokeWidth={2.5} className="text-primary-foreground" />
          </div>
          <span className="text-primary mt-0.5">{t('newEntry')}</span>
        </Link>

        {/* Profile */}
        <Link href={`/${locale}/profile`} className={itemClass(`/${locale}/profile`)}>
          <User size={22} strokeWidth={1.5} />
          <span>{t('settings')}</span>
        </Link>

        {/* Help */}
        <Link href={`/${locale}/help`} className={itemClass(`/${locale}/help`)}>
          <HelpCircle size={22} strokeWidth={1.5} />
          <span>{t('help')}</span>
        </Link>
      </div>
    </nav>
  )
}
