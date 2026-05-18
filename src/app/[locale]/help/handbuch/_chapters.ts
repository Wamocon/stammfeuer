export interface Section {
  id: string
  title: string
  content: string
}

export interface Chapter {
  id: string
  title: string
  sections: Section[]
}

// ─── German ───────────────────────────────────────────────────────────────────

const chaptersDE: Chapter[] = [
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

// ─── English ──────────────────────────────────────────────────────────────────

const chaptersEN: Chapter[] = [
  {
    id: 'erste-schritte',
    title: 'Getting Started',
    sections: [
      {
        id: 'konto-erstellen',
        title: 'Create an Account',
        content: `Open ahnenecho.eu and click "Sign Up". Enter your full name, email address and a secure password. After signing up you are logged in immediately – no waiting for a confirmation email.

Your account is completely private. Only family members you invite yourself can see your content.`,
      },
      {
        id: 'anmelden',
        title: 'Sign In and Sign Out',
        content: `Sign in with your email address and password. If you have forgotten your password, click "Forgot password" on the login page. You will receive a reset link by email.

To sign out, click "Sign out" in the sidebar (desktop) or go to Profile > Sign out.`,
      },
      {
        id: 'dashboard',
        title: 'Understanding the Dashboard',
        content: `After signing in you land on the dashboard. Here you see all family archives (Vaults) you are part of – both your own and Vaults you have been invited to.

Each Vault card shows the name, the number of members and entries, and the date of the last entry. Use the "New Archive" button to create your first Vault.`,
      },
    ],
  },
  {
    id: 'vaults',
    title: 'Family Archives (Vaults)',
    sections: [
      {
        id: 'vault-anlegen',
        title: 'Create an Archive',
        content: `Click "New Archive" on the dashboard. Give the archive a name (e.g. "The Miller Family" or "Grandma's Stories") and optionally a short description.

An archive is always private. You are automatically the Initiator – the person with full rights.`,
      },
      {
        id: 'vault-uebersicht',
        title: 'The Vault Overview',
        content: `Click on an archive to go to the overview page. There you see:

- A health indicator showing how complete the archive is
- The 6 content categories with number of entries each
- The latest activities in the archive
- Quick access to all areas

Use the sidebar (desktop) or the Vault sub-nav (mobile) to switch between Overview, Entries, Chronicle, Family and Settings.`,
      },
      {
        id: 'vault-einstellungen',
        title: 'Archive Settings',
        content: `Under "Settings" of an archive you can:

- Change the name and description
- Delete the archive (Initiator only)

Note: Deleting an archive is irreversible. All entries, photos and family tree data will be permanently removed.`,
      },
      {
        id: 'plaene',
        title: 'Plans and Limits',
        content: `Ahnenecho is available in three plans:

Free: 1 Vault, up to 3 members, up to 50 entries, no image uploads.

Pro: Unlimited Vaults and members, up to 500 entries, image uploads, AI writing suggestions.

Family Plus: Everything in Pro, unlimited entries, extended family tree, priority support.

View your current plan under Dashboard > Pricing. Upgrades are possible at any time.`,
      },
    ],
  },
  {
    id: 'mitglieder',
    title: 'Members and Roles',
    sections: [
      {
        id: 'einladen',
        title: 'Invite Family Members',
        content: `Open an archive and navigate to "Family" > "Members" tab. Click "Invite", enter the family member's email address and choose the desired role.

The invited person receives a personal invitation link by email. Clicking the link automatically adds them to the archive – even without a prior account. The link is valid for 7 days.`,
      },
      {
        id: 'rollen',
        title: 'Roles and Permissions',
        content: `Each member has a role that determines what they can do:

Initiator: Creates the archive. Full control over all content, members and settings. Can delete the archive.

Contributor (Bewahrer): Can create, edit and delete entries. Can add and connect family tree persons. Cannot invite members.

Reader: Can read all entries and the family tree, but cannot change or create anything.

The Initiator can adjust roles at any time under "Members".`,
      },
      {
        id: 'mitglied-ohne-account',
        title: 'Members without an App Account',
        content: `You can add family members to the family tree without an email address – for example deceased ancestors or children. These people appear in the family tree but have no login.

Later, when that person creates an account, the Initiator can link the family tree profile with the real account.`,
      },
    ],
  },
  {
    id: 'eintraege',
    title: 'Creating Entries',
    sections: [
      {
        id: 'eintrag-erstellen',
        title: 'Add a New Entry',
        content: `Click the "+" button (mobile: centre of the bottom navigation bar, desktop: "New Entry" in the sidebar).

Every entry has:
- A category (required)
- A title (required)
- Body text (optional but recommended)
- Metadata depending on category (e.g. ingredients for recipes, coordinates for places)
- Photos (for the Photo category and on Pro/Family Plus)

After saving you land automatically on the entry detail page.`,
      },
      {
        id: 'kategorien',
        title: 'The 6 Content Categories',
        content: `Every entry belongs to one of six categories:

📖 Stories: Personal memories, experiences, historic family moments. A time range (from/to) can be specified.

🍳 Recipes: Family recipes with ingredient list and step-by-step instructions. Origin and servings can be noted.

🎉 Traditions: Recurring family customs with "since when" and "how often" (yearly, monthly, occasion-based).

💡 Wisdom: Life mottos, quotes, advice from family members. With context of when and why they arose.

📍 Places: Significant family locations with address, GPS coordinates and the meaning of the place.

📷 Photos: Images with description, year and an uploadable image file.`,
      },
      {
        id: 'stellvertretend-schreiben',
        title: 'Writing on Behalf of Someone',
        content: `Sometimes you want to write down a story that another person experienced – for example your grandmother's childhood memories that she told you.

When creating an entry you can select an archive member under "On behalf of". The entry will then appear with that person's name, with a note that you wrote it down.`,
      },
      {
        id: 'fotos-hochladen',
        title: 'Uploading Photos',
        content: `In the "Photos" category (and on Pro/Family Plus for other categories too) you can upload images directly. Click the upload area or drag and drop images into it.

Supported formats: JPG, PNG, WebP, HEIC. Photos are stored securely in your private archive and are only visible to archive members.

Tip: Older photos can be photographed with your phone and uploaded directly.`,
      },
      {
        id: 'eintrag-bearbeiten',
        title: 'Editing and Deleting Entries',
        content: `Open an entry and click the edit icon (pencil) in the top right. You can change all fields afterwards.

Delete an entry: Click "Delete" in the edit view. Deleted entries cannot be restored.

Who can edit? Initiators and Contributors can edit all entries. Readers can only edit their own entries.`,
      },
    ],
  },
  {
    id: 'stammbaum',
    title: 'The Family Tree',
    sections: [
      {
        id: 'stammbaum-ueberblick',
        title: 'What is the Family Tree?',
        content: `The family tree shows all family members as connected nodes on a canvas. You can freely pan and zoom the view.

Open it via "Family" > "Family Tree" tab within an archive. In the "Members" tab next to it you manage the member list.

The toolbar at the top shows the number of persons and connections. Use "Auto Layout" to automatically arrange all persons.`,
      },
      {
        id: 'person-hinzufuegen',
        title: 'Adding Persons',
        content: `Click "Add Person" in the family tree toolbar. Fill in the form:

- Name (required)
- Birth and death year
- Gender (determines node color: blue/pink/neutral)
- Short biography
- Profile photo (URL)

The person appears on the canvas immediately. You can drag and drop them to reposition – the position is saved automatically.`,
      },
      {
        id: 'beziehungen',
        title: 'Connecting Relationships',
        content: `There are two relationship types:

Parent-Child: A dashed orange line with a downward arrow. Shows who is whose child.

Partner: A dashed red line with a heart symbol. Connects couples and married pairs.

To add a relationship: Hover over a person → click "+ Relationship" → choose type and target person.

To delete a relationship: Double-click the connection line (Initiator or Contributor only).`,
      },
      {
        id: 'person-verknuepfen',
        title: 'Link a Family Tree Person to an App Account',
        content: `If a family member exists in the family tree and has also registered an app account, the Initiator can link both together.

Hover over the family tree person → click "Assign User" → select the archive member. From then on a golden ring around the node indicates "Linked".`,
      },
      {
        id: 'autolayout',
        title: 'Auto Layout',
        content: `The "Auto Layout" button automatically arranges all persons in a grid. This is useful when the family tree has become cluttered.

Auto Layout overwrites all manually set positions. You can then reposition persons manually again afterwards.`,
      },
    ],
  },
  {
    id: 'chronik',
    title: 'The Chronicle',
    sections: [
      {
        id: 'chronik-ueberblick',
        title: 'What is the Chronicle?',
        content: `Open the Chronicle via "Chronicle" in the sidebar (desktop) or the Vault sub-nav (mobile). It has two tabs:

Activity: Shows all the latest actions in the archive – who created or changed which entry and when. Ideal for staying up to date.

History: A timeline view of all entries sorted by their creation date. This shows the family history in chronological order.`,
      },
      {
        id: 'luecken',
        title: 'Identifying Time Gaps',
        content: `The Chronicle marks periods without entries. This helps identify which decades or life phases are not yet documented.

These hints serve as inspiration: "We know nothing about these years yet – who has a story about them?"`,
      },
    ],
  },
  {
    id: 'mobile',
    title: 'Using Ahnenecho on Mobile',
    sections: [
      {
        id: 'mobile-navigation',
        title: 'Navigation on Smartphones',
        content: `Ahnenecho is fully optimised for mobile. On a smartphone a navigation bar appears at the bottom with:

- Dashboard
- Archive (overview of the active Vault)
- "+" button (new entry)
- Profile
- Help

When you are inside a Vault, an additional Vault sub-nav appears above the navigation bar with: Overview, Entries, Chronicle, Family Tree, Settings.`,
      },
      {
        id: 'mobile-stammbaum',
        title: 'Family Tree on Mobile',
        content: `The family tree works on mobile too. You can zoom and pan the canvas with two fingers. Individual persons can be dragged with a finger.

For more extensive editing (adding many relationships) we recommend using a desktop browser.`,
      },
    ],
  },
  {
    id: 'profil-einstellungen',
    title: 'Profile and Settings',
    sections: [
      {
        id: 'profil',
        title: 'Edit Your Profile',
        content: `Under "Profile" (sidebar or mobile nav) you can change:

- Full name
- Birth year
- Short biography
- Profile photo (URL)

Your profile is only visible to members of shared archives.`,
      },
      {
        id: 'erscheinungsbild',
        title: 'Light and Dark Mode',
        content: `Ahnenecho supports light and dark appearance. Switch the theme using the sun/moon icon in the header.

Options: Light, Dark and System (automatically follows your device settings).`,
      },
      {
        id: 'sprache',
        title: 'Switch Language',
        content: `Ahnenecho is available in German and English. Switch the language using the language icon in the header (DE / EN).

The chosen language affects the entire user interface. Your entries remain in the language in which you wrote them.`,
      },
      {
        id: 'app-einstellungen',
        title: 'App Settings',
        content: `Under "Settings" (app settings, not Vault settings) you find:

- Notification settings (planned)
- Appearance and language
- Account management

Reach this page via the sidebar (desktop) or Profile > Settings.`,
      },
    ],
  },
  {
    id: 'datenschutz',
    title: 'Privacy and Security',
    sections: [
      {
        id: 'daten-speicherung',
        title: 'Where is My Data Stored?',
        content: `All data is stored in a European database (EU-West, Paris) and is SSL-encrypted. We do not share data with third parties and display no advertising.

Your archives are completely private. Only members you personally invite can access the content.`,
      },
      {
        id: 'rls',
        title: 'Row-Level Security',
        content: `Ahnenecho uses Row-Level Security at the database level. This means: even if someone had access to the database, they could only read the data from archives they were invited to.

This security level cannot be bypassed by code errors – it is anchored directly in the database.`,
      },
      {
        id: 'konto-loeschen',
        title: 'Delete Account',
        content: `You can delete your account at any time under Settings > Delete Account. All your data will be permanently removed.

Important: If you are the Initiator of an archive and delete your account, the archive and all its entries will also be deleted. First transfer the Initiator role to another member if the archive should continue to exist.`,
      },
      {
        id: 'rechtliches',
        title: 'Legal Information',
        content: `Ahnenecho is operated by WAMOCON GmbH. All legal documents can be found in the website footer:

- Imprint
- Privacy Policy
- Terms and Conditions

Questions? info@ahnenecho.app`,
      },
    ],
  },
]

export function getChapters(locale: string): Chapter[] {
  return locale === 'en' ? chaptersEN : chaptersDE
}
