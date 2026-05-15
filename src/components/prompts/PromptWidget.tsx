'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { MemberPrompt } from '@/types/database'
import { MessageCircle, Mic } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PromptWidgetProps {
  prompt: MemberPrompt | null
  locale: string
  vaultId: string
}

export function PromptWidget({ prompt, locale, vaultId }: PromptWidgetProps) {
  const t = useTranslations('prompts')

  if (!prompt?.prompt) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle size={18} className="text-amber-600" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{t('thisWeek')}</span>
        </div>
        <p className="text-sm text-amber-600 dark:text-amber-500">{t('noPrompt')}</p>
      </div>
    )
  }

  const promptText = locale === 'en' ? prompt.prompt.text_en : prompt.prompt.text_de

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={18} className="text-amber-600" strokeWidth={1.5} />
        <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{t('thisWeek')}</span>
      </div>
      <p className="text-base leading-relaxed font-medium text-gray-900 dark:text-stone-50 mb-4">
        &ldquo;{promptText}&rdquo;
      </p>
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          onClick={() => {}}
          className="!bg-amber-600 !hover:bg-amber-500"
        >
          <Link href={`/${locale}/vault/${vaultId}/entries/new?prompt=${prompt.id}`} className="flex items-center gap-2">
            {t('answerNow')}
          </Link>
        </Button>
        <Link
          href={`/${locale}/vault/${vaultId}/entries/new?prompt=${prompt.id}&voice=1`}
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
        >
          <Mic size={14} strokeWidth={1.5} />
          Per Sprache
        </Link>
      </div>
    </div>
  )
}
