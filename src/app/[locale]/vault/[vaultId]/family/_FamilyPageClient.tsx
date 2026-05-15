'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { GitBranch, Users, UserPlus } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { FamilyTree } from '@/components/family/FamilyTree'
import { MemberList } from '@/components/members/MemberList'
import { InviteForm } from '@/components/members/InviteForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { FamilyPerson, FamilyRelationship, VaultMember, MemberRole } from '@/types/database'

type Tab = 'tree' | 'members'

interface FamilyPageClientProps {
  locale: string
  vaultId: string
  vaultName: string
  persons: FamilyPerson[]
  relationships: FamilyRelationship[]
  members: VaultMember[]
  currentUserId: string
  currentRole: MemberRole
  defaultTab?: Tab
}

export default function FamilyPageClient({
  locale,
  vaultId,
  vaultName,
  persons,
  relationships,
  members,
  currentUserId,
  currentRole,
  defaultTab = 'tree',
}: FamilyPageClientProps) {
  const t = useTranslations('members')
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab)
  const [inviteOpen, setInviteOpen] = useState(false)

  const isInitiator = currentRole === 'initiator'

  const tabClass = (tab: Tab) =>
    `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
      activeTab === tab
        ? 'border-amber-500 text-amber-600 dark:text-amber-400'
        : 'border-transparent text-gray-500 dark:text-stone-400 hover:text-gray-700 dark:hover:text-stone-200 hover:border-gray-300 dark:hover:border-stone-600'
    }`

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="px-6 pt-5 pb-0 border-b border-border shrink-0">
        <Breadcrumbs
          items={[
            { label: vaultName, href: `/${locale}/vault/${vaultId}` },
            { label: 'Familie' },
          ]}
        />

        <div className="flex items-center justify-between mt-2 mb-3">
          <h1 className="text-2xl font-bold text-foreground">Familie</h1>

          {/* Tab-specific action */}
          {activeTab === 'members' && isInitiator && (
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <UserPlus size={15} className="mr-1" />
              {t('invite')}
            </Button>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 -mb-px">
          <button className={tabClass('tree')} onClick={() => setActiveTab('tree')}>
            <GitBranch size={15} />
            Stammbaum
          </button>
          <button className={tabClass('members')} onClick={() => setActiveTab('members')}>
            <Users size={15} />
            Mitglieder
            <span className="ml-1.5 text-[11px] bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 rounded-full px-1.5 py-0.5 font-normal">
              {members.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'tree' ? (
        <div className="flex-1 min-h-0">
          <FamilyTree
            vaultId={vaultId}
            initialPersons={persons}
            initialRelationships={relationships}
            members={members}
            currentUserId={currentUserId}
            currentRole={currentRole}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-6">
            <MemberList
              members={members}
              currentUserId={currentUserId}
              currentRole={currentRole}
              vaultId={vaultId}
              onUpdate={() => router.refresh()}
            />
          </div>
        </div>
      )}

      {/* Invite modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title={t('invite')}>
        <InviteForm
          vaultId={vaultId}
          onInvited={() => {
            setInviteOpen(false)
            router.refresh()
          }}
        />
      </Modal>
    </div>
  )
}
