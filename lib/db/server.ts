import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";
import { auth } from "@/lib/auth";

/** Session user for API routes (replaces Supabase auth user). */
export async function getSessionUser(): Promise<{ id: string; email?: string | null } | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return { id: session.user.id, email: session.user.email };
}

export async function getUserPlan(userId: string): Promise<string> {
  const result = await sql`
    SELECT o.plan
    FROM user_profiles up
    JOIN organizations o ON up.org_id = o.id
    WHERE up.id = ${userId}
  `;
  const row = result.rows[0] as { plan: string } | undefined;
  return row?.plan ?? "free";
}

export async function getMonthlyQueryCount(userId: string): Promise<number> {
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const result = await sql`
    SELECT COUNT(*)::int AS count
    FROM usage_records
    WHERE user_id = ${userId}
      AND action_type = 'chat_query'
      AND created_at >= ${monthStart.toISOString()}
  `;
  const row = result.rows[0] as { count: number } | undefined;
  return row?.count ?? 0;
}
