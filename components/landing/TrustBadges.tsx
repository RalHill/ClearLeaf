"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Cloud, ShieldCheck } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: Lock,
      label: 'AES-256 Encrypted',
      description: 'Military-grade data encryption'
    },
    {
      icon: Cloud,
      label: 'GDPR Compliant',
      description: 'International data protection'
    },
    {
      icon: ShieldCheck,
      label: 'PIPEDA Compliant',
      description: 'Canadian privacy certified'
    }
  ];

  return (
    <section className="py-12 bg-[#F8F7F4] border-y border-[#E8E6E1]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-center gap-4 text-center"
              >
                <div className="flex-shrink-0">
                  <Icon className="w-8 h-8 text-[#3A8A6C]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1C1C1E] text-sm">{badge.label}</p>
                  <p className="text-xs text-[#7A756E]">{badge.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
