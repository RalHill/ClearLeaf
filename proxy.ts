import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js 16+ proxy (replaces middleware.ts). Edge-safe auth gate for /dashboard.
 * Demo mode: no AUTH_SECRET / NEXTAUTH_SECRET — allow dashboard without login.
 */
export async function proxy(request: NextRequest) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret?.length) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret });

  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
