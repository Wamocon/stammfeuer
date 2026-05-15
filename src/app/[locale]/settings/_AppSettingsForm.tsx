'use client'

import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Sun, Moon, Monitor } from 'lucide-react'

interface AppSettingsFormProps {
  locale: string
  userEmail: string
}

export default function AppSettingsForm({ locale, userEmail }: AppSettingsFormProps) {
  const t = useTranslations('settings')
  const { theme, setTheme } = useTheme()
  const { showToast } = useToast()
  const router = useRouter()

  const otherLocale = locale === 'de' ? 'en' : 'de'

  async function handleDeleteAccount() {
    const confirmed = window.confirm(t('deleteAccountConfirm'))
    if (!confirmed) return
    try {
      const res = await fetch('/api/user/delete', { method: 'POST' })
      if (!res.ok) throw new Error()
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push(`/${locale}`)
    } catch {
      showToast('Fehler beim Löschen des Kontos.', 'error')
    }
  }

  async function handleExport() {
    try {
      const res = await fetch('/api/user/export')
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'ahnenecho-export.json'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      showToast('Export fehlgeschlagen.', 'error')
    }
  }

  const themeOptions = [
    { value: 'light', label: t('themeLight'), Icon: Sun },
    { value: 'dark', label: t('themeDark'), Icon: Moon },
    { value: 'system', label: t('themeSystem'), Icon: Monitor },
  ]

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>

      {/* Theme */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">{t('theme')}</h2>
        <div className="flex gap-2 flex-wrap">
          {themeOptions.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                theme === value
                  ? 'border-amber-600 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/20 dark:text-amber-400'
                  : 'border-border text-muted-foreground hover:border-amber-400'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Language */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">{t('language')}</h2>
        <div className="flex gap-2">
          {['de', 'en'].map((l) => (
            <Link
              key={l}
              href={`/${l}/settings`}
              className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                l === locale
                  ? 'border-amber-600 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/20 dark:text-amber-400'
                  : 'border-border text-muted-foreground hover:border-amber-400'
              }`}
            >
              {l === 'de' ? 'Deutsch' : 'English'}
            </Link>
          ))}
        </div>
      </section>

      {/* Data */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">Daten</h2>
        <Button variant="secondary" size="sm" onClick={handleExport}>
          {t('exportData')}
        </Button>
      </section>

      {/* Danger zone */}
      <section className="border-t border-red-200 dark:border-red-900/30 pt-6">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">{t('dangerZone')}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground mb-4">
          Das Löschen deines Kontos entfernt alle deine Daten unwiderruflich.
        </p>
        <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
          {t('deleteAccountButton')}
        </Button>
      </section>
    </div>
  )
}
