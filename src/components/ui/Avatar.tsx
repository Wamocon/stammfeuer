import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function initials(name?: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const sizes = {
  sm: { px: 32, cls: 'w-8 h-8 text-xs' },
  md: { px: 40, cls: 'w-10 h-10 text-sm' },
  lg: { px: 56, cls: 'w-14 h-14 text-base' },
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const { px, cls } = sizes[size]
  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? 'Avatar'}
        width={px}
        height={px}
        className={`rounded-full object-cover ${cls} ${className}`}
      />
    )
  }
  return (
    <div
      className={`rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold flex items-center justify-center shrink-0 ${cls} ${className}`}
      aria-label={name ?? undefined}
    >
      {initials(name)}
    </div>
  )
}
