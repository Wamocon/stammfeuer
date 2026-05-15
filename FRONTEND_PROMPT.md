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
- **Tagline:** "Das Feuer deiner Familie, für immer am Brennen." / "Your family's fire, burning forever."
- **Color palette suggestion:** Warm ambers and deep reds (#b45309, #dc2626) on cream/warm-white backgrounds. Dark mode: deep charcoal with warm amber accents.
- **Logo placeholder:** An SVG flame icon in amber - already referenced in layout

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

A professional marketing landing page. Must include:

1. **Hero section:** Full-width, warm gradient background (amber to red). Large headline with tagline. Two CTAs: "Jetzt starten" (register) and "Mehr erfahren" (scroll down). Subtle flame SVG or animation.

2. **Problem section:** Three columns showing what gets lost without Stammfeuer (Großmutters Rezept, Die Geschichte des Familienhauses, Die Tradition die niemand mehr erklärt). Use icons.

3. **Feature section:** Six feature cards (one per knowledge category: Geschichten, Rezepte, Traditionen, Weisheiten, Orte, Fotos). Each with category icon, name, short description.

4. **How it works:** Three steps with numbers (1. Vault anlegen, 2. Familie einladen, 3. Gemeinsam archivieren).

5. **Quote/testimonial placeholder:** "Das Feuer deiner Familie, für immer am Brennen."

6. **Pricing teaser:** Three plan cards (Kostenlos / Pro / Familie+) with CTA.

7. **Footer:** WAMOCON stamp, legal links (Impressum, Datenschutz, AGB), language switcher.

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

Three cards side by side (stacked on mobile):
- Free: €0, feature list, "Jetzt starten" CTA
- Pro: €9,90/Monat, highlighted as "Beliebt", "Jetzt upgraden" button (shows toast: "Zahlung folgt in Kürze")
- Familie+: €14,90/Monat, "Kontakt" CTA

Annual pricing shown below Pro card: "€79/Jahr - 33% sparen".

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
- Show modal: "Limit erreicht - Mit Pro hast du unbegrenzte Einträge"
- "Jetzt upgraden" CTA → `/pricing`

When API returns `{ error: 'freemium_member_limit' }` (HTTP 402):
- Same pattern

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
