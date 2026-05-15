'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Sun, Moon, Monitor, Globe, Flame } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/Avatar'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

interface HeaderProps {
  locale: string
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
    supabase.auth.getUser().then((result: { data: { user: User | null } }) => setUser(result.data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const otherLocale = locale === 'de' ? 'en' : 'de'
  const switchLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  // On app routes the Sidebar handles all navigation/auth actions
  const APP_ROUTES = ['/dashboard', '/vault', '/profile', '/settings']
  const isAppRoute = APP_ROUTES.some((r) => pathname.includes(r))

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}/auth/login`)
  }

  const themeIcon = !mounted ? null : theme === 'dark' ? (
    <Moon size={18} strokeWidth={1.5} />
  ) : theme === 'light' ? (
    <Sun size={18} strokeWidth={1.5} />
  ) : (
    <Monitor size={18} strokeWidth={1.5} />
  )

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <svg viewBox="0 0 40 48" className="w-7 h-7" fill="none" aria-hidden="true">
            <path d="M20 4C20 4 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 14 20 4 20 4Z" fill="#d97706" opacity="0.9" />
            <path d="M20 16C20 16 14 22 14 28C14 31.9 16.7 35 20 35C23.3 35 26 31.9 26 28C26 22 20 16 20 16Z" fill="#b91c1c" opacity="0.85" />
            <path d="M20 24C20 24 17 27 17 30C17 31.7 18.3 33 20 33C21.7 33 23 31.7 23 30C23 27 20 24 20 24Z" fill="#fbbf24" />
          </svg>
          <span className="text-lg font-bold text-foreground">
            Ahnen<span className="text-amber-600 dark:text-amber-400">echo</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-accent transition-colors"
            aria-label="Design wechseln"
          >
            {themeIcon}
          </button>
          {/* Locale switch */}
          <Link
            href={switchLocalePath}
            className="p-2 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-accent transition-colors"
            aria-label="Sprache wechseln"
          >
            <Globe size={18} strokeWidth={1.5} />
          </Link>

          {/* On app routes the Sidebar handles all auth actions - show nothing extra */}
          {!isAppRoute && (
            user ? (
              <div className="flex items-center gap-2">
                <Link href={`/${locale}/profile`}>
                  <Avatar name={user.user_metadata?.full_name as string} src={user.user_metadata?.avatar_url as string} size="sm" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href={`/${locale}/auth/login`}
                  className="text-sm font-medium text-muted-foreground hover:text-amber-600 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors min-h-[36px] inline-flex items-center"
                >
                  {t('register')}
                </Link>
              </>
            )
          )}
        </div>

      </div>
    </header>
  )
}
