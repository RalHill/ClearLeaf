"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  annualPrice?: string;
  planKey?: 'starter' | 'professional';
  features: Array<{ text: string; included: boolean }>;
  popular?: boolean;
  cta: string;
  ctaHref?: string;
}

function PricingCard({
  name,
  price,
  annualPrice,
  planKey,
  features,
  popular = false,
  cta,
  ctaHref,
  annual,
  onCheckout,
}: Plan & { annual: boolean; onCheckout: (plan: 'starter' | 'professional', billing: 'monthly' | 'annual') => void }) {
  const displayPrice = annual && annualPrice ? annualPrice : price;
  const period = price === 'Free' || price === 'Custom' ? '' : annual ? '/mo billed annually' : '/mo';

  return (
    <div
      className={`relative flex flex-col p-8 rounded-xl border bg-white ${
        popular
          ? 'border-[#2C5F4F] border-2 scale-105 shadow-lg'
          : 'border-[#E8E6E1]'
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3A8A6C] text-white text-xs font-semibold px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl text-[#1C1C1E] mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="font-serif text-5xl text-[#1C1C1E]">{displayPrice}</span>
          {period && <span className="text-[#7A756E] text-sm">{period}</span>}
        </div>
        {annual && annualPrice && (
          <p className="text-xs text-[#3A8A6C] mt-1 font-medium">Save 20% vs monthly</p>
        )}
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            {feature.included ? (
              <Check className="w-5 h-5 text-[#3A8A6C] flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-[#7A756E] opacity-30 flex-shrink-0 mt-0.5" />
            )}
            <span className={`text-sm ${feature.included ? 'text-[#1C1C1E]' : 'text-[#7A756E] opacity-50'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          if (planKey) {
            onCheckout(planKey, annual ? 'annual' : 'monthly');
          } else if (ctaHref) {
            window.location.href = ctaHref;
          }
        }}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-colors ${
          popular
            ? 'bg-[#2C5F4F] hover:bg-[#3A8A6C] text-white'
            : 'bg-[#3A8A6C] hover:bg-[#2C5F4F] text-white'
        }`}
      >
        {cta}
      </button>
    </div>
  );
}

export function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan: 'starter' | 'professional', billing: 'monthly' | 'annual') => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === 'Unauthorized') {
        // Not logged in — send to signup
        window.location.href = `/signup?plan=${plan}&billing=${billing}`;
      } else {
        alert(data.error ?? 'Could not start checkout. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const plans: Plan[] = [
    {
      name: 'Free',
      price: 'Free',
      features: [
        { text: '5 AI chat queries/month', included: true },
        { text: 'News feed access', included: true },
        { text: 'Province comparison tool', included: true },
        { text: '2 guided walkthroughs', included: true },
        { text: 'Policy compliance checker', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Start free',
      ctaHref: '/signup',
    },
    {
      name: 'Starter',
      price: '$49',
      annualPrice: '$39',
      planKey: 'starter',
      features: [
        { text: '100 AI chat queries/month', included: true },
        { text: 'Full news feed', included: true },
        { text: 'Full province compare', included: true },
        { text: 'All 5 guided walkthroughs', included: true },
        { text: '5 policy compliance checks/month', included: true },
        { text: 'Priority support', included: false },
      ],
      cta: loading ? 'Loading…' : 'Start with Starter',
    },
    {
      name: 'Professional',
      price: '$149',
      annualPrice: '$119',
      planKey: 'professional',
      popular: true,
      features: [
        { text: 'Unlimited AI chat queries', included: true },
        { text: 'Full news feed + alerts', included: true },
        { text: 'Full province compare', included: true },
        { text: 'All 5 guided walkthroughs', included: true },
        { text: 'Unlimited policy checks', included: true },
        { text: 'Priority support', included: true },
      ],
      cta: loading ? 'Loading…' : 'Start with Professional',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom training', included: true },
        { text: 'SLA guarantee', included: true },
      ],
      cta: 'Contact sales',
      ctaHref: '/contact',
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-serif text-5xl text-[#1C1C1E] mb-4">
            Start free. Upgrade when it clicks.
          </h2>
          <p className="text-xl text-[#7A756E] mb-6">No credit card required. Cancel anytime.</p>

          {/* Annual toggle */}
          <div className="inline-flex items-center gap-3 bg-white border border-[#E8E6E1] rounded-full px-4 py-2">
            <span className={`text-sm ${!annual ? 'text-[#1C1C1E] font-semibold' : 'text-[#7A756E]'}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                annual ? 'bg-[#3A8A6C]' : 'bg-[#E8E6E1]'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  annual ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-[#1C1C1E] font-semibold' : 'text-[#7A756E]'}`}>
              Annual
            </span>
            {annual && (
              <span className="bg-[#3A8A6C] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12 items-start">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <PricingCard {...plan} annual={annual} onCheckout={handleCheckout} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
