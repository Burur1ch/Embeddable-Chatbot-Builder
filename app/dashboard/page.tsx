import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, FileText, HelpCircle, Sparkles, Activity, Plus } from 'lucide-react';
import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { getUserPlanUsage, getPlanConfig } from '@/lib/billing/usage';

export default async function Dashboard() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const usage = await getUserPlanUsage(supabase, user.id);
  const planConfig = getPlanConfig(usage.plan);

  const { data: recentChatbots } = await supabase
    .from('chatbots')
    .select('id, name, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Workspace overview</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Welcome back</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Here is what is happening with your AI support team.</p>
        </div>
        <Link href="/dashboard/chatbot">
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> New chatbot
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="group overflow-hidden border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
          <CardContent className="pt-6">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
              <MessageSquare className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {usage.chatbotsCreated} <span className="text-lg text-slate-400 font-normal">/ {planConfig.chatbots}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Chatbots</p>
          </CardContent>
        </Card>
        <Card className="group overflow-hidden border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
          <CardContent className="pt-6">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3">
              <FileText className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {usage.documentsUsed} <span className="text-lg text-slate-400 font-normal">/ {planConfig.documents}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Documents</p>
          </CardContent>
        </Card>
        <Card className="group overflow-hidden border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
          <CardContent className="pt-6">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-3">
              <HelpCircle className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {usage.questionsUsedThisMonth}{' '}
              <span className="text-lg text-slate-400 font-normal">/ {planConfig.questionsPerMonth}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Questions this month</p>
          </CardContent>
        </Card>
        <Card className="group overflow-hidden border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
          <CardContent className="pt-6">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center mb-3">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="text-3xl font-bold mb-1">{planConfig.name}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Current Plan</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Upload your first document and create a chatbot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/dashboard/knowledge">
                <Button className="w-full justify-between gap-2">
                  Upload Documents <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard/chatbot">
                <Button variant="outline" className="w-full justify-between">
                  Create Chatbot
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4 text-indigo-600" /> Recent Activity</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentChatbots && recentChatbots.length > 0 ? (
              <ul className="space-y-3">
                {recentChatbots.map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-slate-500">{new Date(c.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400">No recent activity yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
