import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { email, password, full_name } = await request.json()

  if (!email || !password || !full_name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('[register] Missing env vars:', { supabaseUrl: !!supabaseUrl, serviceKey: !!serviceKey })
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const supabase = createSupabaseServiceClient()

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { full_name },
    email_confirm: true,
  })

  if (error) {
    console.error('[register] Supabase admin error:', error.message, error.status)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ userId: data.user.id }, { status: 201 })
}
