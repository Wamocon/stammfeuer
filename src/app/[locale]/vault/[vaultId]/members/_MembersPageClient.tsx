'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MemberList } from '@/components/members/MemberList'
import { InviteForm } from '@/components/members/InviteForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import type { VaultMember, MemberRole } from '@/types/database'
import { UserPlus } from 'lucide-react'

interface MembersPageClientProps {
  locale: string
  vaultId: string
  vaultName: string
  members: VaultMember[]
  currentUserId: string
  currentRole: MemberRole
}

export default function MembersPageClient({
  locale,
  vaultId,
  vaultName,
  members: initialMembers,
  currentUserId,
  currentRole,
}: MembersPageClientProps) {
  const t = useTranslations('members')
  const router = useRouter()
  const [inviteOpen, setInviteOpen] = useState(false)
  const members = initialMembers

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/${locale}/dashboard` },
          { label: vaultName, href: `/${locale}/vault/${vaultId}` },
          { label: t('invite').replace(' einladen', 'liste') ?? 'Mitglieder' },
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-50">Mitglieder</h1>
        {currentRole === 'initiator' && (
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus size={16} strokeWidth={1.5} />
            {t('invite')}
          </Button>
        )}
      </div>

      <MemberList
        members={members}
        currentUserId={currentUserId}
        currentRole={currentRole}
        vaultId={vaultId}
        onUpdate={() => router.refresh()}
      />

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title={t('invite')}>
        <InviteForm vaultId={vaultId} onInvited={() => { setInviteOpen(false); router.refresh() }} />
      </Modal>
    </div>
  )
}
