// src/lib/ai/index.ts
// Single import point for the AI adapter.
// To switch providers: replace NullAdapter with your implementation.

import { NullAdapter } from './null-adapter'
import type { AIAdapter } from './types'

// Singleton AI adapter instance
// When your AI solution is ready:
//   1. Create src/lib/ai/your-adapter.ts implementing AIAdapter
//   2. Replace `new NullAdapter()` with `new YourAdapter()`
export const ai: AIAdapter = new NullAdapter()

export type { AIAdapter } from './types'
export type {
  PromptGenerationInput,
  PromptGenerationResult,
  TranscriptionInput,
  TranscriptionResult,
  TranslationInput,
  TranslationResult,
  VaultAnalysisInput,
  VaultAnalysisResult,
} from './types'
