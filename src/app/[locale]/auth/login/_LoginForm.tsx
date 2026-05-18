'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { AuthSlideshow } from '@/components/auth/AuthSlideshow'

export default function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations('auth')
  const { showToast } = useToast()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicMode, setMagicMode] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()

    if (magicMode) {
      const redirectTo = `${window.location.origin}/auth/callback?next=/${locale}/dashboard`
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      })
      setLoading(false)
      if (error) return setError(t('errors.generic'))
      showToast(t('success.magicLinkSent'), 'success')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      if (error.message.includes('Email not confirmed')) return setError(t('errors.emailNotConfirmed'))
      return setError(t('errors.invalidCredentials'))
    }
    router.push(`/${locale}/dashboard`)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left panel - rotating slideshow (desktop only) */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-amber-600 via-orange-500 to-red-700 overflow-hidden">
        <AuthSlideshow />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:max-w-lg mx-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden mb-4 flex justify-center">
              <svg viewBox="0 0 40 48" className="w-12 h-12" fill="none">
                <path d="M20 4C20 4 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 14 20 4 20 4Z" fill="#d97706" opacity="0.9" />
                <path d="M20 16C20 16 14 22 14 28C14 31.9 16.7 35 20 35C23.3 35 26 31.9 26 28C26 22 20 16 20 16Z" fill="#b91c1c" opacity="0.85" />
                <path d="M20 24C20 24 17 27 17 30C17 31.7 18.3 33 20 33C21.7 33 23 31.7 23 30C23 27 20 24 20 24Z" fill="#fbbf24" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t('loginTitle')}</h1>
            <p className="text-base text-muted-foreground mt-1 leading-relaxed">{t('loginSubtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            {!magicMode && (
              <Input
                label={t('password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            )}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" loading={loading} className="w-full">
              {magicMode ? t('magicLinkButton') : t('loginButton')}
            </Button>
          </form>

          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              onClick={() => setMagicMode(!magicMode)}
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              {magicMode ? 'Mit Passwort anmelden' : 'Ohne Passwort anmelden'}
            </button>
            {!magicMode && (
              <Link
                href={`/${locale}/auth/reset-password`}
                className="text-sm text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400"
              >
                {t('forgotPassword')}
              </Link>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link href={`/${locale}/auth/register`} className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
              {t('registerButton')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
