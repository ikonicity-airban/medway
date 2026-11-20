import * as React from "react";
import { Badge } from "@/components/ui/badge";

export type BudgetChoice = "tiship" | "fast";

export interface BudgetGateProps {
  value: BudgetChoice;
  onChange: (value: BudgetChoice) => void;
}

export const BudgetGate: React.FC<BudgetGateProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-ink">
          Student Budget & Insurance Gate
        </label>
        <span className="text-xs text-muted">TISHIP Hard Lock Active</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="radiogroup">
        {/* Option 1: ₦0 TISHIP Covered */}
        <label
          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer min-h-[56px] transition-all select-none ${
            value === "tiship"
              ? "bg-surface border-2 border-success ring-1 ring-success/30 shadow-sm"
              : "bg-surface border-border hover:border-muted active:bg-surface-subtle"
          }`}
        >
          <input
            type="radio"
            name="budget_gate"
            value="tiship"
            checked={value === "tiship"}
            onChange={() => onChange("tiship")}
            className="w-5 h-5 mt-0.5 rounded-full border-border text-success focus:ring-success"
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink">
                ₦0 TISHIP Coverage
              </span>
              <Badge variant="tiship">On Campus</Badge>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Mandatory health fee covers doctor consultations and essential stock at
              UNN Medical Centre without out of pocket cost.
            </p>
          </div>
        </label>

        {/* Option 2: Fast Retail Care */}
        <label
          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer min-h-[56px] transition-all select-none ${
            value === "fast"
              ? "bg-surface border-2 border-accent ring-1 ring-accent/30 shadow-sm"
              : "bg-surface border-border hover:border-muted active:bg-surface-subtle"
          }`}
        >
          <input
            type="radio"
            name="budget_gate"
            value="fast"
            checked={value === "fast"}
            onChange={() => onChange("fast")}
            className="w-5 h-5 mt-0.5 rounded-full border-border text-accent focus:ring-accent"
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink">
                Fast Retail Care
              </span>
              <Badge variant="neutral">Off Campus</Badge>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Paid retail care (₦1,000 - ₦3,500) for short queues at accredited PCN
              pharmacies near Odim, Hilltop, or Ogige gates.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
