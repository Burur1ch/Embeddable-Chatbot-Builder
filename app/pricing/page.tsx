import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/billing/config";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-14 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-violet-600">
          Pricing
        </p>
        <h1 className="mb-4 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
          Simple plans for support teams that want to scale
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-slate-600">
          Start free, then upgrade when your knowledge base, team, and customer
          volume grow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {Object.entries(PLANS).map(([planKey, plan]) => {
          const isPro = planKey === "PRO";
          const isBusiness = planKey === "BUSINESS";

          return (
            <div
              key={planKey}
              className={[
                "relative rounded-[30px] border p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1",
                isPro
                  ? "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 shadow-[0_30px_60px_rgba(99,102,241,0.12)]"
                  : "border-slate-200 bg-white",
              ].join(" ")}
            >
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {plan.name}
                </h2>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-black tracking-[-0.06em] text-slate-950">
                    ${plan.price}
                  </span>
                  <span className="pb-2 text-slate-500">/month</span>
                </div>
              </div>

              <div className="space-y-4 border-b border-slate-200 pb-6 text-sm text-slate-600">
                <div>
                  <div className="mb-1 font-semibold text-slate-900">
                    {plan.chatbots} chatbot{plan.chatbots > 1 ? "s" : ""}
                  </div>
                  <p>
                    Launch one or many assistants across your support journeys.
                  </p>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-slate-900">
                    {plan.documents} document{plan.documents > 1 ? "s" : ""}
                  </div>
                  <p>Upload product docs, policies, help content, and FAQs.</p>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-slate-900">
                    {plan.questionsPerMonth.toLocaleString()} questions / month
                  </div>
                  <p>Cap usage based on your support volume and team needs.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Included
                </h3>
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-slate-700"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/signup">
                  <Button
                    className={[
                      "w-full rounded-2xl",
                      isPro
                        ? "bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-violet-200 hover:brightness-110"
                        : isBusiness
                          ? "bg-slate-950 text-white hover:bg-slate-800"
                          : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {planKey === "FREE"
                      ? "Get started"
                      : planKey === "PRO"
                        ? "Upgrade now"
                        : "Contact sales"}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.04)] md:p-12">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-violet-600">
            FAQ
          </p>
          <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-950">
            Questions teams usually ask
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Can I change plans?
            </h3>
            <p className="text-slate-600">
              Yes. You can upgrade or downgrade at any time, and the change
              applies right away.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Is there a free trial?
            </h3>
            <p className="text-slate-600">
              Yes — the free plan is enough to test the product before you scale
              to paid usage.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              What if I exceed my usage cap?
            </h3>
            <p className="text-slate-600">
              We notify you before limits are reached, and you can upgrade in a
              few clicks.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Do you offer enterprise pricing?
            </h3>
            <p className="text-slate-600">
              Yes. We can build a custom plan for larger teams, higher limits,
              and advanced controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
