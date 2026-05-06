'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PropertyListingSection from "@/components/PropertyListingSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

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
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ServicesSection />
        <PropertyListingSection />
        <HowItWorksSection />
      </div>
      <Footer />
    </div>
  );
}
