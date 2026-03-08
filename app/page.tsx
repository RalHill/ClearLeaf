"use client";

import React from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { Pricing } from "@/components/ui/pricing";

const CLEARLEAF_PLANS = [
  {
    name: "FREE",
    price: "0",
    yearlyPrice: "0",
    period: "Forever free",
    features: [
      "5 monthly queries",
      "Ontario only",
      "3 policy templates",
      "Basic support",
      "Community access",
    ],
    description: "Perfect for getting started",
    buttonText: "Start Free",
    href: "/dashboard/chat",
    isPopular: false,
  },
  {
    name: "STARTER",
    price: "49",
    yearlyPrice: "39",
    period: "per month",
    features: [
      "Unlimited queries (Ontario)",
      "1 team seat",
      "All policy templates",
      "Email support",
      "Usage analytics",
      "Chat history",
    ],
    description: "For individual HR professionals",
    buttonText: "Get Started",
    href: "/dashboard/chat?plan=starter",
    isPopular: false,
  },
  {
    name: "PROFESSIONAL",
    price: "99",
    yearlyPrice: "79",
    period: "per month",
    features: [
      "All 13 Canadian provinces",
      "3 team seats",
      "90-day chat history",
      "Advanced analytics",
      "Priority support",
      "All walkthroughs",
      "Custom integrations",
    ],
    description: "Ideal for growing teams",
    buttonText: "Get Started",
    href: "/dashboard/chat?plan=professional",
    isPopular: true,
  },
  {
    name: "TEAM",
    price: "199",
    yearlyPrice: "159",
    period: "per month",
    features: [
      "Everything in Professional",
      "10 team seats",
      "Admin dashboard",
      "Unlimited chat history",
      "SSO authentication",
      "Dedicated support",
      "Custom contracts",
      "SLA guarantee",
    ],
    description: "For large organizations",
    buttonText: "Contact Sales",
    href: "mailto:sales@clearleaf.ca?subject=Team%20Plan%20Inquiry",
    isPopular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-off-white">
        <Pricing
          plans={CLEARLEAF_PLANS}
          title="Simple, Transparent Pricing"
          description="Choose the plan that fits your HR team's needs.
All plans include province-specific employment law guidance, policy templates, and live regulatory updates."
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-light-green border-y border-border-color">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl text-dark-green text-center mb-4 font-light">
            Everything you need for HR compliance
          </h2>
          <p className="text-center text-muted max-w-2xl mx-auto mb-12">
            Built from the ground up for Canadian employment law
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🗺️",
                title: "Province-Specific Guidance",
                description:
                  "Get accurate legal information for all 13 Canadian provinces and territories",
              },
              {
                icon: "📰",
                title: "Live Regulatory Updates",
                description:
                  "Stay current with employment law changes as they happen",
              },
              {
                icon: "📋",
                title: "Policy Templates",
                description:
                  "Download legally-reviewed templates for termination, accommodation, and more",
              },
              {
                icon: "⚖️",
                title: "Province Comparison",
                description:
                  "Compare employment standards across provinces side-by-side",
              },
              {
                icon: "🛤️",
                title: "HR Walkthroughs",
                description:
                  "Step-by-step guidance for complex HR situations",
              },
              {
                icon: "👥",
                title: "Team Collaboration",
                description:
                  "Invite team members and share knowledge across your organization",
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-dark-green mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-off-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-dark-green mb-4 font-light">
            Ready to simplify HR compliance?
          </h2>
          <p className="text-muted mb-8">
            Join HR professionals across Canada using ClearLeaf for
            province-specific employment law guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard/chat"
              className="px-8 py-3 bg-mid-green text-white rounded-lg font-medium hover:bg-mid-green/90 transition-colors inline-flex items-center justify-center"
            >
              Start Free Trial
            </a>
            <a
              href="mailto:demo@clearleaf.ca?subject=ClearLeaf%20Demo%20Request"
              className="px-8 py-3 bg-white border border-border-color text-dark-green rounded-lg font-medium hover:bg-light-green transition-colors inline-flex items-center justify-center"
            >
              Request Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-green text-white/70 py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green to-mid-green flex items-center justify-center text-white text-lg">
                  🍁
                </div>
                <span className="font-serif text-lg text-white font-light">
                  ClearLeaf
                </span>
              </div>
              <p className="text-sm">Canada's HR Intelligence Layer</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/docs/terms-of-service" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="/docs/privacy-policy" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm">
            <p>
              © 2026 ClearLeaf. All rights reserved. Empowering Canadian HR
              professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
