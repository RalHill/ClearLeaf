import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Edge-safe auth gate for /dashboard routes.
 * Demo mode: if AUTH_SECRET is not set, allow dashboard without login.
 */
export async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  // No secret = demo mode, allow all
  if (!secret?.length) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret });

  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
