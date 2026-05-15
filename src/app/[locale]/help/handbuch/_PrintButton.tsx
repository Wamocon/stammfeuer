'use client'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
    >
      Als PDF drucken / speichern
    </button>
  )
}
