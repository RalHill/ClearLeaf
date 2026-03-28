import "@/lib/db/ensure-postgres-url";
import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      orgId: string;
    };
  }

  interface User {
    orgId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    orgId?: string;
  }
}

async function findOrCreateOAuthUser(email: string, name: string | null) {
  const existing = await sql`
    SELECT id, org_id FROM user_profiles WHERE email = ${email}
  `;
  const row = existing.rows[0] as { id: string; org_id: string } | undefined;
  if (row) {
    return { id: row.id, orgId: row.org_id };
  }

  const org = await sql`
    INSERT INTO organizations (plan) VALUES ('free') RETURNING id
  `;
  const orgId = (org.rows[0] as { id: string }).id;

  const inserted = await sql`
    INSERT INTO user_profiles (org_id, email, name, role)
    VALUES (${orgId}, ${email}, ${name}, 'member')
    RETURNING id, org_id
  `;
  const u = inserted.rows[0] as { id: string; org_id: string };
  return { id: u.id, orgId: u.org_id };
}

const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      const email = String(credentials.email);
      const result = await sql`
        SELECT id, email, password_hash, org_id FROM user_profiles
        WHERE email = ${email}
      `;
      const row = result.rows[0] as
        | {
            id: string;
            email: string;
            password_hash: string | null;
            org_id: string;
          }
        | undefined;
      if (!row?.password_hash) return null;
      const ok = await bcrypt.compare(String(credentials.password), row.password_hash);
      if (!ok) return null;
      return {
        id: row.id,
        email: row.email,
        orgId: row.org_id,
      };
    },
  }),
];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user?.email) {
        if (account?.provider === "github" && user.email) {
          const p = profile as { name?: string } | undefined;
          const name = p?.name ?? user.name ?? null;
          const row = await findOrCreateOAuthUser(user.email, name);
          token.id = row.id;
          token.orgId = row.orgId;
        } else if (user.id && "orgId" in user && user.orgId) {
          token.id = user.id;
          token.orgId = user.orgId as string;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && token.orgId) {
        session.user.id = token.id;
        session.user.orgId = token.orgId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});
