"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLANS, type PlanId } from "@/lib/billing/config";
import { cn } from "@/lib/cn";
import { CheckCircle2, CreditCard, LockKeyhole, X } from "lucide-react";

type Usage = {
  plan: "free" | "pro" | "business";
  chatbotsCreated: number;
  documentsUsed: number;
  questionsUsedThisMonth: number;
};

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {used} / {limit}
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full",
            pct >= 100 ? "bg-red-500" : "bg-slate-900 dark:bg-white",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function BillingManager({ usage: initialUsage }: { usage: Usage }) {
  const [usage, setUsage] = useState(initialUsage);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [checkoutPlan, setCheckoutPlan] = useState<"pro" | "business" | null>(
    null,
  );
  const [payment, setPayment] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [paymentError, setPaymentError] = useState("");
  const planConfig = PLANS[usage.plan.toUpperCase() as PlanId];

  async function changePlan(plan: "free" | "pro" | "business") {
    setLoadingPlan(plan);
    setMessage("");
    try {
      const res = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to update plan");
        return;
      }
      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }
      if (data.mockCheckout) {
        setPaymentError("");
        setCheckoutPlan(plan as "pro" | "business");
        return;
      }
      setUsage((prev) => ({ ...prev, plan }));
      setMessage(
        `You're now on the ${PLANS[plan.toUpperCase() as PlanId].name} plan.`,
      );
    } catch {
      setMessage("Failed to update plan");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function submitMockPayment(event: React.FormEvent) {
    event.preventDefault();
    if (!checkoutPlan) return;
    setLoadingPlan(checkoutPlan);
    setPaymentError("");

    try {
      const res = await fetch("/api/billing/mock-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: checkoutPlan, ...payment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPaymentError(data.error || "Payment details are invalid");
        return;
      }
      setUsage((prev) => ({ ...prev, plan: checkoutPlan }));
      setMessage(
        `Payment approved. You are now on the ${PLANS[checkoutPlan.toUpperCase() as PlanId].name} plan.`,
      );
      setCheckoutPlan(null);
      setPayment({ cardholderName: "", cardNumber: "", expiry: "", cvc: "" });
    } catch {
      setPaymentError("Payment could not be completed");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your subscription and billing
        </p>
      </div>

      <div className="grid gap-6">
        {message && (
          <div className="p-3 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 rounded text-sm">
            {message}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              You&apos;re on the {planConfig.name} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
              <li>✓ {planConfig.chatbots} chatbot(s)</li>
              <li>✓ {planConfig.documents} documents</li>
              <li>
                ✓ {planConfig.questionsPerMonth.toLocaleString()}{" "}
                questions/month
              </li>
              {planConfig.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>This month&apos;s usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UsageBar
              label="Questions"
              used={usage.questionsUsedThisMonth}
              limit={planConfig.questionsPerMonth}
            />
            <UsageBar
              label="Documents"
              used={usage.documentsUsed}
              limit={planConfig.documents}
            />
            <UsageBar
              label="Chatbots"
              used={usage.chatbotsCreated}
              limit={planConfig.chatbots}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Plan</CardTitle>
            <CardDescription>
              This is a simulated (mock) checkout for demo purposes. No real
              payment is processed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(PLANS).map(([key, plan]) => {
                const isCurrent = usage.plan === plan.id;
                return (
                  <div
                    key={key}
                    className={cn(
                      "rounded-lg border p-4 flex flex-col",
                      isCurrent
                        ? "border-slate-900 dark:border-white"
                        : "border-slate-200 dark:border-slate-700",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{plan.name}</h3>
                      {isCurrent && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-2xl font-bold mb-3">
                      ${plan.price}
                      <span className="text-sm font-normal text-slate-500">
                        /mo
                      </span>
                    </p>
                    <Button
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent}
                      loading={loadingPlan === plan.id}
                      onClick={() =>
                        changePlan(plan.id as "free" | "pro" | "business")
                      }
                    >
                      {isCurrent ? "Current Plan" : "Switch Plan"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-xl bg-white shadow-2xl dark:bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mock-checkout-title"
          >
            <div className="flex items-start justify-between border-b border-slate-200 p-6 dark:border-slate-800">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 id="mock-checkout-title" className="text-xl font-semibold">
                  Complete your purchase
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {PLANS[checkoutPlan.toUpperCase() as PlanId].name} plan · $
                  {PLANS[checkoutPlan.toUpperCase() as PlanId].price}/month
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCheckoutPlan(null)}
                aria-label="Close payment form"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={submitMockPayment} className="space-y-4 p-6">
              {paymentError && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
                  {paymentError}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="cardholderName" className="text-sm font-medium">
                  Cardholder name
                </label>
                <input
                  id="cardholderName"
                  value={payment.cardholderName}
                  onChange={(e) =>
                    setPayment({ ...payment, cardholderName: e.target.value })
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-white"
                  placeholder="Alex Morgan"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="cardNumber" className="text-sm font-medium">
                  Card number
                </label>
                <input
                  id="cardNumber"
                  inputMode="numeric"
                  value={payment.cardNumber}
                  onChange={(e) =>
                    setPayment({ ...payment, cardNumber: e.target.value })
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-white"
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="expiry" className="text-sm font-medium">
                    Expiry
                  </label>
                  <input
                    id="expiry"
                    inputMode="numeric"
                    value={payment.expiry}
                    onChange={(e) =>
                      setPayment({ ...payment, expiry: e.target.value })
                    }
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-white"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cvc" className="text-sm font-medium">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    inputMode="numeric"
                    value={payment.cvc}
                    onChange={(e) =>
                      setPayment({ ...payment, cvc: e.target.value })
                    }
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-white"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <LockKeyhole className="h-3.5 w-3.5" /> Demo checkout. No real
                payment is processed.
              </p>
              <Button
                type="submit"
                className="w-full"
                loading={loadingPlan === checkoutPlan}
              >
                Pay ${PLANS[checkoutPlan.toUpperCase() as PlanId].price}/month
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
