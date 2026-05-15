import Link from 'next/link'
import { HelpCircle, Mail, MessageSquare, BookOpen } from 'lucide-react'

export default function HelpPage() {
  const faqs = [
    {
      q: 'Was ist Stammfeuer?',
      a: 'Stammfeuer ist ein privates Familienarchiv. Hier könnt ihr gemeinsam Geschichten, Rezepte, Traditionen, Weisheiten, Orte und Fotos für alle Generationen bewahren.',
    },
    {
      q: 'Wie lege ich ein Familienarchiv (Vault) an?',
      a: 'Melde dich an, klicke auf "Neues Archiv erstellen" und gib deinem Archiv einen Namen. Das dauert weniger als eine Minute.',
    },
    {
      q: 'Wie lade ich Familienmitglieder ein?',
      a: 'Öffne dein Archiv, gehe zu "Mitglieder" und gib die E-Mail-Adresse des Familienmitglieds ein. Die Person erhält einen Einladungslink per E-Mail.',
    },
    {
      q: 'Ist mein Familienarchiv privat?',
      a: 'Ja, vollständig privat. Nur Personen, die du einlädst, können dein Archiv sehen. Wir verkaufen keine Daten und zeigen keine Werbung.',
    },
    {
      q: 'Kann ich Fotos hochladen?',
      a: 'Ja, du kannst Fotos direkt zu Einträgen hochladen. Beim kostenlosen Plan sind bis zu 500 MB Speicher inklusive.',
    },
    {
      q: 'Was ist der Unterschied zwischen den Rollen?',
      a: 'Initiator ist der Ersteller des Archivs mit vollen Rechten. Bewahrer können Einträge erstellen und bearbeiten. Leser können alles lesen, aber nichts ändern.',
    },
    {
      q: 'Wie kann ich mein Konto löschen?',
      a: 'Gehe zu Einstellungen, scrolle nach unten und wähle "Konto löschen". Deine Daten werden dauerhaft gelöscht.',
    },
    {
      q: 'Ich habe die E-Mail-Einladung nicht erhalten - was tun?',
      a: 'Prüfe deinen Spam-Ordner. Falls die E-Mail dort nicht ist, bitte den Einladenden, dich erneut einzuladen, oder schreib uns an info@stammfeuer.app.',
    },
    {
      q: 'Was kostet Stammfeuer?',
      a: 'Der kostenlose Plan ist für immer kostenlos. Stammfeuer Pro kostet €7,99 pro Monat (oder €79 pro Jahr) und bietet unbegrenzte Einträge und mehr Speicher.',
    },
    {
      q: 'Kann ich auf dem Handy schreiben?',
      a: 'Ja, Stammfeuer funktioniert auf allen Geräten - Handy, Tablet und Computer. Eine App müsst ihr nicht installieren, der Browser reicht.',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <HelpCircle size={32} className="text-amber-600" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-50">Hilfe und häufige Fragen</h1>
        <p className="text-lg leading-relaxed text-gray-600 dark:text-stone-400">
          Hier findet ihr Antworten auf die häufigsten Fragen zu Stammfeuer.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { Icon: BookOpen, label: 'Erste Schritte', href: '#faq' },
          { Icon: MessageSquare, label: 'FAQ', href: '#faq' },
          { Icon: Mail, label: 'Kontakt', href: 'mailto:info@stammfeuer.app' },
        ].map(({ Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="bg-[var(--color-card-bg)] dark:bg-stone-800 border border-[var(--color-border)] dark:border-stone-700 rounded-xl p-4 flex items-center gap-3 hover:border-amber-400 transition-colors"
          >
            <Icon size={22} className="text-amber-600 shrink-0" strokeWidth={1.5} />
            <span className="font-medium text-gray-900 dark:text-stone-50">{label}</span>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <div id="faq" className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-stone-50">Häufige Fragen</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div
              key={q}
              className="bg-white dark:bg-stone-800 border border-[var(--color-border)] dark:border-stone-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-stone-50 mb-2">{q}</h3>
              <p className="text-base leading-relaxed text-gray-600 dark:text-stone-400">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-2xl p-8 text-white text-center space-y-4">
        <h2 className="text-2xl font-bold">Noch eine Frage?</h2>
        <p className="text-white/90">Wir helfen gerne - schreibt uns einfach eine E-Mail.</p>
        <a
          href="mailto:info@stammfeuer.app"
          className="inline-block bg-white text-amber-700 font-bold px-6 py-3 rounded-xl hover:bg-amber-50 transition-colors"
        >
          info@stammfeuer.app
        </a>
      </div>
    </div>
  )
}
