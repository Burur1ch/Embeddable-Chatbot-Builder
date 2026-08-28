import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/billing/stripe";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature error:", error);
    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;

      if (userId && (plan === "pro" || plan === "business")) {
        await supabaseServer
          .from("subscriptions")
          .update({
            plan,
            status: "active",
            stripe_customer_id:
              typeof session.customer === "string" ? session.customer : null,
            stripe_subscription_id:
              typeof session.subscription === "string"
                ? session.subscription
                : null,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.user_id;
      const plan = subscription.metadata.plan;
      const period = subscription.items.data[0]?.current_period_start;
      const periodEnd = subscription.items.data[0]?.current_period_end;

      if (userId && (plan === "pro" || plan === "business")) {
        await supabaseServer
          .from("subscriptions")
          .update({
            plan,
            status:
              event.type === "customer.subscription.deleted"
                ? "canceled"
                : "active",
            stripe_customer_id:
              typeof subscription.customer === "string"
                ? subscription.customer
                : null,
            stripe_subscription_id: subscription.id,
            ...(period
              ? { current_period_start: new Date(period * 1000).toISOString() }
              : {}),
            ...(periodEnd
              ? { current_period_end: new Date(periodEnd * 1000).toISOString() }
              : {}),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
