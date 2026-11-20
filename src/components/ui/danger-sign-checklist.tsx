import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, PhoneCall } from "lucide-react";

export interface DangerSign {
  id: string;
  label: string;
  description: string;
}

export const DANGER_SIGNS: readonly DangerSign[] = [
  {
    id: "fluids",
    label: "Unable to drink or keep fluids down",
    description: "Repeated vomiting, unable to take oral medication or rehydration fluids.",
  },
  {
    id: "neurological",
    label: "Convulsions, seizures, or fainting",
    description: "Loss of consciousness, extreme lethargy, or uncontrolled shaking.",
  },
  {
    id: "respiratory",
    label: "Severe breathing distress or gasping",
    description: "Rapid breathing, chest indrawing, or blue tinted lips.",
  },
  {
    id: "meningism",
    label: "High fever accompanied by stiff neck",
    description: "Inability to bend chin to chest, severe headache, light sensitivity.",
  },
  {
    id: "bleeding",
    label: "Persistent bleeding or coughing blood",
    description: "Coffee ground vomit, black tarry stool, or uncontrolled bleeding.",
  },
] as const;

export interface DangerSignChecklistProps {
  selectedFlags?: string[];
  onToggleSign?: (signId: string) => void;
  onDangerSignChange?: (hasRedFlags: boolean, selectedFlags: string[]) => void;
  emergencyPhone?: string;
  showEmergencyBanner?: boolean;
}

export const DangerSignChecklist: React.FC<DangerSignChecklistProps> = ({
  selectedFlags,
  onToggleSign,
  onDangerSignChange,
  emergencyPhone = "+2348037704288", // UNN Medical Centre Emergency Unit
  showEmergencyBanner = true,
}) => {
  const [internalSelected, setInternalSelected] = React.useState<Set<string>>(new Set());

  const isControlled = selectedFlags !== undefined;
  const currentSelected = React.useMemo(() => {
    return isControlled ? new Set(selectedFlags) : internalSelected;
  }, [isControlled, selectedFlags, internalSelected]);

  const handleToggle = (id: string) => {
    if (onToggleSign) {
      onToggleSign(id);
    }

    if (!isControlled) {
      setInternalSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        const hasFlags = next.size > 0;
        onDangerSignChange?.(hasFlags, Array.from(next));
        return next;
      });
    } else {
      const nextSet = new Set(currentSelected);
      if (nextSet.has(id)) {
        nextSet.delete(id);
      } else {
        nextSet.add(id);
      }
      onDangerSignChange?.(nextSet.size > 0, Array.from(nextSet));
    }
  };

  const hasRedFlags = currentSelected.size > 0;

  return (
    <div className="space-y-4">
      {hasRedFlags && showEmergencyBanner && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 md:p-6 rounded-lg bg-error text-on-error border-2 border-error shadow-md"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="emergency">Emergency Danger Sign Detected</Badge>
              </div>
              <h4 className="text-lg font-bold leading-tight">
                Immediate Hospital Escalation Required
              </h4>
              <p className="text-sm opacity-95">
                MedWay has locked all retail pharmacy routing. You must report directly
                to UNN Medical Centre Casualty Bay or Bishop Shanahan Specialist Hospital
                immediately.
              </p>

              <div className="pt-2">
                <a
                  href={`tel:${emergencyPhone}`}
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-md bg-surface text-ink font-bold text-base hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <PhoneCall className="w-5 h-5 text-error" />
                  <span>Call UNN Emergency Bay ({emergencyPhone})</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border border-border rounded-lg bg-surface p-4 md:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-ink">
            Emergency Danger Signs Screening
          </h3>
          <span className="text-xs text-muted">WHO / Red Cross Standard</span>
        </div>
        <p className="text-sm text-body">
          Do you or the student have any of these critical red flag warning signs right
          now?
        </p>

        <div className="space-y-2 pt-2">
          {DANGER_SIGNS.map((sign) => {
            const isChecked = currentSelected.has(sign.id);
            return (
              <label
                key={sign.id}
                className={`flex items-start gap-3 p-3.5 rounded-md border min-h-[48px] cursor-pointer transition-colors ${
                  isChecked
                    ? "bg-error/10 border-error text-ink"
                    : "bg-surface-subtle border-border-subtle hover:border-muted text-body"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(sign.id)}
                  className="w-5 h-5 mt-0.5 rounded border-border text-error focus:ring-error"
                />
                <div className="space-y-0.5 select-none">
                  <span className="text-sm font-semibold block text-ink">
                    {sign.label}
                  </span>
                  <span className="text-xs text-muted block">
                    {sign.description}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {hasRedFlags && showEmergencyBanner && (
          <div className="pt-2">
            <Button
              variant="emergency"
              fullWidth
              size="lg"
              onClick={() => {
                window.location.href = `tel:${emergencyPhone}`;
              }}
              className="flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Connect to Emergency Ward Now</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
