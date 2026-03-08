export type ModelTier = "haiku" | "sonnet" | "qwen3";

export interface SelectModelContext {
  isDevMode: boolean;
  requiresEscalation?: boolean;
}

/**
 * Central routing logic for model selection.
 * This is the single source of truth for which model handles which request.
 */
export function selectModel(context: SelectModelContext): string {
  // Development mode: use free Qwen3 model
  if (context.isDevMode) {
    return "qwen/qwen3-30b-a3b:free";
  }

  // Escalation: use Sonnet for low-confidence responses (post-MVP feature)
  if (context.requiresEscalation) {
    return "anthropic/claude-sonnet-4-5";
  }

  // Production default: Claude Haiku 3.5 for all user-facing queries
  return "anthropic/claude-haiku-3.5";
}

export const OPENROUTER_CONFIG = {
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL,
    "X-Title": "ClearLeaf HR Intelligence",
  },
  temperature: 0.1, // Low for legal accuracy
  max_tokens: 1000,
  stream: true,
};
