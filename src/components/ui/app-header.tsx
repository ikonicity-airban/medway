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
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo and Campus Tag */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-ink tracking-tight hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-on-accent font-mono text-base font-bold shadow-sm">
              M
            </div>
            <span>MedWay</span>
          </Link>

          <Badge variant="neutral" className="hidden sm:inline-flex">
            UNN Nsukka
          </Badge>
        </div>

        {/* Status Indicators and Emergency Dialer */}
        <div className="flex items-center gap-2.5">
          {isOffline ? (
            <Badge variant="neutral" icon={<WifiOff className="w-3.5 h-3.5 text-warning" />}>
              <span className="hidden md:inline">Offline Mode</span>
            </Badge>
          ) : (
            <Badge variant="neutral" icon={<Wifi className="w-3.5 h-3.5 text-success" />}>
              <span className="hidden md:inline">Online Sync</span>
            </Badge>
          )}

          {hasRedFlags ? (
            <a
              href={`tel:${emergencyPhone}`}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-md bg-error text-on-error font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Casualty Alert</span>
            </a>
          ) : (
            <a
              href={`tel:${emergencyPhone}`}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 rounded-md bg-surface text-body border border-border hover:bg-surface-subtle font-medium text-xs focus-visible:outline-2 focus-visible:outline-offset-2"
              title="UNN Medical Centre Casualty Unit"
            >
              <PhoneCall className="w-3.5 h-3.5 text-error shrink-0" />
              <span className="hidden sm:inline">24/7 Casualty</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
