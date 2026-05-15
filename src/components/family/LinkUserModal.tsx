'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { UserCheck, UserX } from 'lucide-react'
import type { FamilyPerson, VaultMember } from '@/types/database'

interface LinkUserModalProps {
  open: boolean
  onClose: () => void
  vaultId: string
  person: FamilyPerson | null
  members: VaultMember[]
  onLinked: (updatedPerson: FamilyPerson) => void
}

export function LinkUserModal({
  open,
  onClose,
  vaultId,
  person,
  members,
  onLinked,
}: LinkUserModalProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!person) return null

  // Members that are not yet linked to a different person
  const availableMembers = members.filter((m) => m.user_id !== null)

  async function handleLink(memberId: string | null) {
    setSaving(true)
    setError(null)

    const res = await fetch(`/api/vaults/${vaultId}/family/${person!.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_id: memberId }),
    })
    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Fehler beim Verknupfen.')
      setSaving(false)
      return
    }

    onLinked(json.person as FamilyPerson)
    onClose()
    setSaving(false)
  }

  const currentMember = members.find((m) => m.id === person.member_id)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`User zuweisen: ${person.full_name}`}
    >
      <div className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Weise einen registrierten App-Nutzer dieser Person zu. Dadurch werden
          Beitrage dieses Nutzers mit der Person im Stammbaum verknupft.
        </p>

        {/* Current link */}
        {currentMember && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <UserCheck size={16} className="text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-stone-100">
                  {currentMember.profile?.full_name ?? currentMember.display_name ?? '—'}
                </p>
                <p className="text-xs text-muted-foreground">Aktuell verknupft</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleLink(null)}
              disabled={saving}
            >
              <UserX size={14} className="mr-1" />
              Trennen
            </Button>
          </div>
        )}

        {/* Available members list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Keine App-Nutzer im Archiv gefunden.
            </p>
          ) : (
            availableMembers.map((member) => {
              const name =
                member.profile?.full_name ?? member.display_name ?? member.invite_email ?? '—'
              const isLinked = member.id === person.member_id

              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors
                    ${
                      isLinked
                        ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20'
                        : 'border-border hover:border-stone-300 dark:hover:border-stone-600'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={name} src={member.profile?.avatar_url} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-stone-100">{name}</p>
                      {member.family_role && (
                        <p className="text-xs text-muted-foreground">{member.family_role}</p>
                      )}
                    </div>
                  </div>

                  {isLinked ? (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                      <UserCheck size={12} />
                      Verknupft
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleLink(member.id)}
                      disabled={saving}
                    >
                      Zuweisen
                    </Button>
                  )}
                </div>
              )
            })
          )}
        </div>

        <Button variant="secondary" onClick={onClose} disabled={saving} className="w-full">
          Schliessen
        </Button>
      </div>
    </Modal>
  )
}
