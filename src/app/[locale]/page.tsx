import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { BookOpen, Home, Sparkles, ChevronDown, Check } from 'lucide-react'
import { CategoryIcon } from '@/components/vault/CategoryIcon'
import { Header } from '@/components/layout/Header'
import type { CategorySlug } from '@/types/database'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

const CATEGORIES: { slug: CategorySlug; desc: string }[] = [
  { slug: 'stories', desc: 'Familiengeschichten, Erinnerungen und persönliche Erlebnisse.' },
  { slug: 'recipes', desc: 'Traditionelle Rezepte mit Geschichte und Seele.' },
  { slug: 'traditions', desc: 'Was eure Familie besonders macht - von Generation zu Generation.' },
  { slug: 'wisdom', desc: 'Weisheiten und Lebensratschläge, die weiterleben.' },
  { slug: 'places', desc: 'Orte, die die Familie geprägt haben.' },
  { slug: 'photos', desc: 'Bilder mit Beschreibungen, damit niemand vergessen wird.' },
]

const CATEGORY_NAMES: Record<CategorySlug, string> = {
  stories: 'Geschichten',
  recipes: 'Rezepte',
  traditions: 'Traditionen',
  wisdom: 'Weisheiten',
  places: 'Orte',
  photos: 'Fotos',
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const tPricing = await getTranslations('pricing')

  return (
    <div className="overflow-x-hidden">
      <Header locale={locale} />
      {/* Section 1 - Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-amber-600 via-orange-500 to-red-700 text-white px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <svg viewBox="0 0 40 48" className="w-20 h-20 animate-pulse drop-shadow-2xl" fill="none" aria-hidden="true">
              <path d="M20 4C20 4 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 14 20 4 20 4Z" fill="white" opacity="0.95" />
              <path d="M20 16C20 16 14 22 14 28C14 31.9 16.7 35 20 35C23.3 35 26 31.9 26 28C26 22 20 16 20 16Z" fill="#fbbf24" opacity="0.9" />
              <path d="M20 24C20 24 17 27 17 30C17 31.7 18.3 33 20 33C21.7 33 23 31.7 23 30C23 27 20 24 20 24Z" fill="white" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            {locale === 'de'
              ? 'Das Echo deiner Ahnen, für immer lebendig.'
              : "Your ancestors' echo, alive forever."}
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-10">
            {locale === 'de'
              ? 'Großmutters Rezepte. Opas Geschichten. Die Traditionen, die eure Familie zusammenhalten. Für immer bewahrt.'
              : "Grandma's recipes. Grandpa's stories. The traditions that hold your family together. Preserved forever."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/auth/register`}
              className="bg-white text-amber-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-amber-50 transition-colors shadow-xl min-h-[56px] inline-flex items-center justify-center"
            >
              {locale === 'de' ? 'Jetzt starten' : 'Get started'}
            </Link>
            <a
              href="#features"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-colors min-h-[56px] inline-flex items-center justify-center"
            >
              {locale === 'de' ? 'Mehr erfahren' : 'Learn more'}
            </a>
          </div>
        </div>
        <a href="#problem" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce">
          <ChevronDown size={32} strokeWidth={1.5} />
        </a>
      </section>

      {/* Section 2 - Problem */}
      <section id="problem" className="py-16 md:py-24 bg-card px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Was geht verloren, wenn niemand fragt?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: BookOpen, title: 'Omas Gulaschrezept', desc: 'Sie kennt es auswendig. Aber hat sie es je aufgeschrieben?' },
              { Icon: Home, title: 'Die Geschichte des Familienhauses', desc: 'Wer hat es gebaut? Welche Erinnerungen stecken darin?' },
              { Icon: Sparkles, title: 'Die Tradition, die nur ihr kennt', desc: 'Warum macht eure Familie das so? Bald weiß es niemand mehr.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-4 p-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Icon size={32} className="text-amber-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 - Features */}
      <section id="features" className="py-16 md:py-24 bg-card px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            6 Kategorien für das komplette Familiengedächtnis
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Jede Familie ist einzigartig. Ahnenecho bewahrt jede Art von Erinnerung.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {CATEGORIES.map(({ slug, desc }) => (
              <div
                key={slug}
                className="bg-background border border-border rounded-xl p-5 flex flex-col gap-3"
              >
                <CategoryIcon slug={slug} size={32} />
                <h3 className="text-lg font-bold text-foreground">{CATEGORY_NAMES[slug]}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 - How it works */}
      <section className="py-16 md:py-24 bg-card px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            So einfach geht&apos;s
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-0.5 bg-amber-200 dark:bg-amber-900/40" />
            {[
              { num: 1, title: 'Vault anlegen', desc: 'Erstelle ein privates Familienarchiv in 30 Sekunden.' },
              { num: 2, title: 'Familie einladen', desc: 'Lade Oma, Opa, Eltern und Geschwister ein.' },
              { num: 3, title: 'Gemeinsam archivieren', desc: 'Jeder trägt bei - per Sprache, Text oder Foto.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg z-10">
                  {num}
                </div>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 - Quote */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-amber-600 to-orange-500 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-3xl md:text-4xl font-bold italic leading-relaxed mb-4">
            &ldquo;Das Echo deiner Ahnen, für immer lebendig.&rdquo;
          </p>
          <p className="text-lg text-white/80">Ahnenecho - Das generationsübergreifende Familienarchiv</p>
        </div>
      </section>

      {/* Section 6 - Pricing teaser */}
      <section className="py-16 md:py-24 bg-card px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-lg italic text-muted-foreground mb-4">
            Weniger als ein Kaffee im Monat. Ein Erbe für immer.
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            {tPricing('title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-background border border-border rounded-2xl p-6 flex flex-col gap-4">
              <div>
                <p className="text-lg font-bold text-foreground">{tPricing('free.name')}</p>
                <p className="text-4xl font-extrabold text-foreground mt-1">{tPricing('free.price')}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {(tPricing.raw('free.features') as string[]).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={16} className="text-emerald-600 shrink-0" strokeWidth={2} />{f}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/auth/register`} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-3 rounded-lg text-center transition-colors">
                Jetzt starten
              </Link>
            </div>
            {/* Pro */}
            <div className="relative bg-background border-2 border-amber-600 rounded-2xl p-6 flex flex-col gap-4 shadow-lg">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                Beliebt
              </span>
              <div>
                <p className="text-lg font-bold text-foreground">{tPricing('pro.name')}</p>
                <p className="text-4xl font-extrabold text-foreground mt-1">
                  {tPricing('pro.price')}<span className="text-base font-normal text-gray-500">{tPricing('pro.period')}</span>
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">{tPricing('pro.yearlyPrice')}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {(tPricing.raw('pro.features') as string[]).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={16} className="text-emerald-600 shrink-0" strokeWidth={2} />{f}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/pricing`} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-3 rounded-lg text-center transition-colors">
                Jetzt upgraden
              </Link>
            </div>
            {/* Familie+ */}
            <div className="bg-background border border-border rounded-2xl p-6 flex flex-col gap-4">
              <div>
                <p className="text-lg font-bold text-foreground">{tPricing('familyPlus.name')}</p>
                <p className="text-4xl font-extrabold text-foreground mt-1">
                  {tPricing('familyPlus.price')}<span className="text-base font-normal text-gray-500">{tPricing('familyPlus.period')}</span>
                </p>
              </div>
              <ul className="space-y-2 flex-1">
                {(tPricing.raw('familyPlus.features') as string[]).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={16} className="text-emerald-600 shrink-0" strokeWidth={2} />{f}
                  </li>
                ))}
              </ul>
              <a href="mailto:info@ahnenecho.app" className="w-full border border-amber-600 text-amber-600 font-semibold px-4 py-3 rounded-lg text-center hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                Kontakt aufnehmen
              </a>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href={`/${locale}/pricing`} className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
              Alle Pläne anzeigen →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
