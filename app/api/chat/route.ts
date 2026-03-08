import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * POST /api/chat
 * 
 * Main chat endpoint for ClearLeaf
 * - In DEMO MODE: Returns mock responses
 * - In PRODUCTION: Uses OpenRouter for real AI responses
 */

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

type ChatRequest = z.infer<typeof chatRequestSchema>;

// Mock responses for demo mode
const MOCK_RESPONSES: { [key: string]: { answer: string; source: string; confidence: "high" | "medium" | "low" } } = {
  "can i terminate": {
    answer:
      "Yes, you can terminate an employee without cause at any time. Under the Ontario ESA, you must provide 2 weeks' written notice or 2 weeks' severance pay. However, your common law exposure is typically much greater—courts usually award 1 month per year of service, so for a 5-year employee that's roughly 5 months of pay plus benefits.",
    source: "Ontario ESA, s.57; Honda Canada v. Keays, 2008 SCC 39",
    confidence: "high",
  },
  "harassment": {
    answer:
      "Under Ontario's OHSA (Bill 132), harassment is defined as workplace conduct that is likely to cause offense or humiliation, or that might be perceived as placing a condition on employment. You must investigate any allegation promptly and take corrective action if harassment is found. Documentation and timeliness are critical.",
    source: "OHSA s.32(6); O. Reg. 1051/20",
    confidence: "high",
  },
  "parental leave": {
    answer:
      "To qualify for parental leave in Ontario, an employee must have: (1) completed 12 consecutive months of employment with the same employer AND (2) worked 1,250 hours in the past 12 months. If they don't meet both criteria, they're not eligible. Part-time employees must have logged the required hours.",
    source: "ESA s.35 (parental leave requirements)",
    confidence: "high",
  },
  "probation": {
    answer:
      "Even during a probation period, employees in Ontario retain statutory minimum ESA protections. You cannot use probation to bypass notice requirements. You must provide 2 weeks' notice or severance. However, reasonable notice during probation is typically much shorter—1-2 weeks instead of months.",
    source: "ESA s.2(1); common law",
    confidence: "medium",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, province } = chatRequestSchema.parse(body);

    // Check if we're in demo mode
    const isDemoMode =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      !process.env.OPENROUTER_API_KEY;

    if (isDemoMode) {
      // DEMO MODE: Return mock response based on keywords
      let mockResponse =
        MOCK_RESPONSES["can i terminate"];

      if (message.toLowerCase().includes("harassment")) {
        mockResponse = MOCK_RESPONSES["harassment"];
      } else if (message.toLowerCase().includes("parental")) {
        mockResponse = MOCK_RESPONSES["parental leave"];
      } else if (message.toLowerCase().includes("probation")) {
        mockResponse = MOCK_RESPONSES["probation"];
      }

      return NextResponse.json({
        message: mockResponse.answer,
        sources: [
          {
            title: mockResponse.source.split(";")[0].trim(),
            section: mockResponse.source.split(";")[1]?.trim() || "",
            article: province,
          },
        ],
        confidence: mockResponse.confidence,
      });
    }

    // PRODUCTION MODE: Call OpenRouter (when API key is provided)
    // TODO: Implement actual API call here
    return NextResponse.json({
      message: "[Production mode - requires API key]",
      sources: [],
      confidence: "medium",
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
