export type ModelTier = "haiku" | "sonnet" | "llama";

export interface SelectModelContext {
  isDevMode: boolean;
  requiresEscalation?: boolean;
}

/**
 * Central routing logic for model selection.
 * Dev: Claude Haiku 3.5 (fast + cheap)
 * Prod default: Claude Haiku 3.5 (fast + cheap)
 * Prod escalation: Claude Sonnet 4.5 (complex legal queries)
 */
export function selectModel(context: SelectModelContext): string {
  if (context.requiresEscalation) {
    return "anthropic/claude-sonnet-4-5";
  }
  // Use Claude Haiku for both dev and prod
  return "anthropic/claude-haiku-3.5";
}

export const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
