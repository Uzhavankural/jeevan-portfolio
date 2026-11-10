import React from "react";
import { AgentOrchestrator } from "@/components/AgentOrchestrator";
import { HeroSection } from "@/components/HeroSection";
import { WorkSection } from "@/components/WorkSection";
import { StackSection } from "@/components/StackSection";
import { RecordSection } from "@/components/RecordSection";
import { AboutSection } from "@/components/AboutSection";
import { ContactFooter } from "@/components/ContactFooter";

export default function HomePage() {
  return (
    <div id="top" className="relative min-h-dvh bg-[#09090b] text-zinc-100">
      <main id="main-content">
        <HeroSection />
        <WorkSection />
        <StackSection />
        <RecordSection />
        <AboutSection />
        <ContactFooter />
      </main>
      <AgentOrchestrator />
    </div>
  );
}
