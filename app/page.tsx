"use client"

import React from 'react';
import { Navigation } from '@/components/landing/Navigation';
import { TrustBadges } from '@/components/landing/TrustBadges';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CustomerCarousel } from '@/components/landing/CustomerCarousel';
import { PricingSection } from '@/components/landing/PricingSection';
import { HowItWorksSection, NeverMissLegislativeChangeSection } from '@/components/landing/AboutSection';
import { StatsSection, FeaturesHighlights, FAQSection, CTASection, Footer } from '@/components/landing/SectionsGroup';

export default function ClearLeafLanding() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Navigation onLandingPage={true} />

      {/* Main content */}
      <main className="pt-16">
        <HeroSection />
        <TrustBadges />
        <FeaturesSection />
        <CustomerCarousel />
        <StatsSection />
        <FeaturesHighlights />
        <PricingSection />
        <HowItWorksSection />
        <NeverMissLegislativeChangeSection />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
