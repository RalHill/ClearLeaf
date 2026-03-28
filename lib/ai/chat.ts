export type ModelTier = "haiku" | "sonnet" | "llama";

export interface SelectModelContext {
  isDevMode: boolean;
  requiresEscalation?: boolean;
}

/**
 * Central routing logic for model selection.
 * Dev: free Llama 3.3 70B via OpenRouter (no cost)
 * Prod default: Claude Haiku 3.5 (fast + cheap)
 * Prod escalation: Claude Sonnet 4.5 (complex legal queries)
 */
export function selectModel(context: SelectModelContext): string {
  if (context.isDevMode) {
    return "meta-llama/llama-3.3-70b-instruct:free";
  }
  if (context.requiresEscalation) {
    return "anthropic/claude-sonnet-4-5";
  }
  return "anthropic/claude-haiku-3.5";
}

export const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
