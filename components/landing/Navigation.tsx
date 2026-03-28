"use client"

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onLandingPage?: boolean;
}

export function Navigation({ onLandingPage = false }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: onLandingPage ? '#features' : '/#features' },
    { label: 'Pricing', href: onLandingPage ? '#pricing' : '/#pricing' },
    { label: 'About', href: onLandingPage ? '#how-it-works' : '/#how-it-works' },
    { label: 'FAQ', href: onLandingPage ? '#faq' : '/#faq' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#E8E6E1]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-serif text-2xl text-[#1C1C1E] hover:opacity-80 transition-opacity">
          🍁 ClearLeaf
        </a>
        
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#7A756E] hover:text-[#1C1C1E] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="ghost" className="text-[#1C1C1E]">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="bg-[#3A8A6C] hover:bg-[#2C5F4F] text-white">
            <Link href="/signup">Start free</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E8E6E1]">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-[#7A756E] hover:text-[#1C1C1E] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="space-y-2 pt-4 border-t border-[#E8E6E1]">
              <Button asChild variant="ghost" className="w-full justify-start text-[#1C1C1E]">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="w-full bg-[#3A8A6C] hover:bg-[#2C5F4F] text-white">
                <Link href="/signup">Start free</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
