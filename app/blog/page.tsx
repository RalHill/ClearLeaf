"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/landing/Navigation';
import { Footer } from '@/components/landing/SectionsGroup';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding PIPEDA Compliance for Canadian HR Teams',
      excerpt: 'A comprehensive guide to protecting employee data under Canadian privacy law.',
      category: 'Compliance',
      date: 'March 7, 2026',
      readTime: '8 min read'
    },
    {
      id: 2,
      title: 'Employment Standards Across Canada: Key Differences You Need to Know',
      excerpt: 'Navigate the complexity of employment law across 13 Canadian provinces.',
      category: 'HR Law',
      date: 'March 1, 2026',
      readTime: '12 min read'
    },
    {
      id: 3,
      title: 'How to Create a Compliant Termination Policy',
      excerpt: 'Step-by-step guide to ensure your termination procedures meet statutory requirements.',
      category: 'Best Practices',
      date: 'February 24, 2026',
      readTime: '10 min read'
    }
  ];

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
              ClearLeaf Blog
            </h1>
            <p className="text-xl text-white/80">
              Stay updated on Canadian employment law, HR compliance, and best practices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-6">
            {blogPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-8 border border-[#E8E6E1] hover:border-[#3A8A6C] hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-[#EEF4F1] text-[#2C5F4F]">
                      {post.category}
                    </Badge>
                    <span className="text-sm text-[#7A756E]">{post.date}</span>
                  </div>
                  <h2 className="font-serif text-2xl text-[#1C1C1E] mb-3">
                    {post.title}
                  </h2>
                  <p className="text-[#7A756E] mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#7A756E]">{post.readTime}</span>
                    <ArrowRight className="w-5 h-5 text-[#3A8A6C]" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl text-[#1C1C1E] mb-4">
            More insights coming soon
          </h2>
          <p className="text-[#7A756E] text-lg">
            Subscribe to our blog to stay updated on Canadian employment law trends and best practices.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
