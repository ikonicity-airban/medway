import * as React from "react";
import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { RouterView } from "@/features/router";
import { AlertCircle, ChevronRight, PhoneCall } from "lucide-react";

export const metadata = {
  title: "MedWay UNN | Campus Care Router & Triage",
  description:
    "Offline-first healthcare router and pre-triage navigation system for University of Nigeria, Nsukka.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body">
      <AppHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Emergency Red-Flag Warning Banner */}
        <section className="bg-error/10 border-2 border-error rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-ink">
                Experiencing Acute Danger Signs?
              </h2>
              <p className="text-xs text-body leading-relaxed">
                Persistent vomiting, difficulty breathing, seizures, high fever with stiff neck,
                or severe bleeding require immediate hospital emergency stabilization.
              </p>
            </div>
          </div>
          <div className="pt-1">
            <Link
              href="/emergency"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-on-error bg-error hover:opacity-95 rounded-md transition-opacity min-h-[48px] w-full shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Check Danger Signs & 24/7 Casualty Contacts</span>
            </Link>
          </div>
        </section>

        {/* Live Interactive Care Router View */}
        <RouterView />

        {/* Attendant & Partner Portal Link */}
        <section className="pt-4 border-t border-border">
          <Link
            href="/partner"
            className="group bg-surface border border-border hover:border-accent rounded-lg p-4 transition-colors flex items-center justify-between min-h-[48px]"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted block">
                Pharmacy & Clinic Staff
              </span>
              <h3 className="text-sm font-bold text-ink group-hover:text-accent transition-colors">
                Partner Telemetry & Counter Check-in Scanner
              </h3>
            </div>
            <ChevronRight className="w-5 h-5 text-muted group-hover:text-accent transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-border text-center text-xs text-muted space-y-1 px-4">
        <p>MedWay Campus Healthcare Logistics · Piloted at University of Nigeria Nsukka</p>
        <p className="text-[11px]">
          Strictly non diagnostic care navigation. Adheres to WHO and Red Cross community triage standards.
        </p>
      </footer>
    </div>
  );
}
