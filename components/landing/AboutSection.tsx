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

export function ScenarioQuestionsSection() {
  const scenarios = [
    {
      province: 'ON',
      topic: 'Termination',
      question: 'I have a 3-year employee in Ontario. Can I terminate without cause?',
      color: '#2d6a4f'
    },
    {
      province: 'BC',
      topic: 'Harassment',
      question: 'How do I investigate a workplace harassment complaint in BC?',
      color: '#9b4400'
    },
    {
      province: 'Federal',
      topic: 'Leave',
      question: 'What are the bereavement leave rules for federally regulated employees?',
      color: '#1a4480'
    },
    {
      province: 'QC',
      topic: 'Psychological Harassment',
      question: 'What counts as psychological harassment under Quebec law?',
      color: '#7b3f6e'
    },
    {
      province: 'AB',
      topic: 'Overtime',
      question: 'Are contractors entitled to overtime pay in Alberta?',
      color: '#6b3410'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate carousel every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % scenarios.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [scenarios.length]);

  return (
    <section className="py-16 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-5xl text-[#1C1C1E] mb-4">Real scenarios HR teams ask about</h2>
          <p className="text-xl text-[#7A756E] max-w-3xl mx-auto">
            Click "Try in chat" to ask any question directly. Every answer is grounded in verified Canadian statute text, cited with section numbers, and marked with a confidence rating.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative h-[280px]">
            {/* Carousel items */}
            {scenarios.map((item, idx) => (
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
                <Card className="p-8 border border-[#E8E6E1] h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-semibold text-[#7A756E]">{item.province}</span>
                          <span className="text-xs text-[#7A756E]">·</span>
                          <span className="text-sm text-[#7A756E]">{item.topic}</span>
                        </div>
                        <h3 className="font-semibold text-[#1C1C1E] text-xl leading-relaxed">
                          {item.question}
                        </h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        // Copy question to clipboard for easy paste into chat
                        navigator.clipboard.writeText(item.question);
                        // In production, could also navigate to chat with prefilled text
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-colors"
                      style={{ backgroundColor: item.color }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'brightness(1)';
                      }}
                    >
                      <span>Try in chat</span>
                      <span className="text-lg">→</span>
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {scenarios.map((_, idx) => (
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
