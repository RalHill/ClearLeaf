# Neon database setup (ClearLeaf)

1. Create a project at https://console.neon.tech (PostgreSQL 16 recommended).
2. Create or select database (e.g. `clearleaf`).
3. Copy the **pooled** connection string and set `POSTGRES_URL` or `DATABASE_URL` in `.env.local` (see `.env.local.example`).

## Run migrations (order)

Apply these in Neon's SQL Editor or via `psql` in order:

1. `supabase/migrations/001_knowledge_base.sql`
2. `supabase/migrations/002_chat_messages.sql`
3. `supabase/migrations/003_news_feed.sql`
4. `supabase/migrations/004_policy_templates.sql`
5. `supabase/migrations/005_feedback.sql`
6. `supabase/migrations/006_functions.sql`
7. `supabase/migrations/007_remove_policy_templates.sql`

Verify tables: `\dt` in `psql`.

## Auth dev user (email + password)

After `AUTH_SECRET` / `NEXTAUTH_SECRET` and `POSTGRES_URL` are set in `.env.local`:

```bash
npx tsx scripts/seed-dev-user.ts you@company.ca "your-password"
```

Then sign in at `/login`.

## Legacy Supabase

If you had an existing Supabase database with the old `auth.users` foreign keys, you must **migrate data manually** or start fresh on Neon. This repo's migrations are now **Neon-first** (no `auth.users`).
