'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Lock, BarChart3, Sparkles, Rocket, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Knowly</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Sign In
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image + Parallax */}
      <section className="relative isolate w-full overflow-hidden py-24 lg:py-40">
        {/* Background Image - Parallax */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage: "url('/hero-bg.svg')",
            transform: `translateY(${scrollY * 0.35}px) scale(1.1)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 -z-10 bg-slate-950/55" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-sm font-semibold text-white">✨ AI-Powered Knowledge Assistant</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight">
            <span className="text-white">
              Turn Your Company Knowledge Into
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              An AI Support Agent
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Upload your docs, connect your knowledge, and give your customers instant answers — anywhere, anytime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg rounded-xl">
                Start for Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-white/40 bg-white/5 text-white hover:bg-white/15 hover:border-white/60 backdrop-blur-sm rounded-xl px-8 py-6 text-lg font-medium">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center max-w-2xl mx-auto pt-8 border-t border-white/15">
            <div>
              <div className="text-3xl font-bold text-blue-400">10K+</div>
              <p className="text-sm text-slate-300 mt-1">Active Users</p>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              <p>© 2026 Knowly. All rights reserved.</p>
            </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">99.9%</div>
              <p className="text-sm text-slate-300 mt-1">Uptime</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">1M+</div>
              <p className="text-sm text-slate-300 mt-1">Messages</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-300">2h</div>
              <p className="text-sm text-slate-300 mt-1">Setup Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Parallax */}
      <section className="relative isolate py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 60%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)
            `,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Built for teams who want to scale support without scaling their team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative rounded-2xl p-8 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Fast Setup</h3>
                <p className="text-slate-600 dark:text-slate-400">Upload your documents and train an AI chatbot in just minutes. No complex configuration needed.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative rounded-2xl p-8 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                <p className="text-slate-600 dark:text-slate-400">Your data stays private with end-to-end encryption and SOC 2 compliance. No third-party access ever.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-2xl p-8 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-pink-400 dark:hover:border-pink-600 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Deep Analytics</h3>
                <p className="text-slate-600 dark:text-slate-400">Track conversations, understand customer needs, and continuously improve your AI assistant&apos;s responses.</p>
              </div>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50">
              <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Instant Integration</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Embed with just one line of code</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50">
              <Lock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">AI-Powered Responses</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Uses latest GPT models for accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Parallax */}
      <section className="relative isolate py-20 lg:py-32 overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
            `,
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Start free, upgrade as you grow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="rounded-2xl p-8 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-xl transition-all hover:scale-105 duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-slate-600 dark:text-slate-400">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                  </span>
                  1 Chatbot
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                  </span>
                  10 Documents
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                  </span>
                  100 Questions/Month
                </li>
              </ul>
              <Button variant="outline" className="w-full border-slate-300 dark:border-slate-600 rounded-lg">
                Get Started
              </Button>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="relative rounded-2xl p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-400 dark:border-purple-600 hover:shadow-2xl transition-all hover:scale-110 duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold">MOST POPULAR</span>
              </div>
              <div className="mb-6 pt-4">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$19</span>
                  <span className="text-slate-600 dark:text-slate-400">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm font-medium">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 flex items-center justify-center">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                  </span>
                  5 Chatbots
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 flex items-center justify-center">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                  </span>
                  100 Documents
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 flex items-center justify-center">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                  </span>
                  2,000 Questions/Month
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all rounded-lg font-medium">
                Upgrade Now
              </Button>
            </div>

            {/* Business Plan */}
            <div className="rounded-2xl p-8 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-xl transition-all hover:scale-105 duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Business</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">$49</span>
                  <span className="text-slate-600 dark:text-slate-400">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                  </span>
                  20 Chatbots
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                  </span>
                  500 Documents
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                  </span>
                  10,000 Questions/Month
                </li>
              </ul>
              <Button variant="outline" className="w-full border-slate-300 dark:border-slate-600 rounded-lg">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Parallax */}
      <section className="relative isolate py-20 lg:py-24 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 60%, rgba(255, 255, 255, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 70% 40%, rgba(255, 255, 255, 0.5) 0%, transparent 50%)
            `,
            transform: `translateY(${scrollY * 0.6}px)`,
          }}
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to transform your support?</h2>
          <p className="text-xl text-blue-100 mb-10">Join thousands of companies delivering instant, accurate support with AI.</p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 shadow-lg hover:shadow-xl px-8 py-6 text-lg rounded-xl font-semibold transition-all">
              Start for Free — No Card Required
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Knowly</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Turn your knowledge into an AI support agent.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400">Pricing</Link></li>
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">About</Link></li>
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Blog</Link></li>
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy</Link></li>
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Terms</Link></li>
                <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>© 2026 Knowly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
