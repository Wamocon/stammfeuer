export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  }
  return (
    <span
      className={`inline-block ${sizes[size]} border-current border-t-transparent rounded-full animate-spin`}
      aria-hidden="true"
    />
  )
}
