"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Lock,
  BarChart3,
  Sparkles,
  Rocket,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Knowly
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Sign In
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative isolate w-full overflow-hidden py-24 lg:py-32">
        <div
          className="absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(circle at 20% 18%, rgba(34,211,238,0.22), transparent 28%), radial-gradient(circle at 78% 28%, rgba(168,85,247,0.22), transparent 32%), radial-gradient(circle at 58% 82%, rgba(244,114,182,0.18), transparent 30%), linear-gradient(120deg, #0b1125 0%, #111d44 26%, #22163d 58%, #491b51 100%)",
            transform: `translateY(${scrollY * 0.25}px) scale(1.05)`,
            transition: "transform 0.12s ease-out",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-b from-transparent to-[#f7f3ff]" />
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -right-16 bottom-8 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 shadow-[0_0_30px_rgba(167,139,250,0.15)] backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-violet-200" />
            <span className="text-sm font-semibold text-white/90">
              AI-powered knowledge assistant
            </span>
          </div>

          <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-[-0.07em] text-white sm:text-6xl lg:text-[7rem] lg:leading-[0.92]">
            Turn your company
            <span className="mt-2 block">knowledge into</span>
            <span className="mt-2 block bg-gradient-to-r from-[#a5b4fc] via-[#d7a5ff] to-[#f7a8d8] bg-clip-text text-transparent">
              an AI support agent
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg text-slate-200 sm:text-2xl">
            Upload your docs, connect your internal knowledge, and give
            customers instant answers — wherever they are, whenever they ask.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                className="gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 px-8 py-6 text-base font-semibold text-white shadow-[0_18px_40px_rgba(99,102,241,0.35)] transition hover:brightness-110"
              >
                Start for free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl border border-white/20 bg-white/6 px-8 py-6 text-base font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.25)] backdrop-blur-sm hover:bg-white/10"
              >
                View pricing
              </Button>
            </Link>
          </div>

          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-sm md:p-5">
              <div className="grid gap-4 rounded-[24px] border border-white/10 bg-[#0b1632]/80 p-4 text-left md:grid-cols-[1.35fr_0.65fr] md:p-6">
                <div className="rounded-[20px] border border-white/10 bg-[#121d3d]/80 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white">
                        K
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Knowledge base
                        </p>
                        <p className="text-xs text-slate-400">
                          Support workspace
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                      live
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/8 px-4 py-3 text-sm text-slate-200 shadow-inner shadow-slate-900/20">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                          Knowly • company assistant
                        </span>
                      </div>
                      Hi! I can answer questions using your uploaded docs,
                      policies, and internal knowledge base.
                    </div>
                    <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-4 py-3 text-sm text-white shadow-lg shadow-violet-500/25">
                      Where can I find the onboarding checklist for new hires?
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/8 px-4 py-3 text-sm text-slate-200 shadow-inner shadow-slate-900/20">
                      It’s in the People Ops guide. New hires should complete
                      the setup steps in the onboarding packet and submit their
                      equipment request by day 2.
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[20px] border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-indigo-500/10 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-violet-200">
                      Coverage
                    </p>
                    <div className="mt-3 text-3xl font-black tracking-[-0.05em] text-white">
                      92%
                    </div>
                    <p className="mt-1 text-sm text-slate-300">
                      Resolved without human handoff
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/10 bg-[#121d3d]/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Sources indexed
                    </p>
                    <ul className="mt-3 space-y-3 text-sm text-slate-200">
                      <li className="flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-3 py-2">
                        <span>Docs</span>
                        <span className="font-semibold text-violet-300">
                          128
                        </span>
                      </li>
                      <li className="flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-3 py-2">
                        <span>Guides</span>
                        <span className="font-semibold text-violet-300">
                          54
                        </span>
                      </li>
                      <li className="flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-3 py-2">
                        <span>FAQs</span>
                        <span className="font-semibold text-violet-300">
                          24
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 border-t border-white/10 pt-8 text-center sm:grid-cols-4">
            <div>
              <div className="text-3xl font-black tracking-[-0.05em] text-violet-300">
                10K+
              </div>
              <p className="mt-2 text-sm text-slate-300">Active users</p>
            </div>
            <div>
              <div className="text-3xl font-black tracking-[-0.05em] text-violet-300">
                99.9%
              </div>
              <p className="mt-2 text-sm text-slate-300">Uptime</p>
            </div>
            <div>
              <div className="text-3xl font-black tracking-[-0.05em] text-violet-300">
                1M+
              </div>
              <p className="mt-2 text-sm text-slate-300">Messages</p>
            </div>
            <div>
              <div className="text-3xl font-black tracking-[-0.05em] text-violet-300">
                2h
              </div>
              <p className="mt-2 text-sm text-slate-300">Setup time</p>
            </div>
          </div>

          <div className="mt-10 text-sm text-slate-400">
            © 2026 Knowly. All rights reserved.
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 lg:py-32">
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

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-violet-600">
              Why teams choose Knowly
            </p>
            <h2 className="text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Everything you need to automate support
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-xl text-slate-600">
              Built for teams who want to ship better customer support without
              managing another bottleneck.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-[28px] border border-violet-100 bg-white p-8 shadow-[0_20px_50px_rgba(120,96,78,0.06)] transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(79,70,229,0.08)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
                <Rocket className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-900">
                Deploy in minutes
              </h3>
              <p className="text-slate-600">
                Upload docs, connect your knowledge base, and your AI agent is
                ready to answer support questions instantly.
              </p>
            </div>

            <div className="group rounded-[28px] border border-violet-100 bg-white p-8 shadow-[0_20px_50px_rgba(120,96,78,0.06)] transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(79,70,229,0.08)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-900">
                Private by default
              </h3>
              <p className="text-slate-600">
                Your data stays protected in a controlled environment with
                precise access and enterprise-grade safeguards.
              </p>
            </div>

            <div className="group rounded-[28px] border border-violet-100 bg-white p-8 shadow-[0_20px_50px_rgba(120,96,78,0.06)] transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(79,70,229,0.08)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/20">
                <BarChart3 className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-900">
                Track what matters
              </h3>
              <p className="text-slate-600">
                See which questions are resolved, where the knowledge gaps are,
                and how your assistant improves over time.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  Instant answers
                </h4>
                <p className="mt-1 text-slate-600">
                  Embed your assistant into any page and answer support
                  questions instantly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  Secure knowledge layer
                </h4>
                <p className="mt-1 text-slate-600">
                  Only the content you upload becomes part of the AI knowledge
                  model.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative isolate overflow-hidden py-20 lg:py-32">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)
            `,
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-4 text-lg font-semibold uppercase tracking-[0.22em] text-violet-600">
              Pricing
            </p>
            <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Start simple, scale when needed
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-xl text-slate-600">
              Transparent plans for teams that want an AI support layer without
              the operational overhead.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(120,96,78,0.06)]">
              <h3 className="text-2xl font-bold text-slate-900">Free</h3>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-black tracking-[-0.05em] text-slate-950">
                  $0
                </span>
                <span className="pb-2 text-slate-500">/month</span>
              </div>
              <ul className="mt-8 space-y-4 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  1 chatbot
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  10 documents
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  100 questions / month
                </li>
              </ul>
              <Link href="/signup" className="mt-8 block">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                >
                  Get started
                </Button>
              </Link>
            </div>

            <div className="relative rounded-[28px] border-2 border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-8 shadow-[0_24px_60px_rgba(99,102,241,0.12)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                Most popular
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Pro</h3>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-black tracking-[-0.05em] text-slate-950">
                  $19
                </span>
                <span className="pb-2 text-slate-500">/month</span>
              </div>
              <ul className="mt-8 space-y-4 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    ✓
                  </span>
                  5 chatbots
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    ✓
                  </span>
                  100 documents
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    ✓
                  </span>
                  2,000 questions / month
                </li>
              </ul>
              <Link href="/signup" className="mt-8 block">
                <Button className="w-full rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-violet-200 hover:brightness-110">
                  Upgrade now
                </Button>
              </Link>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(120,96,78,0.06)]">
              <h3 className="text-2xl font-bold text-slate-900">Business</h3>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-black tracking-[-0.05em] text-slate-950">
                  $49
                </span>
                <span className="pb-2 text-slate-500">/month</span>
              </div>
              <ul className="mt-8 space-y-4 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  20 chatbots
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  500 documents
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  10,000 questions / month
                </li>
              </ul>
              <Link href="/signup" className="mt-8 block">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                >
                  Contact sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-gradient-to-r from-[#0d1b3f] via-[#23163d] to-[#4a1d52] py-20 lg:py-24">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 40%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            Ready to turn support into a product advantage?
          </h2>
          <p className="mt-5 text-xl text-slate-200">
            Give your customers instant answers from the knowledge they already
            trust.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 px-8 py-6 text-base font-semibold text-white shadow-[0_18px_40px_rgba(99,102,241,0.35)] hover:brightness-110"
              >
                Start for free
              </Button>
            </Link>
          </div>
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
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Knowly
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Turn your knowledge into an AI support agent.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Security
                  </Link>
                </li>
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
