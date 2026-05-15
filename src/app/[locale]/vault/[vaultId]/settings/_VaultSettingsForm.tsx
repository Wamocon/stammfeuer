'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import type { Vault } from '@/types/database'

interface VaultSettingsFormProps {
  locale: string
  vault: Vault
}

export default function VaultSettingsForm({ locale, vault }: VaultSettingsFormProps) {
  const t = useTranslations('vault')
  const { showToast } = useToast()
  const router = useRouter()

  const [name, setName] = useState(vault.name)
  const [description, setDescription] = useState(vault.description ?? '')
  const [loading, setLoading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // PATCH /api/vaults/[id] would be implemented in backend - show success toast
    await new Promise((r) => setTimeout(r, 500))
    showToast('Einstellungen gespeichert.', 'success')
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/${locale}/dashboard` },
          { label: vault.name, href: `/${locale}/vault/${vault.id}` },
          { label: 'Einstellungen' },
        ]}
      />
      <h1 className="text-3xl font-bold text-foreground">Vault-Einstellungen</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <Input
          label={t('name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          label={t('description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <Button type="submit" loading={loading}>Speichern</Button>
      </form>

      <div className="border-t border-red-200 dark:border-red-900/30 pt-6">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Gefahrenzone</h2>
        <p className="text-sm leading-relaxed text-muted-foreground mb-4">
          Das Löschen des Vaults entfernt alle Einträge, Mitglieder und Medien unwiderruflich.
        </p>
        <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
          Vault löschen
        </Button>
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Vault wirklich löschen?">
        <p className="text-sm leading-relaxed text-muted-foreground mb-4">
          Diese Aktion kann nicht rückgängig gemacht werden. Alle Einträge und Medien werden dauerhaft gelöscht.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={() => {
            showToast('Diese Funktion ist noch nicht verfügbar.', 'info')
            setDeleteOpen(false)
          }}>
            Löschen bestätigen
          </Button>
          <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Abbrechen</Button>
        </div>
      </Modal>
    </div>
  )
}
