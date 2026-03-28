"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeatureRow, AnimatedChatDemo } from './utils';
import { MessageSquare, FileCheck, Columns, Zap, Shield, Users } from 'lucide-react';

export function FeaturesSection() {
  const featureCards = [
    {
      icon: MessageSquare,
      title: 'AI Chat',
      description: 'Ask anything. Get a cited answer in seconds. Province-specific responses grounded in verified statute text.'
    },
    {
      icon: FileCheck,
      title: 'Policy Compliance Checker',
      description: 'Upload your policy. Find out what\'s legally wrong with it. Get statute citations and suggested fixes.'
    },
    {
      icon: Columns,
      title: 'Province Comparison',
      description: 'Side-by-side comparison of employment standards across all 13 Canadian provinces. Always current, always cited.'
    },
    {
      icon: Zap,
      title: 'Live Updates',
      description: 'Never miss a legislative change. ClearLeaf monitors government sources daily for ESA amendments and tribunal decisions.'
    },
    {
      icon: Shield,
      title: 'Compliance Walkthroughs',
      description: 'Step-by-step guides for complex HR processes. From terminations to harassment investigations.'
    },
    {
      icon: Users,
      title: 'Multi-Province Support',
      description: 'Manage employees across provinces without a law degree. All 13 provinces plus Federal coverage.'
    }
  ];

  return (
    <section id="features" className="py-16 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-5xl text-[#1C1C1E] mb-4">Built for Canadian HR professionals</h2>
          <p className="text-xl text-[#7A756E] max-w-2xl mx-auto">
            Every feature designed to reduce compliance risk and save time
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {featureCards.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className="p-8 border border-[#E8E6E1] bg-white hover:border-[#3A8A6C] hover:shadow-md transition-all h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <Icon className="w-8 h-8 text-[#3A8A6C] flex-shrink-0 mt-1" />
                    <h3 className="font-semibold text-[#1C1C1E] text-lg">{feature.title}</h3>
                  </div>
                  <p className="text-[#7A756E] leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Feature Rows */}
        <div className="mt-16 pt-16 border-t border-[#E8E6E1]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl text-[#1C1C1E] mb-4">How ClearLeaf works in practice</h2>
            <p className="text-lg text-[#7A756E] max-w-2xl mx-auto">
              Deep dives into our key features and how they solve real HR compliance challenges
            </p>
          </motion.div>

          <FeatureRow
            title="Ask anything. Get a cited answer in seconds."
            description="Province-specific responses grounded in verified statute text. Every answer shows the exact legislation it cites, the section number, and a confidence rating. Know instantly when to escalate to legal counsel."
            visual={<AnimatedChatDemo />}
          />

          <FeatureRow
            title="Upload your policy. Find out what's legally wrong with it."
            description="Don't guess whether your termination clause meets Ontario ESA minimums. ClearLeaf reads your policy, compares every clause against current statute requirements, and tells you exactly what to fix — with the statute citation and suggested replacement language."
            visual={
              <Card className="p-6 border border-[#E8E6E1]">
                <Badge className="bg-[#EF4444] text-white mb-4">HIGH COMPLIANCE RISK</Badge>
                <div className="space-y-4">
                  <Card className="p-4 border-l-4 border-[#EF4444] bg-red-50">
                    <p className="text-sm font-mono text-[#7A756E] mb-2">"Employee may be terminated with 2 weeks notice"</p>
                    <p className="text-sm text-[#1C1C1E] mb-2">
                      <strong>Issue:</strong> Clause provides less than statutory minimum for employees with 3+ years service
                    </p>
                    <Badge className="bg-[#EEF4F1] text-[#2C5F4F] text-[11px] font-mono">
                      Ontario ESA 2000, s.57(1)
                    </Badge>
                  </Card>
                  <Card className="p-4 border-l-4 border-[#D4823A] bg-amber-50">
                    <p className="text-sm font-mono text-[#7A756E] mb-2">"Termination without cause at employer discretion"</p>
                    <p className="text-sm text-[#1C1C1E] mb-2">
                      <strong>Issue:</strong> Missing reference to statutory entitlements may not limit common law notice
                    </p>
                    <Badge className="bg-[#EEF4F1] text-[#2C5F4F] text-[11px] font-mono">
                      Ontario ESA 2000, s.5(1)
                    </Badge>
                  </Card>
                </div>
              </Card>
            }
            reverse
          />

          <FeatureRow
            title="Manage employees across provinces without a law degree."
            description="Side-by-side comparison of employment standards across all 13 Canadian provinces. Termination notice, vacation entitlement, harassment investigation requirements, probation periods — always current, always cited."
            visual={
              <Card className="overflow-hidden border border-[#E8E6E1]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#1A2E24] text-white">
                        <th className="px-4 py-3 text-left text-sm font-semibold">Requirement</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Ontario</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">BC</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Quebec</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="px-4 py-3 text-sm font-medium">Termination Notice (5 years)</td>
                        <td className="px-4 py-3 text-sm">5 weeks</td>
                        <td className="px-4 py-3 text-sm">5 weeks</td>
                        <td className="px-4 py-3 text-sm border-l-4 border-[#D4823A]">4 weeks</td>
                      </tr>
                      <tr className="bg-[#F3F2EF]">
                        <td className="px-4 py-3 text-sm font-medium">Vacation (1 year)</td>
                        <td className="px-4 py-3 text-sm">2 weeks</td>
                        <td className="px-4 py-3 text-sm">2 weeks</td>
                        <td className="px-4 py-3 text-sm">2 weeks</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-4 py-3 text-sm font-medium">Probation Period</td>
                        <td className="px-4 py-3 text-sm">3 months</td>
                        <td className="px-4 py-3 text-sm">3 months</td>
                        <td className="px-4 py-3 text-sm">3 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            }
          />
        </div>
      </div>
    </section>
  );
}
