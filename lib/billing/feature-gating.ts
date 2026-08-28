import { PLANS } from '@/lib/billing/config';

export interface UserPlan {
  plan: 'free' | 'pro' | 'business';
  questionsUsedThisMonth: number;
  documentsUsed: number;
  chatbotsCreated: number;
}

export function checkFeatureAccess(userPlan: UserPlan, feature: string): { allowed: boolean; reason?: string } {
  const planKey = userPlan.plan.toUpperCase() as keyof typeof PLANS;
  const planConfig = PLANS[planKey];

  if (!planConfig) {
    return { allowed: false, reason: 'Invalid plan' };
  }

  switch (feature) {
    case 'create_chatbot':
      if (userPlan.chatbotsCreated >= planConfig.chatbots) {
        return {
          allowed: false,
          reason: `Your ${userPlan.plan} plan includes ${planConfig.chatbots} chatbot(s). Upgrade to create more.`,
        };
      }
      return { allowed: true };

    case 'upload_document':
      if (userPlan.documentsUsed >= planConfig.documents) {
        return {
          allowed: false,
          reason: `Your ${userPlan.plan} plan includes ${planConfig.documents} documents. Upgrade to upload more.`,
        };
      }
      return { allowed: true };

    case 'ask_question':
      if (userPlan.questionsUsedThisMonth >= planConfig.questionsPerMonth) {
        return {
          allowed: false,
          reason: `You've reached your monthly question limit (${planConfig.questionsPerMonth}). Upgrade or wait until next month.`,
        };
      }
      return { allowed: true };

    case 'custom_branding':
      if (userPlan.plan === 'free') {
        return {
          allowed: false,
          reason: 'Custom branding is available on Pro and Business plans.',
        };
      }
      return { allowed: true };

    case 'advanced_analytics':
      if (userPlan.plan === 'free') {
        return {
          allowed: false,
          reason: 'Advanced analytics is available on Pro and Business plans.',
        };
      }
      return { allowed: true };

    case 'remove_branding':
      if (userPlan.plan !== 'business') {
        return {
          allowed: false,
          reason: 'Remove branding is only available on the Business plan.',
        };
      }
      return { allowed: true };

    default:
      return { allowed: true };
  }
}

export function getUpgradePromptMessage(feature: string): string {
  switch (feature) {
    case 'create_chatbot':
      return 'Upgrade to Pro to create more chatbots';
    case 'upload_document':
      return 'Upgrade to Pro to upload more documents';
    case 'ask_question':
      return 'Upgrade to Pro or Business for more questions per month';
    case 'custom_branding':
      return 'Upgrade to Pro for custom branding';
    default:
      return 'Upgrade your plan';
  }
}
