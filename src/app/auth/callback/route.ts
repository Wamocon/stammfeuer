// src/app/auth/callback/route.ts
// Handles Supabase PKCE code exchange for email confirmation, magic links,
// and password reset. After exchange, redirects to the target page.

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // The caller can pass ?next=/de/dashboard to redirect after login.
  // Default to /dashboard - middleware will handle locale prefixing.
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    // No code - redirect to login
    return NextResponse.redirect(`${origin}/auth/login`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    },
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] Code exchange failed:', error.message)
    // Redirect to login with error hint
    return NextResponse.redirect(
      `${origin}/auth/login?error=auth_callback_error`,
    )
  }

  // Successful exchange - redirect to the target page
  // Use a relative redirect so it works on any domain (local + Vercel)
  return NextResponse.redirect(`${origin}${next}`)
}
