import { NextRequest, NextResponse } from "next/server";
import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/email/resend";

const signupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = signupSchema.parse(body);

    // Check if email already exists
    const existing = await sql`
      SELECT id FROM user_profiles WHERE email = ${email}
    `;
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create org + user in a single transaction
    const org = await sql`
      INSERT INTO organizations (plan) VALUES ('free') RETURNING id
    `;
    const orgId = (org.rows[0] as { id: string }).id;

    await sql`
      INSERT INTO user_profiles (org_id, email, name, password_hash, role)
      VALUES (${orgId}, ${email}, ${name}, ${passwordHash}, 'member')
    `;

    // Send welcome email (non-blocking — don't fail signup if email fails)
    sendWelcomeEmail({ name, email }).catch((err) =>
      console.error("Welcome email failed:", err)
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Could not create account. Please try again." },
      { status: 500 }
    );
  }
}
