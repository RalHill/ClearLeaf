"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/landing/Navigation';
import { Footer } from '@/components/landing/SectionsGroup';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormState({ name: '', email: '', company: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Let's talk about your compliance needs.
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Schedule a demo, ask questions, or discuss how ClearLeaf can help reduce compliance risk at your organization.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {/* Contact Info Cards */}
            {[
              {
                icon: Mail,
                title: 'Email',
                detail: 'hello@clearleaf.ca',
                description: 'Get in touch via email'
              },
              {
                icon: Phone,
                title: 'Schedule a Demo',
                detail: 'Book a call',
                description: 'See ClearLeaf in action'
              },
              {
                icon: MapPin,
                title: 'Location',
                detail: 'Canada',
                description: 'Supporting all 13 provinces'
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
                  <Card className="p-8 text-center border border-[#E8E6E1] hover:border-[#3A8A6C] transition-colors">
                    <Icon className="w-12 h-12 text-[#3A8A6C] mx-auto mb-4" />
                    <h3 className="font-semibold text-[#1C1C1E] text-lg mb-1">{item.title}</h3>
                    <p className="text-[#3A8A6C] font-semibold mb-2">{item.detail}</p>
                    <p className="text-[#7A756E] text-sm">{item.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-12 border border-[#E8E6E1]">
              <h2 className="font-serif text-3xl text-[#1C1C1E] mb-8 text-center">Send us a message</h2>
              
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-[#D1FAE5] border border-[#10B981] rounded-lg text-[#065F46]"
                >
                  <p className="font-semibold">✓ Message sent successfully!</p>
                  <p className="text-sm">We'll be in touch within 24 hours.</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#E8E6E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A8A6C] bg-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#E8E6E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A8A6C] bg-white"
                      placeholder="your@company.ca"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#E8E6E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A8A6C] bg-white"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-[#E8E6E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A8A6C] bg-white resize-none"
                    placeholder="Tell us about your HR compliance challenges..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#3A8A6C] hover:bg-[#2C5F4F] text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {isSubmitting ? 'Sending...' : 'Send message'}
                  {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </form>

              <p className="text-center text-[#7A756E] text-sm mt-6">
                We typically respond within 24 hours. For urgent matters, email us directly at hello@clearleaf.ca
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white border-t border-[#E8E6E1]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-4xl text-[#1C1C1E] text-center mb-16">Still have questions?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: 'How long does a demo take?',
                a: 'Our demos typically last 30-45 minutes. We customize the walkthrough based on your specific HR challenges.'
              },
              {
                q: 'Do you offer a free trial?',
                a: 'Yes! Start free with no credit card required. Upgrade anytime when you need advanced features.'
              },
              {
                q: 'What industries do you serve?',
                a: 'We support HR teams across all industries managing employees in Canada—from startups to enterprises.'
              },
              {
                q: 'Can I integrate ClearLeaf with our tools?',
                a: 'We\'re building API integrations. Contact us to discuss custom integration requirements for your tech stack.'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 border border-[#E8E6E1]">
                  <h3 className="font-semibold text-[#1C1C1E] mb-3">{item.q}</h3>
                  <p className="text-[#7A756E]">{item.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
