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
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
          2. Student Budget & Insurance Gate
        </label>
        <span className="text-[11px] text-muted font-mono shrink-0">TISHIP Hard Lock Active</span>
      </div>

      <div className="space-y-2.5" role="radiogroup">
        {/* Option 1: ₦0 TISHIP Covered */}
        <label
          className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer min-h-[52px] transition-all select-none ${
            value === "tiship"
              ? "bg-accent/10 border-accent shadow-xs ring-1 ring-accent/30"
              : "bg-surface border-border hover:border-muted hover:bg-surface-subtle"
          }`}
        >
          <input
            type="radio"
            name="budget_gate"
            value="tiship"
            checked={value === "tiship"}
            onChange={() => onChange("tiship")}
            className="w-4 h-4 mt-0.5 rounded-full border-border text-accent focus:ring-accent"
          />

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-ink">
                ₦0 TISHIP Coverage
              </span>
              <Badge variant="tiship">On Campus</Badge>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Mandatory health fee covers doctor consultations and essential stock at UNN Medical Centre without out-of-pocket cost.
            </p>
          </div>
        </label>

        {/* Option 2: Fast Retail Care */}
        <label
          className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer min-h-[52px] transition-all select-none ${
            value === "fast"
              ? "bg-accent/10 border-accent shadow-xs ring-1 ring-accent/30"
              : "bg-surface border-border hover:border-muted hover:bg-surface-subtle"
          }`}
        >
          <input
            type="radio"
            name="budget_gate"
            value="fast"
            checked={value === "fast"}
            onChange={() => onChange("fast")}
            className="w-4 h-4 mt-0.5 rounded-full border-border text-accent focus:ring-accent"
          />

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-ink">
                Fast Retail Care
              </span>
              <Badge variant="neutral">Off Campus</Badge>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Paid retail care (<span className="tabular-nums">₦1,000 - ₦3,500</span>) for short queues at accredited PCN pharmacies near campus gates.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
