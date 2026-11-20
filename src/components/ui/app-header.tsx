import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, PhoneCall, Wifi, WifiOff } from "lucide-react";

export interface AppHeaderProps {
  isOffline?: boolean;
  emergencyPhone?: string;
  hasRedFlags?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isOffline = false,
  emergencyPhone = "+2348037704288",
  hasRedFlags = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand & Campus Anchor */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-ink tracking-tight hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-on-accent font-mono text-base font-bold shadow-sm">
              M
            </div>
            <span className="font-heading">MedWay</span>
          </Link>

          <span className="hidden sm:inline-flex text-xs font-mono font-medium text-muted bg-surface-subtle px-2 py-1 rounded border border-border">
            UNN Nsukka
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden sm:flex items-center gap-1 text-xs font-semibold text-muted">
          <Link
            href="/"
            className="px-3 py-2 rounded-md hover:text-ink hover:bg-surface-subtle transition-colors focus-visible:outline-2"
          >
            Care Router
          </Link>
          <Link
            href="/partner"
            className="px-3 py-2 rounded-md hover:text-ink hover:bg-surface-subtle transition-colors focus-visible:outline-2"
          >
            Partner Counter
          </Link>
          <Link
            href="/telemetry"
            className="px-3 py-2 rounded-md hover:text-ink hover:bg-surface-subtle transition-colors focus-visible:outline-2"
          >
            Population Telemetry
          </Link>
        </nav>

        {/* Status Indicators & Emergency Dial Trigger */}
        <div className="flex items-center gap-2.5">
          {isOffline ? (
            <Badge variant="neutral" icon={<WifiOff className="w-3.5 h-3.5 text-muted" />}>
              <span className="hidden md:inline">Offline Cached</span>
            </Badge>
          ) : (
            <Badge variant="neutral" icon={<Wifi className="w-3.5 h-3.5 text-muted" />}>
              <span className="hidden md:inline">Sync Active</span>
            </Badge>
          )}

          {hasRedFlags ? (
            <a
              href={`tel:${emergencyPhone}`}
              className="inline-flex items-center gap-1.5 min-h-[48px] px-3.5 py-2 rounded-md bg-error text-on-error font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
              <span>Casualty Alert</span>
            </a>
          ) : (
            <a
              href={`tel:${emergencyPhone}`}
              className="inline-flex items-center gap-1.5 min-h-[48px] px-3.5 py-2 rounded-md bg-surface text-ink border border-border hover:bg-surface-subtle font-medium text-xs focus-visible:outline-2 focus-visible:outline-offset-2"
              title="UNN Medical Centre Casualty Unit"
            >
              <PhoneCall className="w-3.5 h-3.5 text-muted shrink-0" />
              <span className="hidden sm:inline font-mono">24/7 Casualty</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
