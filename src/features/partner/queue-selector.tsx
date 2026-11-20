import * as React from "react";
import { QueueLevel } from "@/types";
import { Users, Clock } from "lucide-react";

export interface QueueSelectorProps {
  currentQueue: QueueLevel;
  lastUpdated?: number;
  onSelectQueue: (queue: QueueLevel) => void;
}

export const QueueSelector: React.FC<QueueSelectorProps> = ({
  currentQueue,
  lastUpdated,
  onSelectQueue,
}) => {
  const options: Array<{ level: QueueLevel; label: string; desc: string; colorClass: string }> = [
    {
      level: "low",
      label: "Low Queue",
      desc: "Fast service (< 15 mins)",
      colorClass:
        currentQueue === "low"
          ? "border-success bg-success/10 text-success"
          : "border-border bg-surface text-ink hover:border-muted",
    },
    {
      level: "moderate",
      label: "Moderate Queue",
      desc: "Standard wait (15 - 45 mins)",
      colorClass:
        currentQueue === "moderate"
          ? "border-warning bg-warning/10 text-ink"
          : "border-border bg-surface text-ink hover:border-muted",
    },
    {
      level: "high",
      label: "High Congestion",
      desc: "Severe delay (> 45 mins)",
      colorClass:
        currentQueue === "high"
          ? "border-danger bg-danger/10 text-danger"
          : "border-border bg-surface text-ink hover:border-muted",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          <h2 className="text-base font-bold text-ink">
            Counter Queue Level
          </h2>
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-1 text-xs text-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated recently</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Queue level">
        {options.map((opt) => (
          <button
            key={opt.level}
            type="button"
            role="radio"
            aria-checked={currentQueue === opt.level}
            onClick={() => onSelectQueue(opt.level)}
            className={`p-4 rounded-xl border-2 text-left transition-all min-h-[56px] space-y-1 ${opt.colorClass}`}
          >
            <span className="text-sm font-bold block">{opt.label}</span>
            <span className="text-xs text-muted block">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
