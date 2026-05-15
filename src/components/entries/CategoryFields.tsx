'use client'

import { useTranslations } from 'next-intl'
import type { CategorySlug } from '@/types/database'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2 } from 'lucide-react'

interface CategoryFieldsProps {
  slug: CategorySlug
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: Record<string, any>) => void
}

export function CategoryFields({ slug, value, onChange }: CategoryFieldsProps) {
  const t = useTranslations('entries')

  const set = (key: string, val: unknown) => onChange({ ...value, [key]: val })

  if (slug === 'stories') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Zeitraum von (Jahr)"
          type="number"
          placeholder="z.B. 1950"
          value={value.period_start ?? ''}
          onChange={(e) => set('period_start', e.target.value)}
        />
        <Input
          label="Zeitraum bis (Jahr, optional)"
          type="number"
          placeholder="z.B. 1960"
          value={value.period_end ?? ''}
          onChange={(e) => set('period_end', e.target.value)}
        />
      </div>
    )
  }

  if (slug === 'recipes') {
    const ingredients: string[] = value.ingredients ?? ['']
    const steps: string[] = value.steps ?? ['']
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">Zutaten</p>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={ing}
                  onChange={(e) => {
                    const updated = [...ingredients]
                    updated[i] = e.target.value
                    set('ingredients', updated)
                  }}
                  placeholder={`Zutat ${i + 1}`}
                  className="flex-1"
                />
                <button onClick={() => set('ingredients', ingredients.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => set('ingredients', [...ingredients, ''])}>
              <Plus size={14} strokeWidth={1.5} /> Zutat
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">Zubereitungsschritte</p>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-sm text-gray-400 w-6 mt-3 shrink-0">{i + 1}.</span>
                <Textarea
                  value={step}
                  onChange={(e) => {
                    const updated = [...steps]
                    updated[i] = e.target.value
                    set('steps', updated)
                  }}
                  placeholder={`Schritt ${i + 1}`}
                  rows={2}
                  className="flex-1"
                />
                <button onClick={() => set('steps', steps.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 mt-3">
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => set('steps', [...steps, ''])}>
              <Plus size={14} strokeWidth={1.5} /> Schritt
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Portionen" type="number" value={value.servings ?? ''} onChange={(e) => set('servings', e.target.value)} />
          <Input label="Zubereitungszeit (min)" type="number" value={value.prep_time_minutes ?? ''} onChange={(e) => set('prep_time_minutes', e.target.value)} />
        </div>
        <Textarea label="Herkunftsgeschichte" rows={3} value={value.origin ?? ''} onChange={(e) => set('origin', e.target.value)} placeholder="Woher kommt dieses Rezept?" />
      </div>
    )
  }

  if (slug === 'traditions') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Seit Jahr" type="number" value={value.since_year ?? ''} onChange={(e) => set('since_year', e.target.value)} placeholder="z.B. 1980" />
          <Input label="Eingeführt von" value={value.introduced_by ?? ''} onChange={(e) => set('introduced_by', e.target.value)} placeholder="z.B. Oma Liesel" />
        </div>
        <Select
          label="Häufigkeit"
          value={value.frequency ?? 'annual'}
          onChange={(e) => set('frequency', e.target.value)}
          options={[
            { value: 'annual', label: 'Jährlich' },
            { value: 'monthly', label: 'Monatlich' },
            { value: 'weekly', label: 'Wöchentlich' },
            { value: 'special', label: 'Besondere Anlässe' },
          ]}
        />
      </div>
    )
  }

  if (slug === 'wisdom') {
    return (
      <Textarea
        label="Kontext"
        rows={3}
        value={value.context ?? ''}
        onChange={(e) => set('context', e.target.value)}
        placeholder="In welcher Situation wurde diese Weisheit geteilt?"
      />
    )
  }

  if (slug === 'places') {
    return (
      <div className="space-y-4">
        <Input label="Adresse" value={value.address ?? ''} onChange={(e) => set('address', e.target.value)} placeholder="Straße, Stadt, Land" />
        <Textarea label="Bedeutung" rows={3} value={value.meaning ?? ''} onChange={(e) => set('meaning', e.target.value)} placeholder="Was bedeutet dieser Ort für die Familie?" />
      </div>
    )
  }

  if (slug === 'photos') {
    return (
      <Textarea
        label={`${t('photoDescription')} *`}
        rows={3}
        value={value.description ?? ''}
        onChange={(e) => set('description', e.target.value)}
        placeholder={t('photoDescriptionPlaceholder')}
        required
      />
    )
  }

  return null
}
