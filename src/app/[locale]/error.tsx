'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle size={32} className="text-destructive" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">Etwas ist schiefgelaufen</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Ein unerwarteter Fehler ist aufgetreten. Du kannst es erneut versuchen oder zur Startseite zurückkehren.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <RotateCcw size={15} strokeWidth={1.5} />
            Erneut versuchen
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            Zum Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
