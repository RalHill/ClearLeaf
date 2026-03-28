/**
 * One-time Stripe setup: creates ClearLeaf products and prices.
 * Run once: npx tsx scripts/setup-stripe.ts
 * Then paste the price IDs into .env.local
 */

import Stripe from "stripe";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

async function setup() {
  console.log("Setting up Stripe products and prices...\n");

  // ── Starter Plan ──────────────────────────────────────────────────────────
  const starterProduct = await stripe.products.create({
    name: "ClearLeaf Starter",
    description: "100 AI chat queries/month, full province compare, 5 policy checks/month",
    metadata: { plan: "starter" },
  });

  const starterPriceMonthly = await stripe.prices.create({
    product: starterProduct.id,
    unit_amount: 4900, // $49.00 CAD
    currency: "cad",
    recurring: { interval: "month" },
    nickname: "Starter Monthly",
    metadata: { plan: "starter", billing: "monthly" },
  });

  const starterPriceAnnual = await stripe.prices.create({
    product: starterProduct.id,
    unit_amount: 47040, // $470.40 CAD/yr (20% off = $39.20/mo)
    currency: "cad",
    recurring: { interval: "year" },
    nickname: "Starter Annual",
    metadata: { plan: "starter", billing: "annual" },
  });

  // ── Professional Plan ─────────────────────────────────────────────────────
  const professionalProduct = await stripe.products.create({
    name: "ClearLeaf Professional",
    description: "Unlimited AI queries, unlimited policy checks, priority support",
    metadata: { plan: "professional" },
  });

  const professionalPriceMonthly = await stripe.prices.create({
    product: professionalProduct.id,
    unit_amount: 14900, // $149.00 CAD
    currency: "cad",
    recurring: { interval: "month" },
    nickname: "Professional Monthly",
    metadata: { plan: "professional", billing: "monthly" },
  });

  const professionalPriceAnnual = await stripe.prices.create({
    product: professionalProduct.id,
    unit_amount: 143040, // $1,430.40 CAD/yr (20% off = $119.20/mo)
    currency: "cad",
    recurring: { interval: "year" },
    nickname: "Professional Annual",
    metadata: { plan: "professional", billing: "annual" },
  });

  console.log("✓ Products and prices created.\n");
  console.log("═══ Add these to .env.local and Vercel env vars ═══\n");
  console.log(`STRIPE_STARTER_PRICE_ID=${starterPriceMonthly.id}`);
  console.log(`STRIPE_STARTER_ANNUAL_PRICE_ID=${starterPriceAnnual.id}`);
  console.log(`STRIPE_PROFESSIONAL_PRICE_ID=${professionalPriceMonthly.id}`);
  console.log(`STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID=${professionalPriceAnnual.id}`);
  console.log(`\nStarter product ID: ${starterProduct.id}`);
  console.log(`Professional product ID: ${professionalProduct.id}`);
}

setup().catch((err) => {
  console.error("Stripe setup failed:", err.message);
  process.exit(1);
});
