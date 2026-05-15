// src/lib/supabase/client.ts
// Browser-side Supabase client (singleton, for Client Components)
// Uses @supabase/ssr for cookie-based session management

'use client'

import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined

export function createSupabaseBrowserClient() {
  if (client) return client

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}

// Alias for backward compatibility
export const createClient = createSupabaseBrowserClient
