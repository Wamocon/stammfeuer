import { useTranslations } from 'next-intl'
import type { CategorySlug } from '@/types/database'
import { CategoryIcon } from './CategoryIcon'

interface CategoryHealth {
  slug: CategorySlug
  entry_count: number
  max?: number
}

interface VaultHealthChartProps {
  score: number
  categories: CategoryHealth[]
}

const CATEGORY_MAX = 10

export function VaultHealthChart({ score, categories }: VaultHealthChartProps) {
  const t = useTranslations('categories')

  const scoreColor =
    score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="flex items-center gap-4">
        <div className={`text-4xl font-bold tabular-nums ${scoreColor}`}>{score}%</div>
        <div className="flex-1">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                score >= 70
                  ? 'bg-emerald-500'
                  : score >= 40
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Per-category bars */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const max = cat.max ?? CATEGORY_MAX
          const pct = Math.min(100, Math.round((cat.entry_count / max) * 100))
          return (
            <div key={cat.slug} className="flex items-center gap-3">
              <CategoryIcon slug={cat.slug} size={18} className="shrink-0" />
              <span className="text-sm text-muted-foreground w-24 shrink-0 truncate">
                {t(cat.slug)}
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
                {cat.entry_count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
