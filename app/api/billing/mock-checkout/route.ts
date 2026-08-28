import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { mockChangePlan } from "@/lib/billing/mock-billing";

const paymentSchema = z.object({
  plan: z.enum(["pro", "business"]),
  cardholderName: z
    .string()
    .trim()
    .min(2, "Enter the cardholder name")
    .max(100),
  cardNumber: z
    .string()
    .regex(/^(\d{4} ?){4}$/, "Enter a valid 16-digit card number"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Use MM/YY format"),
  cvc: z.string().regex(/^\d{3,4}$/, "Enter a valid CVC"),
});

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = paymentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { plan } = parsed.data;
  const { data, error } = await mockChangePlan(supabase, user.id, plan);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ subscription: data, payment: "mock" });
}
