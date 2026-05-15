'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { CategoryIcon } from '@/components/vault/CategoryIcon'
import { useToast } from '@/components/ui/Toast'
import type { CategorySlug } from '@/types/database'

interface CreateVaultFormProps {
  locale: string
  categories: { slug: CategorySlug; color: string }[]
}

export default function CreateVaultForm({ locale, categories }: CreateVaultFormProps) {
  const t = useTranslations('vault')
  const tCat = useTranslations('categories')
  const { showToast } = useToast()
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim().length < 3) return setError(t('errors.nameTooShort'))
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/vaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      const { vault } = data
      showToast('Euer Familienarchiv wurde erstellt!', 'success')
      router.push(`/${locale}/vault/${vault.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.createFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">{t('createTitle')}</h1>
      <p className="text-base leading-relaxed text-muted-foreground mb-8">
        Wähle einen Namen, den alle Familienmitglieder wiedererkennen.
      </p>

      <form onSubmit={handleCreate} className="space-y-4">
        <Input
          label={t('name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('namePlaceholder')}
          required
        />
        <Textarea
          label={`${t('description')} (optional)`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('descriptionPlaceholder')}
          rows={3}
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          {t('createButton')}
        </Button>
      </form>

      {/* Category preview */}
      <div className="mt-10">
        <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Diese 6 Kategorien werden automatisch angelegt
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ slug, color }) => (
            <span
              key={slug}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${color} dark:bg-opacity-20`}
            >
              <CategoryIcon slug={slug} size={14} />
              {tCat(slug)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
