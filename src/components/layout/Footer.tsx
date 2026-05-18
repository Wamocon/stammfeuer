'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

interface FooterProps {
  locale: string
}

const APP_ROUTES = ['/dashboard', '/vault', '/profile', '/settings']

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('legal')
  const pathname = usePathname()

  const isAppRoute = APP_ROUTES.some((r) => pathname.includes(r))
  if (isAppRoute) return null

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Tagline */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-lg font-bold text-foreground">
              Ahnen<span className="text-amber-600 dark:text-amber-400">echo</span>
            </span>
            <span className="text-sm text-muted-foreground">
              Das Echo deiner Ahnen, für immer lebendig.
            </span>
          </div>

          {/* Legal Links */}
          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href={`/${locale}/legal/impressum`} className="text-muted-foreground hover:text-amber-600 transition-colors">
              {t('impressum')}
            </Link>
            <Link href={`/${locale}/legal/datenschutz`} className="text-muted-foreground hover:text-amber-600 transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/legal/agb`} className="text-muted-foreground hover:text-amber-600 transition-colors">
              {t('terms')}
            </Link>
          </nav>

          {/* Company stamp */}
          <div className="text-xs text-muted-foreground text-center md:text-right">
            <p>© {new Date().getFullYear()} WAMOCON GmbH</p>
            <p>Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
