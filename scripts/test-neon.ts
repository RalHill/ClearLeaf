import { config } from "dotenv";
import { resolve } from "path";
import { sql } from "@vercel/postgres";

config({ path: resolve(process.cwd(), ".env.local") });

async function testConnection() {
  console.log("POSTGRES_URL set:", !!process.env.POSTGRES_URL);
  try {
    const result = await sql`SELECT NOW()`;
    console.log("✅ Connection OK:", result.rows[0]);
    process.exit(0);
  } catch (e) {
    console.error("❌ Connection failed:", (e as Error).message);
    process.exit(1);
  }
}

testConnection();
