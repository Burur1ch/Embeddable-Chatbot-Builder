import ChatComponent from '@/components/chat/chat-component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * Public chat page for testing a chatbot's RAG behavior end-to-end.
 * Reached via /chat?chatbotId=<id> from the dashboard "Test" button.
 */
export default async function ChatTestPage({
  searchParams,
}: {
  searchParams: Promise<{ chatbotId?: string }>;
}) {
  const { chatbotId } = await searchParams;

  if (!chatbotId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">No chatbot selected</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Open a chatbot from your dashboard and click "Test" to try it here.
        </p>
      </div>
    );
  }

  const { data: chatbot } = await supabaseServer
    .from('chatbots')
    .select('id, name, welcome_message')
    .eq('id', chatbotId)
    .eq('status', 'published')
    .single();

  if (!chatbot) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Chatbot not found</h1>
        <p className="text-slate-600 dark:text-slate-400">
          This chatbot doesn't exist or hasn't been published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{chatbot.name}</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Ask a question and see how your assistant answers using your uploaded knowledge.
        </p>
      </div>

      <div className="h-[600px]">
        <ChatComponent chatbotId={chatbot.id} welcomeMessage={chatbot.welcome_message} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">How This Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>Upload documents (FAQs, policies, documentation, etc.)</li>
            <li>Your AI assistant indexes and understands the content</li>
            <li>When you ask a question, the assistant searches for relevant information</li>
            <li>It provides an answer based on your company knowledge</li>
            <li>Sources are included so you can verify the information</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
