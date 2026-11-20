import * as React from "react";
import { ShieldAlert } from "lucide-react";

export interface AllergySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const COMMON_ALLERGIES = [
  "No known drug allergies",
  "Penicillin",
  "Sulfa drugs (Cotrimoxazole)",
  "NSAIDs / Aspirin",
  "Artemisinin derivatives",
];

export const AllergySelector: React.FC<AllergySelectorProps> = ({
  value,
  onChange,
}) => {
  const [customText, setCustomText] = React.useState(
    COMMON_ALLERGIES.includes(value) ? "" : value
  );

  const handleChipClick = (allergy: string) => {
    if (allergy === "No known drug allergies") {
      setCustomText("");
      onChange("None");
    } else {
      setCustomText("");
      onChange(allergy);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCustomText(text);
    onChange(text.trim().length > 0 ? text : "None");
  };

  const isNone = value === "None" || value === "No known drug allergies";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
          3. Declared Allergies
        </label>
        <span className="text-[11px] text-muted font-mono shrink-0">Counter Safety</span>
      </div>

      {/* Quick selection chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Common drug allergies">
        {COMMON_ALLERGIES.map((item) => {
          const isSelected =
            (item === "No known drug allergies" && isNone) ||
            value === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => handleChipClick(item)}
              aria-pressed={isSelected}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border min-h-[44px] transition-all flex items-center gap-1.5 focus-visible:outline-2 ${
                isSelected
                  ? "bg-accent/15 border-accent text-ink font-bold shadow-xs ring-1 ring-accent/30"
                  : "bg-surface border-border text-ink hover:border-muted hover:bg-surface-subtle active:bg-border-subtle"
              }`}
            >
              <span>{item}</span>
            </button>
          );
        })}
      </div>

      {/* Custom allergy input */}
      <div className="space-y-1">
        <input
          type="text"
          placeholder="Other allergy (e.g. Ciprofloxacin hives)..."
          value={customText}
          onChange={handleCustomChange}
          className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent min-h-[48px]"
        />
      </div>

      {/* Warning context */}
      {!isNone && (
        <div className="p-3 rounded-lg bg-surface-subtle border border-border text-xs text-body flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-ink shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            This allergy will be highlighted in bold amber on your intake slip so the dispenser verifies safe formulations before dispensing.
          </span>
        </div>
      )}
    </div>
  );
};
