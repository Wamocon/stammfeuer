// src/lib/ai/types.ts
// AI adapter interface - implement this to plug in any AI provider

import type { CategorySlug, LifePhase, VaultHealth } from '@/types/database'

export interface PromptGenerationInput {
  member_name: string
  birth_year?: number
  life_phase: LifePhase
  family_role?: string
  category_hint?: CategorySlug
  vault_health?: VaultHealth
}

export interface PromptGenerationResult {
  text_de: string
  text_en: string
  category_slug: CategorySlug
}

export interface TranscriptionInput {
  audio_blob: Blob
  language?: 'de' | 'en'
}

export interface TranscriptionResult {
  text: string
  language: 'de' | 'en'
  confidence?: number
}

export interface TranslationInput {
  text: string
  source_lang: 'de' | 'en'
  target_lang: 'de' | 'en'
}

export interface TranslationResult {
  translated_text: string
  source_lang: 'de' | 'en'
  target_lang: 'de' | 'en'
}

export interface VaultAnalysisInput {
  vault_health: VaultHealth
  member_names: string[]
}

export interface VaultAnalysisResult {
  suggestions_de: string[]
  suggestions_en: string[]
  priority_category?: CategorySlug
}

/**
 * AIAdapter - plug in any AI provider by implementing this interface.
 *
 * Usage:
 *   1. Create a new file src/lib/ai/my-provider-adapter.ts
 *   2. Implement the AIAdapter interface
 *   3. Export it from src/lib/ai/index.ts
 *
 * The NullAdapter (default) returns structured placeholder data so the UI
 * works fully without any AI provider configured.
 */
export interface AIAdapter {
  /**
   * Generate a personalised weekly prompt for a vault member.
   * Phase 1: can use static prompt library. Phase 2: context-aware generation.
   */
  generatePrompt(input: PromptGenerationInput): Promise<PromptGenerationResult>

  /**
   * Transcribe audio from browser microphone to text.
   * Input is a Blob (WebM/OGG from MediaRecorder API).
   */
  transcribeAudio(input: TranscriptionInput): Promise<TranscriptionResult>

  /**
   * Translate an entry from DE to EN or vice versa.
   * Original is always preserved - this only creates a translation copy.
   */
  translateEntry(input: TranslationInput): Promise<TranslationResult>

  /**
   * Analyse vault health and return prioritised suggestions.
   * Used for the "Vault Insights" feature in V2.
   */
  analyzeVault(input: VaultAnalysisInput): Promise<VaultAnalysisResult>
}
