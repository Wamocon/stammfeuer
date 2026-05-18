// src/app/[locale]/layout.tsx
// Locale-aware root layout for next-intl App Router integration

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import { routing } from '@/i18n/routing'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import { CookieBanner } from '@/components/cookie/CookieBanner'
import { AppShell } from '@/components/layout/AppShell'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Ahnenecho',
    default: 'Ahnenecho - Das Gedächtnis deiner Familie',
  },
  description:
    'Das kollaborative Familienarchiv. Bewahre Geschichten, Rezepte, Traditionen und Weisheiten für alle Generationen.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ahnenecho.eu'),
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ToastProvider>
              <AppShell locale={locale}>
                {children}
              </AppShell>
              <Footer locale={locale} />
              <CookieBanner />
            </ToastProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
