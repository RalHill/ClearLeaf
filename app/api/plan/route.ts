import { NextResponse } from "next/server";

/** Auth removed for testing — returns professional plan so all features are unlocked. */
export async function GET() {
  return NextResponse.json({
    plan: "professional",
    queriesUsed: 0,
    queriesLimit: -1,
    name: "Demo User",
    email: "demo@clearleaf.ca",
  });
}
