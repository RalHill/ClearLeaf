import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { sql } from "@vercel/postgres";

async function fix() {
  // Create a proper OHSA source entry
  const insert = await sql`
    INSERT INTO knowledge_sources (title, province, source_type, version, last_verified)
    VALUES (
      'Ontario Occupational Health and Safety Act (OHSA)',
      'ON',
      'statute',
      '2024',
      NOW()
    )
    ON CONFLICT DO NOTHING
    RETURNING id
  `;

  let ohsaSourceId: number;
  if (insert.rows.length > 0) {
    ohsaSourceId = insert.rows[0].id;
    console.log(`Created OHSA source (id=${ohsaSourceId})`);
  } else {
    const existing = await sql`
      SELECT id FROM knowledge_sources
      WHERE title = 'Ontario Occupational Health and Safety Act (OHSA)'
    `;
    ohsaSourceId = existing.rows[0].id;
    console.log(`OHSA source already exists (id=${ohsaSourceId})`);
  }

  // Relink the harassment chunk to the OHSA source
  const update = await sql`
    UPDATE knowledge_chunks
    SET source_id = ${ohsaSourceId}
    WHERE province = 'ON'
      AND article_number = 'OHSA s.1, s.32.0.1–32.0.8'
  `;
  console.log(`Relinked ${update.rowCount} harassment chunk(s) to OHSA source`);

  // Verify
  const check = await sql`
    SELECT kc.article_number, ks.title as source_title
    FROM knowledge_chunks kc
    JOIN knowledge_sources ks ON ks.id = kc.source_id
    WHERE kc.province = 'ON' AND kc.article_number LIKE '%OHSA%'
  `;
  console.log("Verification:", check.rows[0]);
}

fix().catch(console.error);
