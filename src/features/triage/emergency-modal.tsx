"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DangerSign } from "@/components/ui/danger-sign-checklist";
import { AlertTriangle, MapPin, PhoneCall } from "lucide-react";

export interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSigns: DangerSign[];
  emergencyPhone?: string;
  specialistPhone?: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  selectedSigns,
  emergencyPhone = "+2348037704288", // UNN Medical Centre Emergency Casualty
  specialistPhone = "+2348035489721", // Bishop Shanahan Specialist Hospital
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Critical Danger Sign Detected"
      description="Retail pharmacy navigation is locked. Direct hospital evaluation is required."
    >
      <div className="space-y-4">
        {/* Danger signs summary */}
        <div className="p-3.5 rounded-md bg-error/10 border border-error space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-error">
              Active Emergency Danger Signs ({selectedSigns.length})
            </span>
          </div>

          <ul className="text-xs text-body space-y-1 pl-6 list-disc">
            {selectedSigns.map((sign) => (
              <li key={sign.id} className="font-semibold text-ink">
                {sign.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Primary Hospital Option: UNN Medical Centre */}
        <div className="p-4 rounded-md border border-border bg-surface space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="tiship">₦0 TISHIP Enrolled</Badge>
                <Badge variant="emergency">24/7 Casualty</Badge>
              </div>
              <h3 className="text-base font-bold text-ink">
                UNN Medical Centre Casualty Bay
              </h3>
              <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                Near Franco Refectory / Nnamdi Azikiwe Library Roundabout
              </p>
            </div>
          </div>

          <p className="text-xs text-body">
            Official university medical center. Free emergency doctor evaluation, IV fluids,
            and acute malaria stabilization for enrolled students.
          </p>

          <Button
            variant="emergency"
            fullWidth
            onClick={() => {
              window.location.href = `tel:${emergencyPhone}`;
            }}
            className="flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call UNN Casualty Desk ({emergencyPhone})</span>
          </Button>
        </div>

        {/* Secondary Hospital Option: Bishop Shanahan Specialist Hospital */}
        <div className="p-4 rounded-md border border-border-subtle bg-surface-subtle space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-ink">
              Bishop Shanahan Specialist Hospital
            </h4>
            <span className="text-xs text-muted">Off Campus / Fee</span>
          </div>
          <p className="text-xs text-muted">
            Full surgical capability, blood bank, and advanced diagnostic lab located at
            Market Road / University Road junction, Nsukka town.
          </p>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              window.location.href = `tel:${specialistPhone}`;
            }}
            className="flex items-center justify-center gap-2 text-sm"
          >
            <PhoneCall className="w-4 h-4 text-muted" />
            <span>Call Bishop Shanahan ({specialistPhone})</span>
          </Button>
        </div>

        {/* Dismiss / Acknowledge */}
        <div className="pt-2 text-center">
          <Button variant="ghost" fullWidth onClick={onClose}>
            Review Symptom Checklist
          </Button>
        </div>
      </div>
    </Modal>
  );
};
