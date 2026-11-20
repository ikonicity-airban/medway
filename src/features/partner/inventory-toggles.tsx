import * as React from "react";
import { CareCategory, CARE_CATEGORIES, FacilityStockMap } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Check, X, Package } from "lucide-react";

export interface InventoryTogglesProps {
  stock: FacilityStockMap;
  onToggle: (category: CareCategory) => void;
}

export const InventoryToggles: React.FC<InventoryTogglesProps> = ({
  stock,
  onToggle,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-accent" />
          <h2 className="text-base font-bold text-ink">
            Essential Care Inventory Controls
          </h2>
        </div>
        <span className="text-xs text-muted">1-Tap Live Availability</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CARE_CATEGORIES.map((category) => {
          const inStock = Boolean(stock[category]);

          return (
            <button
              key={category}
              type="button"
              role="switch"
              aria-checked={inStock}
              onClick={() => onToggle(category)}
              className={`p-4 rounded-xl border-2 text-left transition-all min-h-[56px] flex items-center justify-between gap-3 select-none ${
                inStock
                  ? "bg-surface border-success shadow-xs hover:border-success/80"
                  : "bg-surface-subtle border-border opacity-85 hover:border-muted"
              }`}
            >
              <div className="space-y-1">
                <span className="text-sm font-bold text-ink block">
                  {category}
                </span>
                <span className="text-xs text-muted block">
                  {inStock ? "Verified available on shelf" : "Reported depleted / stockout"}
                </span>
              </div>

              <div className="shrink-0">
                {inStock ? (
                  <Badge variant="in-stock" icon={<Check className="w-3 h-3" />}>
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="out-of-stock" icon={<X className="w-3 h-3" />}>
                    Out of Stock
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
