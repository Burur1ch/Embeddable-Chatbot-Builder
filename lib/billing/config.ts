// Billing Configuration
export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    chatbots: 1,
    documents: 10,
    questionsPerMonth: 100,
    features: ['Embedded widget', 'Basic analytics'],
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 19,
    chatbots: 5,
    documents: 100,
    questionsPerMonth: 2000,
    features: ['Custom branding', 'Advanced analytics'],
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    price: 49,
    chatbots: 20,
    documents: 500,
    questionsPerMonth: 10000,
    features: ['Remove branding', 'Advanced usage insights'],
  },
} as const;

export type PlanId = keyof typeof PLANS;
