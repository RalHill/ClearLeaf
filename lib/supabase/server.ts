import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, any> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getSupabaseUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserPlan(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("id", userId)
    .single();

  if (!data?.org_id) return "free";

  const { data: org } = await supabase
    .from("organizations")
    .select("plan")
    .eq("id", data.org_id)
    .single();

  return org?.plan || "free";
}

export async function getMonthlyQueryCount(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("usage_records")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("action_type", "chat_query")
    .gte(
      "created_at",
      new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    );

  return count || 0;
}
