import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { EmbedManager } from '@/components/dashboard/embed-manager';
import type { Chatbot } from '@/lib/types';

export default async function EmbedPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: chatbots } = await supabase
    .from('chatbots')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <EmbedManager chatbots={(chatbots as Chatbot[]) || []} />;
}
