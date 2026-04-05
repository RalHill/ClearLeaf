import { NextRequest, NextResponse } from "next/server";
import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const PLAN_FROM_PRICE: Record<string, string> = {
  [process.env.STRIPE_STARTER_PRICE_ID ?? ""]: "starter",
  [process.env.STRIPE_STARTER_ANNUAL_PRICE_ID ?? ""]: "starter",
  [process.env.STRIPE_PROFESSIONAL_PRICE_ID ?? ""]: "professional",
  [process.env.STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID ?? ""]: "professional",
};

async function setPlan(orgId: string, plan: string, subId: string, expiresAt: Date | null) {
  await sql`
    UPDATE organizations
    SET plan = ${plan},
        stripe_subscription_id = ${subId},
        plan_expires_at = ${expiresAt?.toISOString() ?? null}
    WHERE id = ${orgId}
  `;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    // Dev mode: no webhook secret set — parse directly (only allow in development)
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Webhook secret required in production" }, { status: 400 });
    }
    event = JSON.parse(body) as Stripe.Event;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.org_id;
        const plan = session.metadata?.plan;

        if (!orgId || !plan || session.mode !== "subscription") break;

        const subId = session.subscription as string;
        const sub = await stripe.subscriptions.retrieve(subId);
        const expiresAt = new Date(sub.current_period_end * 1000);

        await setPlan(orgId, plan, subId, expiresAt);
        console.log(`✓ Plan upgraded: org ${orgId} → ${plan}`);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const orgId = sub.metadata?.org_id;
        if (!orgId) break;

        const priceId = sub.items.data[0]?.price.id;
        const plan = PLAN_FROM_PRICE[priceId] ?? "starter";
        const expiresAt = new Date(sub.current_period_end * 1000);

        if (sub.status === "active" || sub.status === "trialing") {
          await setPlan(orgId, plan, sub.id, expiresAt);
        } else if (sub.status === "past_due") {
          console.warn(`Subscription past due: org ${orgId}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const orgId = sub.metadata?.org_id;
        if (!orgId) break;

        await sql`
          UPDATE organizations
          SET plan = 'free', stripe_subscription_id = NULL, plan_expires_at = NULL
          WHERE id = ${orgId}
        `;
        console.log(`✓ Plan downgraded to free: org ${orgId}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(`Payment failed: customer ${invoice.customer}`);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
