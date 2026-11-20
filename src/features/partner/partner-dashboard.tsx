import * as React from "react";
import { Facility, CareCategory, QueueLevel, UNN_PILOT_FACILITIES } from "@/types";
import { PartnerAuth } from "./partner-auth";
import { InventoryToggles } from "./inventory-toggles";
import { QueueSelector } from "./queue-selector";
import { TokenScanner } from "./token-scanner";
import { PrescriptionReviewConsole } from "./prescription-review";
import { getOfflineStorage, seedInitialData } from "@/lib/offline-db";
import { syncChannel } from "@/lib/sync-channel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  LogOut,
  Radio,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

interface TelemetryFeedItem {
  id: string;
  facilityName: string;
  action: string;
  timeAgo: string;
}

const DEFAULT_FEED: TelemetryFeedItem[] = [
  {
    id: "f1",
    facilityName: "Odim Gate Dispenser",
    action: "Antimalarials (ACT) verified in stock",
    timeAgo: "2m ago",
  },
  {
    id: "f2",
    facilityName: "UNN Medical Centre",
    action: "Crowd report: Low queue (~15m wait)",
    timeAgo: "8m ago",
  },
  {
    id: "f3",
    facilityName: "Hilltop Care Pharmacy",
    action: "Student intake pass verified (MW-UNN-741)",
    timeAgo: "14m ago",
  },
  {
    id: "f4",
    facilityName: "Ogige Central Pharmacy",
    action: "Analgesics & Fever verified in stock",
    timeAgo: "22m ago",
  },
  {
    id: "f5",
    facilityName: "UNN Medical Centre",
    action: "TISHIP coverage verified for Malaria RDT",
    timeAgo: "35m ago",
  },
];

export interface PartnerDashboardProps {
  initialFacility?: Facility;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({
  initialFacility,
}) => {
  const [activeFacility, setActiveFacility] = React.useState<Facility | null>(
    initialFacility ?? null
  );
  const [facilities, setFacilities] = React.useState<Facility[]>([...UNN_PILOT_FACILITIES]);
  const [syncStatus, setSyncStatus] = React.useState<string | null>(null);
  const [mobileTab, setMobileTab] = React.useState<"controls" | "feed">("controls");
  const [routesToday, setRoutesToday] = React.useState(144);
  const [stockoutReroutes, setStockoutReroutes] = React.useState(37);
  const [feedItems, setFeedItems] = React.useState<TelemetryFeedItem[]>(DEFAULT_FEED);

  // Sync data across tabs
  React.useEffect(() => {
    async function loadData() {
      await seedInitialData();
      const storage = getOfflineStorage();
      const loaded = await storage.getAllFacilities();
      if (loaded.length > 0) {
        setFacilities(loaded);
        if (activeFacility) {
          const fresh = loaded.find((f) => f.id === activeFacility.id);
          if (fresh) setActiveFacility(fresh);
        }
      }
    }
    loadData();

    const unsubscribe = syncChannel.subscribe((payload) => {
      loadData();
      if (payload.type === "stock_toggled") {
        setFeedItems((prev) => [
          {
            id: String(Date.now()),
            facilityName: "Partner Network",
            action: `${payload.category} set to ${payload.inStock ? "In Stock" : "Out of Stock"}`,
            timeAgo: "Just now",
          },
          ...prev.slice(0, 7),
        ]);
      } else if (payload.type === "queue_updated") {
        setFeedItems((prev) => [
          {
            id: String(Date.now()),
            facilityName: "Partner Network",
            action: `Queue status updated to ${payload.queue}`,
            timeAgo: "Just now",
          },
          ...prev.slice(0, 7),
        ]);
      } else if (payload.type === "prescription_uploaded") {
        setFeedItems((prev) => [
          {
            id: String(Date.now()),
            facilityName: "Care Router",
            action: `New doctor prescription slip uploaded (${payload.passCode})`,
            timeAgo: "Just now",
          },
          ...prev.slice(0, 7),
        ]);
      } else if (payload.type === "prescription_clarified") {
        setFeedItems((prev) => [
          {
            id: String(Date.now()),
            facilityName: "Pharmacist Station",
            action: `Prescription clarified for pass ${payload.passCode}`,
            timeAgo: "Just now",
          },
          ...prev.slice(0, 7),
        ]);
      }
    });

    return unsubscribe;
  }, [activeFacility?.id]);

  const handleAuthenticate = (facility: Facility) => {
    setActiveFacility(facility);
  };

  const handleSignOut = () => {
    setActiveFacility(null);
  };

  const handleToggleStock = async (category: CareCategory) => {
    if (!activeFacility) return;

    const currentVal = Boolean(activeFacility.stock[category]);
    const updatedStock = {
      ...activeFacility.stock,
      [category]: !currentVal,
    };

    const updatedFacility: Facility = {
      ...activeFacility,
      stock: updatedStock,
    };

    setActiveFacility(updatedFacility);
    setFacilities((prev) =>
      prev.map((f) => (f.id === updatedFacility.id ? updatedFacility : f))
    );

    // Save to local offline storage
    const storage = getOfflineStorage();
    await storage.saveFacility(updatedFacility);

    // Broadcast change to other open student tabs
    syncChannel.broadcast({
      type: "stock_toggled",
      facilityId: updatedFacility.id,
      category,
      inStock: !currentVal,
    });

    setSyncStatus(`Updated ${category} stock to ${!currentVal ? "In Stock" : "Out of Stock"}.`);
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleSelectQueue = async (queue: QueueLevel) => {
    if (!activeFacility) return;

    const updatedFacility: Facility = {
      ...activeFacility,
      currentQueue: queue,
      lastQueueUpdate: Date.now(),
    };

    setActiveFacility(updatedFacility);
    setFacilities((prev) =>
      prev.map((f) => (f.id === updatedFacility.id ? updatedFacility : f))
    );

    // Save to local offline storage
    const storage = getOfflineStorage();
    await storage.saveFacility(updatedFacility);

    // Broadcast change to student router
    syncChannel.broadcast({
      type: "queue_updated",
      facilityId: updatedFacility.id,
      queue,
    });

    setSyncStatus(`Updated current queue to ${queue}.`);
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // Simulate 2 PM Rush & Stockout
  const handleSimulateRush = async () => {
    const clinic = facilities.find((f) => f.isCampusClinic) || activeFacility;
    if (!clinic) return;

    const updatedClinic: Facility = {
      ...clinic,
      currentQueue: "high",
      stock: {
        ...clinic.stock,
        "Antimalarials (ACT)": false,
      },
    };

    const storage = getOfflineStorage();
    await storage.saveFacility(updatedClinic);

    setFacilities((prev) =>
      prev.map((f) => (f.id === updatedClinic.id ? updatedClinic : f))
    );

    if (activeFacility && activeFacility.id === updatedClinic.id) {
      setActiveFacility(updatedClinic);
    }

    setStockoutReroutes((prev) => prev + 1);

    syncChannel.broadcast({
      type: "queue_updated",
      facilityId: updatedClinic.id,
      queue: "high",
    });
    syncChannel.broadcast({
      type: "stock_toggled",
      facilityId: updatedClinic.id,
      category: "Antimalarials (ACT)",
      inStock: false,
    });

    setSyncStatus("Simulated 2 PM Rush: UNN Medical Centre set to High Queue & ACT Out of Stock.");
    setTimeout(() => setSyncStatus(null), 3500);
  };

  // Reset Baseline
  const handleResetBaseline = async () => {
    const clinic = facilities.find((f) => f.isCampusClinic) || activeFacility;
    if (!clinic) return;

    const resetClinic: Facility = {
      ...clinic,
      currentQueue: "low",
      stock: {
        ...clinic.stock,
        "Antimalarials (ACT)": true,
      },
    };

    const storage = getOfflineStorage();
    await storage.saveFacility(resetClinic);

    setFacilities((prev) =>
      prev.map((f) => (f.id === resetClinic.id ? resetClinic : f))
    );

    if (activeFacility && activeFacility.id === resetClinic.id) {
      setActiveFacility(resetClinic);
    }

    syncChannel.broadcast({
      type: "queue_updated",
      facilityId: resetClinic.id,
      queue: "low",
    });
    syncChannel.broadcast({
      type: "stock_toggled",
      facilityId: resetClinic.id,
      category: "Antimalarials (ACT)",
      inStock: true,
    });

    setSyncStatus("Baseline restored: UNN Medical Centre set to Low Queue & ACT In Stock.");
    setTimeout(() => setSyncStatus(null), 3500);
  };

  if (!activeFacility) {
    return <PartnerAuth onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="max-w-[1120px] mx-auto w-full space-y-6">
      {/* Workstation Header Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-muted shrink-0">
            <Building2 className="w-5 h-5 text-ink" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-ink">
                {activeFacility.name}
              </h1>
              {activeFacility.isCampusClinic ? (
                <Badge variant="tiship">Campus Clinic</Badge>
              ) : (
                <Badge variant="pcn">PCN Accredited</Badge>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">
              Dispenser & Attendant Workstation • Instant cross-session broadcast
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSignOut}
            className="gap-1.5 min-h-[44px]"
          >
            <LogOut className="w-4 h-4 text-muted" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Demo Simulation Trigger Bar */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-xs font-bold text-ink">
            Hackathon Stage Telemetry Controls:
          </span>
          <span className="text-xs text-muted hidden md:inline">
            Flip campus congestion to watch Student routes reroute immediately.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSimulateRush}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs min-h-[40px] shadow-2xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Simulate 2 PM Rush</span>
          </button>

          <button
            type="button"
            onClick={handleResetBaseline}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-ink font-bold text-xs min-h-[40px] shadow-2xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0 text-muted" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Sync Status Feedback Toast */}
      {syncStatus && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-2xs"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Mobile-Only Segmented Tabs (< 1024px) */}
      <div className="lg:hidden flex justify-center">
        <div className="bg-surface-subtle p-1 rounded-xl border border-border inline-flex gap-1 shadow-2xs w-full max-w-sm">
          <button
            type="button"
            onClick={() => setMobileTab("controls")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg text-center min-h-[44px] transition-all ${
              mobileTab === "controls"
                ? "bg-surface text-ink border border-border shadow-xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Live Stock & Queues
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("feed")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg text-center min-h-[44px] transition-all ${
              mobileTab === "feed"
                ? "bg-surface text-ink border border-border shadow-xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Campus Demand Feed
          </button>
        </div>
      </div>

      {/* Main 2-Column Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN (~65% — Live Controls) ================= */}
        <div
          className={`lg:col-span-8 space-y-6 ${
            mobileTab === "controls" ? "block" : "hidden lg:block"
          }`}
        >
          {/* Consolidated Console Surface */}
          <div className="bg-surface border border-border rounded-xl shadow-xs divide-y divide-border overflow-hidden">
            {/* 1. Essential Care Inventory Controls */}
            <section className="p-4 sm:p-6">
              <InventoryToggles
                stock={activeFacility.stock}
                onToggle={handleToggleStock}
              />
            </section>

            {/* 2. Queue Level Selector */}
            <section className="p-4 sm:p-6">
              <QueueSelector
                currentQueue={activeFacility.currentQueue}
                lastUpdated={activeFacility.lastQueueUpdate}
                onSelectQueue={handleSelectQueue}
              />
            </section>

            {/* 3. Doctor Prescription Handwriting Review */}
            <section className="p-4 sm:p-6">
              <PrescriptionReviewConsole
                facilityId={activeFacility.id}
                facilityName={activeFacility.name}
                onPrescriptionClarified={(passCode) => {
                  setFeedItems((prev) => [
                    {
                      id: String(Date.now()),
                      facilityName: activeFacility.name,
                      action: `Prescription clarified for pass ${passCode}`,
                      timeAgo: "Just now",
                    },
                    ...prev.slice(0, 7),
                  ]);
                }}
              />
            </section>

            {/* 4. Counter Token Scanner */}
            <section className="p-4 sm:p-6">
              <TokenScanner
                facilityId={activeFacility.id}
                facilityName={activeFacility.name}
              />
            </section>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (~35% — Live Demand Rail) ================= */}
        <aside
          className={`lg:col-span-4 space-y-5 lg:sticky lg:top-20 ${
            mobileTab === "feed" ? "block" : "hidden lg:block"
          }`}
        >
          {/* Top-Line Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-surface border border-border shadow-xs space-y-1">
              <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
                Routes Today
              </span>
              <strong className="text-2xl font-bold text-ink block font-mono">
                {routesToday}
              </strong>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border shadow-xs space-y-1">
              <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
                Stockout Reroutes
              </span>
              <strong className="text-2xl font-bold text-amber-700 dark:text-amber-400 block font-mono">
                {stockoutReroutes}
              </strong>
            </div>
          </div>

          {/* Live Anonymized Campus Demand Feed */}
          <div className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-accent shrink-0" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
                  Campus Demand Feed
                </h3>
              </div>
              <Badge variant="neutral" className="text-[10px]">
                Live Stream
              </Badge>
            </div>

            <p className="text-[11px] text-muted">
              Real-time telemetry reports from student intake passes and gate check-ins.
            </p>

            <div className="space-y-2.5 pt-1">
              {feedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-1 text-[11px] text-muted font-mono">
                    <span className="font-bold text-ink truncate">
                      {item.facilityName}
                    </span>
                    <span className="shrink-0">{item.timeAgo}</span>
                  </div>
                  <p className="text-xs text-body leading-snug">
                    {item.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
