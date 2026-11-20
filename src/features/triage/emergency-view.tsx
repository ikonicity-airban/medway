"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DangerSignChecklist } from "@/components/ui/danger-sign-checklist";
import { EmergencyModal } from "./emergency-modal";
import { useEmergencyTriage } from "./use-emergency-triage";
import {
  AlertTriangle,
  Building2,
  Clock,
  Compass,
  MapPin,
  PhoneCall,
  ShieldAlert,
} from "lucide-react";

export interface EmergencyViewProps {
  emergencyPhone?: string;
  specialistPhone?: string;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({
  emergencyPhone = "+2348037704288",
  specialistPhone = "+2348035489721",
}) => {
  const { hasRedFlags, selectedFlags, activeSigns, toggleDangerSign, clearDangerSigns } =
    useEmergencyTriage();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Auto open modal on the first transition to hasRedFlags
  const prevRedFlags = React.useRef(hasRedFlags);
  React.useEffect(() => {
    if (!prevRedFlags.current && hasRedFlags) {
      setIsModalOpen(true);
    }
    prevRedFlags.current = hasRedFlags;
  }, [hasRedFlags]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Red flag alert banner */}
      {hasRedFlags && (
        <div
          role="alert"
          className="p-5 rounded-lg bg-error text-on-error border-2 border-error shadow-md space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h2 className="text-xl font-bold leading-tight">
                Emergency Hospital Escalation Active
              </h2>
            </div>
            <Badge variant="emergency">Pharmacy Lockout</Badge>
          </div>

          <p className="text-sm opacity-95">
            You or your patient reported danger signs ({activeSigns.map((s) => s.label).join(", ")}).
            MedWay has locked all retail pharmacy routing. Proceed directly to UNN Medical
            Centre or call the emergency casualty desk.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`tel:${emergencyPhone}`}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 rounded-md bg-surface text-ink font-bold text-sm hover:bg-surface-subtle shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <PhoneCall className="w-4 h-4 text-error" />
              <span>Call UNN Casualty ({emergencyPhone})</span>
            </a>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-on-error hover:bg-error/80 border border-on-error/30"
            >
              View Full Hospital Details
            </Button>
          </div>
        </div>
      )}

      {/* Danger Signs Checklist */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">
            WHO / Red Cross Danger Signs Screening
          </h2>
          {hasRedFlags && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDangerSigns}
              className="text-xs text-muted hover:text-ink"
            >
              Reset Danger Signs
            </Button>
          )}
        </div>

        <DangerSignChecklist
          selectedFlags={selectedFlags}
          onToggleSign={toggleDangerSign}
          emergencyPhone={emergencyPhone}
          showEmergencyBanner={false}
        />
      </section>

      {/* Campus Emergency Facilities Directory */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-ink">
          24/7 Primary Emergency Facilities (Nsukka)
        </h2>

        {/* UNN Medical Centre */}
        <Card className="border-2 border-border">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <Badge variant="tiship">
                    <Building2 className="w-3.5 h-3.5 mr-1 inline" />
                    Tier 1: Campus Clinic
                  </Badge>
                  <Badge variant="tiship">₦0 TISHIP Enrolled</Badge>
                  <Badge variant="emergency">24/7 Casualty Open</Badge>
                </div>
                <CardTitle as="h3">UNN Medical Centre Casualty Bay</CardTitle>
              </div>
              <span className="text-base font-bold text-success">₦0 (Covered)</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-4 text-sm text-body">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-muted shrink-0" />
                <span>Near Franco Refectory / Nnamdi Azikiwe Library Roundabout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-muted shrink-0" />
                <span>Continuous 24-Hour Doctor & Triage Coverage</span>
              </div>
            </div>

            <p className="text-sm text-body leading-relaxed">
              Equipped for urgent fluid resuscitation, injectable artesunate for severe malaria,
              wound debridement, and ambulance transfer.
            </p>

            <div className="p-3 rounded-md bg-surface-subtle border border-border-subtle flex items-start gap-2 text-xs text-muted">
              <Compass className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
              <span>
                <strong>Transport Guide:</strong> From Franco, Okeke, or Balewa hostels, walk 3 to 5 minutes toward the central library.
                From Hilltop or Odim gate, take a campus shuttle tricycle directly to Medical Centre gate.
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${emergencyPhone}`}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-md bg-error text-on-error font-bold text-base hover:opacity-95 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Call UNN Casualty Desk ({emergencyPhone})</span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Bishop Shanahan Specialist Hospital */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="neutral">Tier 2: Off-Campus Specialist</Badge>
                  <Badge variant="neutral">Private / Fee-for-Service</Badge>
                </div>
                <CardTitle as="h3">Bishop Shanahan Specialist Hospital</CardTitle>
              </div>
              <span className="text-sm font-semibold text-muted">Private Rates</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center gap-1.5 text-sm text-body">
              <MapPin className="w-4 h-4 text-muted shrink-0" />
              <span>University Road / Market Road Junction, Nsukka Town (~2.5km)</span>
            </div>

            <p className="text-sm text-body leading-relaxed">
              Comprehensive private hospital with full surgical theaters, dedicated intensive care,
              24-hour blood bank, and digital ultrasound diagnostics.
            </p>

            <div className="pt-1">
              <a
                href={`tel:${specialistPhone}`}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 rounded-md bg-surface text-ink border border-border font-semibold text-sm hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <PhoneCall className="w-4 h-4 text-muted" />
                <span>Call Bishop Shanahan Casualty ({specialistPhone})</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Safety Notice */}
      <div className="p-4 rounded-lg bg-surface-subtle border border-border text-xs text-muted flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-ink block">
            Institutional Ambulance & Hostel Transport Advisory
          </span>
          <p>
            If a student is unconscious or convulsing in a hostel room, do not attempt to transport them alone
            on a motorcycle. Alert your lodge hall warden or UNN Security Emergency Dispatch immediately.
          </p>
        </div>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSigns={activeSigns}
        emergencyPhone={emergencyPhone}
        specialistPhone={specialistPhone}
      />
    </div>
  );
};
