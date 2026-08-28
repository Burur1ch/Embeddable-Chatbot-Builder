import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/lib/billing/config';

export default function PricingPage() {
  return (
    <div className="max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">Start free, scale as you grow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(PLANS).map(([planKey, plan]) => (
          <Card
            key={planKey}
            className={planKey === 'PRO' ? 'border-2 border-slate-900 dark:border-white' : undefined}
          >
            <CardHeader>
              {planKey === 'PRO' && (
                <div className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  MOST POPULAR
                </div>
              )}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-semibold mb-1">
                    {plan.chatbots} Chatbot{plan.chatbots > 1 ? 's' : ''}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Create and manage multiple chatbots</p>
                </div>
                <div className="text-sm">
                  <div className="font-semibold mb-1">
                    {plan.documents} Document{plan.documents > 1 ? 's' : ''}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Upload and index knowledge sources</p>
                </div>
                <div className="text-sm">
                  <div className="font-semibold mb-1">{plan.questionsPerMonth.toLocaleString()} Questions/Month</div>
                  <p className="text-slate-600 dark:text-slate-400">Track and limit API calls</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-semibold text-sm">Features included:</h4>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                variant={planKey === 'PRO' ? 'default' : 'outline'}
              >
                {planKey === 'FREE' ? 'Get Started' : planKey === 'PRO' ? 'Upgrade' : 'Contact Sales'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold mb-2">Can I change plans?</h3>
            <p className="text-slate-600 dark:text-slate-400">Yes, you can upgrade or downgrade anytime. Changes take effect at the start of your next billing cycle.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-slate-600 dark:text-slate-400">Yes! Start with our free plan and upgrade whenever you're ready. No credit card required.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What happens if I exceed my limit?</h3>
            <p className="text-slate-600 dark:text-slate-400">We'll notify you when you're approaching your limit. You can upgrade or wait for the next billing cycle.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you offer discounts?</h3>
            <p className="text-slate-600 dark:text-slate-400">Contact our sales team for enterprise pricing and custom arrangements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
