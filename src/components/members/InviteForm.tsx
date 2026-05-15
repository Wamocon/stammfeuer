'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { MemberRole } from '@/types/database'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { Copy, Check } from 'lucide-react'

interface InviteFormProps {
  vaultId: string
  onInvited: () => void
}

export function InviteForm({ vaultId, onInvited }: InviteFormProps) {
  const t = useTranslations('members')
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MemberRole>('contributor')
  const [familyRole, setFamilyRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleInvite() {
    if (!email.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/vaults/${vaultId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role, family_role: familyRole.trim() || null }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      const data = await res.json()
      showToast(t('success.invited'), 'success')
      if (data.invite_link) setInviteLink(data.invite_link)
      setEmail('')
      setFamilyRole('')
      onInvited()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      showToast(msg === 'already_member' ? t('errors.alreadyMember') : t('errors.inviteFailed'), 'error')
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    if (!inviteLink) return
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Input
        label={t('inviteEmail')}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="familie@beispiel.de"
      />
      <Select
        label={t('inviteRole')}
        value={role}
        onChange={(e) => setRole(e.target.value as MemberRole)}
        options={[
          { value: 'contributor', label: t('roles.contributor') },
          { value: 'reader', label: t('roles.reader') },
          { value: 'initiator', label: t('roles.initiator') },
        ]}
      />
      <Input
        label={t('inviteFamilyRole')}
        value={familyRole}
        onChange={(e) => setFamilyRole(e.target.value)}
        placeholder={t('inviteFamilyRolePlaceholder')}
      />
      <Button onClick={handleInvite} loading={loading}>
        {t('inviteButton')}
      </Button>

      {inviteLink && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 rounded-lg">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">{t('inviteLink')}</p>
          <div className="flex gap-2 items-center">
            <code className="text-xs text-amber-700 dark:text-amber-400 break-all flex-1">{inviteLink}</code>
            <button
              onClick={copyLink}
              className="shrink-0 p-2 rounded-lg bg-card border border-amber-200 dark:border-amber-900/30 text-amber-600 hover:text-amber-700"
            >
              {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
