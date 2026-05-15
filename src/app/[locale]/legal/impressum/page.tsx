import Link from 'next/link'

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="text-sm text-gray-500 dark:text-stone-400 mb-8">
        <Link href="/" className="hover:text-amber-600 transition-colors">Start</Link>
        <span className="mx-2">/</span>
        <span>Impressum</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-50 mb-2">Impressum</h1>
      <p className="text-sm text-gray-500 dark:text-stone-400 mb-10">Stand: Mai 2026</p>

      <div className="prose prose-stone dark:prose-invert max-w-none space-y-8 text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">WAMOCON GmbH</h2>
          <p className="text-gray-700 dark:text-stone-300">
            Mergenthalerallee 79 - 81<br />
            65760 Eschborn<br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">Kontakt</h2>
          <p className="text-gray-700 dark:text-stone-300">
            Telefon: +49 6196 5838311<br />
            E-Mail: <a href="mailto:info@wamocon.com" className="text-amber-600 hover:underline">info@wamocon.com</a><br />
            Projektkontakt: <a href="mailto:info@ahnenecho.app" className="text-amber-600 hover:underline">info@ahnenecho.app</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">Vertretungsberechtigter Geschäftsführer</h2>
          <p className="text-gray-700 dark:text-stone-300">Dipl.-Ing. Waleri Moretz</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">Registereintrag</h2>
          <p className="text-gray-700 dark:text-stone-300">
            Sitz der Gesellschaft: Eschborn<br />
            Handelsregister: Eschborn HRB 123666<br />
            Umsatzsteuer-Identifikationsnummer: DE344930486
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-50 mb-3">Angaben zum Angebot</h2>
          <p className="text-gray-700 dark:text-stone-300">
            Ahnenecho ist eine webbasierte Software-as-a-Service-Plattform für die generationsübergreifende
            Archivierung von Familiengeschichten, Rezepten, Traditionen und Weisheiten. Das Angebot richtet
            sich an Familien und Privatpersonen.
          </p>
        </section>
      </div>
    </div>
  )
}
