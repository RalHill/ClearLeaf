import { NextRequest, NextResponse } from "next/server";
import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";
import { selectModel, OPENROUTER_BASE } from "@/lib/ai/chat";
import { buildComplianceSystemPrompt } from "@/lib/ai/prompts";
import { ComplianceCheckResult } from "@/lib/types/compliance";

/**
 * Retrieve relevant statute chunks using Postgres full-text search.
 * Works without an OpenAI key — no vector embeddings required.
 */
async function getRelevantChunks(
  policyType: string,
  province: string
): Promise<Array<{ content: string; source_title: string; section_title: string | null }>> {
  // Build search query from policyType words
  const searchTerms = policyType
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .join(" | ");

  try {
    const result = await sql`
      SELECT
        kc.content,
        ks.title AS source_title,
        kc.section_title
      FROM knowledge_chunks kc
      JOIN knowledge_sources ks ON kc.source_id = ks.id
      WHERE (
        kc.province = ${province}
        OR kc.province = 'All'
        OR kc.province = 'Federal'
      )
      AND (
        kc.search_vector @@ to_tsquery('english', ${searchTerms})
        OR kc.topic_tags && ARRAY[${policyType.toLowerCase()}]::text[]
        OR kc.content ILIKE ${'%' + policyType + '%'}
      )
      ORDER BY
        CASE WHEN kc.province = ${province} THEN 0
             WHEN kc.province = 'All' THEN 1
             ELSE 2 END,
        ts_rank(kc.search_vector, to_tsquery('english', ${searchTerms})) DESC
      LIMIT 12
    `;
    return result.rows as Array<{ content: string; source_title: string; section_title: string | null }>;
  } catch {
    // Fallback: simple ILIKE search if full-text index isn't ready
    const result = await sql`
      SELECT
        kc.content,
        ks.title AS source_title,
        kc.section_title
      FROM knowledge_chunks kc
      JOIN knowledge_sources ks ON kc.source_id = ks.id
      WHERE (
        kc.province = ${province}
        OR kc.province = 'All'
        OR kc.province = 'Federal'
      )
      ORDER BY
        CASE WHEN kc.province = ${province} THEN 0 ELSE 1 END
      LIMIT 12
    `;
    return result.rows as Array<{ content: string; source_title: string; section_title: string | null }>;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth removed for testing — all features unlocked
    const { documentText, fileName, province, policyType } = await request.json();
    if (!documentText || !province || !policyType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Retrieve relevant statute chunks via full-text search
    const chunks = await getRelevantChunks(policyType, province);

    const knowledgeContext =
      chunks.length > 0
        ? chunks
            .map((c) => `[${c.source_title} — ${c.section_title}]\n${c.content}`)
            .join("\n\n")
        : `No specific statute chunks found for ${policyType} in ${province}. Apply general Canadian employment law standards.`;

    const systemPrompt = buildComplianceSystemPrompt(province, policyType, knowledgeContext);
    const model = selectModel({ });

    const aiRes = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://clearleaf.ca",
        "X-Title": "ClearLeaf Compliance Check",
      },
      body: JSON.stringify({
        model,
        temperature: 0.05,
        max_tokens: 2500,
        stream: false,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `DOCUMENT: ${fileName}\n\n${documentText.substring(0, 30000)}`,
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("OpenRouter compliance error:", aiRes.status, errText);
      return NextResponse.json(
        { error: "AI service unavailable. Please try again." },
        { status: 502 }
      );
    }

    const aiData = await aiRes.json();
    const rawText: string = aiData.choices?.[0]?.message?.content ?? "";

    let result: ComplianceCheckResult;
    try {
      const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed, raw:", rawText.substring(0, 500));
      return NextResponse.json(
        {
          error: "parse_failed",
          message: "Analysis could not be completed. Please try again.",
        },
        { status: 500 }
      );
    }

    // Usage logging skipped (no auth)

    return NextResponse.json(result);
  } catch (error) {
    console.error("Compliance check error:", error);
    return NextResponse.json(
      {
        error: "internal_error",
        message: "An error occurred during analysis. Please try again.",
      },
      { status: 500 }
    );
  }
}
