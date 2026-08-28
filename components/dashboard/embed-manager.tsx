'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Copy, Code2, AlertCircle } from 'lucide-react';
import ChatComponent from '@/components/chat/chat-component';
import type { Chatbot } from '@/lib/types';

export function EmbedManager({ chatbots }: { chatbots: Chatbot[] }) {
  const [selectedId, setSelectedId] = useState(chatbots[0]?.id ?? '');
  const [position, setPosition] = useState('bottom-right');
  const [copied, setCopied] = useState(false);

  const selectedChatbot = chatbots.find((c) => c.id === selectedId);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-knowly-domain.com';

  const embedCode = useMemo(
    () => `<!-- Add this script to your website, right before </body> -->
<script src="${origin}/widget.js"><\/script>
<script>
  Knowly.init({
    chatbotId: '${selectedId || 'your-chatbot-id'}',
    position: '${position}',
    primaryColor: '${selectedChatbot?.primary_color || '#4f46e5'}'
  });
<\/script>`,
    [origin, selectedId, position, selectedChatbot]
  );

  async function copyToClipboard() {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (chatbots.length === 0) {
    return (
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Embed Chatbot</h1>
          <p className="text-slate-600 dark:text-slate-400">Add your AI chatbot to any website with a simple code snippet</p>
        </div>
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900">
          <CardContent className="pt-6 flex gap-4">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Create a chatbot first</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                You need to create a chatbot before you can embed it. Go to the Chatbot section to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Embed Chatbot</h1>
          <p className="text-slate-600 dark:text-slate-400">Add your AI chatbot to any website with a simple code snippet</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="w-48">
            {chatbots.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select value={position} onChange={(e) => setPosition(e.target.value)} className="w-40">
            <option value="bottom-right">Bottom right</option>
            <option value="bottom-left">Bottom left</option>
            <option value="top-right">Top right</option>
            <option value="top-left">Top left</option>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Embed Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Copy this code and paste it before the{' '}
                <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">&lt;/body&gt;</code> tag on your
                website:
              </p>
              <div className="bg-slate-900 dark:bg-slate-800 text-slate-50 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                <pre>{embedCode}</pre>
              </div>
              <Button className="gap-2" onClick={copyToClipboard}>
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {[
                  { step: 'Visitor clicks the chat button', desc: 'A floating button appears on your page' },
                  { step: 'Chat window opens', desc: 'A clean, professional chat interface appears' },
                  { step: 'Visitor asks a question', desc: 'Your AI assistant searches your knowledge base' },
                  { step: 'Instant answer', desc: 'The assistant replies with sources, in real time' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 list-none">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-sm font-semibold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{item.step}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="h-[560px]">
            {selectedChatbot ? (
              <ChatComponent chatbotId={selectedChatbot.id} welcomeMessage={selectedChatbot.welcome_message} />
            ) : (
              <p className="text-sm text-slate-500">Select a chatbot to preview it.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
