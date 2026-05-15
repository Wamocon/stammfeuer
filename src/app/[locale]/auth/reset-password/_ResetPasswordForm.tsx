'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function ResetPasswordForm({ locale }: { locale: string }) {
  const t = useTranslations('auth')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/auth/update-password`,
    })
    setLoading(false)
    if (error) return setError(t('errors.generic'))
    setSent(true)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          href={`/${locale}/auth/login`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 mb-8"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Zurück zur Anmeldung
        </Link>

        {sent ? (
          <div className="text-center">
            <CheckCircle size={48} className="text-emerald-600 mx-auto mb-4" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-50 mb-2">{t('success.resetLinkSent')}</h1>
            <p className="text-base leading-relaxed text-gray-600 dark:text-stone-400">
              Wir haben dir einen Link geschickt. Bitte prüfe dein Postfach.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-50 mb-1">{t('resetPasswordTitle')}</h1>
            <p className="text-base leading-relaxed text-gray-600 dark:text-stone-400 mb-6">{t('resetPasswordSubtitle')}</p>
            <form onSubmit={handleReset} className="space-y-4">
              <Input
                label={t('email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <Button type="submit" loading={loading} className="w-full">
                {t('resetButton')}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
