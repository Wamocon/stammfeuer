import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { VaultWithStats } from '@/types/database'
import { Badge } from '@/components/ui/Badge'
import { Users, BookOpen, Calendar } from 'lucide-react'

interface VaultCardProps {
  vault: VaultWithStats
  locale: string
}

export function VaultCard({ vault, locale }: VaultCardProps) {
  const t = useTranslations('vault')

  const formattedDate = vault.last_entry_at
    ? new Date(vault.last_entry_at).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <Link href={`/${locale}/vault/${vault.id}`} className="block">
      <div className="bg-white dark:bg-stone-800 border border-[var(--color-border)] dark:border-stone-700 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 h-full">
        {vault.cover_url && (
          <div className="w-full h-32 rounded-lg mb-4 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={vault.cover_url} alt={vault.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-stone-50 leading-tight">
            {vault.name}
          </h3>
          <Badge variant={vault.user_role}>{vault.user_role}</Badge>
        </div>
        {vault.description && (
          <p className="text-sm leading-relaxed text-gray-600 dark:text-stone-400 mb-4 line-clamp-2">
            {vault.description}
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-stone-400">
          <span className="flex items-center gap-1">
            <Users size={14} strokeWidth={1.5} />
            {vault.member_count} {t('members')}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={14} strokeWidth={1.5} />
            {vault.entry_count} {t('totalEntries')}
          </span>
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Calendar size={14} strokeWidth={1.5} />
              {formattedDate}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
