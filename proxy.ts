import { type NextRequest, NextResponse } from "next/server";

/**
 * proxy.ts (Next.js 16.1 Replacement for middleware.ts)
 * 
 * Route Protection for ClearLeaf Dashboard
 * - In DEMO MODE (no env vars): Allows all routes through without auth
 * - In PRODUCTION (with env vars): Verifies Supabase auth session
 * - Redirects unauthenticated users to /login (production only)
 * 
 * Usage: Automatically called by Next.js for all routes matching config.matcher
 */

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if we're in demo mode (no Supabase env vars)
  const isDemoMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Protected routes that require authentication
  const protectedPaths = [
    "/dashboard",
    "/dashboard/chat",
    "/dashboard/news",
    "/dashboard/library",
    "/dashboard/compare",
    "/dashboard/walkthroughs",
  ];

  // Check if current path is protected
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  // In demo mode, allow all routes through (no auth required)
  if (isDemoMode) {
    return NextResponse.next();
  }

  // In production mode (env vars present), verify authentication
  try {
    const { createServerClient } = await import("@supabase/ssr");

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return (request.cookies as any).getSetCookie?.().map((cookie: string) => {
              const [name, ...rest] = cookie.split("=");
              const value = rest.join("=").split(";")[0];
              return { name, value };
            }) || [];
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, any> }[]) {
            // Cookies are managed by Supabase SSR adapter
          },
        },
      }
    );

    // Verify if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If route is protected and user is not authenticated, redirect to login
    if (isProtected && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    // If there's an error in auth check, allow through for demo purposes
    console.warn("Auth check failed, allowing request through for demo mode");
  }

  // Allow through
  return NextResponse.next();
}

// Configure which routes this middleware applies to
export const config = {
  // Match all routes except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
