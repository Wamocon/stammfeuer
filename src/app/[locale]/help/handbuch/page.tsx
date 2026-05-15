import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'
import { PrintButton } from './_PrintButton'

interface HandbuchPageProps {
  params: Promise<{ locale: string }>
}

const chapters = [
  {
    id: 'erste-schritte',
    title: 'Erste Schritte',
    sections: [
      {
        id: 'konto-erstellen',
        title: 'Konto erstellen',
        content: `Nach der Registrierung erhaeltst du Zugang zu Ahnenecho. Gib deinen Namen, deine E-Mail-Adresse und ein sicheres Passwort ein. In der Produktionsversion bestaetigen wir deine E-Mail-Adresse mit einem Link.`,
      },
      {
        id: 'erster-vault',
        title: 'Deinen ersten Vault anlegen',
        content: `Ein Vault ist das Herzstuck von Ahnenecho. Klicke im Dashboard auf "Neuer Vault" und gib ihm einen aussagekraeftigen Namen wie "Familie Mueller" oder "Oma Erika". Du kannst jederzeit weitere Vaults anlegen.`,
      },
    ],
  },
  {
    id: 'vaults',
    title: 'Vaults verwalten',
    sections: [
      {
        id: 'vault-anlegen',
        title: 'Vault anlegen und bearbeiten',
        content: `Gib beim Anlegen eines Vaults einen Namen und optional eine Beschreibung an. Du kannst auch ein Titelbild hochladen. Name und Beschreibung lassen sich jederzeit in den Vault-Einstellungen anpassen.`,
      },
      {
        id: 'plaene',
        title: 'Free und Pro-Plan',
        content: `Mit dem Free-Plan kannst du einen Vault mit bis zu 3 Mitgliedern und 50 Eintraegen nutzen. Der Pro-Plan erlaubt unbegrenzte Vaults, Mitglieder und Eintraege sowie Bild-Uploads und KI-Vorschlaege.`,
      },
    ],
  },
  {
    id: 'mitglieder',
    title: 'Mitglieder einladen',
    sections: [
      {
        id: 'einladen',
        title: 'Personen einladen',
        content: `Oeffne einen Vault und gehe zu "Mitglieder". Klicke auf "Einladen" und gib die E-Mail-Adresse der Person ein. Sie erhaelt einen personalisierten Einladungslink per E-Mail und wird nach dem Beitreten automatisch dem Vault hinzugefuegt.`,
      },
      {
        id: 'rollen',
        title: 'Rollen und Rechte',
        content: `Jedes Mitglied hat eine Rolle:\n- **Inhaber**: Vollzugriff, kann Vault loeschen\n- **Admin**: Kann Mitglieder einladen und Eintraege verwalten\n- **Mitglied**: Kann Eintraege lesen und eigene Eintraege erstellen\n- **Leser**: Kann nur Eintraege lesen`,
      },
    ],
  },
  {
    id: 'eintraege',
    title: 'Eintraege erstellen',
    sections: [
      {
        id: 'eintrag-erstellen',
        title: 'Einen Eintrag erstellen',
        content: `Waehle einen Vault und klicke auf "Neuer Eintrag". Gib Titel, Inhalt und optional ein Datum, eine Kategorie und Bilder an. Eintraege koennen jederzeit bearbeitet werden.`,
      },
      {
        id: 'kategorien',
        title: 'Kategorien',
        content: `Eintraege lassen sich mit Kategorien wie "Rezept", "Geschichte", "Tradition", "Weisheit", "Foto" oder "Dokument" versehen. Damit bleiben auch grosse Vaults uebersichtlich.`,
      },
      {
        id: 'ki-vorschlaege',
        title: 'KI-Schreibvorschlaege',
        content: `Im Pro-Plan hilft dir eine KI beim Schreiben. Sie schlaegt Fragen vor wie "Welche Zutaten hat das Originalrezept?" oder "Wo fand das Ereignis statt?" und hilft so, Erinnerungen zu vervollstaendigen.`,
      },
    ],
  },
  {
    id: 'datenschutz',
    title: 'Datenschutz und Sicherheit',
    sections: [
      {
        id: 'daten',
        title: 'Wo liegen meine Daten?',
        content: `Alle Daten werden verschluesselt in einer europaischen Datenbank gespeichert. Wir geben keine Daten an Dritte weiter. Du kannst deine Daten jederzeit exportieren oder dein Konto loeschen.`,
      },
      {
        id: 'export',
        title: 'Daten exportieren',
        content: `Unter Profil > Daten exportieren kannst du alle deine Eintraege als JSON-Datei herunterladen. Der Export enthaelt alle Texte, Metadaten und Links zu Mediendateien.`,
      },
    ],
  },
]

export default async function HandbuchPage({ params }: HandbuchPageProps) {
  const { locale } = await params

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href={`/${locale}/help`} className="hover:text-amber-600 transition-colors">
            Hilfe
          </Link>
          <ChevronRight size={14} />
          <span>Produkthandbuch</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <BookOpen size={20} className="text-amber-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Produkthandbuch</h1>
        </div>
        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
          Alles, was du ueber Ahnenecho wissen musst. Von den ersten Schritten bis zu fortgeschrittenen Funktionen.
        </p>
      </div>

      {/* Table of contents */}
      <div className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Inhaltsverzeichnis</h2>
        <ol className="space-y-2">
          {chapters.map((chapter, i) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs flex items-center justify-center font-semibold shrink-0">
                  {i + 1}
                </span>
                {chapter.title}
              </a>
              <ol className="ml-7 mt-1 space-y-0.5">
                {chapter.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>

      {/* Chapters */}
      <div className="space-y-14">
        {chapters.map((chapter, i) => (
          <div key={chapter.id} id={chapter.id}>
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white text-sm flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </span>
              {chapter.title}
            </h2>
            <div className="space-y-8 pl-11">
              {chapter.sections.map((section) => (
                <div key={section.id} id={section.id}>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {section.title}
                  </h3>
                  <div className="text-sm leading-relaxed text-muted-foreground space-y-2">
                    {section.content.split('\n').map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Print button */}
      <div className="mt-14 pt-8 border-t border-border flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Version 1.0 &mdash; Ahnenecho
        </p>
        <PrintButton />
      </div>
    </div>
  )
}
