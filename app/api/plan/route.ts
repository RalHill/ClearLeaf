import { NextResponse } from "next/server";
import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";
import { getSessionUser, getMonthlyQueryCount } from "@/lib/db/server";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ plan: "free", queriesUsed: 0, queriesLimit: 5 });
  }

  const [planResult, queriesUsed] = await Promise.all([
    sql`
      SELECT o.plan, up.name, up.email
      FROM user_profiles up
      JOIN organizations o ON up.org_id = o.id
      WHERE up.id = ${user.id}
    `,
    getMonthlyQueryCount(user.id),
  ]);

  const row = planResult.rows[0] as { plan: string; name: string; email: string } | undefined;
  const plan = row?.plan ?? "free";

  const queriesLimit = plan === "free" ? 5 : plan === "starter" ? 100 : -1; // -1 = unlimited

  return NextResponse.json({
    plan,
    queriesUsed,
    queriesLimit,
    name: row?.name ?? null,
    email: row?.email ?? null,
  });
}
