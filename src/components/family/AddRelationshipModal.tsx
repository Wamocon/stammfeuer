'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { FamilyPerson, FamilyRelationship, FamilyRelationshipType } from '@/types/database'

interface AddRelationshipModalProps {
  open: boolean
  onClose: () => void
  vaultId: string
  /** The "from" person - relationship starts here */
  fromPerson: FamilyPerson | null
  allPersons: FamilyPerson[]
  onAdded: (relationship: FamilyRelationship) => void
}

const RELATIONSHIP_OPTIONS = [
  { value: 'parent_child', label: 'Elternteil von (diese Person ist Elternteil)' },
  { value: 'partner', label: 'Partner / Ehepartner' },
]

export function AddRelationshipModal({
  open,
  onClose,
  vaultId,
  fromPerson,
  allPersons,
  onAdded,
}: AddRelationshipModalProps) {
  const [toPersonId, setToPersonId] = useState('')
  const [relType, setRelType] = useState<FamilyRelationshipType>('parent_child')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setToPersonId('')
      setRelType('parent_child')
      setError(null)
    }
  }, [open])

  if (!fromPerson) return null

  const otherPersons = allPersons.filter((p) => p.id !== fromPerson.id)

  const targetOptions = [
    { value: '', label: '- Person auswahlen -' },
    ...otherPersons.map((p) => ({
      value: p.id,
      label: `${p.full_name}${p.birth_year ? ` (${p.birth_year})` : ''}`,
    })),
  ]

  async function handleAdd() {
    if (!toPersonId) {
      setError('Bitte eine Person auswahlen.')
      return
    }
    setSaving(true)
    setError(null)

    const res = await fetch(`/api/vaults/${vaultId}/family/relationships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        person_a_id: fromPerson!.id,
        person_b_id: toPersonId,
        relationship_type: relType,
      }),
    })
    const json = await res.json()

    if (!res.ok) {
      setError(json.error === 'Relationship already exists'
        ? 'Diese Beziehung existiert bereits.'
        : (json.error ?? 'Fehler beim Speichern.'))
      setSaving(false)
      return
    }

    onAdded(json.relationship as FamilyRelationship)
    onClose()
    setSaving(false)
  }

  const relLabel = relType === 'parent_child'
    ? `${fromPerson.full_name} ist Elternteil von`
    : `${fromPerson.full_name} ist Partner von`

  return (
    <Modal open={open} onClose={onClose} title="Beziehung hinzufugen">
      <div className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <p className="text-sm text-gray-700 dark:text-stone-300">
          Von: <strong>{fromPerson.full_name}</strong>
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
            Beziehungstyp
          </label>
          <Select
            value={relType}
            onChange={(e) => setRelType(e.target.value as FamilyRelationshipType)}
            options={RELATIONSHIP_OPTIONS}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
            {relLabel}
          </label>
          <Select
            value={toPersonId}
            onChange={(e) => setToPersonId(e.target.value)}
            options={targetOptions}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleAdd} disabled={saving || !toPersonId} className="flex-1">
            {saving ? 'Speichern...' : 'Beziehung erstellen'}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Abbrechen
          </Button>
        </div>
      </div>
    </Modal>
  )
}
