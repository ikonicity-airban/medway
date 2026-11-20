import Link from "next/link";
import { AlertCircle, ShieldCheck, Clock, MapPin, PhoneCall, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col p-4 sm:p-6 space-y-6">
      {/* Top Navigation & Status */}
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">MedWay</h1>
          <p className="text-xs text-muted">University of Nigeria, Nsukka (UNN) Care Router</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Live Telemetry</span>
        </div>
      </header>

      {/* Emergency Red-Flag Warning Banner */}
      <section className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-lg p-4 space-y-2">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">
              Experiencing Acute Danger Signs?
            </h2>
            <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
              High fever over 3 days, difficulty breathing, fainting, severe bleeding, or acute sudden pain require immediate hospital emergency stabilization.
            </p>
          </div>
        </div>
        <div className="pt-1 flex gap-2">
          <Link
            href="/emergency"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors min-h-[48px] w-full"
          >
            <PhoneCall className="w-4 h-4" />
            24/7 Hospital Emergency Contacts
          </Link>
        </div>
      </section>

      {/* Core Routing Capabilities */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-lg font-semibold text-ink">Student Care Logistics</h2>
          <p className="text-xs text-muted">
            Screen danger signs, check clinic queues, and route to verified medication stock.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* Action Card 1: Student Router */}
          <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Student Care Router</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-accent font-medium border border-sky-200 dark:border-sky-800">
                TISHIP ₦0 Covered
              </span>
            </div>
            <h3 className="text-base font-semibold text-ink">Find Best Route for Symptoms</h3>
            <p className="text-xs text-body leading-relaxed">
              Verify if UNN Medical Centre has antimalarials, pain relievers, or lab reagents in stock before walking across campus.
            </p>
            <div className="pt-1 flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Average queue: ~20 mins
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> PCN Verified
              </span>
            </div>
          </div>

          {/* Action Card 2: Partner & Attendant Telemetry */}
          <Link
            href="/partner"
            className="group bg-surface border border-border hover:border-accent rounded-lg p-4 transition-colors block space-y-2 min-h-[48px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Pharmacy & Clinic Attendants</span>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-transform group-hover:translate-x-0.5" />
            </div>
            <h3 className="text-base font-semibold text-ink group-hover:text-accent transition-colors">
              Partner Telemetry Dashboard
            </h3>
            <p className="text-xs text-body leading-relaxed">
              1-tap stock updates for Odim, Hilltop, and Ogige counters, plus intake token verification scanner.
            </p>
          </Link>
        </div>
      </section>

      {/* Tracked Categories */}
      <section className="bg-surface border border-border rounded-lg p-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Essential Care Categories</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded border border-border/60 bg-canvas/50">
            <p className="font-semibold text-ink">Antimalarials (ACT)</p>
            <p className="text-muted text-[11px]">Artemether/Lumefantrine</p>
          </div>
          <div className="p-2.5 rounded border border-border/60 bg-canvas/50">
            <p className="font-semibold text-ink">Analgesics & Fever</p>
            <p className="text-muted text-[11px]">Paracetamol & NSAIDs</p>
          </div>
          <div className="p-2.5 rounded border border-border/60 bg-canvas/50">
            <p className="font-semibold text-ink">Typhoid / Lab Test</p>
            <p className="text-muted text-[11px]">Widal & Diagnostic Kits</p>
          </div>
          <div className="p-2.5 rounded border border-border/60 bg-canvas/50">
            <p className="font-semibold text-ink">ORS & Hydration</p>
            <p className="text-muted text-[11px]">Electrolyte Salts & Zinc</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto pt-6 border-t border-border text-center text-xs text-muted space-y-1">
        <p>MedWay Campus Healthcare Logistics • Piloted at University of Nigeria, Nsukka</p>
        <p className="text-[11px]">Strictly non-diagnostic. Adheres to WHO and Red Cross emergency screening protocols.</p>
      </footer>
    </main>
  );
}
