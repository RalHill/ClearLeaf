"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedChatDemo } from './utils';

export function HeroSection() {
  const [selectedProvince, setSelectedProvince] = useState('Ontario');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const provinces = ['Ontario', 'British Columbia', 'Alberta', 'Quebec'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedProvince(prev => {
        const currentIndex = provinces.indexOf(prev);
        return provinces[(currentIndex + 1) % provinces.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section 
      ref={heroRef}
      style={{ opacity: heroOpacity }}
      className="relative min-h-screen bg-gradient-to-b from-[#0F1F18] to-[#1A2E24] pt-24 pb-16 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiAvPjwvc3ZnPg==')]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Badge className="mb-6 bg-white/10 text-white border-white/20">
                🍁 Built for Canadian HR
              </Badge>
            </motion.div>

            <motion.h1 
              className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {['Canada\'s', 'Human', 'Resources', 'Intelligence', 'Platform.'].map((word, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: idx * 0.08,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className={`inline-block mr-3 ${word === 'Intelligence' ? 'text-[#3A8A6C]' : ''}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl text-white/80 mb-3 leading-relaxed"
            >
              Province-specific compliance guidance, live regulatory updates, and policy analysis — grounded in verified Canadian statute text.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-[#3A8A6C] font-semibold mb-8"
            >
              Get answers in seconds, not days
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="bg-[#3A8A6C] hover:bg-[#2C5F4F] text-white h-12 px-8 font-semibold">
                Start free — no credit card
              </Button>
              <a href="/contact" className="inline-flex">
                <Button size="lg" className="bg-white/15 hover:bg-white/25 text-white border border-white/30 h-12 px-8 font-semibold transition-all">
                  Schedule a demo
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="mt-12 flex items-center gap-4 text-white/60 text-sm"
            >
              <span>Trusted by HR professionals across Canada</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-[#E8E6E1]">
              <div className="bg-[#1A2E24] px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <Badge variant="secondary" className="bg-white/10 text-white text-xs border-white/20">
                    {selectedProvince}
                  </Badge>
                </div>
              </div>
              <div className="p-6 h-[400px] overflow-hidden">
                <AnimatedChatDemo />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
