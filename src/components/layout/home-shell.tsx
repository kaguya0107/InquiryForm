"use client";

import InquiryFormSection from "@/components/forms/inquiry-form-section";
import { FloatingControls } from "@/components/layout/floating-controls";
import { HeroSection } from "@/components/sections/hero-section";

export default function HomeShell() {
  return (
    <div className="relative min-h-[100vh] bg-[var(--background)] pb-36 text-[var(--foreground)]">
      <FloatingControls />

      <main id="landing" className="relative isolate">
        <HeroSection />
        <InquiryFormSection />
      </main>
    </div>
  );
}
