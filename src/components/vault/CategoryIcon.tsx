import type { CategorySlug } from '@/types/database'
import { BookOpen, UtensilsCrossed, Sparkles, Quote, MapPin, Camera } from 'lucide-react'

interface CategoryIconProps {
  slug: CategorySlug
  size?: number
  className?: string
}

const iconMap: Record<CategorySlug, { Icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>; colorClass: string }> = {
  stories: { Icon: BookOpen as never, colorClass: 'text-amber-600' },
  recipes: { Icon: UtensilsCrossed as never, colorClass: 'text-orange-600' },
  traditions: { Icon: Sparkles as never, colorClass: 'text-yellow-600' },
  wisdom: { Icon: Quote as never, colorClass: 'text-emerald-600' },
  places: { Icon: MapPin as never, colorClass: 'text-blue-600' },
  photos: { Icon: Camera as never, colorClass: 'text-purple-600' },
}

export function CategoryIcon({ slug, size = 24, className = '' }: CategoryIconProps) {
  const { Icon, colorClass } = iconMap[slug] ?? iconMap.stories
  return (
    <Icon
      size={size}
      strokeWidth={1.5}
      className={`${colorClass} ${className}`}
    />
  )
}
