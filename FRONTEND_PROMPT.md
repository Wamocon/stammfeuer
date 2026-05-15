# STAMMFEUER - Frontend Developer Prompt

## Context

You are building the **frontend of Stammfeuer**, a collaborative family memory archive app.
The **backend is already fully implemented** on the `feature/backend` branch. Your job is to build all UI components, pages, and client-side logic on top of it.

Do NOT touch:
- `/src/app/api/**` (API route handlers - already done)
- `/src/lib/ai/**` (AI adapter stubs - already done)
- `/src/lib/supabase/**` (Supabase client utils - already done)
- `/src/types/database.ts` (Type definitions - already done)
- `/src/i18n/**` (i18n routing config - already done)
- `/src/middleware.ts` (Session + locale middleware - already done)
- `/supabase/**` (DB migrations + seed - already done)
- `/messages/de.json` and `/messages/en.json` (All translation strings are already there - use them)

---

## Tech Stack

- **Framework:** Next.js 16.2.1, App Router, `src/app/[locale]/` routing
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (utility-first, no custom CSS unless unavoidable)
- **Icons:** Use `lucide-react` (install if not present)
- **Themes:** `next-themes` (already installed) - `dark`/`light`/`system`
- **i18n:** `next-intl` (already configured) - `useTranslations` hook for ALL text
- **Auth:** Supabase Auth via `@supabase/ssr` - already configured in middleware
- **Data fetching:** Server Components where possible, Client Components only for interactivity
- **Forms:** React `useState` or `useActionState` (no external form library needed)

---

## Core Design Principles

- **Warm, emotional, family-focused** - this is not a productivity tool
- **Accessible to ages 20-85** - large touch targets (min 44px), readable fonts (min 16px body)
- **Mobile-first** - majority of older users are on phone
- **Tagline (DE):** "Das Feuer deiner Familie, für immer am Brennen."
- **Tagline (EN):** "Your family's fire, burning forever."
- **Full marketing concept, brand guidelines and design language:** see `Marketing/MARKETING_KONZEPT.md` - read it before building any page or component.

---

## Brand and Design System

> The full specification is in `Marketing/MARKETING_KONZEPT.md`. The key rules are extracted here for convenience - always refer to the full document for edge cases.

### Brand Positioning

Stammfeuer is **not a productivity tool**. It is an emotional heritage archive. The design must feel like:
- An old family photo album - but digital and shared
- A campfire evening - warm, communal, timeless
- A home - not a SaaS dashboard

Every design decision must serve this emotional positioning.

### Color System

**Light mode:**

| Token | Hex | Usage |
|---|---|---|
| Primary CTA | `#d97706` (amber-600) | Buttons, active elements, links |
| Primary hover | `#f59e0b` (amber-500) | Hover states |
| Accent bg | `#fef3c7` (amber-100) | Badges, background highlights |
| Danger | `#b91c1c` (red-700) | Danger actions, secondary CTAs |
| Page bg | `#fdfaf6` | Main background (warm off-white, NOT pure white) |
| Card bg | `#f5f0e8` | Card surfaces |
| Border | `#e8dfd0` | Dividers, input borders |
| Body text | `#111827` (gray-900) | Primary text |
| Muted text | `#4b5563` (gray-600) | Secondary text |

**Dark mode:**

| Token | Tailwind | Usage |
|---|---|---|
| Page bg | `stone-900` (#1c1917) | Main background |
| Card bg | `stone-800` (#292524) | Card surfaces |
| Border | `stone-700` (#44403c) | Dividers, borders |
| Body text | `stone-50` (#fafaf9) | Primary text |
| Muted text | `stone-400` (#a8a29e) | Secondary text |
| Primary CTA | `amber-400` (#fbbf24) | Buttons, links in dark mode |
| Primary hover | `amber-300` (#fcd34d) | Hover in dark mode |

**Rules:**
- Never use pure black on pure white - too harsh for older eyes
- Amber dominates CTAs - never blue or purple
- All backgrounds use warm tones - never cool grey

### Typography

Font: **Geist** (already installed via `next/font`). Use the variable font weight.

| Role | Weight | Min Size |
|---|---|---|
| Hero headline | 800 | `text-5xl` (mobile) / `text-6xl` (desktop) |
| Page heading | 700 | `text-3xl` |
| Section heading | 700 | `text-2xl` |
| Body text | 400 | `text-base` (16px ABSOLUTE MINIMUM) |
| UI labels | 500-600 | `text-sm` (14px min) |
| Metadata | 400 | `text-xs` ONLY for timestamps/meta - never body |

Line height: always `leading-relaxed` for body text. Never tight for paragraphs.

### Logo

The Stammfeuer logo is a stylized **two-line flame** representing two generations burning together.

**Wordmark rendering:**
```tsx
<span className="font-bold text-gray-900 dark:text-stone-50">Stamm</span>
<span className="font-bold text-amber-600 dark:text-amber-400">feuer</span>
```

**SVG Flame Icon** (use this exact SVG for favicon, header, and hero):
```svg
<svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 4C20 4 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 14 20 4 20 4Z" fill="#d97706" opacity="0.9"/>
  <path d="M20 16C20 16 14 22 14 28C14 31.9 16.7 35 20 35C23.3 35 26 31.9 26 28C26 22 20 16 20 16Z" fill="#b91c1c" opacity="0.85"/>
  <path d="M20 24C20 24 17 27 17 30C17 31.7 18.3 33 20 33C21.7 33 23 31.7 23 30C23 27 20 24 20 24Z" fill="#fbbf24"/>
</svg>
```

### Category Icons (lucide-react mapping)

| Category slug | Icon | Color class |
|---|---|---|
| `stories` | `BookOpen` | `text-amber-600` |
| `recipes` | `UtensilsCrossed` | `text-orange-600` |
| `traditions` | `Sparkles` | `text-yellow-600` |
| `wisdom` | `Quote` | `text-emerald-600` |
| `places` | `MapPin` | `text-blue-600` |
| `photos` | `Camera` | `text-purple-600` |

Icon stroke width: always `strokeWidth={1.5}` (thinner than default, looks more elegant).

### Component Style Guide

**Buttons:**
```
Primary:   bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg
Secondary: border border-amber-600 text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-lg
Danger:    bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg
```
Minimum height: 44px (accessibility requirement for older users).

**Cards:**
```
bg-white dark:bg-stone-800
border border-[#e8dfd0] dark:border-stone-700
rounded-xl shadow-sm p-6
hover:shadow-md transition-shadow duration-200
```

**Inputs:**
```
border border-[#e8dfd0] dark:border-stone-600
rounded-lg px-4 py-3 bg-white dark:bg-stone-800
text-base (MINIMUM - never text-sm in inputs)
focus:ring-2 focus:ring-amber-500 focus:border-amber-500
```

**Category Badges:**
```
inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
stories:    bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300
recipes:    bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300
traditions: bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300
wisdom:     bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300
places:     bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300
photos:     bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300
```

### Animations

- Button hover: `transition-colors duration-150`
- Card hover: `transition-shadow duration-200`
- Modal open: opacity + scale (`opacity-0 scale-95` to `opacity-100 scale-100`), 200ms
- Toast: `translate-y-2 opacity-0` to `translate-y-0 opacity-100`, 300ms
- Hero flame: subtle `animate-pulse` or CSS keyframe loop (3s), amber glow

Always wrap animations in `@media (prefers-reduced-motion: no-preference)` to respect accessibility preferences.

### Spacing Rules

- Body text line height: `leading-relaxed` (never `leading-tight` for paragraphs)
- Card padding: `p-6` (desktop) / `p-4` (mobile)
- Section spacing: `py-16` (desktop) / `py-10` (mobile)
- Max content width: `max-w-2xl` (text), `max-w-4xl` (cards/grids), `max-w-7xl` (hero)

---

## Directory Structure to Build

Create all files under `src/app/[locale]/`:

```
src/app/[locale]/
  page.tsx                        <- Homepage (landing page)
  layout.tsx                      <- Already done (do NOT edit)
  dashboard/
    page.tsx                      <- Authenticated dashboard
  vault/
    create/page.tsx               <- Create new vault
    [vaultId]/
      page.tsx                    <- Vault overview
      entries/
        page.tsx                  <- Entry list with filters
        new/page.tsx              <- New entry form
        [entryId]/page.tsx        <- Single entry view
      members/page.tsx            <- Member management
      settings/page.tsx           <- Vault settings
  invite/[token]/page.tsx         <- Accept invitation page
  auth/
    login/page.tsx
    register/page.tsx
    reset-password/page.tsx
  profile/page.tsx                <- User profile
  settings/page.tsx               <- App settings (theme, language, notifications)
  pricing/page.tsx                <- Pricing plans
  help/page.tsx                   <- FAQ + help for older users
  legal/
    impressum/page.tsx
    datenschutz/page.tsx
    agb/page.tsx

src/components/
  layout/
    Header.tsx                    <- Nav + locale switcher + theme toggle + auth state
    Footer.tsx                    <- Legal links + WAMOCON stamp
    Breadcrumbs.tsx
  ui/
    Button.tsx                    <- Primary, secondary, danger variants
    Card.tsx
    Input.tsx
    Textarea.tsx
    Select.tsx
    Badge.tsx                     <- For roles, categories
    Modal.tsx                     <- Accessible dialog
    Toast.tsx                     <- Notification toasts
    LoadingSpinner.tsx
    EmptyState.tsx
    Avatar.tsx
  vault/
    VaultCard.tsx
    VaultHealthChart.tsx          <- Bar chart (CSS only, no chart library)
    CategoryIcon.tsx              <- Flame/book/etc per category
  entries/
    EntryCard.tsx
    EntryForm.tsx                 <- Shared form for all 6 categories
    CategoryFields.tsx            <- Category-specific metadata fields
    VoiceInput.tsx                <- Browser Web Speech API recorder
    MediaUpload.tsx               <- Photo upload to Supabase Storage
  members/
    MemberList.tsx
    InviteForm.tsx
    RoleBadge.tsx
  prompts/
    PromptWidget.tsx              <- Weekly prompt card on dashboard
  cookie/
    CookieBanner.tsx              <- DSGVO cookie notice
```

---

## Page Specifications

### `/` - Homepage

A professional emotional marketing landing page. No productivity-tool aesthetics. Warm, personal, family.

**Section 1 - Hero (full viewport height on desktop):**
- Background: gradient `from-amber-600 via-orange-500 to-red-700`, dark overlay for text contrast
- Headline: large (`text-5xl md:text-6xl`), white, font-weight 800
  - DE: "Das Feuer deiner Familie, fur immer am Brennen."
  - EN: "Your family's fire, burning forever."
- Subheading: `text-lg md:text-xl text-white/90`
  - DE: "Großmutters Rezepte. Opas Geschichten. Die Traditionen, die eure Familie zusammenhalten. Fur immer bewahrt."
  - EN: "Grandma's recipes. Grandpa's stories. The traditions that hold your family together. Preserved forever."
- Two CTAs side by side: "Jetzt starten" (primary, white bg + amber text) and "Mehr erfahren" (ghost, white border)
- Flame SVG (from brand guidelines) centered above headline, `animate-pulse` (3s), 80px
- Scroll indicator arrow at bottom

**Section 2 - Problem (emotional hook):**
- Section title: "Was geht verloren, wenn niemand fragt?"
- Three columns (stacked on mobile):
  1. `BookOpen` icon - "Omas Gulaschrezept" - "Sie kennt es auswendig. Aber hat sie es je aufgeschrieben?"
  2. `Home` icon - "Die Geschichte des Familienhauses" - "Wer hat es gebaut? Welche Erinnerungen stecken darin?"
  3. `Sparkles` icon - "Die Tradition, die nur ihr kennt" - "Warum macht eure Familie das so? Bald weiß es niemand mehr."
- Background: warm `bg-[#f5f0e8]` / `dark:bg-stone-900`

**Section 3 - Feature cards (6 categories):**
- Grid 2-col (mobile) / 3-col (desktop)
- Each card: category icon (colored, 32px), category name, short description
- Use exact category icon + color mapping from Brand Design System above
- Background: white / dark:stone-800

**Section 4 - How it works:**
- Title: "So einfach geht's"
- Three numbered steps horizontally (stacked on mobile):
  1. "Vault anlegen" - "Erstelle ein privates Familienarchiv in 30 Sekunden."
  2. "Familie einladen" - "Lade Oma, Opa, Eltern und Geschwister ein."
  3. "Gemeinsam archivieren" - "Jeder tragt bei - per Sprache, Text oder Foto."
- Connecting line or arrow between steps on desktop

**Section 5 - Pull quote:**
- Full-width amber gradient background
- Large italic quote: "Das Feuer deiner Familie, fur immer am Brennen."
- Below it: "Stammfeuer - Das generationsubergreifende Familienarchiv"

**Section 6 - Pricing teaser:**
- Three plan cards (Kostenlos / Pro / Familie+)
- Pro card: highlighted with `ring-2 ring-amber-600`, "Beliebt" badge
- Pricing anchor: "Weniger als ein Kaffee im Monat. Ein Erbe fur immer."
- CTA: "Alle Plane anzeigen" linking to `/pricing`

**Section 7 - Footer (see Footer component spec)**

No hardcoded strings - use `useTranslations`.

---

### `/dashboard` - Authenticated dashboard

Protected route - redirect to `/auth/login` if not authenticated.

Sections:
1. **Welcome header:** "Willkommen, [Name]" or "Welcome, [Name]"
2. **Vault health widget:** Fetches `GET /api/vaults/[vaultId]/health`. Shows a horizontal bar chart per category (CSS bars, Tailwind only). Shows health score as percentage ring or number. Shows inactive members list.
3. **Active prompt widget:** Fetches `GET /api/vaults/[vaultId]/prompts`. Shows the weekly question with "Jetzt beantworten" CTA. Includes voice input button.
4. **Recent entries:** Last 5 entries across all categories. Entry cards with category badge, author avatar, date.
5. **Timeline gaps:** Shows years with no entries as chips/badges.

---

### Entry Form - `/vault/[vaultId]/entries/new`

This is the most complex UI. It must handle all 6 categories differently.

**Shared fields (all categories):**
- Title (text input)
- Language selector (DE/EN toggle)
- "On behalf of" selector - proxy entry for family member
- Media upload (Supabase Storage, multiple images allowed)
- Save / Cancel buttons

**Category-specific fields:**

`stories`: Period start year + end year (optional number inputs)

`recipes`: Ingredients list (add/remove items), steps list (add/remove), origin story (textarea), servings (number), prep time (number)

`traditions`: Since year (number), introduced by (text), frequency (select: annual/monthly/weekly/special)

`wisdom`: Author (select from vault members), context (textarea)

`places`: Address (text), meaning (textarea), optional coordinates (hidden, from browser geolocation if user permits)

`photos`: Description (MANDATORY - enforce in UI before allowing save), multiple image upload

**Voice Input component:**
- Microphone button
- On click: start `window.SpeechRecognition` (Web Speech API, no API key)
- Show recording indicator (animated red dot)
- On stop: show transcript in editable textarea
- User must confirm/edit before it fills the form body
- Show toast if browser doesn't support it

**Translation tab:**
- Show "Original" and "Übersetzung" tabs
- "Übersetzung" tab shows: translated content if available, or a message "KI-Übersetzung folgt in Version 2" with info icon

---

### `/members` - Member management

Only initiators see the full management UI. Contributors/readers see the list only.

- Member list with avatar, name, family role, role badge, last contribution date
- Inactive members highlighted (no contribution ever)
- Invite form (modal): email, role selector, family role input
- Generated invite link + copy button
- Remove member (initiator only, with confirmation)
- Change role (initiator only)

---

### `/pricing` - Pricing page

**Page anchor text (above cards):** "Weniger als ein Kaffee im Monat. Ein Erbe fur immer."

Three cards side by side (stacked on mobile). Centered layout `max-w-5xl mx-auto`.

**Free card:**
- Price: €0
- Subtitle: "Legt los, ohne Kreditkarte"
- Features: 5 Familienmitglieder, 20 Eintrage, alle 6 Kategorien, Spracheingabe
- CTA: "Jetzt starten" (primary amber button)

**Pro card (highlighted):**
- `ring-2 ring-amber-600` border, "Beliebt" badge (amber pill, top right)
- Price: €9,90/Monat
- Annual anchor: "oder €79/Jahr - 33% sparen" (below price, `text-sm text-amber-700`)
- Subtitle: "Fur Familien, die es ernst meinen"
- Features: Unbegrenzte Mitglieder, unbegrenzte Eintrage, KI-Prompts, Medien-Upload, DSGVO-Export, Prioritats-Support
- CTA: "Jetzt upgraden" - shows toast "Zahlung folgt in Kurze" (payment not yet implemented)

**Familie+ card:**
- Price: €14,90/Monat
- Annual anchor: "oder €119/Jahr - 33% sparen"
- Subtitle: "Fur grosse Familien und mehrere Vaults"
- Features: Alles aus Pro, mehrere Vaults, fruher Zugang zu neuen Features
- CTA: "Kontakt aufnehmen" (links to mailto:info@stammfeuer.app)

**Below cards:** Value anchor section
- "Was ware es wert, Omas Rezept in 20 Jahren noch zu lesen?" (italic, centered)
- "Ein Fotoalbum-Druck kostet €40 bis 80. Stammfeuer Pro ist €79 fur ein ganzes Jahr."

---

### Legal pages

Read content from `/legal-docs/` markdown files and render them. Replace placeholders:
- `{{PROJEKTNAME}}` → Stammfeuer
- `{{MONAT}}` → May
- `{{JAHR}}` → 2026
- `{{PROJEKT_EMAIL}}` → info@stammfeuer.app
- `{{BESCHREIBUNG_DES_ANGEBOTS}}` → die generationsübergreifende Archivierung von Familiengeschichten, Rezepten, Traditionen und Weisheiten

---

### Cookie Banner

- Appears at bottom on first visit (persisted in localStorage)
- Message from `messages/de.json` `cookie.message`
- Two buttons: "Verstanden" (accept + dismiss) and "Mehr erfahren" (link to /legal/datenschutz)
- No tracking cookies are set - this is purely informational

---

## API Integration Reference

All API calls use the Supabase client. For Server Components use `createSupabaseServerClient()` from `@/lib/supabase/server`. For Client Components use `createSupabaseBrowserClient()` from `@/lib/supabase/client`.

| Action | Method | Endpoint |
|--------|--------|----------|
| List vaults | GET | `/api/vaults` |
| Create vault | POST | `/api/vaults` |
| List entries | GET | `/api/vaults/[vaultId]/entries` |
| Create entry | POST | `/api/vaults/[vaultId]/entries` |
| List members | GET | `/api/vaults/[vaultId]/members` |
| Invite member | POST | `/api/vaults/[vaultId]/members` |
| Vault health | GET | `/api/vaults/[vaultId]/health` |
| Active prompts | GET | `/api/vaults/[vaultId]/prompts` |
| Validate invite | GET | `/api/invite/[token]` |
| Accept invite | POST | `/api/invite/[token]` |
| Export data | GET | `/api/user/export` |
| Delete account | DELETE | `/api/user/delete` |

Auth endpoints use Supabase directly:
```ts
// Server Component: check session
const { data: { user } } = await supabase.auth.getUser()

// Client Component: sign in
await supabase.auth.signInWithPassword({ email, password })

// Client Component: sign up
await supabase.auth.signUp({ email, password, options: { data: { full_name } } })

// Client Component: magic link
await supabase.auth.signInWithOtp({ email })

// Client Component: sign out
await supabase.auth.signOut()
```

---

## Translation Usage

**Always** use `useTranslations`:
```tsx
// Server Component
import { useTranslations } from 'next-intl'
const t = useTranslations('auth')
return <h1>{t('loginTitle')}</h1>

// Client Component
'use client'
import { useTranslations } from 'next-intl'
```

All keys are defined in `/messages/de.json` and `/messages/en.json`.
Namespaces: `nav`, `auth`, `vault`, `members`, `categories`, `entries`, `prompts`, `dashboard`, `freemium`, `pricing`, `profile`, `settings`, `legal`, `cookie`, `errors`, `common`

---

## Auth Flow

1. Unauthenticated users hitting `/dashboard` or `/vault/**` → redirect to `/{locale}/auth/login`
2. After login → redirect to `/{locale}/dashboard`
3. If user has no vault → show vault creation prompt on dashboard
4. Invite flow: `/invite/[token]` → if not logged in, redirect to login with `?redirect=/invite/[token]`

---

## Freemium Limits

When API returns `{ error: 'freemium_entry_limit' }` (HTTP 402):
- Show modal with amber header, flame icon
- Headline: "Limit erreicht"
- Body: "Mit Pro hast du unbegrenzte Eintrage und unbegrenzte Mitglieder. Weniger als ein Kaffee im Monat."
- Primary CTA: "Jetzt upgraden" → `/pricing`
- Secondary: "Schliessen" (ghost button)

When API returns `{ error: 'freemium_member_limit' }` (HTTP 402):
- Same pattern, body: "Du hast das Limit von 5 Familienmitgliedern erreicht. Mit Pro ladet ihr unbegrenzt ein."

**Proactive upgrade triggers (soft nudges - no blocking):**
- At 80 % of entry limit (16/20): info banner on vault page "Fast voll - hol dir Pro"
- After adding 4th member: tooltip "Noch eine Person? Mit Pro unbegrenzt einladen."
- After first successful entry save: dismissable card "Das war einfach. Mit Pro unbegrenzt."

---

## Responsive Breakpoints

| Breakpoint | Use |
|------------|-----|
| `sm` (640px) | Mobile landscape |
| `md` (768px) | Tablet |
| `lg` (1024px) | Desktop |

Mobile-first approach. Navigation collapses to hamburger below `md`.

---

## Accessibility Requirements

- All interactive elements: min 44×44px touch target
- Form labels: always visible (no placeholder-only labels)
- Images: meaningful alt text
- Keyboard navigation: all interactive elements reachable by Tab
- Color contrast: WCAG AA minimum
- Older user consideration: font size min 16px body, 20px+ for headlines

---

## What NOT to do

- Do NOT install chart libraries (Recharts, Chart.js) - use CSS bars only
- Do NOT install form libraries (React Hook Form, Formik) - use native React state
- Do NOT install UI component libraries (shadcn, MUI, Chakra) - build components from Tailwind
- Do NOT hardcode any user-facing strings - always `useTranslations`
- Do NOT use em dash (—) in any text or code
- Do NOT use `"use client"` unless the component truly needs interactivity
- Do NOT skip the voice input implementation - it is mandatory per requirements (A-03)

---

## Quality Gates (run before declaring done)

```bash
npm run typecheck   # must be 0 errors
npm run lint        # must be 0 errors
npm run build       # must succeed with 0 errors
```

---

## Deliverables

1. All pages listed in the directory structure above
2. All components listed above
3. Cookie banner
4. Responsive navigation (header + mobile hamburger)
5. Light + dark mode working on all pages
6. DE + EN translations working (language switcher in header)
7. Auth flow (login, register, magic link, password reset)
8. Voice input component using Web Speech API
9. Vault health bar chart (CSS only)
10. `npm run build` passing with 0 errors
