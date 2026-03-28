import { NextRequest, NextResponse } from "next/server";
import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";
import Stripe from "stripe";
import { z } from "zod";
import { getSessionUser } from "@/lib/db/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const PRICE_MAP: Record<string, string | undefined> = {
  starter_monthly: process.env.STRIPE_STARTER_PRICE_ID,
  starter_annual: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID,
  professional_monthly: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
  professional_annual: process.env.STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID,
};

const schema = z.object({
  plan: z.enum(["starter", "professional"]),
  billing: z.enum(["monthly", "annual"]).default("monthly"),
});

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { plan, billing } = schema.parse(body);

  const priceId = PRICE_MAP[`${plan}_${billing}`];
  if (!priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://clearleaf.ca";

  // Get or create Stripe customer
  const orgResult = await sql`
    SELECT o.id, o.stripe_customer_id, up.email, up.name
    FROM user_profiles up
    JOIN organizations o ON up.org_id = o.id
    WHERE up.id = ${user.id}
  `;
  const org = orgResult.rows[0] as {
    id: string;
    stripe_customer_id: string | null;
    email: string;
    name: string;
  } | undefined;

  if (!org) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let customerId = org.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: org.email,
      name: org.name ?? undefined,
      metadata: { org_id: org.id, user_id: user.id },
    });
    customerId = customer.id;
    await sql`
      UPDATE organizations SET stripe_customer_id = ${customerId}
      WHERE id = ${org.id}
    `;
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=1`,
    cancel_url: `${appUrl}/dashboard?upgrade_cancelled=1`,
    metadata: {
      org_id: org.id,
      user_id: user.id,
      plan,
    },
    subscription_data: {
      metadata: { org_id: org.id, plan },
    },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
