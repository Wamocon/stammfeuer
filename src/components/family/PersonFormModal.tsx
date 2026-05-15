'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import type { FamilyPerson, Gender } from '@/types/database'

interface PersonFormModalProps {
  open: boolean
  onClose: () => void
  vaultId: string
  /** When provided, form is in edit mode */
  person?: FamilyPerson | null
  /** Called with the saved person after success */
  onSaved: (person: FamilyPerson) => void
  onDeleted?: (personId: string) => void
}

const GENDER_OPTIONS = [
  { value: '', label: '- Keine Angabe -' },
  { value: 'male', label: 'Mannlich' },
  { value: 'female', label: 'Weiblich' },
  { value: 'other', label: 'Divers' },
]

export function PersonFormModal({
  open,
  onClose,
  vaultId,
  person,
  onSaved,
  onDeleted,
}: PersonFormModalProps) {
  const isEdit = !!person

  const [fullName, setFullName] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [deathYear, setDeathYear] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (person) {
      setFullName(person.full_name)
      setBirthYear(person.birth_year ? String(person.birth_year) : '')
      setDeathYear(person.death_year ? String(person.death_year) : '')
      setGender((person.gender as Gender | '') ?? '')
      setBio(person.bio ?? '')
    } else {
      setFullName('')
      setBirthYear('')
      setDeathYear('')
      setGender('')
      setBio('')
    }
    setError(null)
    setConfirmDelete(false)
  }, [person, open])

  async function handleSave() {
    if (!fullName.trim()) {
      setError('Name ist erforderlich.')
      return
    }
    setSaving(true)
    setError(null)

    const payload = {
      full_name: fullName.trim(),
      birth_year: birthYear ? parseInt(birthYear, 10) : null,
      death_year: deathYear ? parseInt(deathYear, 10) : null,
      gender: gender || null,
      bio: bio.trim() || null,
    }

    const url = isEdit
      ? `/api/vaults/${vaultId}/family/${person!.id}`
      : `/api/vaults/${vaultId}/family`
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Fehler beim Speichern.')
      setSaving(false)
      return
    }

    onSaved(json.person as FamilyPerson)
    onClose()
    setSaving(false)
  }

  async function handleDelete() {
    if (!isEdit || !onDeleted) return
    setDeleting(true)
    setError(null)

    const res = await fetch(`/api/vaults/${vaultId}/family/${person!.id}`, { method: 'DELETE' })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(json.error ?? 'Fehler beim Loschen.')
      setDeleting(false)
      setConfirmDelete(false)
      return
    }

    onDeleted(person!.id)
    onClose()
    setDeleting(false)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Person bearbeiten' : 'Neue Person hinzufugen'}
    >
      <div className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="z.B. Anna Müller"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
              Geburtsjahr
            </label>
            <Input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="z.B. 1942"
              min={1800}
              max={new Date().getFullYear()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
              Sterbejahr
            </label>
            <Input
              type="number"
              value={deathYear}
              onChange={(e) => setDeathYear(e.target.value)}
              placeholder="leer lassen falls lebend"
              min={1800}
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
            Geschlecht
          </label>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender | '')}
            options={GENDER_OPTIONS}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
            Kurzbiografie (optional)
          </label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Ein paar Satze uber diese Person..."
            rows={3}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? 'Speichern...' : isEdit ? 'Speichern' : 'Hinzufugen'}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Abbrechen
          </Button>
        </div>

        {/* Delete section - only in edit mode */}
        {isEdit && onDeleted && (
          <div className="pt-2 border-t border-border">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                Person loschen
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-sm text-red-600 dark:text-red-400 flex-1">
                  Person und alle Beziehungen loschen?
                </p>
                <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
                  {deleting ? '...' : 'Ja, loschen'}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(false)}>
                  Nein
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
