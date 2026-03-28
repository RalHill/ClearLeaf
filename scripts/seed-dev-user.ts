/**
 * One-off: create a dev org + user with email/password (bcrypt) for Credentials login.
 *
 * Usage:
 *   npx tsx scripts/seed-dev-user.ts you@example.com your-password
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
if (!process.env.POSTGRES_URL && process.env.DATABASE_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  if (!email || !password) {
    console.error("Usage: npx tsx scripts/seed-dev-user.ts <email> <password>");
    process.exit(1);
  }

  const password_hash = await bcrypt.hash(password, 12);

  const existing = await sql`
    SELECT id FROM user_profiles WHERE email = ${email}
  `;

  if (existing.rows[0]) {
    await sql`
      UPDATE user_profiles SET password_hash = ${password_hash}, updated_at = NOW()
      WHERE email = ${email}
    `;
    console.log("Updated password for existing user.");
  } else {
    const org = await sql`INSERT INTO organizations (plan) VALUES ('starter') RETURNING id`;
    const orgId = (org.rows[0] as { id: string }).id;
    await sql`
      INSERT INTO user_profiles (org_id, email, password_hash, name, role)
      VALUES (${orgId}, ${email}, ${password_hash}, ${email.split("@")[0]}, 'member')
    `;
    console.log("Created org + user. Sign in at /login.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
