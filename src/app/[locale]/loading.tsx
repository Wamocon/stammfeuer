export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-4">
        <svg viewBox="0 0 40 48" className="w-10 h-10 animate-pulse opacity-60" fill="none" aria-hidden="true">
          <path d="M20 4C20 4 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 14 20 4 20 4Z" fill="#d97706" opacity="0.9" />
          <path d="M20 16C20 16 14 22 14 28C14 31.9 16.7 35 20 35C23.3 35 26 31.9 26 28C26 22 20 16 20 16Z" fill="#b91c1c" opacity="0.85" />
          <path d="M20 24C20 24 17 27 17 30C17 31.7 18.3 33 20 33C21.7 33 23 31.7 23 30C23 27 20 24 20 24Z" fill="#fbbf24" />
        </svg>
        <div className="space-y-2 text-center">
          <div className="h-2 w-32 bg-muted rounded-full animate-pulse" />
          <div className="h-2 w-24 bg-muted rounded-full animate-pulse opacity-60" />
        </div>
      </div>
    </div>
  )
}
