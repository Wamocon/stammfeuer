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

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const labels = ['', 'Schwach', 'Mittel', 'Stark']
  const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500']
  if (!password) return null
  return (
    <div className="mt-1 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? colors[strength] : 'bg-muted'}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{labels[strength]}</p>
    </div>
  )
}

export default function RegisterForm({ locale }: { locale: string }) {
  const t = useTranslations('auth')
  const tLegal = useTranslations('legal')
  const { showToast } = useToast()
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Passwörter stimmen nicht überein.')
    if (password.length < 8) return setError('Passwort muss mindestens 8 Zeichen lang sein.')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/${locale}/auth/confirm-email`,
      },
    })
    setLoading(false)
    if (error) return setError(t('errors.generic'))
    showToast(t('success.registered'), 'success')
    // In production, email confirmation is required - show confirm page
    // Locally (NEXT_PUBLIC_REQUIRE_EMAIL_CONFIRM=false) skip directly to dashboard
    if (process.env.NEXT_PUBLIC_REQUIRE_EMAIL_CONFIRM === 'true') {
      router.push(`/${locale}/auth/confirm-email`)
    } else {
      router.push(`/${locale}/dashboard`)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left panel - rotating slideshow (desktop only) */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-amber-600 via-orange-500 to-red-700 overflow-hidden">
        <AuthSlideshow />
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:max-w-lg mx-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">{t('registerTitle')}</h1>
            <p className="text-base text-muted-foreground mt-1 leading-relaxed">{t('registerSubtitle')}</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label={t('fullName')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
            />
            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <div>
              <Input
                label={t('password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <PasswordStrength password={password} />
            </div>
            <Input
              label="Passwort bestätigen"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" loading={loading} className="w-full">
              {t('registerButton')}
            </Button>
          </form>

          <p className="mt-4 text-xs text-center text-muted-foreground leading-relaxed">
            Mit der Registrierung stimmst du unserer{' '}
            <Link href={`/${locale}/legal/datenschutz`} className="text-amber-600 dark:text-amber-400 hover:underline">
              {tLegal('privacy')}
            </Link>{' '}
            und den{' '}
            <Link href={`/${locale}/legal/agb`} className="text-amber-600 dark:text-amber-400 hover:underline">
              {tLegal('terms')}
            </Link>{' '}
            zu.
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('hasAccount')}{' '}
            <Link href={`/${locale}/auth/login`} className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
              {t('loginButton')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
