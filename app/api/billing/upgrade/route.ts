import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { mockChangePlan } from "@/lib/billing/mock-billing";
import {
  getAppUrl,
  getStripeClient,
  getStripePriceId,
} from "@/lib/billing/stripe";

const upgradeSchema = z.object({
  plan: z.enum(["free", "pro", "business"]),
});

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = upgradeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { plan } = parsed.data;

  if (plan !== "free") {
    const stripe = getStripeClient();
    const priceId = getStripePriceId(plan);

    if (stripe && priceId) {
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("stripe_customer_id, stripe_subscription_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (subscription?.stripe_subscription_id) {
        const currentSubscription = await stripe.subscriptions.retrieve(
          subscription.stripe_subscription_id,
        );
        const currentItem = currentSubscription.items.data[0];

        if (!currentItem) {
          return NextResponse.json(
            { error: "Stripe subscription has no billing item" },
            { status: 400 },
          );
        }

        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          items: [{ id: currentItem.id, price: priceId }],
          metadata: { user_id: user.id, plan },
        });

        return NextResponse.json({ updated: true });
      }

      let customerId = subscription?.stripe_customer_id ?? undefined;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { user_id: user.id },
        });
        customerId = customer.id;
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${getAppUrl()}/dashboard/billing?checkout=success`,
        cancel_url: `${getAppUrl()}/dashboard/billing?checkout=cancelled`,
        metadata: { user_id: user.id, plan },
        subscription_data: { metadata: { user_id: user.id, plan } },
      });

      return NextResponse.json({ checkoutUrl: session.url });
    }

    return NextResponse.json({ mockCheckout: true, plan });
  }

  const { data, error } = await mockChangePlan(supabase, user.id, plan);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ subscription: data });
}
