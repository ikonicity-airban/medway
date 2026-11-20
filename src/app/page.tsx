import * as React from "react";
import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { RouterView } from "@/features/router";
import { AlertCircle, ChevronRight } from "lucide-react";

export const metadata = {
  title: "MedWay UNN | Campus Care Router & Triage",
  description:
    "Offline-first healthcare router and pre-triage navigation system for University of Nigeria, Nsukka.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body">
      <AppHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-8">
        {/* Editorial Hero Header */}
        <header className="space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-muted">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>UNN Student Logistics Protocol</span>
          </div>

          <h1 className="text-fluid-h1 font-heading font-bold text-ink text-balance">
            Campus Care Router & Pre-Triage
          </h1>

          <p className="text-fluid-body text-muted text-pretty max-w-prose">
            Find in-stock essential medications, verify ₦0 TISHIP coverage at UNN Medical Centre,
            and view accredited community pharmacy queues in under thirty seconds.
          </p>
        </header>

        {/* Emergency Triage Caution Strip */}
        <section
          aria-label="Emergency danger signs notice"
          className="bg-surface border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-border flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-ink" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-ink">
                Acute Danger Signs Checklist
              </h2>
              <p className="text-xs text-muted leading-relaxed max-w-xl">
                Persistent vomiting, difficulty breathing, seizures, or severe bleeding require immediate
                hospital stabilization rather than pharmacy outpatient visits.
              </p>
            </div>
          </div>

          <Link
            href="/emergency"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-on-error bg-error hover:opacity-95 rounded-lg transition-opacity min-h-[48px] shrink-0 focus-visible:outline-2"
          >
            <span>Casualty Unit</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Integrated Triage Command Console & Care Router */}
        <RouterView />

        {/* Institutional & Attendant Footer Bar */}
        <footer className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            <p className="font-medium text-body">MedWay University Logistics</p>
            <p className="text-[11px]">Strict non diagnostic pre triage boundary. In emergency, visit UNN Medical Centre.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/partner"
              className="px-3 py-2 rounded-md hover:text-ink hover:bg-surface-subtle border border-border min-h-[48px] inline-flex items-center"
            >
              Staff Portal
            </Link>
            <Link
              href="/telemetry"
              className="px-3 py-2 rounded-md hover:text-ink hover:bg-surface-subtle border border-border min-h-[48px] inline-flex items-center"
            >
              Public Telemetry
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
