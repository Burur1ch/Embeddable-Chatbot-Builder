'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Barcode,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/knowledge', icon: BookOpen, label: 'Knowledge' },
  { href: '/dashboard/chatbot', icon: MessageSquare, label: 'Chatbot' },
  { href: '/dashboard/embed', icon: Barcode, label: 'Embed' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

function getPageLabel(pathname: string) {
  if (pathname === '/dashboard') return 'Overview';
  const item = navItems.find((navItem) => pathname.startsWith(navItem.href));
  return item?.label ?? 'Workspace';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <div className="flex h-full min-h-screen bg-[#f6f8fb] dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Knowly
            </span>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href + '/') || pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
          <div className="flex h-16 items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-semibold">Knowly</span>
              </Link>
              <span className="hidden h-5 w-px bg-slate-200 dark:bg-slate-800 lg:block" />
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{getPageLabel(pathname)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-slate-500 sm:block">Workspace</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                K
              </div>
            </div>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200/80 bg-white px-4 py-2 lg:hidden dark:border-slate-800 dark:bg-slate-950" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-medium',
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_32rem)] p-5 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
