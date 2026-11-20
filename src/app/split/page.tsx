"use client";

import * as React from "react";
import { AppHeader } from "@/components/ui/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FacilityCard } from "@/components/ui/facility-card";
import { Modal } from "@/components/ui/modal";
import { getOfflineStorage, seedInitialData } from "@/lib/offline-db";
import { syncChannel } from "@/lib/sync-channel";
import { rankFacilities, RoutingPreferences } from "@/lib/routing-engine";
import { createIntakePass } from "@/lib/intake-pass";
import { CareCategory, Facility, IntakePass, QueueLevel, UNN_PILOT_FACILITIES } from "@/types";
import { IntakePassView } from "@/features/intake-pass";
import { PrescriptionUpload } from "@/features/router";
import { PrescriptionReviewConsole } from "@/features/partner";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  PhoneCall,
  Zap,
} from "lucide-react";

interface RedFlagItem {
  id: string;
  label: string;
  description: string;
}

const RED_FLAGS: RedFlagItem[] = [
  {
    id: "fever_stiff_neck",
    label: "High fever lasting > 3 days or stiff neck",
    description: "Requires urgent in-person clinical assessment and malaria/meningitis exclusion.",
  },
  {
    id: "breathing_difficulty",
    label: "Difficulty breathing, chest tightness, or persistent cough",
    description: "Potential respiratory distress; do not wait in an outpatient pharmacy queue.",
  },
  {
    id: "fainting_confusion",
    label: "Fainting, confusion, or severe lethargy",
    description: "Neurological or hemodynamic warning sign requiring 24/7 emergency casualty care.",
  },
  {
    id: "persistent_vomiting",
    label: "Persistent vomiting or inability to keep fluids down",
    description: "Acute dehydration risk; emergency IV fluids required.",
  },
];

export default function SplitViewPage() {
  const [facilities, setFacilities] = React.useState<Facility[]>([...UNN_PILOT_FACILITIES]);
  const [selectedCategory, setSelectedCategory] = React.useState<CareCategory>("Antimalarials (ACT)");
  const [selectedFlags, setSelectedFlags] = React.useState<string[]>([]);
  const [activePass, setActivePass] = React.useState<IntakePass | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = React.useState(false);
  const [prescriptionImage, setPrescriptionImage] = React.useState<string | undefined>(undefined);
  const [partnerTab, setPartnerTab] = React.useState<"telemetry" | "prescriptions">("telemetry");

  // Live Telemetry KPI stats
  const [routesToday, setRoutesToday] = React.useState(144);
  const [reroutesCount, setReroutesCount] = React.useState(37);

  // Sync and offline data loading
  const loadData = React.useCallback(async () => {
    await seedInitialData();
    const storage = getOfflineStorage();
    const loaded = await storage.getAllFacilities();
    if (loaded.length > 0) {
      setFacilities(loaded);
    }
  }, []);

  React.useEffect(() => {
    loadData();
    const unsubscribe = syncChannel.subscribe((msg) => {
      loadData();
      if (msg.type === "prescription_clarified") {
        setActivePass((prev) =>
          prev && prev.passCode === msg.passCode
            ? { ...prev, pharmacistNotes: msg.notes, status: "verified" }
            : prev
        );
      }
    });
    return unsubscribe;
  }, [loadData]);

  const hasRedFlags = selectedFlags.length > 0;

  const routingPrefs: RoutingPreferences = React.useMemo(() => {
    return {
      category: selectedCategory,
      budgetPreference: "tiship",
      isZeroBudget: true,
      hasRedFlags,
    };
  }, [selectedCategory, hasRedFlags]);

  const scoredFacilities = React.useMemo(() => {
    return rankFacilities(facilities, routingPrefs);
  }, [facilities, routingPrefs]);

  const campusClinic = React.useMemo(() => {
    return facilities.find((f) => f.isCampusClinic);
  }, [facilities]);

  const isClinicOutOfStock = campusClinic ? !campusClinic.stock[selectedCategory] : false;
  const isClinicHighQueue = campusClinic ? campusClinic.currentQueue === "high" : false;
  const isAutoRerouteActive = isClinicOutOfStock || isClinicHighQueue;

  const topPartner = React.useMemo(() => {
    return scoredFacilities.find((s) => !s.facility.isCampusClinic)?.facility;
  }, [scoredFacilities]);

  // Handle Red Flag toggle
  const toggleFlag = (flagId: string) => {
    setSelectedFlags((prev) =>
      prev.includes(flagId) ? prev.filter((id) => id !== flagId) : [...prev, flagId]
    );
  };

  // Simulate 2 PM Rush & Stockout
  const handleSimulateRush = async () => {
    if (!campusClinic) return;
    const storage = getOfflineStorage();

    const updatedClinic: Facility = {
      ...campusClinic,
      currentQueue: "high",
      stock: {
        ...campusClinic.stock,
        "Antimalarials (ACT)": false,
      },
    };

    await storage.saveFacility(updatedClinic);
    setFacilities((prev) => prev.map((f) => (f.id === updatedClinic.id ? updatedClinic : f)));
    setReroutesCount((prev) => prev + 1);

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
  };

  // Reset Baseline
  const handleResetBaseline = async () => {
    if (!campusClinic) return;
    const storage = getOfflineStorage();

    const resetClinic: Facility = {
      ...campusClinic,
      currentQueue: "low",
      stock: {
        ...campusClinic.stock,
        "Antimalarials (ACT)": true,
      },
    };

    await storage.saveFacility(resetClinic);
    setFacilities((prev) => prev.map((f) => (f.id === resetClinic.id ? resetClinic : f)));

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
  };

  // Partner queue toggle
  const handleUpdateQueue = async (facilityId: string, queue: QueueLevel) => {
    const target = facilities.find((f) => f.id === facilityId);
    if (!target) return;
    const updated: Facility = { ...target, currentQueue: queue };

    const storage = getOfflineStorage();
    await storage.saveFacility(updated);
    setFacilities((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));

    syncChannel.broadcast({
      type: "queue_updated",
      facilityId,
      queue,
    });
  };

  // Partner stock toggle
  const handleToggleStock = async (facilityId: string, category: CareCategory) => {
    const target = facilities.find((f) => f.id === facilityId);
    if (!target) return;
    const currentVal = Boolean(target.stock[category]);
    const updated: Facility = {
      ...target,
      stock: { ...target.stock, [category]: !currentVal },
    };

    const storage = getOfflineStorage();
    await storage.saveFacility(updated);
    setFacilities((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));

    syncChannel.broadcast({
      type: "stock_toggled",
      facilityId,
      category,
      inStock: !currentVal,
    });
  };

  const handleSelectFacility = async (facility: Facility) => {
    const pass = createIntakePass({
      facilityId: facility.id,
      facilityName: facility.name,
      category: selectedCategory,
      allergies: "None",
      tishipCovered: facility.tishipCovered,
      redFlagsCleared: !hasRedFlags,
      isCampusClinic: facility.isCampusClinic,
      prescriptionImage,
    });

    const storage = getOfflineStorage();
    await storage.saveIntakePass(pass);

    if (prescriptionImage) {
      syncChannel.broadcast({
        type: "prescription_uploaded",
        passCode: pass.passCode,
        facilityId: facility.id,
      });
    }

    setActivePass(pass);
    setIsPassModalOpen(true);
    setRoutesToday((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-canvas text-body flex flex-col font-sans antialiased">
      <AppHeader activeNav="split" hasRedFlags={hasRedFlags} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stage & Hackathon Header */}
        <header className="space-y-1.5">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
            University of Nigeria, Nsukka · TISHIP & PCN-Verified Pharmacy Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
            Split-Screen Live Routing Demo
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-2xl">
            Test real-time rerouting side by side: flip stock or queue congestion in the Partner Pane to watch Student routes adapt immediately.
          </p>
        </header>

        {/* Dual Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ================= LEFT PANE: STUDENT CARE ROUTER ================= */}
          <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <h2 className="text-sm font-bold text-ink uppercase tracking-wider font-mono">
                  Student Care Router View
                </h2>
              </div>
              <Badge variant="tiship" className="text-[11px]">Synced Live</Badge>
            </div>

            {/* Smart Auto-Reroute Active Banner */}
            {isAutoRerouteActive && topPartner && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider font-mono">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Smart Auto-Reroute Active</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-ink">
                    {topPartner.priceLabel}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-ink">{topPartner.name}</h3>

                <p className="text-xs text-muted leading-relaxed">
                  UNN Medical Centre is currently reporting {isClinicOutOfStock ? "Out of Stock for Antimalarials (ACT)" : "High Congestion (~2.5+ hrs)"}. Routed to the top PCN-verified pharmacy with confirmed stock.
                </p>
              </div>
            )}

            {/* Emergency Red Flag Safety Screen */}
            <div className="p-4 rounded-xl bg-surface-subtle/80 border border-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span className="font-semibold uppercase tracking-wider">WHO & Red Cross Criteria</span>
                <span className={hasRedFlags ? "text-error font-bold" : "text-muted"}>
                  {selectedFlags.length}/4 Triggered
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink">
                  01. Emergency Red-Flag Safety Screen
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Check any danger sign below if present right now. Any selection locks pharmacy routing and escalates to 24/7 casualty care.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {RED_FLAGS.map((flag) => {
                  const isChecked = selectedFlags.includes(flag.id);
                  return (
                    <label
                      key={flag.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isChecked
                          ? "bg-error/10 border-error/50 text-ink ring-1 ring-error/30"
                          : "bg-surface border-border hover:bg-surface-subtle"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFlag(flag.id)}
                        className="w-4 h-4 mt-0.5 rounded border-border text-error focus:ring-error"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-ink block leading-snug">
                          {flag.label}
                        </span>
                        <span className="text-[11px] text-muted block mt-0.5">
                          {flag.description}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Doctor Written Prescription Capture */}
            <div className="p-4 rounded-xl bg-surface-subtle/80 border border-border">
              <PrescriptionUpload
                prescriptionImage={prescriptionImage}
                onChange={setPrescriptionImage}
              />
            </div>

            {/* Ranked Care Facilities */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider font-mono">
                  Live Ranked Destinations
                </h3>
                <span className="text-xs font-mono text-muted">
                  {scoredFacilities.length} Facilities
                </span>
              </div>

              {hasRedFlags ? (
                <div
                  role="alert"
                  className="p-4 sm:p-5 rounded-xl bg-error/15 border-2 border-error text-ink space-y-3 shadow-md"
                >
                  <div className="flex items-center gap-2 text-error font-mono font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Urgent Hospital Escalation Alert</span>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-ink leading-tight">
                      Retail Pharmacy Routing Locked
                    </h4>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      One or more WHO red-flag emergency danger signs were selected. MedWay has locked all outpatient pharmacy routing. Do not wait in an outpatient queue or self-medicate. Report immediately to 24/7 hospital casualty care.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    <a
                      href="tel:+2348037704288"
                      className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-error text-on-error font-bold text-xs hover:opacity-95 shadow-xs transition-opacity"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>UNN Emergency Bay</span>
                    </a>
                    <a
                      href="tel:+2348035544211"
                      className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-surface border border-border text-ink font-bold text-xs hover:bg-surface-subtle shadow-xs transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-error" />
                      <span>Bishop Shanahan 24/7</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {scoredFacilities.map(({ facility, isAutoRerouted, rerouteReason }, idx) => (
                    <FacilityCard
                      key={facility.id}
                      facility={facility}
                      selectedCategory={selectedCategory}
                      isRecommended={idx === 0}
                      onSelect={handleSelectFacility}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT PANE: PARTNER & TELEMETRY CONTROLS ================= */}
          <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" />
                <h2 className="text-sm font-bold text-ink uppercase tracking-wider font-mono">
                  Partner & Crowd Telemetry View
                </h2>
              </div>
              <Badge variant="pcn" className="text-[11px]">Instant Broadcast</Badge>
            </div>

            {/* View Mode Switcher */}
            <div className="bg-surface-subtle p-1 rounded-xl border border-border inline-flex gap-1 shadow-2xs w-full">
              <button
                type="button"
                onClick={() => setPartnerTab("telemetry")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg text-center min-h-[40px] transition-all ${
                  partnerTab === "telemetry"
                    ? "bg-surface text-ink border border-border shadow-xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                Live Stock & Queues
              </button>
              <button
                type="button"
                onClick={() => setPartnerTab("prescriptions")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg text-center min-h-[40px] transition-all ${
                  partnerTab === "prescriptions"
                    ? "bg-surface text-ink border border-border shadow-xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                Rx Handwriting Review
              </button>
            </div>

            {partnerTab === "prescriptions" ? (
              <PrescriptionReviewConsole
                facilityId={topPartner?.id || facilities[1].id}
                facilityName={topPartner?.name || facilities[1].name}
              />
            ) : (
              <>
                {/* Simulation Control Toolbar */}
            <div className="p-4 rounded-xl bg-surface-subtle/80 border border-border space-y-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
                  B2B Pharmacy & Clinic Telemetry Portal · Real-Time Sync
                </span>
                <h3 className="text-sm font-bold text-ink">
                  Live Inventory & Crowd Queue Controls
                </h3>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleSimulateRush}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-warning hover:opacity-95 text-on-warning font-bold text-xs shadow-xs transition-opacity focus-visible:outline-2"
                >
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span>Simulate 2 PM Rush & Stockout</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetBaseline}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface border border-border hover:bg-surface-subtle text-ink font-semibold text-xs shadow-2xs transition-colors focus-visible:outline-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0 text-muted" />
                  <span>Reset Baseline</span>
                </button>
              </div>
            </div>

            {/* Live KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-surface-subtle/60 border border-border space-y-1">
                <span className="text-[11px] font-mono text-muted block">Routes Today</span>
                <span className="text-xl font-bold font-mono text-ink">{routesToday}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-subtle/60 border border-border space-y-1">
                <span className="text-[11px] font-mono text-muted block">Stockout Reroutes</span>
                <span className="text-xl font-bold font-mono text-amber-700 dark:text-amber-400">{reroutesCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-subtle/60 border border-border space-y-1">
                <span className="text-[11px] font-mono text-muted block">Verified Partners</span>
                <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">4</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-subtle/60 border border-border space-y-1">
                <span className="text-[11px] font-mono text-muted block">Top Searched</span>
                <span className="text-xs font-bold text-ink truncate block">ACT Malaria</span>
              </div>
            </div>

            {/* Facility 1: UNN Medical Centre Interactive Card */}
            {campusClinic && (
              <div className="p-4 rounded-xl border border-border bg-surface space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-muted font-mono">
                      <span>Campus Health Clinic</span>
                      <span>•</span>
                      <Badge variant="tiship" className="py-0 px-1.5 text-[10px]">TISHIP Hub</Badge>
                      <span>•</span>
                      <span>Live Synced</span>
                    </div>
                    <h3 className="text-base font-bold text-ink">{campusClinic.name}</h3>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    ₦0 Point of Care
                  </span>
                </div>

                {/* Queue Toggles */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-muted uppercase tracking-wider block">
                    Current Queue Load
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(["low", "moderate", "high"] as QueueLevel[]).map((q) => {
                      const isActive = campusClinic.currentQueue === q;
                      const activeClasses =
                        q === "low"
                          ? "bg-emerald-600 text-white font-bold"
                          : q === "moderate"
                          ? "bg-amber-600 text-white font-bold"
                          : "bg-rose-600 text-white font-bold";

                      return (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleUpdateQueue(campusClinic.id, q)}
                          className={`py-2 px-3 text-xs rounded-lg border font-medium capitalize transition-all min-h-[44px] ${
                            isActive
                              ? activeClasses
                              : "bg-surface-subtle border-border text-muted hover:text-ink hover:bg-surface"
                          }`}
                        >
                          {q}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category Stock Toggles */}
                <div className="space-y-1.5 pt-1 border-t border-border">
                  <span className="text-[11px] font-mono font-bold text-muted uppercase tracking-wider block">
                    Medication Stock Status
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(campusClinic.stock) as CareCategory[]).map((cat) => {
                      const inStock = campusClinic.stock[cat];
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleToggleStock(campusClinic.id, cat)}
                          className={`p-2.5 rounded-lg border text-left text-xs font-medium flex items-center justify-between gap-1 transition-colors min-h-[44px] ${
                            inStock
                              ? "bg-emerald-500/10 border-emerald-500/30 text-ink"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400"
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          <span className={`text-[10px] font-mono font-bold ${inStock ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>
                            {inStock ? "IN STOCK" : "OUT"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Facility 2: Odim Gate Community Pharmacy Interactive Card */}
            {topPartner && (
              <div className="p-4 rounded-xl border border-border bg-surface space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-muted font-mono">
                      <span>Off Campus Partner</span>
                      <span>•</span>
                      <Badge variant="pcn" className="py-0 px-1.5 text-[10px]">PCN Verified</Badge>
                    </div>
                    <h3 className="text-base font-bold text-ink">{topPartner.name}</h3>
                  </div>

                  <span className="text-xs font-mono font-bold text-ink">
                    {topPartner.priceLabel}
                  </span>
                </div>

                {/* Queue Toggles */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-muted uppercase tracking-wider block">
                    Current Queue Load
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(["low", "moderate", "high"] as QueueLevel[]).map((q) => {
                      const isActive = topPartner.currentQueue === q;
                      const activeClasses =
                        q === "low"
                          ? "bg-emerald-600 text-white font-bold"
                          : q === "moderate"
                          ? "bg-amber-600 text-white font-bold"
                          : "bg-rose-600 text-white font-bold";

                      return (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleUpdateQueue(topPartner.id, q)}
                          className={`py-2 px-3 text-xs rounded-lg border font-medium capitalize transition-all min-h-[44px] ${
                            isActive
                              ? activeClasses
                              : "bg-surface-subtle border-border text-muted hover:text-ink hover:bg-surface"
                          }`}
                        >
                          {q}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stock status button */}
                <div className="pt-1 border-t border-border">
                  <button
                    type="button"
                    onClick={() => handleToggleStock(topPartner.id, selectedCategory)}
                    className="w-full py-2.5 px-3 rounded-lg border border-border bg-surface-subtle text-ink font-semibold text-xs flex items-center justify-between min-h-[44px]"
                  >
                    <span>{selectedCategory} Status</span>
                    <Badge variant={topPartner.stock[selectedCategory] ? "in-stock" : "out-of-stock"}>
                      {topPartner.stock[selectedCategory] ? "Confirmed In Stock" : "Reported Stockout"}
                    </Badge>
                  </button>
                </div>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Generated Intake Pass Modal */}
      {activePass && (
        <Modal
          isOpen={isPassModalOpen}
          onClose={() => setIsPassModalOpen(false)}
          title="Digital Student Intake Pass"
          description="Present this pass to the facility attendant upon arrival."
        >
          <IntakePassView pass={activePass} onClose={() => setIsPassModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
