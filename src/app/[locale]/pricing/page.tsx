import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Check } from 'lucide-react'
import UpgradeButton from './_UpgradeButton'

interface PricingPageProps {
  params: Promise<{ locale: string }>
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params
  const t = await getTranslations('pricing')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      <div className="text-center space-y-3">
        <p className="text-lg italic text-muted-foreground">
          Weniger als ein Kaffee im Monat. Ein Erbe für immer.
        </p>
        <h1 className="text-4xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Free */}
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-6">
          <div>
            <p className="text-xl font-bold text-foreground mb-1">{t('free.name')}</p>
            <p className="text-5xl font-extrabold text-foreground">{t('free.price')}</p>
            <p className="text-sm text-muted-foreground mt-1">Legt los, ohne Kreditkarte</p>
          </div>
          <ul className="space-y-3 flex-1">
            {(t.raw('free.features') as string[]).map((f) => (
              <li key={f} className="flex items-center gap-3 text-base text-gray-700 dark:text-stone-300">
                <Check size={18} className="text-emerald-600 shrink-0" strokeWidth={2} />{f}
              </li>
            ))}
          </ul>
          <Link
            href={`/${locale}/auth/register`}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-4 rounded-xl text-center transition-colors text-lg"
          >
            Jetzt starten
          </Link>
        </div>

        {/* Pro */}
        <div className="relative bg-card border-2 border-amber-600 rounded-2xl p-8 flex flex-col gap-6 shadow-xl">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-sm font-bold px-5 py-1.5 rounded-full shadow">
            Beliebt
          </span>
          <div>
            <p className="text-xl font-bold text-foreground mb-1">{t('pro.name')}</p>
            <p className="text-5xl font-extrabold text-foreground">
              {t('pro.price')}<span className="text-lg font-normal text-muted-foreground">{t('pro.period')}</span>
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">{t('pro.yearlyPrice')}</p>
            <p className="text-sm text-muted-foreground mt-1">Für Familien, die es ernst meinen</p>
          </div>
          <ul className="space-y-3 flex-1">
            {(t.raw('pro.features') as string[]).map((f) => (
              <li key={f} className="flex items-center gap-3 text-base text-gray-700 dark:text-stone-300">
                <Check size={18} className="text-emerald-600 shrink-0" strokeWidth={2} />{f}
              </li>
            ))}
          </ul>
          <UpgradeButton label="Jetzt upgraden" />
        </div>

        {/* Familie+ */}
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-6">
          <div>
            <p className="text-xl font-bold text-foreground mb-1">{t('familyPlus.name')}</p>
            <p className="text-5xl font-extrabold text-foreground">
              {t('familyPlus.price')}<span className="text-lg font-normal text-muted-foreground">{t('familyPlus.period')}</span>
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">oder €119/Jahr - 33% sparen</p>
            <p className="text-sm text-muted-foreground mt-1">Für große Familien und mehrere Vaults</p>
          </div>
          <ul className="space-y-3 flex-1">
            {(t.raw('familyPlus.features') as string[]).map((f) => (
              <li key={f} className="flex items-center gap-3 text-base text-gray-700 dark:text-stone-300">
                <Check size={18} className="text-emerald-600 shrink-0" strokeWidth={2} />{f}
              </li>
            ))}
          </ul>
          <a
            href="mailto:info@ahnenecho.app"
            className="w-full border-2 border-amber-600 text-amber-600 font-semibold px-4 py-4 rounded-xl text-center hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-lg"
          >
            Kontakt aufnehmen
          </a>
        </div>
      </div>

      {/* Value anchor */}
      <div className="text-center bg-card rounded-2xl p-8 space-y-3">
        <p className="text-xl italic text-gray-700 dark:text-stone-300 leading-relaxed">
          &ldquo;Was wäre es wert, Omas Rezept in 20 Jahren noch zu lesen?&rdquo;
        </p>
        <p className="text-base text-muted-foreground">
          Ein Fotoalbum-Druck kostet €40 bis 80. Ahnenecho Pro ist €79 für ein ganzes Jahr.
        </p>
      </div>
    </div>
  )
}
