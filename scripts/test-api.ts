/**
 * End-to-end API test — hits the live /api/chat endpoint
 * Run while dev server is running on localhost:3000
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BASE = "http://localhost:3000";

interface ChatResult {
  message?: string;
  confidence?: string;
  sources?: Array<{ title: string; section: string; province: string }>;
  error?: string;
  extractedInput?: { tenure?: number; province?: string; topic?: string };
}

async function ask(label: string, message: string, province = "ON", history: Array<{role: string; content: string}> = []) {
  console.log(`\n${"─".repeat(70)}`);
  console.log(`TEST: ${label}`);
  console.log(`Q: "${message}"`);

  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, province, conversationHistory: history }),
  });

  const data: ChatResult = await res.json();

  if (data.error) {
    console.log(`❌ ERROR (${res.status}): ${data.error}`);
    return data;
  }

  console.log(`✓ Status: ${res.status}`);
  console.log(`✓ Confidence: ${data.confidence}`);
  console.log(`✓ Tenure extracted: ${data.extractedInput?.tenure ?? "none"}`);
  console.log(`✓ Topic: ${data.extractedInput?.topic}`);
  console.log(`✓ Sources: ${data.sources?.map(s => s.title).join(", ") || "none"}`);

  // Check CONFIDENCE not leaking into message
  const hasConfidenceLeak = data.message?.toUpperCase().includes("CONFIDENCE:");
  console.log(`✓ CONFIDENCE stripped: ${hasConfidenceLeak ? "❌ STILL IN MESSAGE" : "✅ clean"}`);

  // Print first 300 chars of response
  console.log(`\nResponse preview:\n${data.message?.slice(0, 400)}...`);

  return data;
}

async function runTests() {
  console.log("ClearLeaf API End-to-End Tests\n");

  // Test 1: Core termination question — the original failing case
  await ask(
    "Termination notice — 3-year employee Ontario",
    "I have a 3-year employee in Ontario. What's the notice period if I terminate without cause?"
  );

  // Test 2: Harassment — check source shows OHSA not ESA
  const harassResult = await ask(
    "Harassment complaint process Ontario",
    "What's the process for a harassment complaint in Ontario?"
  );
  const correctSource = harassResult.sources?.some(s => s.title.includes("OHSA") || s.title.includes("Occupational"));
  console.log(`✓ Source is OHSA (not ESA): ${correctSource ? "✅" : "❌ still showing ESA"}`);

  // Test 3: Follow-up "3 years" after being asked tenure
  const history = [
    { role: "user", content: "What's the notice period if I terminate without cause?" },
    { role: "assistant", content: "I need to know: How long has the employee worked for you?" },
  ];
  await ask(
    "Follow-up tenure answer",
    "3 years",
    "ON",
    history
  );

  // Test 4: BC severance
  await ask(
    "BC termination — 5 years",
    "I have an employee who has worked for 5 years. What notice do I owe them?",
    "BC"
  );

  // Test 5: Out-of-scope question
  await ask(
    "Out-of-scope refusal",
    "Who won the Super Bowl?",
    "ON"
  );

  console.log(`\n${"═".repeat(70)}`);
  console.log("Tests complete.");
}

runTests().catch(console.error);
