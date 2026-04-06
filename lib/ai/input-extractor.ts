/**
 * Input Extractor — extracts structured facts from user chat messages
 * Validates tenure, employer size, province, and topic for guardrails + context injection
 */

export interface ExtractedInput {
  tenure?: number; // years of service
  employerSize?: number; // payroll in millions
  province: string | undefined; // 2-letter code — undefined if not mentioned in message
  topic: string; // domain (termination, harassment, leave, overtime, etc.)
  confidence: "high" | "medium" | "low";
  warnings: string[]; // e.g., "Tenure not specified - assuming general info"
}

// Province name to code mapping
const provinceMap: Record<string, string> = {
  ontario: "ON",
  "on": "ON",
  "british columbia": "BC",
  "bc": "BC",
  alberta: "AB",
  "ab": "AB",
  quebec: "QC",
  "qc": "QC",
  manitoba: "MB",
  "mb": "MB",
  saskatchewan: "SK",
  "sk": "SK",
  "nova scotia": "NS",
  "ns": "NS",
  "new brunswick": "NB",
  "nb": "NB",
  "prince edward island": "PE",
  "pe": "PE",
  "newfoundland": "NL",
  "nl": "NL",
  "nwt": "NT",
  "northwest territories": "NT",
  yukon: "YT",
  "yt": "YT",
  nunavut: "NU",
  "nu": "NU",
  federal: "CA",
  canada: "CA",
  "ca": "CA",
};

// Topic keywords for classification
const topicKeywords: Record<string, string[]> = {
  termination: [
    "fire",
    "terminate",
    "termination",
    "laid off",
    "layoff",
    "dismissed",
    "dismissal",
    "let go",
    "severance",
    "notice",
    "without cause",
    "with cause",
    "just cause",
    "unjust dismissal",
  ],
  harassment: [
    "harassment",
    "bully",
    "bullying",
    "hostile",
    "hostile work",
    "discrimination",
    "discriminate",
    "abuse",
  ],
  leave: [
    "leave",
    "maternity",
    "parental",
    "sick leave",
    "personal leave",
    "bereavement",
    "compassionate",
    "time off",
  ],
  overtime: [
    "overtime",
    "overtime pay",
    "ot",
    "hours",
    "work hours",
    "shift",
    "paid",
    "compensation",
  ],
  wage: [
    "wage",
    "minimum wage",
    "salary",
    "pay",
    "compensation",
    "minimum",
    "rate",
    "hourly",
  ],
  accommodation: [
    "accommodation",
    "accommodate",
    "disability",
    "medical",
    "duty to accommodate",
    "human rights",
  ],
};

export function extractAndValidateInput(message: string): ExtractedInput {
  const lowerMessage = message.toLowerCase();
  const warnings: string[] = [];

  // Extract tenure (years of service)
  let tenure: number | undefined;
  const tenureMatch =
    // "3-year employee", "3 year employee", "3 years of service/employment/experience"
    lowerMessage.match(
      /(\d+)\s*[-]?\s*(?:year|yr)s?\s*(?:of\s*)?(?:service|tenure|employment|experience|employee)/i
    ) ||
    // "for 3 years", "over 3 years", "past 3 years", "about 3 years"
    lowerMessage.match(
      /(?:for|past|over|about|approximately)\s+(\d+)\s*(?:year|yr)s?/i
    ) ||
    // standalone "3 years" or "3 yrs" as the whole (or near-whole) message — follow-up answers
    lowerMessage.match(/^(\d+)\s*(?:year|yr)s?\.?$/);
  if (tenureMatch) {
    tenure = parseInt(tenureMatch[1], 10);
  }

  if (!tenure) {
    warnings.push("Tenure not specified - please clarify length of service");
  }

  // Extract employer payroll / size
  let employerSize: number | undefined;
  const payrollMatch = lowerMessage.match(
    /(?:payroll|revenue|annual\s+revenue)\s*(?:of\s*)?(?:\$)?\s*(\d+(?:\.\d+)?)\s*(?:m|million|k|thousand|b|billion)?/i
  );
  if (payrollMatch) {
    let size = parseFloat(payrollMatch[1]);
    const unitMatch = payrollMatch[0].match(/([mkb])/i);
    if (unitMatch) {
      const unit = unitMatch[1].toLowerCase();
      if (unit === "k") size = size / 1000;
      if (unit === "b") size = size * 1000;
    }
    employerSize = Math.round(size * 100) / 100; // 2 decimals
  }

  if (!employerSize) {
    warnings.push(
      "Employer size not specified - assuming small employer (<$2.5M payroll)"
    );
  }

  // Extract province — only set if explicitly mentioned in the message.
  // If not found, return undefined so the caller uses the UI-selected province.
  let province: string | undefined;
  let provinceFound = false;

  for (const [provName, provCode] of Object.entries(provinceMap)) {
    if (lowerMessage.includes(provName)) {
      province = provCode;
      provinceFound = true;
      break;
    }
  }

  if (!provinceFound) {
    warnings.push("Province not specified - using selected jurisdiction");
  }

  // Extract topic/domain
  let topic = "general";
  let topicConfidence = 0;

  for (const [topicName, keywords] of Object.entries(topicKeywords)) {
    const matches = keywords.filter((kw) => lowerMessage.includes(kw)).length;
    if (matches > topicConfidence) {
      topic = topicName;
      topicConfidence = matches;
    }
  }

  // Determine overall confidence
  let confidence: "high" | "medium" | "low" = "medium";

  if (tenure && provinceFound && topicConfidence > 1) {
    confidence = "high";
  } else if (warnings.length > 2) {
    confidence = "low";
  }

  return {
    tenure,
    employerSize,
    province,
    topic,
    confidence,
    warnings,
  };
}

/**
 * Format extracted input as readable context string for system prompt
 */
export function formatExtractedInputAsContext(input: ExtractedInput): string {
  return `
User Context Extracted:
- Employee tenure: ${input.tenure ? `${input.tenure} years` : "not specified"}
- Employer payroll: ${input.employerSize ? `$${input.employerSize}M` : "not specified"}
- Jurisdiction: ${input.province}
- Primary topic: ${input.topic}
- Input extraction confidence: ${input.confidence}
${input.warnings.length > 0 ? `- Warnings: ${input.warnings.join("; ")}` : ""}
`.trim();
}
