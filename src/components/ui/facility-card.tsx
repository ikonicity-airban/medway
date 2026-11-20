import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CareCategory, Facility } from "@/types";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  XCircle,
} from "lucide-react";

export interface FacilityCardProps {
  facility: Facility;
  selectedCategory?: CareCategory;
  isRecommended?: boolean;
  onSelect?: (facility: Facility) => void;
  onSelectRoute?: (facility: Facility) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  selectedCategory,
  isRecommended = false,
  onSelect,
  onSelectRoute,
}) => {
  // Estimated walking time: ~80 meters per minute
  const walkingMinutes = Math.max(1, Math.round(facility.distanceMeters / 80));

  const queueBadgeMap: Record<
    Facility["currentQueue"],
    { variant: "queue-low" | "queue-moderate" | "queue-high"; label: string }
  > = {
    low: { variant: "queue-low", label: "Low Queue (< 15m)" },
    moderate: { variant: "queue-moderate", label: "Moderate Queue (15-45m)" },
    high: { variant: "queue-high", label: "High Queue (> 45m)" },
  };

  const queueInfo = queueBadgeMap[facility.currentQueue];
  const isCategoryInStock = selectedCategory ? facility.stock[selectedCategory] : true;

  const handleAction = () => {
    if (onSelect) {
      onSelect(facility);
    } else if (onSelectRoute) {
      onSelectRoute(facility);
    }
  };

  const buttonText = onSelectRoute && !onSelect ? "Select Route" : "Select Facility";

  return (
    <Card
      className={`transition-all ${
        isRecommended
          ? "border-accent/60 shadow-xs ring-1 ring-accent/30 bg-surface"
          : "border-border hover:border-muted hover:shadow-xs"
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {isRecommended && (
                <Badge variant="tiship" icon={<Star className="w-3 h-3 fill-current" />}>
                  Optimal Route
                </Badge>
              )}

              {facility.isCampusClinic ? (
                <Badge variant="tiship">
                  <Building2 className="w-3 h-3 mr-1 inline" />
                  Campus Clinic
                </Badge>
              ) : (
                <Badge variant="neutral">Community Pharmacy</Badge>
              )}

              {facility.isVerified && (
                <Badge variant="pcn">
                  <ShieldCheck className="w-3 h-3 mr-1 inline" />
                  PCN Verified
                </Badge>
              )}

              {facility.tishipCovered && (
                <Badge variant="tiship">₦0 TISHIP Enrolled</Badge>
              )}
            </div>

            <CardTitle as="h3" className="text-base sm:text-lg font-bold text-ink">
              {facility.name}
            </CardTitle>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-sm sm:text-base font-bold text-ink block font-mono tabular-nums tracking-tight">
              {facility.priceLabel}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-body mb-3">
          <div className="flex items-center gap-1.5 text-muted">
            <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
            <span>
              <strong className="font-mono tabular-nums text-ink">{facility.distanceMeters}m</strong> from campus (<span className="font-mono tabular-nums">{walkingMinutes} min</span> walk)
            </span>
          </div>

          <span className="text-border text-xs hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted shrink-0" />
            <Badge variant={queueInfo.variant}>{queueInfo.label}</Badge>
          </div>
        </div>

        {/* Stock status for the requested category */}
        {selectedCategory && (
          <div className="px-3 py-2 rounded-lg bg-surface-subtle/80 border border-border flex items-center justify-between text-xs">
            <span className="font-mono font-medium text-muted uppercase tracking-wider text-[11px]">
              {selectedCategory}
            </span>
            {isCategoryInStock ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 font-mono text-xs">
                <XCircle className="w-3.5 h-3.5" />
                Stockout
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="w-full flex items-center justify-between gap-3">
          <span className="text-xs text-muted">
            {facility.isCampusClinic
              ? "Official student medical center"
              : "Accredited retail partner"}
          </span>

          <Button
            variant={facility.isCampusClinic ? "primary" : "secondary"}
            size="default"
            onClick={handleAction}
            className="flex items-center gap-2 min-h-[44px] sm:min-h-[48px] px-4 py-2 font-semibold text-xs sm:text-sm"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
