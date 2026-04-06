import { NextRequest, NextResponse } from "next/server";
import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const province = searchParams.get("province") ?? "ON";
  const type = searchParams.get("type"); // optional filter
  const from = searchParams.get("from"); // YYYY-MM-DD
  const to = searchParams.get("to"); // YYYY-MM-DD

  try {
    // Build province filter: match if 'Federal' OR selected province is in the provinces array
    let rows;

    if (type) {
      if (from && to) {
        rows = await sql`
          SELECT id, title, deadline_type, description, due_date,
                 recurrence, provinces, consequence, action_items,
                 authority, source_url
          FROM compliance_deadlines
          WHERE (${province} = ANY(provinces) OR 'Federal' = ANY(provinces))
            AND deadline_type = ${type}
            AND due_date BETWEEN ${from} AND ${to}
          ORDER BY due_date ASC
        `;
      } else {
        rows = await sql`
          SELECT id, title, deadline_type, description, due_date,
                 recurrence, provinces, consequence, action_items,
                 authority, source_url
          FROM compliance_deadlines
          WHERE (${province} = ANY(provinces) OR 'Federal' = ANY(provinces))
            AND deadline_type = ${type}
          ORDER BY due_date ASC
        `;
      }
    } else {
      if (from && to) {
        rows = await sql`
          SELECT id, title, deadline_type, description, due_date,
                 recurrence, provinces, consequence, action_items,
                 authority, source_url
          FROM compliance_deadlines
          WHERE (${province} = ANY(provinces) OR 'Federal' = ANY(provinces))
            AND due_date BETWEEN ${from} AND ${to}
          ORDER BY due_date ASC
        `;
      } else {
        rows = await sql`
          SELECT id, title, deadline_type, description, due_date,
                 recurrence, provinces, consequence, action_items,
                 authority, source_url
          FROM compliance_deadlines
          WHERE (${province} = ANY(provinces) OR 'Federal' = ANY(provinces))
          ORDER BY due_date ASC
        `;
      }
    }

    return NextResponse.json({ deadlines: rows.rows });
  } catch (error) {
    console.error("[COMPLIANCE_CALENDAR] Error:", error);
    return NextResponse.json({ error: "Failed to fetch compliance deadlines" }, { status: 500 });
  }
}
