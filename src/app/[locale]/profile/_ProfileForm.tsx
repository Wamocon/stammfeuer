'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import type { Profile } from '@/types/database'

interface ProfileFormProps {
  locale: string
  profile: Profile | null
  userId: string
}

export default function ProfileForm({ locale, profile, userId }: ProfileFormProps) {
  const t = useTranslations('profile')
  const { showToast } = useToast()

  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [birthYear, setBirthYear] = useState(profile?.birth_year?.toString() ?? '')
  const [familyRole, setFamilyRole] = useState('')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [loading, setLoading] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        birth_year: birthYear ? parseInt(birthYear) : null,
        bio: bio || null,
        updated_at: new Date().toISOString(),
      } as never)
    setLoading(false)
    if (error) return showToast(error.message, 'error')
    showToast(t('success'), 'success')
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-50">{t('title')}</h1>

      <div className="flex items-center gap-4">
        <Avatar name={fullName} size="lg" />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-stone-50">{fullName || 'Dein Name'}</p>
          <p className="text-xs text-gray-400 dark:text-stone-500">{t('changeAvatar')} (folgt in V2)</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <Input
          label={t('fullName')}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          label={t('birthYear')}
          type="number"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          placeholder="z.B. 1945"
        />
        <Input
          label={t('familyRole')}
          value={familyRole}
          onChange={(e) => setFamilyRole(e.target.value)}
          placeholder={t('familyRolePlaceholder')}
        />
        <Textarea
          label={t('bio')}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t('bioPlaceholder')}
          rows={4}
        />
        <Button type="submit" loading={loading}>{t('save')}</Button>
      </form>
    </div>
  )
}
