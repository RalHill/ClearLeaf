import { NextRequest, NextResponse } from "next/server";
import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";
import { z } from "zod";
import { selectModel, OPENROUTER_BASE } from "@/lib/ai/chat";
import { createSystemPrompt } from "@/lib/ai/prompts";
import { extractAndValidateInput, formatExtractedInputAsContext } from "@/lib/ai/input-extractor";
import { retrieveWithFallback, formatChunksAsContext } from "@/lib/ai/retrieval";

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

    // Auth removed for testing — no rate limiting, no user required
    const userId: string | null = null;

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

    // ── Step 1: Extract & validate input facts ───────────────────────────────
    const extractedInput = extractAndValidateInput(message);
    const effectiveProvince = extractedInput.province || province;

    // Return early with warning if critical tenure info missing for termination questions
    if (
      !extractedInput.tenure &&
      (message.toLowerCase().includes("terminate") ||
        message.toLowerCase().includes("fire") ||
        message.toLowerCase().includes("severance") ||
        message.toLowerCase().includes("laid off"))
    ) {
      return NextResponse.json({
        error: "missing_context",
        message: "I need to know: How long has the employee worked for you? This is critical for calculating notice periods and severance eligibility.",
        warnings: extractedInput.warnings,
        extractedInput: {
          tenure: extractedInput.tenure,
          employerSize: extractedInput.employerSize,
          province: effectiveProvince,
          topic: extractedInput.topic,
          confidence: extractedInput.confidence,
        },
      }, { status: 400 });
    }

    // ── Step 2: Retrieve with fallback & quality check ──────────────────────
    const { chunks, confidence: retrievalConfidence, warning: retrievalWarning, matchedCount } =
      await retrieveWithFallback(message, effectiveProvince, 0.3);

    // If retrieval returned 0 results, provide fallback message
    if (matchedCount === 0) {
      return NextResponse.json({
        message:
          "I don't have verified statute text for this in my knowledge base. This could mean:\n1. Your situation involves an uncommon fact pattern\n2. The rule varies significantly by province\n3. It requires specialized legal expertise\n\nPlease consult with a Canadian employment lawyer for your specific situation.",
        confidence: "low",
        sources: [],
        warning: retrievalWarning,
        extractedInput: {
          tenure: extractedInput.tenure,
          employerSize: extractedInput.employerSize,
          province: effectiveProvince,
          topic: extractedInput.topic,
          confidence: extractedInput.confidence,
        },
      });
    }

    // ── Step 3: Build enhanced system prompt with context injection ──────────
    const contextStr = formatChunksAsContext(chunks);
    const inputContext = formatExtractedInputAsContext(extractedInput);
    
    const enhancedContext = `
KNOWLEDGE BASE CONTEXT (verified statutes):
${contextStr}

${inputContext}
`;

    const systemPrompt = createSystemPrompt(effectiveProvince, enhancedContext);

    // ── Step 4: Call OpenRouter with guardrailed prompt ─────────────────────
    const model = selectModel({ isDevMode: process.env.NODE_ENV === "development" });

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
        temperature: 0.1, // Lower temp for legal precision
        max_tokens: 1500,
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
          VALUES (${userId}, 'user', ${message}, ${effectiveProvince}, NULL)
        `,
        sql`
          INSERT INTO chat_messages (user_id, role, content, province, confidence_level)
          VALUES (${userId}, 'assistant', ${cleanMessage}, ${effectiveProvince}, ${confidence})
        `,
        sql`
          INSERT INTO usage_records (user_id, action_type, province)
          VALUES (${userId}, 'chat_query', ${effectiveProvince})
        `,
      ]).catch((err) => console.error("DB persist error:", err));
    }

    return NextResponse.json({
      message: cleanMessage,
      sources: chunks.map((c) => ({
        title: c.source_title,
        section: c.article_number || "General",
        province: c.province,
        relevance: c.similarity,
      })),
      confidence,
      extractedInput: {
        tenure: extractedInput.tenure,
        employerSize: extractedInput.employerSize,
        province: effectiveProvince,
        topic: extractedInput.topic,
        confidence: extractedInput.confidence,
      },
      retrievalInfo: {
        matchedChunks: matchedCount,
        retrievalConfidence,
        warning: retrievalWarning,
      },
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
