import Link from 'next/link'
import type { Entry } from '@/types/database'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useTranslations } from 'next-intl'
import { CategoryIcon } from '@/components/vault/CategoryIcon'

interface EntryCardProps {
  entry: Entry
  locale: string
  vaultId: string
}

export function EntryCard({ entry, locale, vaultId }: EntryCardProps) {
  const tCat = useTranslations('categories')

  const formattedDate = new Date(entry.created_at).toLocaleDateString(
    locale === 'de' ? 'de-DE' : 'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' }
  )

  return (
    <Link href={`/${locale}/vault/${vaultId}/entries/${entry.id}`} className="block h-full">
      <div className="bg-white dark:bg-stone-800 border border-[var(--color-border)] dark:border-stone-700 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <CategoryIcon slug={entry.category_slug} size={18} />
          <Badge variant={entry.category_slug}>{tCat(entry.category_slug)}</Badge>
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-stone-50 mb-2 leading-snug line-clamp-2 flex-1">
          {entry.title}
        </h3>
        {entry.body && (
          <p className="text-sm leading-relaxed text-gray-600 dark:text-stone-400 line-clamp-3 mb-4">
            {entry.body}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--color-border)] dark:border-stone-700">
          <div className="flex items-center gap-2">
            <Avatar
              name={entry.author?.full_name}
              src={entry.author?.avatar_url}
              size="sm"
            />
            <span className="text-xs text-gray-500 dark:text-stone-400">
              {entry.author?.full_name ?? '—'}
            </span>
          </div>
          <span className="text-xs text-gray-400 dark:text-stone-500">{formattedDate}</span>
        </div>
      </div>
    </Link>
  )
}
