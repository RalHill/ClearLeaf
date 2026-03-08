// lib/types/compliance.ts
export interface ComplianceCheckResult {
  province: string;
  policyType: string;
  analyzedAt: string;        // ISO timestamp
  overallRisk: "low" | "medium" | "high";
  summary: string;           // 2-3 sentence plain-English overview
  compliantClauses: CompliantClause[];
  gaps: GapFinding[];
  recommendations: Recommendation[];
  error?: string;
  message?: string;
}

export interface CompliantClause {
  clauseQuote: string;
  requirement: string;
  statuteCitation: string;
}

export interface GapFinding {
  clauseQuote: string;       // Verbatim from uploaded document
  issue: string;             // Plain English description of the gap
  statuteCitation: string;   // e.g. "Ontario ESA 2000, s.57(1)"
  severity: "critical" | "moderate" | "minor";
  legalRisk: string;         // e.g. "Exposes employer to HRTO complaint"
}

export interface Recommendation {
  forGap: string;            // Matches a clauseQuote from gaps array
  replacementText: string;   // Exact replacement clause language
  rationale: string;         // Why this wording meets the standard
}

export interface ParsedDocument {
  text: string;
  fileName: string;
  fileType: "pdf" | "docx" | "txt" | "doc";
  charCount: number;
  truncated: boolean;
  isScanned: boolean;
}
