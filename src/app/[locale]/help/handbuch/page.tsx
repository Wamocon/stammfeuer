import { HandbuchClient } from './_HandbuchClient'
import { getChapters } from './_chapters'

interface HandbuchPageProps {
  params: Promise<{ locale: string }>
}

export default async function HandbuchPage({ params }: HandbuchPageProps) {
  const { locale } = await params
  const chapters = getChapters(locale)
  return <HandbuchClient chapters={chapters} locale={locale} />
}
