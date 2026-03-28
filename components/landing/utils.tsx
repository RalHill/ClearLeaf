"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export const AnimatedCounter = ({ end, duration = 1.5 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return <div ref={ref}>{count}</div>;
};

export const NewsMarquee = () => {
  const headlines = [
    { text: "Ontario ESA Amendment — Sick Leave Provisions Updated", province: "ON" },
    { text: "BC Human Rights Tribunal: Employer Liability in Harassment Cases", province: "BC" },
    { text: "ESDC announces changes to parental leave top-up rules", province: "Federal" },
    { text: "Alberta Employment Standards Code Update — Overtime Rules", province: "AB" },
    { text: "Quebec Labour Standards Act: New Harassment Prevention Requirements", province: "QC" },
  ];

  return (
    <div className="overflow-hidden relative w-full py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...headlines, ...headlines].map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2 mx-3 px-4 py-2 bg-white border border-[#E8E6E1] rounded-full"
          >
            <Badge variant="secondary" className="bg-[#EEF4F1] text-[#2C5F4F] text-xs">
              {item.province}
            </Badge>
            <span className="text-sm text-[#1C1C1E]">{item.text}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export const ChatMessage = ({ isUser, children, source, confidence }: { 
  isUser: boolean; 
  children: React.ReactNode;
  source?: string;
  confidence?: 'high' | 'medium' | 'low';
}) => {
  const confidenceColors = {
    high: 'bg-[#3A8A6C] text-white',
    medium: 'bg-[#D4823A] text-white',
    low: 'bg-[#EF4444] text-white'
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] ${isUser ? 'max-w-[65%]' : ''}`}>
        <div
          className={`px-4 py-3 ${
            isUser
              ? 'bg-[#2C5F4F] text-white rounded-2xl rounded-br-sm'
              : 'bg-white border border-[#E8E6E1] rounded-sm rounded-tl-2xl rounded-br-2xl rounded-bl-2xl'
          }`}
        >
          <p className="text-sm leading-relaxed">{children}</p>
        </div>
        {!isUser && (source || confidence) && (
          <div className="flex gap-2 mt-2">
            {source && (
              <Badge variant="secondary" className="bg-[#EEF4F1] text-[#2C5F4F] text-[11px] font-mono">
                {source}
              </Badge>
            )}
            {confidence && (
              <Badge className={`text-[11px] ${confidenceColors[confidence]}`}>
                {confidence === 'high' ? 'High Confidence' : confidence === 'medium' ? 'Medium Confidence' : 'Low Confidence'}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const AnimatedChatDemo = () => {
  const [messages, setMessages] = useState<Array<{ isUser: boolean; text: string; source?: string; confidence?: 'high' | 'medium' | 'low' }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages([{ isUser: true, text: "What is the notice period for terminating a 6-year employee in Ontario?" }]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTyping(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        isUser: false, 
        text: "In Ontario, an employee with 6 years of service is entitled to 6 weeks of notice under the Employment Standards Act, 2000.",
        source: "Ontario ESA 2000, s.57(1)",
        confidence: "high"
      }]);

      await new Promise(resolve => setTimeout(resolve, 8000));
      setMessages([]);
      setIsTyping(false);
    };

    sequence();
    const interval = setInterval(sequence, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#F8F7F4] rounded-lg p-6 h-[400px] overflow-y-auto">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} isUser={msg.isUser} source={msg.source} confidence={msg.confidence}>
          {msg.text}
        </ChatMessage>
      ))}
      {isTyping && (
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 bg-[#3A8A6C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#3A8A6C] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
          <div className="w-2 h-2 bg-[#3A8A6C] rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
      )}
    </div>
  );
};

export const FeatureRow = ({ 
  title, 
  description, 
  visual, 
  reverse = false 
}: { 
  title: string; 
  description: string; 
  visual: React.ReactNode; 
  reverse?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className={`grid md:grid-cols-2 gap-12 items-center mb-24 ${reverse ? 'md:grid-flow-dense' : ''}`}>
      <motion.div
        initial={{ opacity: 0, x: reverse ? 30 : -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reverse ? 30 : -30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={reverse ? 'md:col-start-2' : ''}
      >
        <h3 className="font-serif text-4xl text-[#1C1C1E] mb-4">{title}</h3>
        <p className="text-lg text-[#7A756E] leading-relaxed">{description}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: reverse ? -30 : 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reverse ? -30 : 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={reverse ? 'md:col-start-1 md:row-start-1' : ''}
      >
        {visual}
      </motion.div>
    </div>
  );
};

export const PricingCard = ({ 
  name, 
  price, 
  period = 'month',
  features, 
  popular = false,
  cta = 'Start free'
}: { 
  name: string; 
  price: string; 
  period?: string;
  features: Array<{ text: string; included: boolean }>; 
  popular?: boolean;
  cta?: string;
}) => {
  const { Button } = require('@/components/ui/button');
  
  return (
    <Card className={`relative p-8 ${popular ? 'border-[#2C5F4F] border-2 scale-105' : 'border-[#E8E6E1]'} bg-gradient-to-b from-white to-[#FAFAF9]`}>
      {popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3A8A6C] text-white">
          Most Popular
        </Badge>
      )}
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl text-[#1C1C1E] mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="font-serif text-5xl text-[#1C1C1E]">{price}</span>
          {price !== 'Free' && <span className="text-[#7A756E]">/{period}</span>}
        </div>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            {feature.included ? (
              <Check className="w-5 h-5 text-[#3A8A6C] flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-[#7A756E] opacity-30 flex-shrink-0 mt-0.5" />
            )}
            <span className={feature.included ? 'text-[#1C1C1E]' : 'text-[#7A756E] opacity-50'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      <Button className={`w-full ${popular ? 'bg-[#2C5F4F] hover:bg-[#3A8A6C]' : 'bg-[#3A8A6C] hover:bg-[#2C5F4F]'} text-white`}>
        {cta}
      </Button>
    </Card>
  );
};

export const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#E8E6E1] py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="font-serif text-xl text-[#1C1C1E] pr-8">{question}</h3>
        <ChevronDown className={`w-5 h-5 text-[#2C5F4F] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-[#7A756E] mt-4 leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </div>
  );
};
