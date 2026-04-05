/**
 * Fix script:
 * 1. Remove duplicate knowledge chunks across all source_ids for same province+article_number
 * 2. Update the Ontario harassment chunk to correctly cite Bill 168 and Bill 132
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { sql } from "@vercel/postgres";

async function fix() {
  // ── Diagnose duplicates ─────────────────────────────────────────────────────
  const dupes = await sql`
    SELECT province, article_number, COUNT(*) as cnt, array_agg(id ORDER BY id) as ids
    FROM knowledge_chunks
    GROUP BY province, article_number
    HAVING COUNT(*) > 1
    ORDER BY province, article_number
    LIMIT 10
  `;
  console.log(`Found ${dupes.rows.length} duplicate groups:`);
  dupes.rows.forEach((r) => console.log(`  ${r.province} | ${r.article_number} | ids: ${r.ids}`));

  // ── 1. Remove duplicates across source_ids ──────────────────────────────────
  // Keep lowest id per (province, article_number)
  const dedup = await sql`
    DELETE FROM knowledge_chunks
    WHERE id NOT IN (
      SELECT MIN(id)
      FROM knowledge_chunks
      GROUP BY province, article_number
    )
  `;
  console.log(`\nRemoved ${dedup.rowCount} duplicate chunks`);

  // ── 2. Fix the Ontario harassment chunk ────────────────────────────────────
  const harassmentContent = `Under the Ontario Occupational Health and Safety Act (OHSA), ss. 32.0.1–32.0.8 (introduced by Bill 168, Occupational Health and Safety Amendment Act, 2009, in force June 15, 2010), employers must: (1) prepare a written workplace harassment policy (s.32.0.2); (2) review it at least annually; (3) develop and maintain a program to implement the policy including investigation procedures (s.32.0.6). Bill 132 (Sexual Violence and Harassment Action Plan Act, 2016, in force September 8, 2016) amended OHSA to strengthen these requirements: investigators must now be "appropriate" — meaning impartial and with relevant training (s.32.0.6(3), as amended by Bill 132); employers must report investigation results in writing to both the complainant and the alleged harasser (s.32.0.7); and sexual harassment is explicitly defined and prohibited (s.1). Workplace harassment means a course of vexatious comment or conduct against a worker that is known or ought reasonably to be known to be unwelcome. Employers cannot retaliate against workers who report harassment (OHSA s.50). Workers may file a complaint with the Ontario Labour Relations Board if the employer fails to investigate.`;

  const updated = await sql`
    UPDATE knowledge_chunks
    SET content = ${harassmentContent}
    WHERE province = 'ON'
      AND article_number = 'OHSA s.1, s.32.0.1–32.0.8'
  `;
  console.log(`Updated ${updated.rowCount} harassment chunk(s)`);

  // ── 3. Verify ───────────────────────────────────────────────────────────────
  const counts = await sql`
    SELECT province, COUNT(*) as chunks
    FROM knowledge_chunks
    GROUP BY province ORDER BY province
  `;
  console.log("\nChunks by province after fix:");
  counts.rows.forEach((r) => console.log(`  ${r.province}: ${r.chunks}`));
}

fix().catch(console.error);
