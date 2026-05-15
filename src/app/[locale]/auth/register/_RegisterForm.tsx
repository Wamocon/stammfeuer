'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const labels = ['', 'Schwach', 'Mittel', 'Stark']
  const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500']
  if (!password) return null
  return (
    <div className="mt-1 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? colors[strength] : 'bg-gray-200 dark:bg-stone-700'}`} />
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-stone-400">{labels[strength]}</p>
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
      options: { data: { full_name: fullName } },
    })
    setLoading(false)
    if (error) return setError(t('errors.generic'))
    showToast(t('success.registered'), 'success')
    router.push(`/${locale}/dashboard`)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-amber-600 via-orange-500 to-red-700 items-center justify-center p-12">
        <div className="text-center text-white max-w-sm">
          <svg viewBox="0 0 40 48" className="w-20 h-20 mx-auto mb-6" fill="none">
            <path d="M20 4C20 4 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 14 20 4 20 4Z" fill="white" opacity="0.9" />
            <path d="M20 16C20 16 14 22 14 28C14 31.9 16.7 35 20 35C23.3 35 26 31.9 26 28C26 22 20 16 20 16Z" fill="#b91c1c" opacity="0.85" />
            <path d="M20 24C20 24 17 27 17 30C17 31.7 18.3 33 20 33C21.7 33 23 31.7 23 30C23 27 20 24 20 24Z" fill="#fbbf24" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Das Familiengedächtnis beginnt hier.</h2>
          <p className="text-white/90 text-base leading-relaxed">
            Erstelle einen Account und lege das Gedächtnis deiner Familie für immer an.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:max-w-lg mx-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-50">{t('registerTitle')}</h1>
            <p className="text-base text-gray-600 dark:text-stone-400 mt-1 leading-relaxed">{t('registerSubtitle')}</p>
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

          <p className="mt-4 text-xs text-center text-gray-500 dark:text-stone-400 leading-relaxed">
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

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-stone-400">
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
