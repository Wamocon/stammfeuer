import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500 dark:text-stone-400 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} strokeWidth={1.5} className="shrink-0" />}
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-stone-50 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
