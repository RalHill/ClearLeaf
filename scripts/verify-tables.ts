import { config } from "dotenv";
import { resolve } from "path";
import { sql } from "@vercel/postgres";

config({ path: resolve(process.cwd(), ".env.local") });

async function verifyTables() {
  try {
    const result = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    console.log("✅ Tables in Neon database:");
    result.rows.forEach((row: any) => {
      console.log(`   - ${row.table_name}`);
    });
    process.exit(0);
  } catch (e) {
    console.error("❌ Failed to verify tables:", (e as Error).message);
    process.exit(1);
  }
}

verifyTables();
