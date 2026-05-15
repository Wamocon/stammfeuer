'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { CategorySlug } from '@/types/database'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { CategoryFields } from './CategoryFields'
import { VoiceInput } from './VoiceInput'
import { MediaUpload } from './MediaUpload'
import { useToast } from '@/components/ui/Toast'
import { Mic } from 'lucide-react'

interface EntryFormProps {
  vaultId: string
  locale: string
  defaultCategory?: CategorySlug
  defaultPromptId?: string
}

const CATEGORIES: CategorySlug[] = ['stories', 'recipes', 'traditions', 'wisdom', 'places', 'photos']

export function EntryForm({ vaultId, locale, defaultCategory, defaultPromptId }: EntryFormProps) {
  const t = useTranslations('entries')
  const tCat = useTranslations('categories')
  const { showToast } = useToast()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<CategorySlug>(defaultCategory ?? 'stories')
  const [lang, setLang] = useState<'de' | 'en'>(locale === 'en' ? 'en' : 'de')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [metadata, setMetadata] = useState<Record<string, any>>({})
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [showVoice, setShowVoice] = useState(false)
  const [activeTab, setActiveTab] = useState<'original' | 'translation'>('original')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = t('errors.titleRequired')
    if (category === 'photos' && !metadata.description?.trim()) {
      errs.description = t('errors.photoDescriptionRequired')
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/vaults/${vaultId}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim() || null,
          category_slug: category,
          lang,
          metadata,
          media_urls: mediaUrls,
          prompt_id: defaultPromptId ?? null,
        }),
      })
      if (!res.ok) throw new Error()
      const { entry } = await res.json()
      showToast('Eintrag gespeichert!', 'success')
      router.push(`/${locale}/vault/${vaultId}/entries/${entry.id}`)
    } catch {
      showToast(t('errors.saveFailed'), 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Category + Language */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label={t('category')}
          value={category}
          onChange={(e) => setCategory(e.target.value as CategorySlug)}
          options={CATEGORIES.map((s) => ({ value: s, label: tCat(s) }))}
        />
        <Select
          label={t('language')}
          value={lang}
          onChange={(e) => setLang(e.target.value as 'de' | 'en')}
          options={[
            { value: 'de', label: 'Deutsch' },
            { value: 'en', label: 'English' },
          ]}
        />
      </div>

      {/* Title */}
      <Input
        label={t('title')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t('titlePlaceholder')}
        error={errors.title}
      />

      {/* Body - Tabs */}
      <div>
        <div className="flex gap-1 mb-2 border-b border-border">
          <button
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
              activeTab === 'original'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-muted-foreground'
            }`}
            onClick={() => setActiveTab('original')}
          >
            {t('originalTab')}
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
              activeTab === 'translation'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-muted-foreground'
            }`}
            onClick={() => setActiveTab('translation')}
          >
            {t('translationTab')}
          </button>
        </div>

        {activeTab === 'original' ? (
          <div className="space-y-3">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('bodyPlaceholder')}
              rows={6}
              label={t('body')}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowVoice(!showVoice)}
                className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-500 dark:text-amber-400 font-medium"
              >
                <Mic size={16} strokeWidth={1.5} />
                {t('voiceInput')}
              </button>
            </div>
            {showVoice && (
              <VoiceInput onTranscript={(text) => { setBody((b) => b ? `${b}\n${text}` : text); setShowVoice(false) }} />
            )}
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            {t('translationComingSoon')}
          </div>
        )}
      </div>

      {/* Category-specific fields */}
      <CategoryFields slug={category} value={metadata} onChange={setMetadata} />

      {/* Media upload */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">{t('addPhoto')}</p>
        <MediaUpload vaultId={vaultId} onUploaded={setMediaUrls} />
        {errors.description && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} loading={saving}>{t('save')}</Button>
        <Button variant="ghost" onClick={() => router.back()}>{t('cancel')}</Button>
      </div>
    </div>
  )
}
