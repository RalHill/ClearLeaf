import * as dotenv from "dotenv";
import path from "path";

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { sql } from "@vercel/postgres";

async function checkKnowledgeBase() {
  try {
    console.log("Environment check:");
    console.log(`  POSTGRES_URL set: ${!!process.env.POSTGRES_URL}`);
    
    const result = await sql`SELECT COUNT(*) as count FROM knowledge_chunks`;
    const count = result.rows[0]?.count || 0;
    console.log(`✓ Knowledge chunks in database: ${count}`);
    
    if (count === 0) {
      console.warn("⚠ Knowledge base is EMPTY! Need to seed the database.");
      return;
    }

    // Check by province
    const provinceResult = await sql`
      SELECT province, COUNT(*) as count FROM knowledge_chunks GROUP BY province ORDER BY province
    `;
    
    console.log("\nChunks by province:");
    provinceResult.rows.forEach((row) => {
      console.log(`  ${row.province}: ${row.count} chunks`);
    });
  } catch (error) {
    console.error("Error checking knowledge base:", error);
  }
}

checkKnowledgeBase();
