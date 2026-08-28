import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripeClient() {
  if (stripeInstance) return stripeInstance;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  stripeInstance = new Stripe(secretKey);
  return stripeInstance;
}

export function getStripePriceId(plan: "pro" | "business") {
  return plan === "pro"
    ? process.env.STRIPE_PRICE_PRO
    : process.env.STRIPE_PRICE_BUSINESS;
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
