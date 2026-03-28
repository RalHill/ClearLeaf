"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AnimatedCounter, FAQItem, NewsMarquee } from './utils';

export function StatsSection() {
  const stats = [
    { number: 13, label: 'Canadian provinces covered' },
    { number: 500, label: '+statute sections indexed' },
    { number: 99.2, label: 'Overall accuracy', percent: true },
    { number: 100, label: 'Canadian employment law — no US content', percent: true }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl font-serif text-[#2C5F4F] mb-2">
                <AnimatedCounter end={stat.number} />
                {stat.percent && '%'}
              </div>
              <p className="text-[#7A756E]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsSection() {
  return (
    <section className="py-24 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-serif text-5xl text-[#1C1C1E] mb-4">Stay on top of regulatory changes</h2>
          <p className="text-xl text-[#7A756E] max-w-2xl">
            Employment law doesn't stay still. ClearLeaf tracks updates across all provinces and alerts you when new requirements affect your policies.
          </p>
        </motion.div>
        <NewsMarquee />
      </div>
    </section>
  );
}

export function FeaturesHighlights() {
  const features = [
    {
      icon: Shield,
      title: 'Liability Protection',
      description: 'Documented compliance reduces legal risk. Every recommendation is grounded in statute law.'
    },
    {
      icon: Zap,
      title: 'Save 40 hours/year',
      description: 'Stop manual compliance checking. ClearLeaf automates what lawyers charge $400+/hr to do.'
    },
    {
      icon: BookOpen,
      title: 'Live Statute Updates',
      description: 'When Ontario ESA changes, your compliance checks automatically reflect the new requirements.'
    },
    {
      icon: Users,
      title: 'Built for teams',
      description: 'One person finds a gap, your whole team knows. Shared compliance intelligence.'
    },
    {
      icon: TrendingUp,
      title: 'Predictable costs',
      description: 'No surprise bills. Transparent pricing, start free and upgrade anytime to a plan that suits your team size.'
    },
    {
      icon: Sparkles,
      title: 'Canadian-first design',
      description: 'Not a US tool retrofitted for Canada. Built from the ground up for Canadian employment law.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Icon className="w-10 h-10 text-[#3A8A6C] mb-4" />
                <h3 className="text-xl font-semibold text-[#1C1C1E] mb-2">{feature.title}</h3>
                <p className="text-[#7A756E]">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function DidYouKnowSection() {
  const didYouKnowFacts = [
    { icon: Shield, label: 'All 13 provinces + federal', detail: 'Complete Canadian coverage' },
    { icon: BookOpen, label: '500+ statute sections', detail: 'Verified and indexed' },
    { icon: Sparkles, label: 'Province-specific ESA', detail: 'Not US law retrofitted' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24"
    >
      <div className="bg-white border border-[#E8E6E1] rounded-xl p-12">
        <h3 className="font-serif text-3xl text-[#1C1C1E] text-center mb-12">Did you know?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {didYouKnowFacts.map((fact, idx) => {
            const Icon = fact.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <Icon className="w-12 h-12 text-[#3A8A6C] mx-auto mb-4" />
                <h4 className="font-semibold text-[#1C1C1E] mb-2">{fact.label}</h4>
                <p className="text-[#7A756E] text-sm">{fact.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export function FAQSection() {
  const urgencyText = 'Join Canadian HR teams reducing compliance risk';
  
  const faqs = [
    {
      question: 'How current is the statue information?',
      answer: 'We track provincial legislative updates continuously. When Ontario, BC, or any province updates employment standards, our knowledge base updates within 48 hours. Every citation in your compliance report includes the amendment date.'
    },
    {
      question: 'Is this legal advice?',
      answer: 'No. ClearLeaf is informational only and does not constitute legal advice. We recommend having a qualified Canadian employment lawyer review any policy changes before implementation. The tool is designed to flag risks and save time, not replace legal counsel.'
    },
    {
      question: 'Can I use this for a multi-provincial company?',
      answer: 'Yes. You can run compliance checks per province and use the Compare feature to side-by-side requirements across all provinces your company operates in. This is the intended use case for Professional and Enterprise plans.'
    },
    {
      question: 'What about Quebec? Is it different?',
      answer: 'Quebec\'s employment law (Quebéc Labour Standards Act) is substantially different from English common law provinces. ClearLeaf handles Quebec separately with province-specific knowledge base and citations. French language policies are on the roadmap but not yet supported.'
    },
    {
      question: 'Can I export compliance reports?',
      answer: 'Yes. The compliance checker generates a PDF report with all findings, citations, and recommendations. You can print or save this for your records or to send to your legal counsel.'
    },
    {
      question: 'Do you offer API access?',
      answer: 'Not yet, but it\'s on the roadmap for Enterprise customers. Contact sales@clearleaf.ca to discuss custom integration requirements.'
    }
  ];

  return (
    <section className="py-20 bg-[#F8F7F4]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Did You Know Section */}
        <DidYouKnowSection />

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <div id="faq"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-5xl text-[#1C1C1E] mb-4">Common questions</h2>
          </motion.div>
          <div className="bg-white rounded-lg p-8 border border-[#E8E6E1]">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#1A2E24] to-[#2C5F4F]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-5xl text-white mb-4">
            Stop guessing about compliance. Start knowing.
          </h2>
          <p className="text-xl text-white/80 mb-6">
            Get answers in seconds, not days
          </p>
          <p className="text-lg text-[#3A8A6C] font-semibold mb-8">
            Join Canadian HR teams reducing compliance risk
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#2C5F4F] hover:bg-[#F8F7F4] h-12 px-8 font-semibold">
              Try free — no credit card
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a href="/contact" className="inline-flex">
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border border-white/40 h-12 px-8 font-semibold transition-all">
                Schedule a demo
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const footerLinks = {
    product: [
      { label: 'Overview', href: '#' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Features', href: '#features' }
    ],
    company: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' }
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' }
    ]
  };

  return (
    <footer className="bg-[#1A2E24] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div>
            <div className="font-serif text-2xl mb-2">🍁 ClearLeaf</div>
            <p className="text-white/60 text-sm">Canada's human resources intelligence platform.</p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 capitalize">{category}</h4>
              <ul className="space-y-2">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="bg-white/10" />
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
          <p>&copy; 2026 ClearLeaf. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
