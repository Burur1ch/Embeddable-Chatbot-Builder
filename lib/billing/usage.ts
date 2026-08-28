import type { SupabaseClient } from '@supabase/supabase-js';
import { PLANS, type PlanId } from '@/lib/billing/config';
import type { UserPlan } from '@/lib/billing/feature-gating';

export function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Loads the user's subscription plan and current usage counters, scoped by
 * RLS to the given (session-authenticated) supabase client's user.
 */
export async function getUserPlanUsage(supabase: SupabaseClient, userId: string): Promise<UserPlan> {
  const [{ data: subscription }, { count: chatbotsCount }, { count: documentsCount }, { data: usage }] = await Promise.all([
    supabase.from('subscriptions').select('plan').eq('user_id', userId).maybeSingle(),
    supabase.from('chatbots').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('documents').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('usage').select('questions_count').eq('user_id', userId).eq('period', currentPeriod()).maybeSingle(),
  ]);

  return {
    plan: (subscription?.plan ?? 'free') as UserPlan['plan'],
    chatbotsCreated: chatbotsCount ?? 0,
    documentsUsed: documentsCount ?? 0,
    questionsUsedThisMonth: usage?.questions_count ?? 0,
  };
}

export function getPlanConfig(planId: string) {
  const key = planId.toUpperCase() as PlanId;
  return PLANS[key] ?? PLANS.FREE;
}

/** Increments the current period's question counter for a user (service-role client). */
export async function incrementQuestionUsage(supabase: SupabaseClient, userId: string) {
  const period = currentPeriod();
  const { data: existing } = await supabase
    .from('usage')
    .select('id, questions_count')
    .eq('user_id', userId)
    .eq('period', period)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('usage')
      .update({ questions_count: existing.questions_count + 1, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    await supabase.from('usage').insert({ user_id: userId, period, questions_count: 1 });
  }
}
