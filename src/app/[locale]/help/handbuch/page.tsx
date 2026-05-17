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
        content: `Öffne ahnenecho.eu und klicke auf "Registrieren". Gib deinen vollständigen Namen, deine E-Mail-Adresse und ein sicheres Passwort ein. Nach der Registrierung bist du sofort angemeldet – kein Warten auf eine Bestätigungs-E-Mail.

Dein Konto ist vollständig privat. Nur Familienmitglieder, die du selbst einlädst, können deine Inhalte sehen.`,
      },
      {
        id: 'anmelden',
        title: 'Anmelden und Abmelden',
        content: `Melde dich mit deiner E-Mail-Adresse und deinem Passwort an. Falls du dein Passwort vergessen hast, klicke auf "Passwort vergessen" auf der Anmeldeseite. Du erhältst dann einen Zurücksetz-Link per E-Mail.

Zum Abmelden klicke in der Seitenleiste (Desktop) auf "Abmelden" oder gehe zu Profil > Abmelden.`,
      },
      {
        id: 'dashboard',
        title: 'Das Dashboard verstehen',
        content: `Nach der Anmeldung landest du im Dashboard. Hier siehst du alle Familienarchive (Vaults), an denen du beteiligt bist – sowohl deine eigenen als auch Vaults, zu denen du eingeladen wurdest.

Jede Vault-Karte zeigt den Namen, die Anzahl der Mitglieder und Einträge sowie das Datum des letzten Eintrags. Mit dem Button "Neues Archiv erstellen" legst du deinen ersten Vault an.`,
      },
    ],
  },
  {
    id: 'vaults',
    title: 'Familienarchive (Vaults)',
    sections: [
      {
        id: 'vault-anlegen',
        title: 'Ein Archiv erstellen',
        content: `Klicke im Dashboard auf "Neues Archiv erstellen". Gib dem Archiv einen Namen (z.B. "Familie Müller" oder "Omas Geschichten") und optional eine kurze Beschreibung.

Ein Archiv ist immer privat. Du bist automatisch der Initiator – die Person mit vollen Rechten.`,
      },
      {
        id: 'vault-uebersicht',
        title: 'Die Vault-Übersicht',
        content: `Klicke auf ein Archiv, um zur Übersichtsseite zu gelangen. Dort siehst du:

- Eine Gesundheitsanzeige (wie vollständig das Archiv ist)
- Die 6 Inhaltskategorien mit Anzahl der Einträge
- Die letzten Aktivitäten im Archiv
- Schnellzugriff auf alle Bereiche

Über die Seitenleiste (Desktop) oder die Vault-Subnav (Mobil) kannst du zwischen Übersicht, Einträgen, Chronik, Familie und Einstellungen wechseln.`,
      },
      {
        id: 'vault-einstellungen',
        title: 'Archiv-Einstellungen',
        content: `Unter "Einstellungen" eines Archivs kannst du:

- Name und Beschreibung ändern
- Das Archiv löschen (nur als Initiator)

Achte darauf: Das Löschen eines Archivs ist unwiderruflich. Alle Einträge, Fotos und Stammbaum-Daten werden dauerhaft entfernt.`,
      },
      {
        id: 'plaene',
        title: 'Pläne und Limits',
        content: `Ahnenecho gibt es in drei Plänen:

Free: 1 Vault, bis zu 3 Mitglieder, bis zu 50 Einträge, keine Bild-Uploads.

Pro: Unbegrenzte Vaults und Mitglieder, bis zu 500 Einträge, Bild-Uploads, KI-Schreibvorschläge.

Family Plus: Alles aus Pro, unbegrenzte Einträge, erweiterter Stammbaum, Prioritäts-Support.

Den aktuellen Plan siehst du unter Dashboard > Preise. Ein Upgrade ist jederzeit möglich.`,
      },
    ],
  },
  {
    id: 'mitglieder',
    title: 'Mitglieder und Rollen',
    sections: [
      {
        id: 'einladen',
        title: 'Familienmitglieder einladen',
        content: `Öffne ein Archiv und navigiere zu "Familie" > Tab "Mitglieder". Klicke auf "Einladen", gib die E-Mail-Adresse des Familienmitglieds ein und wähle die gewünschte Rolle.

Die eingeladene Person erhält einen persönlichen Einladungslink per E-Mail. Nach dem Klick auf den Link wird sie automatisch zum Archiv hinzugefügt – auch ohne vorherigen Account. Der Link ist 7 Tage gültig.`,
      },
      {
        id: 'rollen',
        title: 'Rollen und Rechte',
        content: `Jedes Mitglied hat eine Rolle, die bestimmt, was es tun darf:

Initiator: Erstellt das Archiv. Vollständige Kontrolle über alle Inhalte, Mitglieder und Einstellungen. Kann das Archiv löschen.

Bewahrer (Contributor): Kann Einträge erstellen, bearbeiten und löschen. Kann Stammbaum-Personen anlegen und verknüpfen. Kann keine Mitglieder einladen.

Leser: Kann alle Einträge und den Stammbaum lesen, aber nichts ändern oder erstellen.

Der Initiator kann Rollen jederzeit unter "Mitglieder" anpassen.`,
      },
      {
        id: 'mitglied-ohne-account',
        title: 'Mitglieder ohne App-Account',
        content: `Du kannst Familienmitglieder auch ohne E-Mail-Adresse zum Stammbaum hinzufügen – zum Beispiel verstorbene Vorfahren oder Kinder. Diese Personen erscheinen im Stammbaum, haben aber keinen Login.

Später, wenn diese Person einen Account anlegt, kann der Initiator das Stammbaum-Profil mit dem echten Account verknüpfen.`,
      },
    ],
  },
  {
    id: 'eintraege',
    title: 'Einträge erstellen',
    sections: [
      {
        id: 'eintrag-erstellen',
        title: 'Einen Eintrag anlegen',
        content: `Klicke auf den "+" Button (Mobil: mittig in der unteren Navigationsleiste, Desktop: "Neuer Eintrag" in der Seitenleiste). 

Jeder Eintrag hat:
- Eine Kategorie (Pflichtfeld)
- Einen Titel (Pflichtfeld)  
- Einen Fließtext (optional, aber empfohlen)
- Metadaten je nach Kategorie (z.B. Zutaten bei Rezepten, Koordinaten bei Orten)
- Fotos (bei Foto-Kategorie und auf Pro/Family Plus)

Nach dem Speichern landest du automatisch auf der Detailseite des Eintrags.`,
      },
      {
        id: 'kategorien',
        title: 'Die 6 Inhaltskategorien',
        content: `Jeder Eintrag gehört zu einer der sechs Kategorien:

📖 Geschichten: Persönliche Erinnerungen, Erlebnisse, historische Familienmomente. Zeitraum (von/bis) kann angegeben werden.

🍳 Rezepte: Familienrezepte mit Zutatenliste und Schritt-für-Schritt-Anleitung. Herkunft und Portionen können vermerkt werden.

🎉 Traditionen: Wiederkehrende Familienbräuche mit Angabe "seit wann" und "wie oft" (jährlich, monatlich, anlassbezogen).

💡 Weisheiten: Lebensregeln, Zitate, Ratschläge von Familienmitgliedern. Mit Kontext wann und warum sie entstanden.

📍 Orte: Bedeutsame Familienstätten mit Adresse, GPS-Koordinaten und der Bedeutung des Ortes.

📷 Fotos: Bilder mit Beschreibung, Jahrgang und hochladbarer Bilddatei.`,
      },
      {
        id: 'stellvertretend-schreiben',
        title: 'Im Namen von jemandem schreiben',
        content: `Manchmal möchtest du eine Geschichte aufschreiben, die eine andere Person erlebt hat – z.B. Omas Kindheitserinnerungen, die du von ihr erzählt bekommen hast.

Beim Erstellen eines Eintrags kannst du unter "Im Namen von" ein Mitglied aus dem Archiv auswählen. Der Eintrag erscheint dann mit dem Namen dieser Person, mit dem Hinweis dass du ihn aufgeschrieben hast.`,
      },
      {
        id: 'fotos-hochladen',
        title: 'Fotos hochladen',
        content: `In der Kategorie "Fotos" (und auf Pro/Family Plus auch bei anderen Kategorien) kannst du Bilder direkt hochladen. Klicke auf das Upload-Feld oder ziehe Bilder per Drag & Drop hinein.

Unterstützte Formate: JPG, PNG, WebP, HEIC. Die Fotos werden sicher in deinem privaten Archiv gespeichert und sind nur für Archiv-Mitglieder sichtbar.

Tipp: Ältere Fotos können mit deinem Handy abfotografiert und direkt hochgeladen werden.`,
      },
      {
        id: 'eintrag-bearbeiten',
        title: 'Einträge bearbeiten und löschen',
        content: `Öffne einen Eintrag und klicke auf das Bearbeiten-Symbol (Stift) oben rechts. Du kannst alle Felder nachträglich ändern.

Einträge löschen: Klicke in der Bearbeitungsansicht auf "Löschen". Gelöschte Einträge können nicht wiederhergestellt werden.

Wer darf bearbeiten? Initiatoren und Bewahrer können alle Einträge bearbeiten. Leser können nur ihre eigenen Einträge bearbeiten.`,
      },
    ],
  },
  {
    id: 'stammbaum',
    title: 'Der Stammbaum',
    sections: [
      {
        id: 'stammbaum-ueberblick',
        title: 'Was ist der Stammbaum?',
        content: `Der Stammbaum zeigt alle Familienmitglieder als verbundene Knoten auf einer Arbeitsfläche. Du kannst die Ansicht frei verschieben und skalieren.

Öffne ihn über "Familie" > Tab "Stammbaum" in einem Archiv. Im Tab "Mitglieder" nebenan verwaltest du die Mitgliederliste.

Die Toolbar oben zeigt die Anzahl der Personen und Verbindungen. Mit "Auto-Layout" werden alle Personen automatisch angeordnet.`,
      },
      {
        id: 'person-hinzufuegen',
        title: 'Personen hinzufügen',
        content: `Klicke auf "Person hinzufügen" in der Stammbaum-Toolbar. Fülle das Formular aus:

- Name (Pflichtfeld)
- Geburts- und Sterbejahr
- Geschlecht (bestimmt die Farbe des Knotens: blau/rosa/neutral)
- Kurze Biografie
- Profilfoto (URL)

Die Person erscheint sofort auf der Arbeitsfläche. Du kannst sie per Drag & Drop verschieben – die Position wird automatisch gespeichert.`,
      },
      {
        id: 'beziehungen',
        title: 'Beziehungen verbinden',
        content: `Es gibt zwei Beziehungstypen:

Eltern-Kind: Eine gestrichelte orange Linie mit Pfeil nach unten. Zeigt wer wessen Kind ist.

Partner: Eine rote gestrichelte Linie mit Herz-Symbol. Verbindet Paare und Ehepaare.

So fügst du eine Beziehung hinzu: Fahre mit der Maus über eine Person → Klicke auf "+ Beziehung" → Wähle Typ und Zielperson.

Eine Beziehung löschen: Doppelklick auf die Verbindungslinie (nur als Initiator oder Bewahrer).`,
      },
      {
        id: 'person-verknuepfen',
        title: 'Stammbaum-Person mit App-Account verknüpfen',
        content: `Wenn ein Familienmitglied im Stammbaum existiert und sich auch mit einem App-Account registriert hat, kann der Initiator beide verknüpfen.

Fahre über die Stammbaum-Person → Klicke auf "User zuweisen" → Wähle das Archiv-Mitglied aus. Ab dann erscheint der goldene Ring um den Knoten als "Verknüpft"-Indikator.`,
      },
      {
        id: 'autolayout',
        title: 'Auto-Layout',
        content: `Mit dem Button "Auto-Layout" werden alle Personen automatisch in einem Raster angeordnet. Das ist hilfreich wenn der Stammbaum unübersichtlich geworden ist.

Das Auto-Layout überschreibt alle manuell gesetzten Positionen. Danach kannst du die Positionen wieder manuell anpassen.`,
      },
    ],
  },
  {
    id: 'chronik',
    title: 'Die Chronik',
    sections: [
      {
        id: 'chronik-ueberblick',
        title: 'Was ist die Chronik?',
        content: `Die Chronik öffnest du über "Chronik" in der Seitenleiste (Desktop) oder der Vault-Subnav (Mobil). Sie hat zwei Tabs:

Aktivität: Zeigt alle neuesten Aktionen im Archiv – wer hat wann welchen Eintrag erstellt oder geändert. Ideal um auf dem Laufenden zu bleiben.

Geschichte: Eine Zeitstrahl-Ansicht aller Einträge nach Entstehungsdatum sortiert. So sieht man die Familiengeschichte chronologisch.`,
      },
      {
        id: 'luecken',
        title: 'Zeitliche Lücken erkennen',
        content: `In der Chronik werden Zeiträume ohne Einträge markiert. Das hilft dabei zu erkennen, welche Jahrzehnte oder Lebensphasen noch nicht dokumentiert sind.

Diese Hinweise sind als Inspiration gedacht: "Über diese Jahre wissen wir noch nichts – wer hat dazu eine Geschichte?"`,
      },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobil nutzen',
    sections: [
      {
        id: 'mobile-navigation',
        title: 'Navigation auf dem Smartphone',
        content: `Ahnenecho ist vollständig mobiloptimiert. Auf dem Smartphone erscheint unten eine Navigationsleiste mit:

- Dashboard
- Archiv (Übersicht des aktiven Vaults)
- "+" Button (neuer Eintrag)
- Profil
- Hilfe

Wenn du dich innerhalb eines Vaults befindest, erscheint oberhalb der Navigationsleiste eine zusätzliche Vault-Subnav mit: Übersicht, Einträge, Chronik, Stammbaum, Einstellungen.`,
      },
      {
        id: 'mobile-stammbaum',
        title: 'Stammbaum auf dem Handy',
        content: `Der Stammbaum funktioniert auch auf dem Handy. Du kannst die Karte mit zwei Fingern zoomen und verschieben. Einzelne Personen kannst du mit dem Finger verschieben.

Für umfangreichere Bearbeitungen (viele Beziehungen anlegen) empfehlen wir den Desktop-Browser.`,
      },
    ],
  },
  {
    id: 'profil-einstellungen',
    title: 'Profil und Einstellungen',
    sections: [
      {
        id: 'profil',
        title: 'Profil bearbeiten',
        content: `Unter "Profil" (Seitenleiste oder mobiler Nav) kannst du ändern:

- Vollständiger Name
- Geburtsjahr
- Kurze Biografie
- Profilbild (URL)

Dein Profil ist nur für Mitglieder in gemeinsamen Archiven sichtbar.`,
      },
      {
        id: 'erscheinungsbild',
        title: 'Hell- und Dunkelmodus',
        content: `Ahnenecho unterstützt helles und dunkles Erscheinungsbild. Wechsle das Theme über das Sonnen/Mond-Symbol im Header.

Zur Auswahl stehen: Hell, Dunkel und System (folgt automatisch deinen Geräteeinstellungen).`,
      },
      {
        id: 'sprache',
        title: 'Sprache wechseln',
        content: `Ahnenecho ist auf Deutsch und Englisch verfügbar. Wechsle die Sprache über das Sprach-Symbol im Header (DE / EN).

Die gewählte Sprache wirkt sich auf die gesamte Benutzeroberfläche aus. Deine Einträge bleiben in der Sprache, in der du sie geschrieben hast.`,
      },
      {
        id: 'app-einstellungen',
        title: 'App-Einstellungen',
        content: `Unter "Einstellungen" (App-Einstellungen, nicht Vault-Einstellungen) findest du:

- Benachrichtigungseinstellungen (geplant)
- Erscheinungsbild und Sprache
- Konto-Verwaltung

Diese Seite erreichst du über die Seitenleiste (Desktop) oder Profil > Einstellungen.`,
      },
    ],
  },
  {
    id: 'datenschutz',
    title: 'Datenschutz und Sicherheit',
    sections: [
      {
        id: 'daten-speicherung',
        title: 'Wo liegen meine Daten?',
        content: `Alle Daten werden in einer europäischen Datenbank (EU-West, Paris) gespeichert und sind SSL-verschlüsselt. Wir geben keine Daten an Dritte weiter und schalten keine Werbung.

Deine Archive sind vollständig privat. Nur Mitglieder, die du selbst einlädst, können auf die Inhalte zugreifen.`,
      },
      {
        id: 'rls',
        title: 'Row-Level Security',
        content: `Ahnenecho verwendet Row-Level Security auf Datenbankebene. Das bedeutet: Selbst wenn jemand Zugang zur Datenbank hätte, könnte er nur die Daten der Archive lesen, auf die er eingeladen wurde.

Diese Sicherheitsstufe ist nicht durch Code-Fehler umgehbar – sie ist direkt in der Datenbank verankert.`,
      },
      {
        id: 'konto-loeschen',
        title: 'Konto löschen',
        content: `Du kannst dein Konto jederzeit unter Einstellungen > Konto löschen entfernen. Alle deine Daten werden dauerhaft gelöscht.

Wichtig: Wenn du der Initiator eines Archivs bist und dein Konto löschst, wird auch das Archiv mit allen Einträgen gelöscht. Übertrage zuerst die Initiator-Rolle auf ein anderes Mitglied, wenn das Archiv weiterbestehen soll.`,
      },
      {
        id: 'rechtliches',
        title: 'Rechtliche Informationen',
        content: `Betrieben wird Ahnenecho von der WAMOCON GmbH. Alle rechtlichen Dokumente findest du im Footer der Website:

- Impressum
- Datenschutzerklärung
- Allgemeine Geschäftsbedingungen

Bei Fragen: info@ahnenecho.app`,
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
          Alles, was du über Ahnenecho wissen musst – von den ersten Schritten bis zum Stammbaum.
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
                  <h3 className="text-base font-semibold text-foreground mb-3">
                    {section.title}
                  </h3>
                  <div className="text-sm leading-relaxed text-muted-foreground space-y-2">
                    {section.content.split('\n').map((line, j) => {
                      if (!line.trim()) return null
                      // Lines starting with a dash become styled list items
                      if (line.trim().startsWith('- ')) {
                        return (
                          <div key={j} className="flex gap-2">
                            <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                            <span>{line.trim().slice(2)}</span>
                          </div>
                        )
                      }
                      return <p key={j}>{line}</p>
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Version 1.0 &mdash; Ahnenecho by WAMOCON GmbH
          </p>
          <p className="text-xs text-muted-foreground">
            Fragen? Schreib uns: <a href="mailto:info@ahnenecho.app" className="text-amber-600 hover:underline">info@ahnenecho.app</a>
          </p>
        </div>
        <PrintButton />
      </div>
    </div>
  )
}
