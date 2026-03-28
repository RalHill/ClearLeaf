import { NextRequest, NextResponse } from "next/server";
import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";
import { z } from "zod";
import { selectModel, OPENROUTER_BASE } from "@/lib/ai/chat";
import { createSystemPrompt } from "@/lib/ai/prompts";
import { getSessionUser, getMonthlyQueryCount } from "@/lib/db/server";

const FREE_PLAN_LIMIT = 5;

const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  province: z.string().length(2).default("ON"),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, province, conversationHistory } = chatRequestSchema.parse(body);

    const isDemoMode = !process.env.OPENROUTER_API_KEY;

    // ── Auth check (skip in demo mode) ──────────────────────────────────────
    let userId: string | null = null;
    if (!isDemoMode) {
      const user = await getSessionUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = user.id;

      // Rate-limit free users
      const monthlyCount = await getMonthlyQueryCount(userId);
      if (monthlyCount >= FREE_PLAN_LIMIT) {
        return NextResponse.json(
          {
            error: "quota_exceeded",
            message: `You've used all ${FREE_PLAN_LIMIT} free queries this month. Upgrade to Starter for unlimited access.`,
          },
          { status: 429 }
        );
      }
    }

    // ── Demo mode fallback ───────────────────────────────────────────────────
    if (isDemoMode) {
      const demos: Record<string, { answer: string; source: string; confidence: "high" | "medium" | "low" }> = {
        terminate: {
          answer:
            "Yes, you can terminate an employee without cause at any time. Under the Ontario ESA, you must provide 2 weeks' written notice or 2 weeks' severance pay. Common law exposure is typically much greater — courts award roughly 1 month per year of service.",
          source: "Ontario ESA, s.57; Honda Canada v. Keays, 2008 SCC 39",
          confidence: "high",
        },
        harassment: {
          answer:
            "Under Ontario's OHSA (Bill 132), workplace harassment means vexatious conduct against a worker in a workplace that is known or ought reasonably to be known to be unwelcome. You must investigate any allegation promptly. Documentation and timeliness are critical.",
          source: "OHSA s.32(6); O. Reg. 1051/20",
          confidence: "high",
        },
        parental: {
          answer:
            "To qualify for parental leave in Ontario, an employee must have completed at least 13 consecutive weeks of employment. Parental leave can be up to 61 weeks (63 if the employee did not take pregnancy leave).",
          source: "ESA 2000, s.46-49",
          confidence: "high",
        },
        probation: {
          answer:
            "Even during probation, employees in Ontario retain ESA minimum protections. You cannot waive notice requirements via a probation clause. Reasonable notice during probation is typically 1-2 weeks depending on length of service.",
          source: "ESA 2000, s.2(1); common law",
          confidence: "medium",
        },
        overtime: {
          answer:
            "In Ontario, employees are entitled to overtime pay at 1.5× their regular rate for hours worked over 44 in a work week. Some employees are exempt (managers, IT professionals meeting salary thresholds). Check the specific exemptions in O. Reg. 285/01.",
          source: "ESA 2000, s.22; O. Reg. 285/01",
          confidence: "high",
        },
      };

      const lc = message.toLowerCase();
      let pick = demos.terminate;
      if (lc.includes("harass")) pick = demos.harassment;
      else if (lc.includes("parental") || lc.includes("maternity") || lc.includes("leave")) pick = demos.parental;
      else if (lc.includes("probation")) pick = demos.probation;
      else if (lc.includes("overtime")) pick = demos.overtime;

      return NextResponse.json({
        message: pick.answer,
        sources: [
          {
            title: pick.source.split(";")[0].trim(),
            section: pick.source.split(";")[1]?.trim() ?? "",
            article: province,
          },
        ],
        confidence: pick.confidence,
      });
    }

    // ── Real AI mode ─────────────────────────────────────────────────────────
    const model = selectModel({ isDevMode: process.env.NODE_ENV === "development" });
    const systemPrompt = createSystemPrompt(province);

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory,
      { role: "user" as const, content: message },
    ];

    const aiRes = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://clearleaf.ca",
        "X-Title": "ClearLeaf HR Intelligence",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 1200,
        stream: false,
        messages,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("OpenRouter error:", aiRes.status, errText);
      return NextResponse.json(
        { error: "AI service unavailable. Please try again." },
        { status: 502 }
      );
    }

    const aiData = await aiRes.json();
    const rawContent: string = aiData.choices?.[0]?.message?.content ?? "";

    // Extract confidence level from response
    const confidenceMatch = rawContent.match(/CONFIDENCE:\s*(high|medium|low)/i);
    const confidence = (confidenceMatch?.[1]?.toLowerCase() ?? "medium") as "high" | "medium" | "low";

    // Strip the CONFIDENCE line from the displayed message
    const cleanMessage = rawContent.replace(/\n?CONFIDENCE:\s*(high|medium|low)\s*$/i, "").trim();

    // Persist to Neon (non-blocking)
    if (userId) {
      Promise.all([
        sql`
          INSERT INTO chat_messages (user_id, role, content, province, confidence_level)
          VALUES (${userId}, 'user', ${message}, ${province}, NULL)
        `,
        sql`
          INSERT INTO chat_messages (user_id, role, content, province, confidence_level)
          VALUES (${userId}, 'assistant', ${cleanMessage}, ${province}, ${confidence})
        `,
        sql`
          INSERT INTO usage_records (user_id, action_type, province)
          VALUES (${userId}, 'chat_query', ${province})
        `,
      ]).catch((err) => console.error("DB persist error:", err));
    }

    return NextResponse.json({
      message: cleanMessage,
      sources: [],
      confidence,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Chat endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
