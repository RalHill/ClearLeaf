import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { sql } from "@vercel/postgres";

async function check() {
  const r = await sql`
    SELECT kc.id, kc.article_number, kc.section_title, ks.id as source_id, ks.title as source_title
    FROM knowledge_chunks kc
    JOIN knowledge_sources ks ON ks.id = kc.source_id
    WHERE kc.province = 'ON'
    ORDER BY kc.id
  `;
  console.log("ON chunks and their sources:");
  r.rows.forEach((row) =>
    console.log(`  chunk ${row.id} | ${row.article_number} → source ${row.source_id}: "${row.source_title}"`)
  );
}
check().catch(console.error);
