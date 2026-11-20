import * as React from "react";
import { Facility, UNN_PILOT_FACILITIES } from "@/types";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, AlertCircle } from "lucide-react";

export interface PartnerAuthProps {
  onAuthenticate: (facility: Facility) => void;
}

export const FACILITY_PINS: Record<string, string> = {
  "00000000-0000-0000-0000-000000000001": "4288", // UNN Medical Centre
  "00000000-0000-0000-0000-000000000002": "1960", // Odim Gate Community Pharmacy
  "00000000-0000-0000-0000-000000000003": "2024", // Hilltop Care Pharmacy
  "00000000-0000-0000-0000-000000000004": "1234", // Ogige Junction Pharmacy
};

export const PartnerAuth: React.FC<PartnerAuthProps> = ({ onAuthenticate }) => {
  const [selectedFacilityId, setSelectedFacilityId] = React.useState<string>(
    UNN_PILOT_FACILITIES[0].id
  );
  const [pin, setPin] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const expectedPin = FACILITY_PINS[selectedFacilityId] || "1234";

    if (pin.trim() !== expectedPin) {
      setError("Incorrect 4-digit attendant PIN. Please check your credentials.");
      return;
    }

    const facility = UNN_PILOT_FACILITIES.find((f) => f.id === selectedFacilityId);
    if (facility) {
      onAuthenticate(facility);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-surface border-2 border-border rounded-xl shadow-lg space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-ink tracking-tight">
          Pharmacy & Clinic Attendant Portal
        </h1>
        <p className="text-xs text-muted">
          Authenticate with your 4-digit facility access PIN to manage real time stock and queue telemetry.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Facility Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            Select Facility
          </label>
          <select
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-accent min-h-[48px]"
          >
            {UNN_PILOT_FACILITIES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.facilityType})
              </option>
            ))}
          </select>
        </div>

        {/* PIN Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            4-Digit Attendant PIN
          </label>
          <input
            type="password"
            maxLength={4}
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center tracking-widest text-xl font-mono px-3 py-2 rounded-lg border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent min-h-[48px]"
          />
          <p className="text-[11px] text-muted">
            Demo PINs: UNN Clinic: 4288, Odim Gate: 1960, Hilltop: 2024, Ogige: 1234
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-danger/10 border border-danger text-danger text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          className="min-h-[48px] text-sm font-bold"
        >
          <span>Unlock Attendant Console</span>
        </Button>
      </form>

      <div className="pt-2 border-t border-border flex items-center justify-center gap-1.5 text-xs text-muted">
        <ShieldCheck className="w-4 h-4 text-accent" />
        <span>Pharmacists Council of Nigeria (PCN) Certified Portal</span>
      </div>
    </div>
  );
};
