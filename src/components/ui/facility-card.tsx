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
          ? "border-2 border-accent ring-1 ring-accent/20"
          : "border-border hover:border-muted"
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {isRecommended && (
                <Badge variant="tiship" icon={<Star className="w-3.5 h-3.5 fill-current" />}>
                  Optimal Route
                </Badge>
              )}

              {facility.isCampusClinic ? (
                <Badge variant="tiship">
                  <Building2 className="w-3.5 h-3.5 mr-1 inline" />
                  Campus Clinic
                </Badge>
              ) : (
                <Badge variant="neutral">Community Pharmacy</Badge>
              )}

              {facility.isVerified && (
                <Badge variant="pcn">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                  PCN Verified
                </Badge>
              )}

              {facility.tishipCovered && (
                <Badge variant="tiship">₦0 TISHIP Enrolled</Badge>
              )}
            </div>

            <CardTitle as="h3">{facility.name}</CardTitle>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-base font-bold text-ink block">
              {facility.priceLabel}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-4 text-sm text-body mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-muted shrink-0" />
            <span>
              {facility.distanceMeters}m from campus ({walkingMinutes} min walk)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-muted shrink-0" />
            <Badge variant={queueInfo.variant}>{queueInfo.label}</Badge>
          </div>
        </div>

        {/* Stock status for the requested category */}
        {selectedCategory && (
          <div className="p-3 rounded-md bg-surface-subtle border border-border-subtle flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              {selectedCategory}
            </span>
            {isCategoryInStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success">
                <CheckCircle2 className="w-4 h-4" />
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-error">
                <XCircle className="w-4 h-4" />
                Stockout (Check Alternative)
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
            className="flex items-center gap-2"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
