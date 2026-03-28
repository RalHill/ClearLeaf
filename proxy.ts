import { NextResponse } from "next/server";
/**
 * Auth gate disabled — all routes pass through for testing.
 */
export async function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
