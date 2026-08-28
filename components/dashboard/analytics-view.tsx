'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, MessageCircle } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type DailyPoint = { date: string; questions: number };
type TopQuestion = { question: string; count: number };

export function AnalyticsView({
  questionsThisMonth,
  monthlyLimit,
  conversationsCount,
  dailyData,
  topQuestions,
}: {
  questionsThisMonth: number;
  monthlyLimit: number;
  conversationsCount: number;
  dailyData: DailyPoint[];
  topQuestions: TopQuestion[];
}) {
  const hasData = conversationsCount > 0;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400">View your chatbot usage and performance</p>
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No data yet</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
                Analytics will appear here once your chatbot receives messages.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-2">
                  {questionsThisMonth} <span className="text-lg text-slate-400 font-normal">/ {monthlyLimit}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Questions this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-2">{conversationsCount}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Conversations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-2">
                  {Math.round((questionsThisMonth / monthlyLimit) * 100)}%
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Of monthly limit used</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Questions over time</CardTitle>
              <CardDescription>Last 14 days</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="questions" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top questions</CardTitle>
              <CardDescription>Most frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              {topQuestions.length === 0 ? (
                <p className="text-sm text-slate-500">No questions yet.</p>
              ) : (
                <ul className="space-y-3">
                  {topQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <MessageCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="flex-1">{q.question}</span>
                      <span className="text-slate-500">{q.count}x</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
