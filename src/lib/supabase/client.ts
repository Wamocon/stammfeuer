// src/lib/supabase/client.ts
// Browser-side Supabase client (singleton, for Client Components)
// Uses @supabase/ssr for cookie-based session management

'use client'

import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined

export function createSupabaseBrowserClient() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings.'
    )
  }

  client = createBrowserClient(url, key)

  return client
}

// Alias for backward compatibility
export const createClient = createSupabaseBrowserClient
