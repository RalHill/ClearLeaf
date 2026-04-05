export type ModelTier = "haiku" | "sonnet";

export interface SelectModelContext {
  requiresEscalation?: boolean;
}

// Claude 4.5 Haiku as default model for all scenarios
export const OPENROUTER_MODEL_DEFAULT = "anthropic/claude-haiku-4.5";
export const OPENROUTER_MODEL_ESCALATION = "anthropic/claude-sonnet-4.5";

// Optional environment override for model selection
export function selectModel(context: SelectModelContext): string {
  if (context.requiresEscalation) {
    return process.env.OPENROUTER_MODEL_ESCALATION || OPENROUTER_MODEL_ESCALATION;
  }
  return process.env.OPENROUTER_MODEL || OPENROUTER_MODEL_DEFAULT;
}

export const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
