import LoginForm from './_LoginForm'

interface LoginPageProps {
  params: Promise<{ locale: string }>
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params
  return <LoginForm locale={locale} />
}
