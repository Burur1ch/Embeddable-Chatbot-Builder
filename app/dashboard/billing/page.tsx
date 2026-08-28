import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { getUserPlanUsage } from '@/lib/billing/usage';
import { BillingManager } from '@/components/dashboard/billing-manager';

export default async function BillingPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const usage = await getUserPlanUsage(supabase, user.id);

  return <BillingManager usage={usage} />;
}
