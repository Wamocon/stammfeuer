// src/lib/ai/null-adapter.ts
// Default no-op adapter - used until a real AI provider is configured.
// All methods return structured placeholder data so the UI works fully.

import type {
  AIAdapter,
  PromptGenerationInput,
  PromptGenerationResult,
  TranscriptionInput,
  TranscriptionResult,
  TranslationInput,
  TranslationResult,
  VaultAnalysisInput,
  VaultAnalysisResult,
} from './types'

export class NullAdapter implements AIAdapter {
  async generatePrompt(input: PromptGenerationInput): Promise<PromptGenerationResult> {
    // Falls back to static prompt library - handled by the cron job
    return {
      text_de: 'KI-Prompts werden nach der AI-Integration verfügbar sein.',
      text_en: 'AI prompts will be available after AI integration.',
      category_slug: input.category_hint ?? 'stories',
    }
  }

  async transcribeAudio(_input: TranscriptionInput): Promise<TranscriptionResult> {
    // In V1 the browser Web Speech API handles transcription client-side.
    // This stub is only called if the client-side API is unavailable.
    return {
      text: '',
      language: 'de',
    }
  }

  async translateEntry(input: TranslationInput): Promise<TranslationResult> {
    // Returns a placeholder - UI shows "coming in V2" toast
    return {
      translated_text: '',
      source_lang: input.source_lang,
      target_lang: input.target_lang,
    }
  }

  async analyzeVault(_input: VaultAnalysisInput): Promise<VaultAnalysisResult> {
    return {
      suggestions_de: [],
      suggestions_en: [],
    }
  }
}
