import * as React from "react";
import { CARE_CATEGORIES, CareCategory } from "@/types";
import { Activity, Check, Droplets, Pill, Thermometer } from "lucide-react";

export interface CategorySelectorProps {
  selectedCategory: CareCategory;
  onSelectCategory: (category: CareCategory) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categoryMetadata: Record<
    CareCategory,
    { icon: React.ReactNode; subtitle: string }
  > = {
    "Antimalarials (ACT)": {
      icon: <Pill className="w-5 h-5" />,
      subtitle: "ACT, Artemether / Lumefantrine",
    },
    "Analgesics & Fever": {
      icon: <Thermometer className="w-5 h-5" />,
      subtitle: "Paracetamol, Pain & Fever Relief",
    },
    "Typhoid / Lab Test": {
      icon: <Activity className="w-5 h-5" />,
      subtitle: "Widal, Malaria RDT, Blood Screen",
    },
    "ORS & Hydration": {
      icon: <Droplets className="w-5 h-5" />,
      subtitle: "Oral Rehydration Salts, Zinc",
    },
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
          1. Select Care Category
        </label>
        <span className="text-[11px] text-muted font-mono shrink-0">Non-Diagnostic</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CARE_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const meta = categoryMetadata[category];

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`group flex items-start justify-between p-3 rounded-lg border text-left min-h-[52px] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isSelected
                  ? "bg-accent/10 border-accent text-ink shadow-xs ring-1 ring-accent/30"
                  : "bg-surface border-border text-body hover:border-muted hover:bg-surface-subtle"
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className={`mt-0.5 shrink-0 transition-colors ${
                    isSelected ? "text-accent" : "text-muted group-hover:text-ink"
                  }`}
                >
                  {meta.icon}
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-ink block leading-snug truncate">
                    {category}
                  </span>
                  <span className="text-[11px] text-muted block mt-0.5 truncate">
                    {meta.subtitle}
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-accent text-on-accent flex items-center justify-center shrink-0 mt-0.5 ml-1">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
