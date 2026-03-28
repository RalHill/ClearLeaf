"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 bg-[#1A2E24]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-5xl text-white text-center mb-12"
        >
          How It Works
        </motion.h2>

        <div className="space-y-12 relative">
          <div className="absolute left-12 top-0 bottom-0 w-px bg-white/20 hidden md:block" />
          
          {[
            {
              number: '01',
              title: 'Upload or ask.',
              description: 'Paste your question or upload your HR policy document.'
            },
            {
              number: '02',
              title: 'ClearLeaf retrieves the law.',
              description: 'Province-filtered similarity search against verified Canadian statute text. No hallucination. No American law. No expired regulations.'
            },
            {
              number: '03',
              title: 'Get a cited, actionable answer.',
              description: 'Statute citation, confidence rating, and next steps. Every time.'
            }
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="flex gap-8 relative"
            >
              <div className="font-serif text-8xl text-white/15 flex-shrink-0 w-24">{step.number}</div>
              <div className="pt-4">
                <h3 className="font-serif text-3xl text-white mb-3">{step.title}</h3>
                <p className="text-lg text-white/70 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NeverMissLegislativeChangeSection() {
  const newsItems = [
    {
      province: 'ON',
      headline: 'Ontario ESA Amendment — Sick Leave Provisions Updated',
      source: 'Government Source',
      daysAgo: 2
    },
    {
      province: 'BC',
      headline: 'BC Human Rights Tribunal: Employer Liability in Harassment Cases',
      source: 'Tribunal Decision',
      daysAgo: 5
    },
    {
      province: 'Federal',
      headline: 'ESDC announces changes to parental leave top-up',
      source: 'Government Announcement',
      daysAgo: 7
    },
    {
      province: 'QC',
      headline: 'Quebec Labour Standards: New Harassment Prevention Requirements',
      source: 'Legislation Update',
      daysAgo: 3
    },
    {
      province: 'AB',
      headline: 'Alberta Employment Standards Code Update — Overtime Rules',
      source: 'Government Update',
      daysAgo: 4
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate carousel every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  return (
    <section className="py-16 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-5xl text-[#1C1C1E] mb-4">Never miss a legislative change.</h2>
          <p className="text-xl text-[#7A756E] max-w-3xl mx-auto">
            ClearLeaf monitors 12 Canadian government, tribunal, and industry sources daily. When something changes — ESA amendment, HRTO decision, new OHS regulation — you know within 24 hours.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative h-[240px]">
            {/* Carousel items */}
            {newsItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: idx === currentIndex ? 1 : 0,
                  y: idx === currentIndex ? 0 : 20,
                  transition: { duration: 0.5 }
                }}
                className="absolute inset-0"
              >
                <Card className="p-6 border border-[#E8E6E1] h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-[#2C5F4F] mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs uppercase text-[#7A756E] mb-1">{item.source}</p>
                        <h3 className="font-semibold text-[#1C1C1E] text-lg">
                          {item.headline}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-between items-center">
                    <Badge variant="secondary" className="bg-[#EEF4F1] text-[#2C5F4F]">
                      {item.province}
                    </Badge>
                    <span className="text-sm text-[#7A756E]">{item.daysAgo} days ago</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {newsItems.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                initial={{ scale: 1 }}
                animate={{
                  scale: idx === currentIndex ? 1.2 : 1,
                  backgroundColor: idx === currentIndex ? '#2C5F4F' : '#E8E6E1'
                }}
                className="w-2 h-2 rounded-full transition-all"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
