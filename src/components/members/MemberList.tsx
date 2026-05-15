'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { VaultMember, MemberRole } from '@/types/database'
import { Avatar } from '@/components/ui/Avatar'
import { RoleBadge } from './RoleBadge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

interface MemberListProps {
  members: VaultMember[]
  currentUserId: string
  currentRole: MemberRole
  vaultId: string
  onUpdate: () => void
}

export function MemberList({ members, currentUserId, currentRole, vaultId, onUpdate }: MemberListProps) {
  const t = useTranslations('members')
  const tCommon = useTranslations('common')
  const { showToast } = useToast()
  const [removingId, setRemovingId] = useState<string | null>(null)

  const isInitiator = currentRole === 'initiator'

  async function handleRemove(memberId: string) {
    const res = await fetch(`/api/vaults/${vaultId}/members`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_id: memberId }),
    })
    if (res.ok) {
      showToast(t('success.removed'), 'success')
      onUpdate()
    } else {
      showToast(t('errors.inviteFailed'), 'error')
    }
    setRemovingId(null)
  }

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const isMe = member.user_id === currentUserId
        const name = member.profile?.full_name ?? member.display_name ?? member.invite_email ?? '—'
        const avatarUrl = member.profile?.avatar_url
        const lastDate = member.profile?.updated_at
          ? new Date(member.profile.updated_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
          : null
        const isPending = !member.invite_accepted_at && member.invite_email

        return (
          <div
            key={member.id}
            className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${
              isPending
                ? 'border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/10'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar name={name} src={avatarUrl} size="md" />
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  {name} {isMe && <span className="text-xs text-gray-400">(du)</span>}
                </p>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <RoleBadge role={member.role} />
                  {member.family_role && (
                    <span className="text-xs text-muted-foreground">{member.family_role}</span>
                  )}
                  {isPending && (
                    <span className="text-xs text-amber-600 dark:text-amber-400">{t('pendingInvite')}</span>
                  )}
                </div>
              </div>
            </div>

            {isInitiator && !isMe && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setRemovingId(member.id)}
              >
                {t('removeButton')}
              </Button>
            )}
          </div>
        )
      })}

      {/* Remove confirmation modal */}
      <Modal
        open={removingId !== null}
        onClose={() => setRemovingId(null)}
        title={t('removeConfirm')}
      >
        <div className="flex gap-3 mt-4">
          <Button variant="danger" onClick={() => removingId && handleRemove(removingId)}>
            {t('removeButton')}
          </Button>
          <Button variant="ghost" onClick={() => setRemovingId(null)}>
            {tCommon('cancel')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
