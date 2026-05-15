import type { ReactNode } from 'react'
import type { CategorySlug, MemberRole } from '@/types/database'

type BadgeVariant = 'default' | CategorySlug | MemberRole

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-stone-700 dark:text-stone-200',
  stories: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  recipes: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  traditions: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  wisdom: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  places: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  photos: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  initiator: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  contributor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  reader: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${variantClasses[variant] ?? variantClasses.default} ${className}`}
    >
      {children}
    </span>
  )
}
