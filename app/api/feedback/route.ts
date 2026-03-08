import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser } from "@/lib/supabase/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

/**
 * POST /api/feedback
 * 
 * User feedback on chat responses
 * - User tags incorrect/outdated/wrong-province responses
 * - Triggers knowledge base review
 * - Helps identify accuracy issues
 * 
 * Status: Ready to implement (no external API required)
 */

const feedbackSchema = z.object({
  messageId: z.number(),
  feedbackType: z.enum(["inaccurate_law", "wrong_province", "outdated", "other"]),
  province: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getSupabaseUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messageId, feedbackType, province, notes } = feedbackSchema.parse(body);

    const supabase = await createSupabaseServerClient();

    // Insert feedback record
    const { error } = await supabase.from("feedback").insert({
      user_id: user.id,
      chat_message_id: messageId,
      feedback_type: feedbackType,
      province,
      notes,
    });

    if (error) {
      console.error("Feedback insert error:", error);
      return NextResponse.json(
        { error: "Failed to record feedback" },
        { status: 500 }
      );
    }

    // TODO: Trigger alert if feedback volume exceeds threshold
    // e.g., if same province + topic gets 3+ feedback in 7 days

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
