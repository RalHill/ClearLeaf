"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/landing/Navigation';
import { TrustBadges } from '@/components/landing/TrustBadges';
import { Footer } from '@/components/landing/SectionsGroup';
import { Card } from '@/components/ui/card';
import { Lock, Shield, Eye, Server } from 'lucide-react';

export default function SecurityCompliancePage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Navigation onLandingPage={false} />

      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-[#1A2E24] to-[#2C5F4F] mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
              Security & Compliance
            </h1>
            <p className="text-xl text-white/80">
              Your data security and privacy are our top priority. Learn how we protect your information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Security Details */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl text-[#1C1C1E] mb-12 text-center"
          >
            How We Protect Your Data
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Lock,
                title: 'End-to-End Encryption',
                description: 'All data in transit is encrypted using AES-256, the same encryption standard used by governments and financial institutions.'
              },
              {
                icon: Shield,
                title: 'PIPEDA Compliant',
                description: 'ClearLeaf fully complies with the Personal Information Protection and Electronic Documents Act, Canada\'s federal privacy law.'
              },
              {
                icon: Server,
                title: 'Secure Infrastructure',
                description: 'Hosted on AWS with multiple redundancy, automatic backups, and disaster recovery protocols.'
              },
              {
                icon: Eye,
                title: 'Privacy Controls',
                description: 'You control who has access to your data. We never sell or share your information with third parties.'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-8 border border-[#E8E6E1]">
                    <Icon className="w-12 h-12 text-[#3A8A6C] mb-4" />
                    <h3 className="font-semibold text-[#1C1C1E] text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[#7A756E] leading-relaxed">
                      {item.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl text-[#1C1C1E] mb-8 text-center"
          >
            Our Commitments
          </motion.h2>

          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              'PIPEDA Compliance - Canadian privacy law adherence',
              'AES-256 Encryption - Military-grade data protection',
              'AWS Infrastructure - Enterprise-grade security and reliability',
              'Regular Security Audits - Third-party security assessments',
              'Data Residency - All Canadian data stored in Canada',
              'SLA Guarantees - 99.9% uptime commitment'
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 bg-[#F8F7F4] rounded-lg"
              >
                <Shield className="w-6 h-6 text-[#3A8A6C] flex-shrink-0" />
                <span className="text-[#1C1C1E]">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
