import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { getUserPlanUsage, getPlanConfig } from '@/lib/billing/usage';
import { AnalyticsView } from '@/components/dashboard/analytics-view';

export default async function AnalyticsPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const usage = await getUserPlanUsage(supabase, user.id);
  const planConfig = getPlanConfig(usage.plan);

  const { data: chatbots } = await supabase.from('chatbots').select('id').eq('user_id', user.id);
  const chatbotIds = (chatbots ?? []).map((c) => c.id);

  let conversationsCount = 0;
  let dailyData: { date: string; questions: number }[] = [];
  let topQuestions: { question: string; count: number }[] = [];

  if (chatbotIds.length > 0) {
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id')
      .in('chatbot_id', chatbotIds);

    conversationsCount = conversations?.length ?? 0;
    const conversationIds = (conversations ?? []).map((c) => c.id);

    if (conversationIds.length > 0) {
      const today = new Date();
      const fourteenDaysAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
      const { data: messages } = await supabase
        .from('messages')
        .select('content, created_at')
        .in('conversation_id', conversationIds)
        .eq('role', 'user')
        .gte('created_at', fourteenDaysAgo)
        .order('created_at', { ascending: true });

      const byDay = new Map<string, number>();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        byDay.set(d.toISOString().slice(0, 10), 0);
      }
      const questionCounts = new Map<string, number>();

      for (const msg of messages ?? []) {
        const day = msg.created_at.slice(0, 10);
        if (byDay.has(day)) byDay.set(day, (byDay.get(day) ?? 0) + 1);

        const normalized = msg.content.trim().toLowerCase();
        questionCounts.set(normalized, (questionCounts.get(normalized) ?? 0) + 1);
      }

      dailyData = Array.from(byDay.entries()).map(([date, questions]) => ({
        date: date.slice(5),
        questions,
      }));

      topQuestions = Array.from(questionCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([question, count]) => ({ question, count }));
    }
  }

  return (
    <AnalyticsView
      questionsThisMonth={usage.questionsUsedThisMonth}
      monthlyLimit={planConfig.questionsPerMonth}
      conversationsCount={conversationsCount}
      dailyData={dailyData}
      topQuestions={topQuestions}
    />
  );
}
