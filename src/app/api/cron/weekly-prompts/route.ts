// src/app/api/cron/weekly-prompts/route.ts
// Vercel Cron: runs every Monday at 07:00 CET
// Assigns one prompt from the library to each active vault member

import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import type { LifePhase } from '@/types/database'

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized invocations
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseServiceClient()
  const today = new Date().toISOString().split('T')[0]

  // Get all vault members who are active (have a user_id)
  const { data: members, error: membersError } = await supabase
    .from('vault_members')
    .select(`
      id,
      vault_id,
      user_id,
      profile:profiles (
        birth_year
      )
    `)
    .not('user_id', 'is', null)

  if (membersError || !members) {
    return NextResponse.json({ error: 'Failed to fetch members.' }, { status: 500 })
  }

  // Get all prompts from library
  const { data: library } = await supabase
    .from('prompt_library')
    .select('id, category_slug, life_phase')

  if (!library || library.length === 0) {
    return NextResponse.json({ message: 'No prompts in library.' })
  }

  let assigned = 0

  for (const member of members) {
    // Check if already has a prompt this week
    const { count } = await supabase
      .from('member_prompts')
      .select('id', { count: 'exact', head: true })
      .eq('member_id', member.id)
      .eq('scheduled_for', today)

    if (count && count > 0) continue

    // Determine life phase from birth year
    const birthYear = (member.profile as unknown as { birth_year: number | null })?.birth_year
    const lifePhase: LifePhase = birthYear
      ? getLifePhase(new Date().getFullYear() - birthYear)
      : 'any'

    // Pick a random matching prompt
    const matching = library.filter(
      p => p.life_phase === lifePhase || p.life_phase === 'any'
    )
    const prompt = matching[Math.floor(Math.random() * matching.length)]

    if (!prompt) continue

    await supabase.from('member_prompts').insert({
      vault_id: member.vault_id,
      member_id: member.id,
      prompt_id: prompt.id,
      scheduled_for: today,
    })

    assigned++
  }

  return NextResponse.json({ assigned, total_members: members.length })
}

function getLifePhase(age: number): LifePhase {
  if (age < 18) return 'childhood'
  if (age < 30) return 'youth'
  if (age < 60) return 'adulthood'
  return 'senior'
}
