'use client';

import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PropertyListingSection from "@/components/PropertyListingSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FaqSection from "@/components/FaqSection";
import CoHostsSection from "@/components/CoHostsSection";
import JobsSection from "@/components/JobsSection";
import Footer from "@/components/Footer";

export default function Home() {
  const { isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden w-full">
      <Navigation />
      <HeroSection />
      <div className="w-full overflow-hidden">
        <ServicesSection />
        <PropertyListingSection />
        <CoHostsSection />
        <JobsSection />
        <HowItWorksSection />
        <FaqSection />
      </div>
      <Footer />
    </div>
  );
}
