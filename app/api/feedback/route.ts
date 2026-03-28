import { NextRequest, NextResponse } from "next/server";
import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";
import { getSessionUser } from "@/lib/db/server";
import { z } from "zod";

const feedbackSchema = z.object({
  messageId: z.number().optional(),
  feedbackType: z.enum([
    "helpful",
    "not_helpful",
    "inaccurate_law",
    "wrong_province",
    "outdated",
    "other",
  ]),
  province: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messageId, feedbackType, province, notes } = feedbackSchema.parse(body);
    const chatMessageId = messageId ?? null;

    try {
      await sql`
        INSERT INTO feedback (user_id, chat_message_id, feedback_type, province, notes)
        VALUES (${user.id}, ${chatMessageId}, ${feedbackType}, ${province ?? null}, ${notes ?? null})
      `;
    } catch (err) {
      console.error("Feedback insert error:", err);
      return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
