/**
 * @vercel/postgres reads POSTGRES_URL. Neon docs often use DATABASE_URL only.
 */
if (typeof process !== "undefined" && !process.env.POSTGRES_URL && process.env.DATABASE_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}
