'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, BookOpen, Settings, HelpCircle, LogOut, ChevronDown, ChevronRight, PlusCircle, GitBranch } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'

interface Vault {
  id: string
  name: string
}

interface SidebarProps {
  locale: string
  vaults?: Vault[]
  activeVaultId?: string
  userName?: string
  userAvatarUrl?: string
}

export function Sidebar({ locale, vaults = [], activeVaultId, userName, userAvatarUrl }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [vaultsOpen, setVaultsOpen] = useState(true)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}/auth/login`)
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(href)
        ? 'bg-primary/10 text-primary'
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
    }`

  const activeVaultLinks = activeVaultId
    ? [
        { href: `/${locale}/vault/${activeVaultId}`, icon: BookOpen, label: 'Uebersicht' },
        { href: `/${locale}/vault/${activeVaultId}/entries`, icon: BookOpen, label: 'Eintraege' },
        { href: `/${locale}/vault/${activeVaultId}/family`, icon: GitBranch, label: 'Familie' },
        { href: `/${locale}/vault/${activeVaultId}/settings`, icon: Settings, label: 'Einstellungen' },
      ]
    : []

  return (
    <aside className="flex flex-col w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-sidebar-border bg-sidebar text-sidebar-foreground overflow-y-auto">
      <nav className="flex-1 p-3 space-y-1">
        {/* Dashboard */}
        <Link href={`/${locale}/dashboard`} className={linkClass(`/${locale}/dashboard`)}>
          <LayoutDashboard size={18} strokeWidth={1.5} />
          Dashboard
        </Link>

        {/* Vaults section */}
        <div className="pt-2">
          <button
            onClick={() => setVaultsOpen((v) => !v)}
            className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            Archive
            {vaultsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {vaultsOpen && (
            <div className="mt-1 space-y-0.5">
              {vaults.map((vault) => (
                <Link
                  key={vault.id}
                  href={`/${locale}/vault/${vault.id}`}
                  className={linkClass(`/${locale}/vault/${vault.id}`)}
                >
                  <BookOpen size={18} strokeWidth={1.5} />
                  <span className="truncate">{vault.name}</span>
                </Link>
              ))}
              <Link
                href={`/${locale}/vault/create`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <PlusCircle size={18} strokeWidth={1.5} />
                Neues Archiv
              </Link>
            </div>
          )}
        </div>

        {/* Vault context nav */}
        {activeVaultLinks.length > 0 && (
          <div className="pt-2">
            <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dieses Archiv
            </p>
            <div className="mt-1 space-y-0.5">
              {activeVaultLinks.map((item) => (
                <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                  <item.icon size={18} strokeWidth={1.5} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom links */}
      <div className="p-3 border-t border-sidebar-border space-y-0.5">
        <Link href={`/${locale}/help`} className={linkClass(`/${locale}/help`)}>
          <HelpCircle size={18} strokeWidth={1.5} />
          Hilfe
        </Link>
        <Link href={`/${locale}/profile`} className={linkClass(`/${locale}/profile`)}>
          <Settings size={18} strokeWidth={1.5} />
          Profil & Einstellungen
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full text-left text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Abmelden
        </button>
      </div>

      {/* User identity strip */}
      {userName && (
        <div className="px-4 py-3 border-t border-sidebar-border flex items-center gap-3">
          <Avatar name={userName} src={userAvatarUrl} size="sm" />
          <span className="text-sm font-medium text-sidebar-foreground truncate flex-1">{userName}</span>
        </div>
      )}
    </aside>
  )
}
