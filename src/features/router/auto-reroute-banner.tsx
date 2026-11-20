import * as React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { CareCategory, Facility } from "@/types";
import { Button } from "@/components/ui/button";

export interface AutoRerouteBannerProps {
  category: CareCategory;
  alternativeFacility?: Facility;
  onSelectAlternative?: (facility: Facility) => void;
}

export const AutoRerouteBanner: React.FC<AutoRerouteBannerProps> = ({
  category,
  alternativeFacility,
  onSelectAlternative,
}) => {
  return (
    <div
      role="alert"
      className="p-4 sm:p-5 rounded-xl bg-surface border border-border text-ink space-y-3 shadow-sm transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-border flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4 text-ink" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-ink">
              Clinic Stockout Notice: {category}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-subtle border border-border text-ink font-semibold">
              Auto Rerouted
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            UNN Medical Centre currently reports zero stock for {category}. MedWay has
            automatically redirected your route to accredited off campus partner
            pharmacies with verified inventory.
          </p>
        </div>
      </div>

      {alternativeFacility && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="text-xs text-body">
            <span className="font-bold text-ink">Recommended Alternative: </span>
            <span className="font-medium">{alternativeFacility.name}</span>
            <span className="text-muted tabular-nums"> ({alternativeFacility.distanceMeters}m from campus, {alternativeFacility.priceLabel})</span>
          </div>

          {onSelectAlternative && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSelectAlternative(alternativeFacility)}
              className="shrink-0 self-start sm:self-auto min-h-[48px]"
            >
              <span>Select {alternativeFacility.name.split(" ")[0]}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
