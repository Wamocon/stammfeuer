'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight, Search, X, ChevronDown, Printer, Download } from 'lucide-react'
import type { Chapter } from './_chapters'

// ─── Client-side PDF generation ───────────────────────────────────────────────

async function downloadPDF(chapters: Chapter[], locale: string) {
  const { default: jsPDF } = await import('jspdf')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentW = pageW - margin * 2
  const appName = 'Ahnenecho'
  const subtitle = locale === 'de' ? 'Produkthandbuch' : 'Product Handbook'

  let y = margin + 20

  // ── Cover ──────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.setTextColor(146, 64, 14) // amber-800
  doc.text(appName, pageW / 2, y, { align: 'center' })
  y += 12

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(16)
  doc.setTextColor(28, 25, 23) // stone-900
  doc.text(subtitle, pageW / 2, y, { align: 'center' })
  y += 8

  doc.setFontSize(10)
  doc.setTextColor(120, 113, 108) // stone-500
  doc.text(
    new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    }),
    pageW / 2, y, { align: 'center' },
  )
  y += 6
  doc.text('ahnenecho.eu', pageW / 2, y, { align: 'center' })

  // ── Chapters ───────────────────────────────────────────────────────────────
  for (let ci = 0; ci < chapters.length; ci++) {
    const chapter = chapters[ci]
    doc.addPage()
    y = margin

    // Chapter title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(146, 64, 14)
    doc.text(`${ci + 1}. ${chapter.title}`, margin, y)
    y += 2

    // Divider line
    doc.setDrawColor(217, 119, 6) // amber-600
    doc.setLineWidth(0.5)
    doc.line(margin, y + 1, pageW - margin, y + 1)
    y += 8

    for (const section of chapter.sections) {
      // Section heading
      if (y > pageH - 30) { doc.addPage(); y = margin }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(28, 25, 23)
      doc.text(section.title, margin, y)
      y += 6

      // Section content
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(68, 64, 60) // stone-600

      const paragraphs = section.content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
      for (const para of paragraphs) {
        const lines = doc.splitTextToSize(para, contentW) as string[]
        for (const line of lines) {
          if (y > pageH - 20) { doc.addPage(); y = margin }
          doc.text(line, margin, y)
          y += 5
        }
        y += 2
      }

      y += 4
    }
  }

  // ── Page numbers ───────────────────────────────────────────────────────────
  const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(168, 162, 158) // stone-400
    doc.text(
      `${appName} ${subtitle}  ·  ${i} / ${totalPages}`,
      pageW / 2, pageH - 8, { align: 'center' },
    )
  }

  const filename = locale === 'de' ? 'Ahnenecho-Handbuch.pdf' : 'Ahnenecho-Handbook.pdf'
  doc.save(filename)
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  chapters: Chapter[]
  locale: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-amber-200 dark:bg-amber-700/60 rounded-sm px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

// ─── Labels ───────────────────────────────────────────────────────────────────

const labels = {
  de: {
    help: 'Hilfe',
    handbook: 'Produkthandbuch',
    subtitle: 'Alles, was du über Ahnenecho wissen musst – von den ersten Schritten bis zum Stammbaum.',
    toc: 'Inhaltsverzeichnis',
    search: 'Handbuch durchsuchen...',
    noResults: 'Keine Ergebnisse für',
    noResultsHint: 'Versuche einen anderen Suchbegriff.',
    version: 'Version 1.0 — Ahnenecho by WAMOCON GmbH',
    contact: 'Fragen? Schreib uns:',
    print: 'Drucken',
    download: 'Als PDF herunterladen',
    showToc: 'Inhaltsverzeichnis anzeigen',
  },
  en: {
    help: 'Help',
    handbook: 'Product Handbook',
    subtitle: 'Everything you need to know about Ahnenecho – from first steps to the family tree.',
    toc: 'Table of Contents',
    search: 'Search handbook...',
    noResults: 'No results for',
    noResultsHint: 'Try a different search term.',
    version: 'Version 1.0 — Ahnenecho by WAMOCON GmbH',
    contact: 'Questions? Write us:',
    print: 'Print',
    download: 'Download as PDF',
    showToc: 'Show table of contents',
  },
}

// ─── Content renderer ────────────────────────────────────────────────────────

function SectionContent({ content, query }: { content: string; query: string }) {
  return (
    <div className="text-sm leading-relaxed text-muted-foreground space-y-2">
      {content.split('\n').map((line, j) => {
        if (!line.trim()) return null
        if (line.trim().startsWith('- ')) {
          return (
            <div key={j} className="flex gap-2">
              <span className="text-amber-500 mt-0.5 shrink-0">•</span>
              <span>{highlight(line.trim().slice(2), query)}</span>
            </div>
          )
        }
        return <p key={j}>{highlight(line, query)}</p>
      })}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HandbuchClient({ chapters, locale }: Props) {
  const l = locale === 'en' ? labels.en : labels.de
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? '')
  const [tocOpen, setTocOpen] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Active section via IntersectionObserver
  const setupObserver = useCallback(() => {
    observerRef.current?.disconnect()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-10% 0% -75% 0%', threshold: 0 },
    )
    observerRef.current = observer
    mainRef.current?.querySelectorAll('[data-section-anchor]').forEach((el) => observer.observe(el))
  }, [])

  useEffect(() => {
    setupObserver()
    return () => observerRef.current?.disconnect()
  }, [setupObserver, query])

  // Filtered chapters
  const q = query.trim().toLowerCase()
  const filtered = q
    ? chapters
        .map((chapter) => ({
          ...chapter,
          sections: chapter.sections.filter(
            (s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q),
          ),
        }))
        .filter((chapter) => chapter.sections.length > 0)
    : chapters

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ── Page header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href={`/${locale}/help`} className="hover:text-amber-600 transition-colors">
            {l.help}
          </Link>
          <ChevronRight size={14} />
          <span>{l.handbook}</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <BookOpen size={20} className="text-amber-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{l.handbook}</h1>
        </div>
        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">{l.subtitle}</p>
      </div>

      {/* ── Search bar ── */}
      <div className="relative mb-8 max-w-xl">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={l.search}
          className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex gap-10 items-start">
        {/* ── Sidebar (desktop only) ── */}
        <aside className="hidden lg:block w-60 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
            {l.toc}
          </p>
          <nav aria-label={l.toc}>
            <ol className="space-y-0.5">
              {chapters.map((chapter, i) => (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    className={`flex items-center gap-2 text-sm py-1.5 px-2 rounded-lg transition-colors ${
                      activeId === chapter.id
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs flex items-center justify-center font-semibold shrink-0">
                      {i + 1}
                    </span>
                    <span className="truncate">{chapter.title}</span>
                  </a>
                  <ol className="ml-7 mt-0.5 space-y-0.5 mb-1">
                    {chapter.sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className={`block text-xs py-0.5 px-2 rounded transition-colors truncate ${
                            activeId === section.id
                              ? 'text-amber-600 dark:text-amber-400 font-medium'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0" ref={mainRef}>
          {/* Mobile ToC toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              aria-expanded={tocOpen}
              className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-lg px-4 py-2 w-full hover:bg-muted transition-colors"
            >
              <BookOpen size={14} />
              <span>{l.showToc}</span>
              <ChevronDown
                size={14}
                className={`ml-auto transition-transform duration-200 ${tocOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {tocOpen && (
              <div className="mt-2 border border-border rounded-xl p-4 bg-card">
                <ol className="space-y-1">
                  {chapters.map((chapter, i) => (
                    <li key={chapter.id}>
                      <a
                        href={`#${chapter.id}`}
                        onClick={() => setTocOpen(false)}
                        className="flex items-center gap-2 text-sm py-1 text-foreground hover:text-amber-600 transition-colors"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 text-xs flex items-center justify-center font-semibold shrink-0">
                          {i + 1}
                        </span>
                        {chapter.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* No results state */}
          {q && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Search size={36} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium mb-1">
                {l.noResults} <span className="text-foreground">&ldquo;{query}&rdquo;</span>
              </p>
              <p className="text-sm">{l.noResultsHint}</p>
            </div>
          )}

          {/* Chapter list */}
          <div className="space-y-14">
            {filtered.map((chapter) => {
              const chapterIndex = chapters.findIndex((c) => c.id === chapter.id)
              return (
                <div key={chapter.id}>
                  {/* Chapter heading – anchor for IntersectionObserver + hash navigation */}
                  <div id={chapter.id} data-section-anchor className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-amber-600 text-white text-sm flex items-center justify-center font-bold shrink-0">
                        {chapterIndex + 1}
                      </span>
                      {chapter.title}
                    </h2>
                  </div>

                  <div className="space-y-8 pl-11">
                    {chapter.sections.map((section) => (
                      <div key={section.id} id={section.id} data-section-anchor className="scroll-mt-24">
                        <h3 className="text-base font-semibold text-foreground mb-3">{section.title}</h3>
                        <SectionContent content={section.content} query={query} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{l.version}</p>
              <p className="text-xs text-muted-foreground">
                {l.contact}{' '}
                <a href="mailto:info@ahnenecho.app" className="text-amber-600 hover:underline">
                  info@ahnenecho.app
                </a>
              </p>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => downloadPDF(chapters, locale)}
                className="flex items-center gap-2 text-sm text-white bg-amber-600 hover:bg-amber-700 rounded-lg px-4 py-2 transition-colors"
              >
                <Download size={14} />
                {l.download}
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors"
              >
                <Printer size={14} />
                {l.print}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
