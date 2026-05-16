'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

interface EntryActionsProps {
  locale: string
  vaultId: string
  entryId: string
  editHref: string
}

export function EntryActions({ locale, vaultId, entryId, editHref }: EntryActionsProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/vaults/${vaultId}/entries/${entryId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      showToast('Eintrag gelöscht', 'success')
      router.push(`/${locale}/vault/${vaultId}/entries`)
      router.refresh()
    } catch {
      showToast('Löschen fehlgeschlagen', 'error')
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link
        href={editHref}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <Pencil size={14} strokeWidth={1.5} />
        Bearbeiten
      </Link>

      {confirming ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sicher?</span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {deleting ? 'Löschen...' : 'Ja, löschen'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border text-muted-foreground hover:bg-accent transition-colors"
          >
            Abbrechen
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label="Eintrag löschen"
        >
          <Trash2 size={16} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}
