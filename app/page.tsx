"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Check, Leaf } from "lucide-react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Resend/Supabase for email capture
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-dark-green/95 backdrop-blur z-50 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green to-mid-green flex items-center justify-center text-white text-lg">
              🍁
            </div>
            <span className="font-serif text-xl text-white font-light tracking-tight">
              ClearLeaf
            </span>
            <span className="text-xs text-white/40 font-light ml-2">
              HR Intelligence
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard/chat"
              className="px-4 py-2 bg-accent-green text-white text-sm font-medium rounded-lg hover:bg-accent-green/90 transition-colors"
            >
              Try free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-dark-green mb-6 font-light leading-tight">
            Canadian employment law,{" "}
            <span className="font-normal text-accent-green">instantly</span>
          </h1>

          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            ClearLeaf is the HR intelligence layer for Canada. Province-specific
            employment law guidance, live regulatory updates, policy templates,
            and guided walkthroughs — all built for Canadian employers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/dashboard/chat"
              className="px-6 py-3 bg-mid-green text-white rounded-lg font-medium hover:bg-mid-green/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              Start free trial <ChevronRight size={16} />
            </Link>
            <button className="px-6 py-3 bg-white border border-border-color text-near-black rounded-lg font-medium hover:bg-light-green transition-colors">
              Schedule demo
            </button>
          </div>

          {/* Hero graphic placeholder */}
          <div className="mt-16 rounded-2xl bg-gradient-to-b from-light-green to-off-white border border-border-color p-8 shadow-lg">
            <div className="bg-white rounded-xl p-6 space-y-3 h-96 flex flex-col justify-center items-center text-muted">
              <div className="text-5xl">💬</div>
              <p className="text-sm">Interactive chat UI preview</p>
              <p className="text-xs opacity-60">
                Ask anything about provincial employment standards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-16 bg-light-green border-y border-border-color">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl text-dark-green mb-4 font-light">
            Join the ClearLeaf community
          </h2>
          <p className="text-muted mb-8">
            Get notified when we launch full features and reach your province
          </p>

          <form onSubmit={handleWaitlist} className="flex gap-3 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.ca"
              className="flex-1 px-4 py-3 rounded-lg border border-border-color bg-white text-near-black placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-green"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-mid-green text-white rounded-lg font-medium hover:bg-mid-green/90 transition-colors"
            >
              Join waitlist
            </button>
          </form>

          {submitted && (
            <p className="text-sm text-accent-green font-medium">
              ✓ Thanks! We'll be in touch soon.
            </p>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl text-dark-green mb-16 text-center font-light">
            Built for Canadian HR
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📘",
                title: "Province-Specific",
                desc: "Get answers grounded in your province's actual statute text — not generic US-style HR guidance.",
              },
              {
                icon: "📰",
                title: "Live Regulatory Feed",
                desc: "Employment standards change weekly. We auto-update your knowledge base with new amendments, court rulings, and policy changes.",
              },
              {
                icon: "📋",
                title: "Legal Templates",
                desc: "Download reviewed termination letters, accommodation plans, harassment investigation templates — all province-compliant.",
              },
              {
                icon: "⚖️",
                title: "Province Compare",
                desc: "Manage multi-province teams? Compare vacation, notice periods, probation, and harassment policies side-by-side.",
              },
              {
                icon: "🗺️",
                title: "Guided Walkthroughs",
                desc: "Step-by-step processes for terminations, harassment complaints, accommodations, layoffs, and HR disputes — with checklists.",
              },
              {
                icon: "🔐",
                title: "Verified & Audited",
                desc: "Every answer cites the specific statute section. Confidence badges show when to consult a lawyer. No guessing.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-2xl border border-border-color hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-dark-green mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-light-green">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-4xl text-dark-green mb-4 text-center font-light">
            Simple pricing. No surprises.
          </h2>
          <p className="text-center text-muted mb-16 max-w-2xl mx-auto">
            Start free. Scale as you grow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                desc: "Get started",
                features: [
                  "5 queries/month",
                  "Ontario only",
                  "3 template downloads",
                  "Termination + Harassment walkthroughs",
                ],
              },
              {
                name: "Starter",
                price: "$49",
                period: "/month",
                desc: "Most popular",
                highlight: true,
                features: [
                  "Unlimited queries",
                  "Ontario only",
                  "All templates",
                  "All walkthroughs",
                  "1 team seat",
                  "90-day chat history",
                ],
              },
              {
                name: "Professional",
                price: "$99",
                period: "/month",
                desc: "Multi-province",
                features: [
                  "Unlimited queries",
                  "All 13 provinces + Federal",
                  "All templates + uploads",
                  "All walkthroughs",
                  "3 team seats",
                  "Unlimited history",
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl p-8 border ${
                  plan.highlight
                    ? "bg-white border-accent-green shadow-xl scale-105 md:scale-110"
                    : "bg-white border-border-color"
                }`}
              >
                <h3 className="text-xl font-semibold text-dark-green mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl font-light text-dark-green">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-muted">{plan.period}</span>
                  )}
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-medium mb-6 transition-colors ${
                    plan.highlight
                      ? "bg-mid-green text-white hover:bg-mid-green/90"
                      : "bg-light-green text-near-black hover:bg-border-color"
                  }`}
                >
                  Get started
                </button>

                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-accent-green mt-0.5" />
                      <span className="text-near-black">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 bg-dark-green text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-wide text-white/50 mb-4">
            Trusted by HR professionals across Canada
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {["CPHR Canada", "HR Leaders", "SME Compliance", "Legal Tech"].map(
              (org, i) => (
                <div key={i} className="text-sm font-light text-white/70">
                  {org}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl text-dark-green mb-6 font-light">
            Stop Googling. Start trusting.
          </h2>
          <p className="text-muted mb-8 text-lg">
            Get verified Canadian employment law answers in seconds. No legal
            advice disclaimers. No generic AI. Just statute text.
          </p>

          <Link
            href="/dashboard/chat"
            className="inline-flex items-center gap-2 px-8 py-3 bg-mid-green text-white rounded-lg font-medium hover:bg-mid-green/90 transition-colors"
          >
            Start your free trial <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-green text-white/70 text-sm py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-accent-green to-mid-green flex items-center justify-center text-white text-sm">
                🍁
              </div>
              <span className="font-serif text-white font-light">ClearLeaf</span>
            </div>
            <p className="text-xs text-white/50">
              Canada's HR Intelligence Layer
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium text-xs uppercase mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-xs uppercase mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-xs uppercase mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-xs">
          <p>© 2026 ClearLeaf. All rights reserved. | Solo founder · Built in Canada</p>
        </div>
      </footer>
    </div>
  );
}
