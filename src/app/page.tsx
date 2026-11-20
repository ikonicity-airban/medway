import * as React from "react";
import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { RouterView } from "@/features/router";

export const metadata = {
  title: "MedWay UNN | Campus Care Router & Triage",
  description:
    "Offline-first healthcare router and pre-triage navigation system for University of Nigeria, Nsukka.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body font-sans antialiased">
      <AppHeader activeNav="student" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Minimal Clinical Header */}
        <div className="text-center max-w-[520px] mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
            <span>UNN Logistics Protocol</span>
            <span>•</span>
            <span className="text-emerald-700 dark:text-emerald-400">Live Sync</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
            Campus Care Router
          </h1>

          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Find in-stock essential care, verify ₦0 TISHIP coverage, and compare pharmacy queues in 30 seconds.
          </p>
        </div>

        {/* 3-Step Guided Progressive Stepper */}
        <RouterView />

        {/* Minimal Student Footer */}
        <footer className="pt-8 pb-4 text-center text-xs text-muted max-w-[520px] mx-auto space-y-1 border-t border-border">
          <p className="font-semibold text-ink">Strict Non-Diagnostic Care Logistics</p>
          <p className="text-[11px]">
            In critical emergency, proceed directly to UNN Medical Centre Emergency Bay or Bishop Shanahan Hospital.
          </p>
        </footer>
      </main>
    </div>
  );
}
