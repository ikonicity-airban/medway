import * as React from "react";
import { AlertTriangle, PhoneCall } from "lucide-react";

export interface EmergencyBannerProps {
  facilityName?: string;
  phoneNumber?: string;
  dangerSignsCount?: number;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  facilityName = "UNN Medical Centre Casualty Bay",
  phoneNumber = "+2348037704288",
  dangerSignsCount = 1,
}) => {
  return (
    <div
      role="alert"
      className="p-4 md:p-6 rounded-lg bg-error text-on-error border-2 border-error shadow-md"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-on-error" />
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider block opacity-95">
              Immediate Red-Flag Danger Sign Detected ({dangerSignsCount})
            </span>
            <h3 className="text-lg md:text-xl font-bold leading-tight">
              Hospital Escalation Required · {facilityName}
            </h3>
            <p className="text-sm opacity-90 max-w-xl">
              Commercial pharmacies are locked out for emergency cases. Report directly
              to casualty for immediate clinical evaluation.
            </p>
          </div>
        </div>

        <div className="shrink-0 pt-2 md:pt-0">
          <a
            href={`tel:${phoneNumber}`}
            aria-label="Call Casualty"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-md bg-surface text-ink font-bold text-base hover:bg-surface-subtle transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <PhoneCall className="w-5 h-5 text-error" />
            <span>Call Casualty ({phoneNumber})</span>
          </a>
        </div>
      </div>
    </div>
  );
};
