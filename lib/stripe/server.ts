import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const STRIPE_PRICES = {
  free: null,
  starter: process.env.STRIPE_PRICE_STARTER,
  professional: process.env.STRIPE_PRICE_PROFESSIONAL,
  team: process.env.STRIPE_PRICE_TEAM,
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  returnUrl: string
) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${returnUrl}?success=true`,
    cancel_url: returnUrl,
  });
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export function getPlanFromPriceId(priceId: string): string {
  if (priceId === STRIPE_PRICES.starter) return "starter";
  if (priceId === STRIPE_PRICES.professional) return "professional";
  if (priceId === STRIPE_PRICES.team) return "team";
  return "free";
}
