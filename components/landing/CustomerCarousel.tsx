"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export function CustomerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const testimonials = [
    {
      name: 'Sarah Chen',
      company: 'TechCorp HR',
      role: 'HR Director',
      review: 'ClearLeaf reduced our compliance research time by 80%. Instead of spending hours on employment standards, we get instant, accurate answers. It\'s a game-changer for our team.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      company: 'GrowthScale Inc.',
      role: 'People Operations Manager',
      review: 'As a growing company, we needed to understand employment law across multiple provinces. ClearLeaf made it simple and affordable. Our team now has confidence in our HR policies.',
      rating: 5
    },
    {
      name: 'Jessica MacLeod',
      company: 'Maritime Solutions Ltd.',
      role: 'COO',
      review: 'The policy compliance checker caught gaps in our termination procedures that we missed. Having a Canadian legal AI available 24/7 is invaluable for a small HR team like ours.',
      rating: 5
    }
  ];

  // Auto-rotate carousel every 6 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl text-[#1C1C1E] mb-3">
            Trusted by Canadian HR teams
          </h2>
          <p className="text-[#7A756E]">
            See how ClearLeaf is reducing compliance risk across Canada
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-8 border border-[#E8E6E1] bg-gradient-to-br from-[#F8F7F4] to-white">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-lg text-[#1C1C1E] mb-6 leading-relaxed italic">
                  "{currentTestimonial.review}"
                </p>

                {/* Customer Info */}
                <div className="border-t border-[#E8E6E1] pt-6">
                  <p className="font-semibold text-[#1C1C1E]">
                    {currentTestimonial.name}
                  </p>
                  <p className="text-sm text-[#7A756E]">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </p>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-lg border border-[#E8E6E1] hover:bg-[#F8F7F4] transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-[#3A8A6C]" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-lg border border-[#E8E6E1] hover:bg-[#F8F7F4] transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-[#3A8A6C]" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsAutoPlay(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-[#3A8A6C] w-6'
                    : 'bg-[#E8E6E1] hover:bg-[#D1D5DB]'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
