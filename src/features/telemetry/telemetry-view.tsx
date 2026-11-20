"use client";

import * as React from "react";
import { getOfflineStorage, seedInitialData } from "@/lib/offline-db";
import { syncChannel } from "@/lib/sync-channel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  aggregateTelemetry,
  AggregatedTelemetry,
  buildAnonymizedExport,
} from "./telemetry-aggregator";
import {
  CategoryDemandBarChart,
  FacilityStatusMatrix,
  QueueCongestionMeter,
} from "./telemetry-charts";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Download,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

export const TelemetryView: React.FC = () => {
  const [telemetry, setTelemetry] = React.useState<AggregatedTelemetry | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [exportNotice, setExportNotice] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await seedInitialData();
      const storage = getOfflineStorage();
      const [facilities, passes] = await Promise.all([
        storage.getAllFacilities(),
        storage.getAllIntakePasses(),
      ]);

      const agg = aggregateTelemetry(passes, facilities);
      setTelemetry(agg);
    } catch (err) {
      console.error("Failed to load telemetry dataset:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();

    // Listen to real time updates across tabs
    const unsubscribe = syncChannel.subscribe(() => {
      loadData();
    });

    return () => {
      unsubscribe();
    };
  }, [loadData]);

  const handleExportJson = () => {
    if (!telemetry) return;

    const exportData = buildAnonymizedExport(telemetry);
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `medway-unn-telemetry-${new Date().toISOString().split("T")[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice("Export downloaded: zero PII summary ready for institutional reporting.");
    setTimeout(() => setExportNotice(null), 4000);
  };

  if (isLoading || !telemetry) {
    return (
      <div className="py-12 text-center space-y-3">
        <div className="w-8 h-8 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted">
          Aggregating campus logistics telemetry...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Context */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-accent tracking-wider uppercase">
          <Activity className="w-4 h-4" />
          <span>Institutional Public Health Feed</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          Campus Logistics Telemetry
        </h1>
        <p className="text-sm text-muted max-w-2xl">
          Aggregated demand distribution, clinic queue wait loads, and stockout frequency
          for UNN Medical Centre, TISHIP administrators, and public health partners.
        </p>
      </div>

      {/* Non Diagnostic and Privacy Safety Notice */}
      <div className="p-4 rounded-xl border border-border bg-surface-subtle space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-ink">
          <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
          <span>Strict Non Diagnostic & Zero Student PII Boundary</span>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          This institutional feed aggregates logistics and supply chain indicators strictly.
          It does not record patient diagnoses, student names, matriculation numbers, or
          IP addresses. All metrics are computed locally across validated facility reports.
        </p>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-surface">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted text-xs">
              <span className="font-medium">Total Inquiries</span>
              <Users className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl font-bold font-mono text-ink">
              {telemetry.totalInquiries}
            </div>
            <p className="text-[11px] text-muted">24h routing volume</p>
          </CardContent>
        </Card>

        <Card className="bg-surface">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted text-xs">
              <span className="font-medium">TISHIP Coverage</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
              {telemetry.tishipCoveragePercentage}%
            </div>
            <p className="text-[11px] text-muted">₦0 care eligibility</p>
          </CardContent>
        </Card>

        <Card className="bg-surface">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted text-xs">
              <span className="font-medium">Active Stockouts</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400">
              {telemetry.totalStockouts}
            </div>
            <p className="text-[11px] text-muted">Across 4 counters</p>
          </CardContent>
        </Card>

        <Card className="bg-surface">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted text-xs">
              <span className="font-medium">Avg Clinic Wait</span>
              <Activity className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl font-bold font-mono text-ink">
              ~{telemetry.queueDistribution.averageWaitMinutes}m
            </div>
            <p className="text-[11px] text-muted">Estimated queue time</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDemandBarChart
          metrics={telemetry.categoryMetrics}
          totalInquiries={telemetry.totalInquiries}
        />
        <QueueCongestionMeter distribution={telemetry.queueDistribution} />
      </div>

      {/* Facility Operational Matrix */}
      <FacilityStatusMatrix facilities={telemetry.facilityMetrics} />

      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-muted font-mono">
          Last computed: {new Date(telemetry.generatedAt).toLocaleTimeString()}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={loadData}
            className="flex-1 sm:flex-initial inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </Button>

          <Button
            variant="primary"
            onClick={handleExportJson}
            className="flex-1 sm:flex-initial inline-flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Summary</span>
          </Button>
        </div>
      </div>

      {/* Status Notice Toast */}
      {exportNotice && (
        <div
          role="status"
          className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}
    </div>
  );
};
