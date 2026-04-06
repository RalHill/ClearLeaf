import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { sql } from "@vercel/postgres";

config({ path: resolve(process.cwd(), ".env.local") });

const migrations = [
  "supabase/migrations/001_knowledge_base.sql",
  "supabase/migrations/002_chat_messages.sql",
  "supabase/migrations/003_news_feed.sql",
  "supabase/migrations/004_policy_templates.sql",
  "supabase/migrations/005_feedback.sql",
  "supabase/migrations/006_functions.sql",
  "supabase/migrations/007_remove_policy_templates.sql",
  "supabase/migrations/008_compliance_calendar.sql",
];

async function runMigrations() {
  for (const file of migrations) {
    try {
      const content = readFileSync(resolve(process.cwd(), file), "utf-8");
      console.log(`\n⏳ Running: ${file}`);
      await sql.query(content);
      console.log(`✅ ${file} completed`);
    } catch (e) {
      console.error(`❌ ${file} failed:`, (e as Error).message);
      process.exit(1);
    }
  }
  console.log("\n✅ All migrations completed successfully!");
  process.exit(0);
}

runMigrations();
