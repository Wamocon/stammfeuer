import InviteAcceptClient from './_InviteAcceptClient'

interface InvitePageProps {
  params: Promise<{ locale: string; token: string }>
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { locale, token } = await params
  return <InviteAcceptClient locale={locale} token={token} />
}
