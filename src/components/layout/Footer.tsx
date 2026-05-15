import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface FooterProps {
  locale: string
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('legal')

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
            <Link
              href={`/${locale}/legal/impressum`}
              className="text-gray-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 transition-colors"
            >
              {t('impressum')}
            </Link>
            <Link
              href={`/${locale}/legal/datenschutz`}
              className="text-gray-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href={`/${locale}/legal/agb`}
              className="text-gray-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 transition-colors"
            >
              {t('terms')}
            </Link>
          </nav>

          {/* Company stamp */}
          <div className="text-xs text-muted-foreground text-center md:text-right">
            <p>© {new Date().getFullYear()} WAMOCON UG (haftungsbeschränkt)</p>
            <p>Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
