import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, getSupabaseUser, getUserPlan } from "@/lib/supabase/server";
import { selectModel } from "@/lib/ai/chat";
import { buildComplianceSystemPrompt } from "@/lib/ai/prompts";
import { ComplianceCheckResult } from "@/lib/types/compliance";

// Lazy load embedding generation to avoid build-time API key requirement
async function generateComplianceEmbedding(text: string): Promise<number[]> {
  const { generateEmbedding } = await import("@/lib/ai/embeddings");
  return generateEmbedding(text);
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSupabaseUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    const plan = await getUserPlan(user.id);

    if (plan === "free") {
      return NextResponse.json({
        error: "plan_required",
        message: "Policy Compliance Checker is available on Starter and above."
      }, { status: 403 });
    }

    const { documentText, fileName, province, policyType } = await request.json();
    if (!documentText || !province || !policyType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Retrieve top 10 statute chunks — more than chat (full coverage needed)
    const queryText = `${policyType} requirements ${province} employment law`;
    const embedding = await generateComplianceEmbedding(queryText);
    
    const { data: chunks } = await supabase.rpc("match_knowledge_chunks", {
      query_embedding: embedding,
      filter_province: province,
      match_threshold: 0.40,
      match_count: 10,
    });

    const knowledgeContext = (chunks ?? [])
      .map((c: any) => `[${c.source_title} — ${c.section_title}]\n${c.content}`)
      .join("\n\n");

    const systemPrompt = buildComplianceSystemPrompt(province, policyType, knowledgeContext);
    const model = selectModel({ 
      isDevMode: process.env.NODE_ENV === "development", 
      requiresEscalation: false 
    });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL!,
        "X-Title": "ClearLeaf Compliance Check",
      },
      body: JSON.stringify({
        model,
        temperature: 0.05,
        max_tokens: 2000,
        stream: false,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `DOCUMENT: ${fileName}\n\n${documentText}` },
        ],
      }),
    });

    const aiResponse = await response.json();
    const rawText = aiResponse.choices[0].message.content;

    let result: ComplianceCheckResult;
    try {
      result = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    } catch {
      return NextResponse.json({
        error: "parse_failed",
        message: "Analysis could not be completed. Please try again.",
      }, { status: 500 });
    }

    // Log to usage_records
    await supabase.from("usage_records").insert({
      user_id: user.id,
      action_type: "compliance_check",
      details: { province, policyType, fileName },
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Compliance check error:", error);
    return NextResponse.json({
      error: "internal_error",
      message: "An error occurred during analysis. Please try again.",
    }, { status: 500 });
  }
}
