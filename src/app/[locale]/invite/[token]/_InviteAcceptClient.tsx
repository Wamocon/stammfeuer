'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Flame, CheckCircle, XCircle } from 'lucide-react'

interface InviteAcceptClientProps {
  locale: string
  token: string
}

export default function InviteAcceptClient({ locale, token }: InviteAcceptClientProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [vaultId, setVaultId] = useState<string | null>(null)
  const router = useRouter()

  async function acceptInvite() {
    setStatus('loading')
    try {
      const res = await fetch(`/api/invite/${token}`, { method: 'POST' })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setVaultId(data.vault_id ?? null)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <CheckCircle size={56} className="text-emerald-600 mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-50 mb-2">
            Du bist dabei!
          </h1>
          <p className="text-base leading-relaxed text-gray-600 dark:text-stone-400 mb-6">
            Du wurdest erfolgreich zum Familienarchiv hinzugefügt.
          </p>
          <Button onClick={() => router.push(vaultId ? `/${locale}/vault/${vaultId}` : `/${locale}/dashboard`)}>
            Zum Vault
          </Button>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <XCircle size={56} className="text-red-600 mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-50 mb-2">
            Einladung ungültig
          </h1>
          <p className="text-base leading-relaxed text-gray-600 dark:text-stone-400 mb-6">
            Dieser Einladungslink ist abgelaufen oder wurde bereits verwendet.
          </p>
          <Link href={`/${locale}/dashboard`} className="text-amber-600 dark:text-amber-400 hover:underline">
            Zum Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <svg viewBox="0 0 40 48" className="w-16 h-16 mx-auto mb-4 animate-pulse" fill="none">
          <path d="M20 4C20 4 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 14 20 4 20 4Z" fill="#d97706" opacity="0.9" />
          <path d="M20 16C20 16 14 22 14 28C14 31.9 16.7 35 20 35C23.3 35 26 31.9 26 28C26 22 20 16 20 16Z" fill="#b91c1c" opacity="0.85" />
          <path d="M20 24C20 24 17 27 17 30C17 31.7 18.3 33 20 33C21.7 33 23 31.7 23 30C23 27 20 24 20 24Z" fill="#fbbf24" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-50 mb-2">
          Du wurdest eingeladen
        </h1>
        <p className="text-base leading-relaxed text-gray-600 dark:text-stone-400 mb-6">
          Jemand aus deiner Familie möchte dich zu ihrem Stammfeuer-Archiv einladen.
        </p>
        {status === 'loading' ? (
          <div className="flex justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button onClick={acceptInvite}>Einladung annehmen</Button>
            <Link href={`/${locale}/auth/register`} className="text-sm text-gray-500 dark:text-stone-400 hover:underline">
              Noch kein Konto? Jetzt registrieren
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
