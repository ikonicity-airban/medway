import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CategoryMetric,
  FacilityStockoutMetric,
  QueueDistribution,
} from "./telemetry-aggregator";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface CategoryChartProps {
  metrics: CategoryMetric[];
  totalInquiries: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Antimalarials (ACT)": "#0284c7", // Sky blue
  "Analgesics & Fever": "#0d9488", // Teal
  "Typhoid / Lab Test": "#d97706", // Amber
  "ORS & Hydration": "#10b981", // Emerald
};

export const CategoryDemandBarChart: React.FC<CategoryChartProps> = ({
  metrics,
  totalInquiries,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-ink">
            Medication Demand Breakdown
          </CardTitle>
          <span className="text-xs font-semibold text-muted font-mono">
            N = {totalInquiries} queries
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <svg
            role="graphics-document"
            aria-label="Category Demand Distribution Bar Chart"
            className="w-full h-auto"
            viewBox="0 0 460 210"
            preserveAspectRatio="xMidYMid meet"
          >
            <title>Medication Category Demand Distribution</title>
            <desc>
              Horizontal bar chart displaying relative percentage of student inquiries
              across four medication categories.
            </desc>

            {metrics.map((item, index) => {
              const y = index * 52;
              const barWidth = Math.max(8, (item.percentage / 100) * 320);
              const color = CATEGORY_COLORS[item.category] || "#0284c7";

              return (
                <g key={item.category} className="group">
                  {/* Category Label */}
                  <text
                    x="0"
                    y={y + 16}
                    fill="currentColor"
                    className="text-xs font-semibold fill-ink"
                    style={{ fontSize: "12px", fontFamily: "inherit" }}
                  >
                    {item.category}
                  </text>

                  {/* Count & Percentage Text */}
                  <text
                    x="460"
                    y={y + 16}
                    textAnchor="end"
                    fill="currentColor"
                    className="text-xs font-mono font-medium fill-muted"
                    style={{ fontSize: "12px" }}
                  >
                    {item.count} ({item.percentage}%)
                  </text>

                  {/* Track Background */}
                  <rect
                    x="0"
                    y={y + 24}
                    width="460"
                    height="14"
                    rx="7"
                    className="fill-surface-subtle"
                  />

                  {/* Dynamic Progress Bar */}
                  <rect
                    x="0"
                    y={y + 24}
                    width={barWidth}
                    height="14"
                    rx="7"
                    fill={color}
                  />
                </g>
              );
            })}
          </svg>

          {/* Accessible Text Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            {metrics.map((item) => (
              <div key={item.category} className="flex items-center gap-2 text-xs">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: CATEGORY_COLORS[item.category] || "#0284c7",
                  }}
                  aria-hidden="true"
                />
                <span className="text-body font-medium truncate">
                  {item.category}: {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QueueMeterProps {
  distribution: QueueDistribution;
}

export const QueueCongestionMeter: React.FC<QueueMeterProps> = ({
  distribution,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-ink">
            Campus Queue Load
          </CardTitle>
          <div className="flex items-center gap-1.5 text-xs font-bold text-ink font-mono bg-surface-subtle px-2 py-1 rounded">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>~{distribution.averageWaitMinutes} min avg wait</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Visual Stacked Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted font-medium">
              <span>Facility Congestion Spread</span>
              <span>100% of facilities reporting</span>
            </div>

            <div
              className="h-6 w-full rounded-md bg-surface-subtle flex overflow-hidden border border-border"
              role="progressbar"
              aria-label="Queue Congestion Breakdown"
              aria-valuenow={distribution.lowPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {distribution.lowPercentage > 0 && (
                <div
                  style={{ width: `${distribution.lowPercentage}%` }}
                  className="bg-emerald-600 h-full flex items-center justify-center text-[10px] text-white font-bold"
                  title={`Low Queue: ${distribution.lowPercentage}%`}
                >
                  {distribution.lowPercentage >= 15 && `${distribution.lowPercentage}%`}
                </div>
              )}
              {distribution.moderatePercentage > 0 && (
                <div
                  style={{ width: `${distribution.moderatePercentage}%` }}
                  className="bg-amber-600 h-full flex items-center justify-center text-[10px] text-white font-bold"
                  title={`Moderate Queue: ${distribution.moderatePercentage}%`}
                >
                  {distribution.moderatePercentage >= 15 &&
                    `${distribution.moderatePercentage}%`}
                </div>
              )}
              {distribution.highPercentage > 0 && (
                <div
                  style={{ width: `${distribution.highPercentage}%` }}
                  className="bg-rose-600 h-full flex items-center justify-center text-[10px] text-white font-bold"
                  title={`High Queue: ${distribution.highPercentage}%`}
                >
                  {distribution.highPercentage >= 15 && `${distribution.highPercentage}%`}
                </div>
              )}
            </div>
          </div>

          {/* Metric Details */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-2.5 rounded-lg border border-border bg-surface-subtle text-center">
              <span className="block text-[11px] font-mono font-semibold text-muted uppercase tracking-wider">
                Low (&lt;15m)
              </span>
              <span className="text-lg font-bold text-ink font-mono tabular-nums">
                {distribution.low}
              </span>
              <span className="block text-[10px] text-muted">
                {distribution.lowPercentage}% of counters
              </span>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-surface-subtle text-center">
              <span className="block text-[11px] font-mono font-semibold text-muted uppercase tracking-wider">
                Moderate (15-45m)
              </span>
              <span className="text-lg font-bold text-ink font-mono tabular-nums">
                {distribution.moderate}
              </span>
              <span className="block text-[10px] text-muted">
                {distribution.moderatePercentage}% of counters
              </span>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-surface-subtle text-center">
              <span className="block text-[11px] font-mono font-semibold text-muted uppercase tracking-wider">
                High (&gt;45m)
              </span>
              <span className="text-lg font-bold text-ink font-mono tabular-nums">
                {distribution.high}
              </span>
              <span className="block text-[10px] text-muted">
                {distribution.highPercentage}% of counters
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface FacilityMatrixProps {
  facilities: FacilityStockoutMetric[];
}

export const FacilityStatusMatrix: React.FC<FacilityMatrixProps> = ({
  facilities,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-ink">
            Facility Operational Status
          </CardTitle>
          <Badge variant="neutral">{facilities.length} monitored</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border -my-2">
          {facilities.map((fac) => {
            const hasStockout = fac.outOfStockCount > 0;

            return (
              <div
                key={fac.facilityId}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-ink text-sm">
                      {fac.facilityName}
                    </span>
                    {fac.tishipCovered && (
                      <Badge variant="pcn">₦0 TISHIP</Badge>
                    )}
                    {fac.isCampusClinic && (
                      <Badge variant="neutral">Clinic</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted flex items-center gap-3">
                    <span>{fac.facilityType}</span>
                    <span>•</span>
                    <span className="capitalize font-medium text-body">
                      Queue: {fac.currentQueue}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {hasStockout ? (
                    <div className="flex items-center gap-1.5 text-xs text-ink bg-surface-subtle border border-border px-2.5 py-1.5 rounded-md">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-muted" />
                      <span className="font-medium font-mono">
                        {fac.outOfStockCount} Stockout{fac.outOfStockCount > 1 ? "s" : ""}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-ink bg-surface-subtle border border-border px-2.5 py-1.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-muted" />
                      <span className="font-medium font-mono">All 4 In Stock</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
