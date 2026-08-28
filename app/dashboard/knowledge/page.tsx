import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { KnowledgeManager } from '@/components/dashboard/knowledge-manager';
import type { Chatbot, Document } from '@/lib/types';

export default async function KnowledgePage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const [{ data: chatbots }, { data: documents }] = await Promise.all([
    supabase.from('chatbots').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  return (
    <KnowledgeManager
      chatbots={(chatbots as Chatbot[]) || []}
      initialDocuments={(documents as Document[]) || []}
    />
  );
}
