// src/app/api/handbuch/pdf/route.ts
// GET /api/handbuch/pdf?locale=de|en  - generate and stream the handbook as PDF

import { NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { getChapters } from '@/app/[locale]/help/handbuch/_chapters'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'de'
  const chapters = getChapters(locale)

  const doc = new PDFDocument({ margin: 60, size: 'A4', bufferPages: true })

  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  // ── Cover ───────────────────────────────────────────────────────────────────
  const appName = 'Ahnenecho'
  const subtitle = locale === 'de' ? 'Produkthandbuch' : 'Product Handbook'
  const date = new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  doc.fontSize(32).font('Helvetica-Bold').fillColor('#92400e').text(appName, { align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(20).font('Helvetica').fillColor('#1c1917').text(subtitle, { align: 'center' })
  doc.moveDown(0.4)
  doc.fontSize(11).fillColor('#78716c').text(date, { align: 'center' })
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor('#78716c').text('ahnenecho.eu', { align: 'center' })

  // ── Chapters ────────────────────────────────────────────────────────────────
  for (const chapter of chapters) {
    doc.addPage()

    // Chapter heading
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .fillColor('#92400e')
      .text(chapter.title, { paragraphGap: 4 })

    doc
      .moveTo(doc.page.margins.left, doc.y + 4)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 4)
      .strokeColor('#d97706')
      .lineWidth(1.5)
      .stroke()

    doc.moveDown(1.2)

    for (const section of chapter.sections) {
      // Section heading
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#1c1917')
        .text(section.title, { paragraphGap: 4 })

      doc.moveDown(0.4)

      // Section content - split on double newlines for paragraphs
      const paragraphs = section.content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
      for (const para of paragraphs) {
        doc
          .fontSize(11)
          .font('Helvetica')
          .fillColor('#44403c')
          .text(para, { align: 'justify', lineGap: 3, paragraphGap: 6 })
      }

      doc.moveDown(0.8)
    }
  }

  // ── Footer with page numbers ─────────────────────────────────────────────
  const totalPages = (doc as unknown as { bufferedPageRange: () => { count: number } }).bufferedPageRange().count
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i)
    const footerY = doc.page.height - doc.page.margins.bottom + 10
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#a8a29e')
      .text(`${appName} ${subtitle}  ·  ${i + 1} / ${totalPages}`, doc.page.margins.left, footerY, {
        align: 'center',
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
      })
  }

  doc.end()

  const pdf = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
  })

  const filename = locale === 'de' ? 'Ahnenecho-Handbuch.pdf' : 'Ahnenecho-Handbook.pdf'

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(pdf.length),
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
