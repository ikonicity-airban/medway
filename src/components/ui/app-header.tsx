import * as React from "react";
import Link from "next/link";
import { PhoneCall } from "lucide-react";

export interface AppHeaderProps {
  isOffline?: boolean;
  emergencyPhone?: string;
  hasRedFlags?: boolean;
  activeNav?: "student" | "router" | "partner" | "split" | "safety";
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isOffline = false,
  emergencyPhone = "+2348037704288",
  hasRedFlags = false,
  activeNav = "student",
}) => {
  const isStudentActive = activeNav === "student" || activeNav === "router";
  const isPartnerActive = activeNav === "partner";
  const isSplitActive = activeNav === "split";

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-xs border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand & Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg sm:text-xl text-ink tracking-tight hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-on-accent font-mono text-base font-bold shadow-xs">
              M
            </div>
            <span className="font-heading tracking-tight font-extrabold">MedWay</span>
          </Link>
          <span className="hidden md:inline-flex text-[11px] font-mono font-medium text-muted bg-surface-subtle px-2 py-0.5 rounded border border-border">
            UNN Nsukka
          </span>
        </div>

        {/* Compact Segmented Switcher & Emergency Action */}
        <div className="flex items-center gap-2">
          {/* Segmented Mode Switcher */}
          <nav
            aria-label="Application mode switcher"
            className="inline-flex items-center rounded-lg border border-border bg-surface-subtle p-0.5 shadow-2xs text-xs font-semibold"
          >
            <Link
              href="/"
              className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-colors ${
                isStudentActive
                  ? "bg-surface text-ink font-bold shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              Student
            </Link>
            <Link
              href="/partner"
              className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-colors ${
                isPartnerActive
                  ? "bg-surface text-ink font-bold shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              Partner
            </Link>
            <Link
              href="/split"
              className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-colors ${
                isSplitActive
                  ? "bg-surface text-ink font-bold shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              Split Demo
            </Link>
          </nav>

          {/* Emergency Dial (Desktop Only or when Red Flags active) */}
          <a
            href={`tel:${emergencyPhone}`}
            className={`hidden sm:inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-opacity focus-visible:outline-2 ${
              hasRedFlags
                ? "bg-error text-on-error"
                : "bg-surface border border-border text-error hover:bg-surface-subtle"
            }`}
            title="Immediate 24/7 Casualty Escalation"
          >
            <PhoneCall className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden lg:inline">24/7 Casualty</span>
          </a>
        </div>
      </div>
    </header>
  );
};
