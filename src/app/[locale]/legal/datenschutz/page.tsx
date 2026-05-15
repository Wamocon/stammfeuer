import Link from 'next/link'

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="text-sm text-gray-500 dark:text-stone-400 mb-8">
        <Link href="/" className="hover:text-amber-600 transition-colors">Start</Link>
        <span className="mx-2">/</span>
        <span>Datenschutz</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-50 mb-2">Datenschutzerklärung</h1>
      <p className="text-sm text-gray-500 dark:text-stone-400 mb-10">Stand: Mai 2026</p>

      <div className="space-y-10 text-base leading-relaxed text-gray-700 dark:text-stone-300">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">1. Verantwortlicher</h2>
          <p>
            WAMOCON GmbH, Mergenthalerallee 79 - 81, 65760 Eschborn<br />
            Telefon: +49 6196 5838311<br />
            E-Mail: <a href="mailto:info@wamocon.com" className="text-amber-600 hover:underline">info@wamocon.com</a><br />
            Projektkontakt: <a href="mailto:info@ahnenecho.app" className="text-amber-600 hover:underline">info@ahnenecho.app</a><br />
            Geschäftsführer: Dipl.-Ing. Waleri Moretz
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">2. Überblick</h2>
          <p>
            Diese Datenschutzerklärung gilt für die Website und Webanwendung Ahnenecho (ahnenecho.app).
            Wir verarbeiten personenbezogene Daten nur, soweit es zur Bereitstellung unserer Plattform notwendig ist.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">3. Rechtsgrundlagen</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Einwilligung - Art. 6 Abs. 1 lit. a DSGVO</li>
            <li>Vertragserfüllung - Art. 6 Abs. 1 lit. b DSGVO</li>
            <li>Rechtliche Verpflichtung - Art. 6 Abs. 1 lit. c DSGVO</li>
            <li>Berechtigtes Interesse - Art. 6 Abs. 1 lit. f DSGVO</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">4. Hosting und Infrastruktur</h2>
          <p className="mb-3">
            <strong>Vercel Inc.</strong> - Website-Hosting. Technisch notwendige Verbindungsdaten (IP, Zeitstempel, Browser).
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
          </p>
          <p>
            <strong>Supabase Inc.</strong> - Datenbank, Authentifizierung, Dateispeicher. Verarbeitete Daten:
            Authentifizierungsdaten, Session-Informationen, Projektdaten und Medien.
            Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">5. Erhobene Daten</h2>
          <p className="mb-3">
            <strong>Registrierung:</strong> Name, E-Mail-Adresse, Passwort (Art. 6 Abs. 1 lit. b DSGVO).
          </p>
          <p>
            <strong>Server-Logfiles:</strong> IP-Adresse, Datum/Uhrzeit, aufgerufene Seite, Referrer, Browser-Typ
            (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">6. Cookies</h2>
          <p>
            Ahnenecho verwendet ausschließlich technisch notwendige Cookies für Session-Management und Authentifizierung.
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Es werden keine Tracking- oder Werbe-Cookies eingesetzt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">7. Ihre Rechte</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Auskunft (Art. 15 DSGVO)</li>
            <li>Berichtigung (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch (Art. 21 DSGVO)</li>
          </ul>
          <p className="mt-3">
            Anfragen bitte an:{' '}
            <a href="mailto:info@ahnenecho.app" className="text-amber-600 hover:underline">info@ahnenecho.app</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">8. Beschwerderecht</h2>
          <p>
            Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren.
            Zuständig für WAMOCON GmbH ist der Hessische Beauftragte für Datenschutz und Informationsfreiheit.
          </p>
        </section>
      </div>
    </div>
  )
}
