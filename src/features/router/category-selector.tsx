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
      icon: <Pill className="w-5 h-5 text-accent" />,
      subtitle: "ACT, Artemether / Lumefantrine",
    },
    "Analgesics & Fever": {
      icon: <Thermometer className="w-5 h-5 text-warning" />,
      subtitle: "Paracetamol, Pain & Fever Relief",
    },
    "Typhoid / Lab Test": {
      icon: <Activity className="w-5 h-5 text-error" />,
      subtitle: "Widal, Malaria RDT, Blood Screen",
    },
    "ORS & Hydration": {
      icon: <Droplets className="w-5 h-5 text-success" />,
      subtitle: "Oral Rehydration Salts, Zinc",
    },
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-ink">
          Select Required Care Category
        </label>
        <span className="text-xs text-muted">Non Diagnostic Logistics</span>
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
              className={`flex items-start justify-between p-3.5 rounded-lg border text-left min-h-[56px] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isSelected
                  ? "bg-surface border-2 border-accent ring-1 ring-accent/30 shadow-sm"
                  : "bg-surface border-border hover:border-muted active:bg-surface-subtle"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{meta.icon}</div>
                <div>
                  <span className="text-sm font-bold text-ink block leading-snug">
                    {category}
                  </span>
                  <span className="text-xs text-muted block mt-0.5">
                    {meta.subtitle}
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-accent text-on-accent flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
