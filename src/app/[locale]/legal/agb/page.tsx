import Link from 'next/link'

export default function AgbPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="text-sm text-gray-500 dark:text-stone-400 mb-8">
        <Link href="/" className="hover:text-amber-600 transition-colors">Start</Link>
        <span className="mx-2">/</span>
        <span>AGB</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-50 mb-2">Allgemeine Geschäftsbedingungen</h1>
      <p className="text-sm text-gray-500 dark:text-stone-400 mb-10">Stand: Mai 2026</p>

      <div className="space-y-10 text-base leading-relaxed text-gray-700 dark:text-stone-300">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">§ 1 Geltungsbereich</h2>
          <p className="mb-3">
            Diese AGB der WAMOCON GmbH, Mergenthalerallee 79 - 81, 65760 Eschborn (nachfolgend &ldquo;Anbieter&rdquo;),
            gelten für alle Verträge über die Nutzung der Plattform Stammfeuer (stammfeuer.app).
          </p>
          <p>
            Abweichende AGB werden nicht Vertragsbestandteil, es sei denn, der Anbieter stimmt schriftlich zu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">§ 2 Vertragsschluss</h2>
          <p className="mb-3">
            Die Darstellung der Plattform stellt kein verbindliches Angebot dar. Der Vertrag kommt zustande,
            wenn der Anbieter das Angebot durch Freischaltung des Zugangs annimmt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">§ 3 Leistungsbeschreibung</h2>
          <p>
            Stammfeuer ist eine Software-as-a-Service-Plattform für die generationsübergreifende Archivierung
            von Familiengeschichten, Rezepten, Traditionen und Weisheiten. Der genaue Funktionsumfang ergibt
            sich aus der jeweils aktuellen Leistungsbeschreibung.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">§ 4 Nutzungsrechte</h2>
          <p>
            Der Anbieter räumt für die Vertragslaufzeit ein einfaches, nicht übertragbares Nutzungsrecht ein.
            Die Plattform darf nur für private und familiäre Zwecke genutzt werden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">§ 5 Pflichten des Nutzers</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Zugangsdaten geheim halten</li>
            <li>Keine rechtswidrigen Inhalte hochladen</li>
            <li>Nutzung im Einklang mit geltendem Recht</li>
            <li>Keine Daten Dritter ohne deren Einwilligung speichern</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">§ 6 Verfügbarkeit</h2>
          <p>
            Der Anbieter bemüht sich um eine Verfügbarkeit von 99,5 % im Jahresmittel.
            Geplante Wartungsarbeiten werden vorab angekündigt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">§ 7 Datenschutz</h2>
          <p>
            Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{' '}
            <Link href="/de/legal/datenschutz" className="text-amber-600 hover:underline">Datenschutzerklärung</Link>
            {' '}und der DSGVO.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">§ 8 Kündigung</h2>
          <p>
            Kostenlose Accounts können jederzeit gelöscht werden. Kostenpflichtige Abonnements können zum Ende
            der bezahlten Laufzeit gekündigt werden. Die Kündigung erfolgt über die Account-Einstellungen
            oder per E-Mail an{' '}
            <a href="mailto:info@stammfeuer.app" className="text-amber-600 hover:underline">info@stammfeuer.app</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">§ 9 Haftungsbeschränkung</h2>
          <p>
            Der Anbieter haftet für Schäden nur bei Vorsatz und grober Fahrlässigkeit. Der Nutzer ist
            selbst für die Sicherung seiner Daten verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">§ 10 Anwendbares Recht</h2>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand für Kaufleute ist Eschborn.
          </p>
        </section>
      </div>
    </div>
  )
}
