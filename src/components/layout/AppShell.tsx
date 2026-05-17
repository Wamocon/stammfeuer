'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AppShellProps {
  locale: string
  children: React.ReactNode
}

// Routes that should show the sidebar
const APP_ROUTES = ['/dashboard', '/vault', '/profile', '/settings']

export function AppShell({ locale, children }: AppShellProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [vaults, setVaults] = useState<{ id: string; name: string }[]>([])

  const isAppRoute = APP_ROUTES.some((route) =>
    pathname.includes(`/${locale}${route}`) || pathname.includes(route)
  )

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user)
      if (data.user) {
        supabase
          .from('vault_members')
          .select('vault:vaults(id, name)')
          .eq('user_id', data.user.id)
          .then(({ data: rows }: { data: Array<{ vault: { id: string; name: string } | Array<{ id: string; name: string }> }> | null }) => {
            const list = (rows ?? []).map((row: { vault: { id: string; name: string } | Array<{ id: string; name: string }> }) => {
              const v = Array.isArray(row.vault) ? row.vault[0] : row.vault
              return v as { id: string; name: string }
            }).filter(Boolean)
            setVaults(list)
          })
      }
    })
  }, [pathname])

  // Extract active vault from URL
  const vaultMatch = pathname.match(/\/vault\/([^/]+)/)
  const activeVaultId = vaultMatch ? vaultMatch[1] : undefined

  if (!user || !isAppRoute) {
    return <>{children}</>
  }

  const userName = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? ''
  const userAvatarUrl = (user.user_metadata?.avatar_url as string | undefined)

  return (
    <>
      {/* App header - contains logo, theme toggle, language switcher */}
      <Header locale={locale} />

      {/* Main layout: sidebar (desktop) + scrollable content */}
      <div className="flex flex-1 min-h-0">
        <Sidebar
          locale={locale}
          vaults={vaults}
          activeVaultId={activeVaultId}
          userName={userName}
          userAvatarUrl={userAvatarUrl}
        />
        {/* pb-20 on mobile (global nav only), pb-32 when vault sub-nav is visible too */}
        <main className={`flex-1 overflow-auto lg:pb-0 ${activeVaultId ? 'pb-32' : 'pb-20'}`}>
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation - hidden on lg+ */}
      <MobileBottomNav
        locale={locale}
        activeVaultId={activeVaultId}
        vaults={vaults}
      />
    </>
  )
}

