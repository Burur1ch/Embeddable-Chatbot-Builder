import Link from 'next/link';
import { Sparkles, Zap, Shield, BarChart3 } from 'lucide-react';

const highlights = [
  { icon: Zap, text: 'Turn your docs into an AI support agent in minutes' },
  { icon: Shield, text: 'Your data stays private, secured with row-level access' },
  { icon: BarChart3, text: 'Track usage and see exactly what customers ask' },
];

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4) 0%, transparent 45%)',
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Knowly</span>
          </Link>

          <div>
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Turn your company knowledge into an AI support agent.
            </h2>
            <ul className="space-y-4">
              {highlights.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-blue-50 leading-relaxed pt-1">{text}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-blue-100/80">© 2026 Knowly. All rights reserved.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Knowly
            </span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  );
}
