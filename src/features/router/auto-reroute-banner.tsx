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
      className="p-4 rounded-lg bg-warning/10 border-2 border-warning text-ink space-y-3 transition-all"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-ink">
              Clinic Stockout Notice: {category}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-ink font-semibold">
              Auto Rerouted
            </span>
          </div>
          <p className="text-xs text-body leading-relaxed">
            UNN Medical Centre currently reports zero stock for {category}. MedWay has
            automatically redirected your route to accredited off campus partner
            pharmacies with verified inventory.
          </p>
        </div>
      </div>

      {alternativeFacility && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-warning/30">
          <div className="text-xs text-body">
            <span className="font-bold text-ink">Recommended Alternative: </span>
            <span>{alternativeFacility.name}</span>
            <span className="text-muted"> ({alternativeFacility.distanceMeters}m from campus, {alternativeFacility.priceLabel})</span>
          </div>

          {onSelectAlternative && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSelectAlternative(alternativeFacility)}
              className="border-warning text-ink hover:bg-warning/20 shrink-0 self-start sm:self-auto"
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
