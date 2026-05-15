'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const STORAGE_KEY = 'stammfeuer_cookie_accepted'

export function CookieBanner() {
  const t = useTranslations('cookie')
  const tLegal = useTranslations('legal')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-toast-in">
      <div className="max-w-3xl mx-auto bg-white dark:bg-stone-800 border border-[var(--color-border)] dark:border-stone-700 rounded-xl shadow-xl p-5 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm leading-relaxed text-gray-700 dark:text-stone-300 flex-1">
          {t('message')}{' '}
          <Link
            href="/de/legal/datenschutz"
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            {t('learnMore')}
          </Link>
        </p>
        <Button size="sm" onClick={accept} className="shrink-0">
          {t('accept')}
        </Button>
      </div>
    </div>
  )
}
