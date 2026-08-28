import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Realistic mock billing (no real Stripe charge). Clearly separated from
 * the rest of the app so it's obvious this simulates payment success rather
 * than performing one - see README for how to swap in real Stripe Checkout.
 */
export async function mockChangePlan(supabase: SupabaseClient, userId: string, plan: 'free' | 'pro' | 'business') {
  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  const payload = {
    plan,
    status: 'active' as const,
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
    updated_at: now.toISOString(),
  };

  if (existing) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single();
    return { data, error };
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({ user_id: userId, ...payload })
    .select()
    .single();
  return { data, error };
}
