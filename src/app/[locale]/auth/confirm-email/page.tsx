import { Mail } from 'lucide-react'
import Link from 'next/link'

interface ConfirmEmailPageProps {
  params: Promise<{ locale: string }>
}

export default async function ConfirmEmailPage({ params }: ConfirmEmailPageProps) {
  const { locale } = await params

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Mail size={40} className="text-amber-600" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Fast geschafft!
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Wir haben dir eine Bestaetigunsmail geschickt. Bitte klicke auf den Link in der E-Mail um dein Konto zu aktivieren.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 text-left space-y-3">
          <p className="text-sm font-semibold text-foreground">Keine E-Mail erhalten?</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Pruefe deinen Spam-Ordner</li>
            <li>Warte 1-2 Minuten und lade neu</li>
            <li>Stelle sicher, dass die E-Mail-Adresse korrekt ist</li>
          </ul>
        </div>

        <Link
          href={`/${locale}/auth/login`}
          className="inline-block text-sm text-amber-600 dark:text-amber-400 hover:underline"
        >
          Zurueck zur Anmeldung
        </Link>
      </div>
    </div>
  )
}
