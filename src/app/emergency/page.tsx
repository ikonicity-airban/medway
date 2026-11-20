import Link from "next/link";
import { Phone, MapPin, ArrowLeft, ShieldAlert } from "lucide-react";

export default function EmergencyPage() {
  return (
    <main className="flex-1 flex flex-col p-4 sm:p-6 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline min-h-[48px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Care Router
        </Link>
      </div>

      {/* Emergency Header */}
      <div className="bg-red-600 text-white rounded-lg p-5 space-y-3 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-white shrink-0" />
          <h1 className="text-xl font-bold">24/7 Emergency Casualty Escalation</h1>
        </div>
        <p className="text-xs text-red-100 leading-relaxed">
          If you or a colleague have difficulty breathing, prolonged high fever with stiff neck,
          persistent vomiting, uncontrollable bleeding, or severe acute pain, bypass all pharmacies
          and go directly to an emergency ward.
        </p>
      </div>

      {/* Destination Cards */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Primary Emergency Facilities (Nsukka)
        </h2>

        {/* UNN Medical Centre Emergency Bay */}
        <div className="bg-surface border border-red-200 dark:border-red-900 rounded-lg p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                Tier 1: On-Campus (TISHIP)
              </span>
              <h3 className="text-base font-bold text-ink">UNN Medical Centre Casualty Bay</h3>
              <p className="text-xs text-muted flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" /> Near Franco Refectory / Nnamdi Azikiwe
                Library, UNN
              </p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
              ₦0 TISHIP
            </span>
          </div>

          <p className="text-xs text-body leading-relaxed">
            Open 24 hours daily for acute triage, IV hydration, antimalarial injections, and
            emergency doctor stabilization.
          </p>

          <a
            href="tel:+2348030000001"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors min-h-[48px]"
          >
            <Phone className="w-4 h-4" /> Call UNN Emergency Desk
          </a>
        </div>

        {/* Bishop Shanahan Specialist Hospital */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                Tier 2: Off-Campus Specialist
              </span>
              <h3 className="text-base font-bold text-ink">Bishop Shanahan Specialist Hospital</h3>
              <p className="text-xs text-muted flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" /> University Road / Market Road Junction,
                Nsukka Town
              </p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-body font-medium">
              Private / Fee
            </span>
          </div>

          <p className="text-xs text-body leading-relaxed">
            Full surgical capability, advanced diagnostic laboratory, 24-hour blood bank, and
            ambulance triage.
          </p>

          <a
            href="tel:+2348030000002"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-surface hover:bg-canvas text-ink border border-border text-sm font-semibold rounded-md transition-colors min-h-[48px]"
          >
            <Phone className="w-4 h-4" /> Call Bishop Shanahan Casualty
          </a>
        </div>
      </section>

      {/* Safety Notice */}
      <div className="p-4 rounded-lg bg-canvas border border-border text-xs text-muted space-y-1">
        <p className="font-semibold text-ink">Notice on Emergency Transport</p>
        <p className="text-[11px] leading-relaxed">
          For students stranded in distant hostels (Hilltop, Odim, Odenigwe), contact your lodge
          president or campus security dispatch (+234 803 000 0000) for ambulance assistance.
        </p>
      </div>
    </main>
  );
}
