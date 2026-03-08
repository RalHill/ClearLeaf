// Simple in-memory rate limiter for MVP
// In production, use Redis or similar
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 20,
  windowSeconds: number = 60
): boolean {
  const now = Date.now();
  const current = requestCounts.get(identifier);

  if (!current || now > current.resetTime) {
    // New window
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowSeconds * 1000,
    });
    return true;
  }

  if (current.count < limit) {
    current.count++;
    return true;
  }

  return false;
}

export function getRateLimitStatus(
  identifier: string,
  limit: number = 20
): { remaining: number; resetIn: number } {
  const now = Date.now();
  const current = requestCounts.get(identifier);

  if (!current || now > current.resetTime) {
    return { remaining: limit, resetIn: 0 };
  }

  return {
    remaining: Math.max(0, limit - current.count),
    resetIn: Math.ceil((current.resetTime - now) / 1000),
  };
}
