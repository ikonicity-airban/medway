"use client";

import * as React from "react";
import { IntakePass } from "@/types";
import { getOfflineStorage } from "@/lib/offline-db";
import { syncChannel } from "@/lib/sync-channel";
import { createIntakePass } from "@/lib/intake-pass";
import { generateSampleDoctorRx } from "@/features/router/prescription-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  FileText,
  Maximize2,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  SunMedium,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export interface PrescriptionReviewConsoleProps {
  facilityId: string;
  facilityName: string;
  onPrescriptionClarified?: (passCode: string, notes: string) => void;
}

interface CommonPreset {
  label: string;
  category: string;
  text: string;
}

const COMMON_PRESETS: CommonPreset[] = [
  {
    label: "ACT and Paracetamol",
    category: "Antimalarials (ACT)",
    text: "Artemether 80mg and Lumefantrine 480mg: Take 1 tablet twice daily with fatty food or milk for 3 days. Paracetamol 1g: Take 2 tablets three times daily after food for fever or pain.",
  },
  {
    label: "ORS Hydration and Zinc",
    category: "ORS & Hydration",
    text: "Oral Rehydration Salts: Dissolve 1 full sachet in 1 liter of clean drinking water. Drink small sips frequently throughout the day. Zinc Sulfate 20mg: Take 1 tablet once daily for 10 days.",
  },
  {
    label: "Amoxicillin and Clavulanate",
    category: "Antibiotics / Infection",
    text: "Amoxicillin and Clavulanic Acid 625mg: Take 1 tablet twice daily at the start of a meal for 7 days. Complete full course even if feeling better.",
  },
  {
    label: "Ciprofloxacin and Metronidazole",
    category: "Typhoid / Lab Test",
    text: "Ciprofloxacin 500mg: Take 1 tablet twice daily 2 hours after meals for 5 days. Metronidazole 400mg: Take 1 tablet three times daily with food for 5 days. Avoid all alcoholic drinks completely.",
  },
];

export const PrescriptionReviewConsole: React.FC<PrescriptionReviewConsoleProps> = ({
  facilityId,
  facilityName,
  onPrescriptionClarified,
}) => {
  const [passes, setPasses] = React.useState<IntakePass[]>([]);
  const [selectedPassCode, setSelectedPassCode] = React.useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);
  const [highContrast, setHighContrast] = React.useState<boolean>(false);
  const [transcriptionNotes, setTranscriptionNotes] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [filterMode, setFilterMode] = React.useState<"all" | "pending" | "clarified">("all");

  // Load passes from offline storage
  const loadPasses = React.useCallback(async () => {
    const storage = getOfflineStorage();
    const all = await storage.getAllIntakePasses();
    // Filter passes that have a prescription image
    const rxPasses = all.filter((p) => Boolean(p.prescriptionImage));
    // Sort newest first
    rxPasses.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setPasses(rxPasses);

    // Default select the first pass if none selected
    if (rxPasses.length > 0 && !selectedPassCode) {
      setSelectedPassCode(rxPasses[0].passCode);
      setTranscriptionNotes(rxPasses[0].pharmacistNotes || "");
    }
  }, [selectedPassCode]);

  React.useEffect(() => {
    loadPasses();

    const unsubscribe = syncChannel.subscribe((msg) => {
      if (msg.type === "prescription_uploaded" || msg.type === "prescription_clarified") {
        loadPasses();
      }
    });

    return unsubscribe;
  }, [loadPasses]);

  const selectedPass = React.useMemo(() => {
    return passes.find((p) => p.passCode === selectedPassCode) || null;
  }, [passes, selectedPassCode]);

  // Sync transcription textarea when selected pass changes
  React.useEffect(() => {
    if (selectedPass) {
      setTranscriptionNotes(selectedPass.pharmacistNotes || "");
      setZoomLevel(1);
    }
  }, [selectedPassCode]);

  // Seed a demo doctor prescription pass for testing
  const handleSeedDemoPass = async () => {
    const demoPass = createIntakePass({
      facilityId,
      facilityName,
      category: "Antimalarials (ACT)",
      allergies: "None",
      tishipCovered: false,
      redFlagsCleared: true,
      prescriptionImage: generateSampleDoctorRx(),
    });

    const storage = getOfflineStorage();
    await storage.saveIntakePass(demoPass);

    syncChannel.broadcast({
      type: "prescription_uploaded",
      passCode: demoPass.passCode,
      facilityId,
    });

    await loadPasses();
    setSelectedPassCode(demoPass.passCode);
    setTranscriptionNotes("");
    setToastMessage(`Demo prescription slip ${demoPass.passCode} loaded for review.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Stamp and verify plain language clarification
  const handleStampPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPass) return;

    const trimmed = transcriptionNotes.trim();
    if (!trimmed) {
      setToastMessage("Please enter deciphered instructions before stamping.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsSubmitting(true);

    const updatedPass: IntakePass = {
      ...selectedPass,
      pharmacistNotes: trimmed,
    };

    const storage = getOfflineStorage();
    await storage.saveIntakePass(updatedPass);

    // Broadcast realtime update to student pass and counters
    syncChannel.broadcast({
      type: "prescription_clarified",
      passCode: updatedPass.passCode,
      notes: trimmed,
    });

    if (onPrescriptionClarified) {
      onPrescriptionClarified(updatedPass.passCode, trimmed);
    }

    await loadPasses();
    setIsSubmitting(false);
    setToastMessage(`Prescription ${updatedPass.passCode} clarified and stamped legible.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered passes
  const filteredPasses = React.useMemo(() => {
    if (filterMode === "pending") {
      return passes.filter((p) => !p.pharmacistNotes);
    }
    if (filterMode === "clarified") {
      return passes.filter((p) => Boolean(p.pharmacistNotes));
    }
    return passes;
  }, [passes, filterMode]);

  const pendingCount = passes.filter((p) => !p.pharmacistNotes).length;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-accent shrink-0" />
            <h2 className="text-base font-bold text-ink">
              Doctor Prescription Handwriting Review
            </h2>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono text-[11px] font-bold">
                {pendingCount} Awaiting Review
              </span>
            )}
          </div>
          <p className="text-xs text-muted">
            Review incoming doctor handwritten slips and transcribe medical shorthand into clear plain language for the student.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSeedDemoPass}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/40 bg-accent/10 hover:bg-accent/15 text-accent font-bold text-xs min-h-[40px] shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Load Demo Rx Slip</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-2xs"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {passes.length === 0 ? (
        /* Empty State */
        <div className="p-8 rounded-xl border border-dashed border-border bg-surface-subtle text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-surface border border-border mx-auto flex items-center justify-center text-muted">
            <FileText className="w-6 h-6 text-muted" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm font-bold text-ink">
              No Doctor Prescriptions in Queue
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              When students upload or snap a photo of a doctor prescription slip during routing, it appears here instantly for pharmacist handwriting clarification.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSeedDemoPass}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-on-accent text-xs font-bold shadow-xs hover:opacity-95 transition-opacity min-h-[44px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Sample UNN Medical Centre Slip</span>
          </button>
        </div>
      ) : (
        /* Active Workstation Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Queue Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-surface-subtle rounded-lg border border-border text-xs">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`flex-1 py-1.5 rounded-md font-bold text-center transition-all ${
                  filterMode === "all"
                    ? "bg-surface text-ink shadow-2xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                All ({passes.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("pending")}
                className={`flex-1 py-1.5 rounded-md font-bold text-center transition-all ${
                  filterMode === "pending"
                    ? "bg-surface text-ink shadow-2xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("clarified")}
                className={`flex-1 py-1.5 rounded-md font-bold text-center transition-all ${
                  filterMode === "clarified"
                    ? "bg-surface text-ink shadow-2xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                Stamped ({passes.length - pendingCount})
              </button>
            </div>

            {/* List of Incoming Passes */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredPasses.map((p) => {
                const isSelected = p.passCode === selectedPassCode;
                const isClarified = Boolean(p.pharmacistNotes);
                const timeString = new Date(p.timestamp).toLocaleTimeString("en-NG", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={p.passCode}
                    onClick={() => setSelectedPassCode(p.passCode)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-surface border-accent ring-2 ring-accent/20 shadow-xs"
                        : "bg-surface hover:bg-surface-subtle border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-xs">
                      <span className="font-mono font-bold text-ink">{p.passCode}</span>
                      <span className="text-[11px] text-muted font-mono">{timeString}</span>
                    </div>

                    <div className="text-xs text-muted mt-1 truncate">
                      {p.category}
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-border-subtle text-[11px]">
                      <span className="text-muted truncate">
                        Allergies: {p.allergies}
                      </span>
                      {isClarified ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
                          <Check className="w-3 h-3" />
                          <span>Clarified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400">
                          <Clock className="w-3 h-3" />
                          <span>Awaiting</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Review & Transcribe Workstation (8 cols) */}
          {selectedPass && (
            <div className="lg:col-span-8 space-y-4 bg-surface-subtle p-4 rounded-xl border border-border">
              {/* Patient and Prescription Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-ink">
                      {selectedPass.passCode}
                    </span>
                    <Badge variant={selectedPass.pharmacistNotes ? "tiship" : "neutral"}>
                      {selectedPass.pharmacistNotes
                        ? "Clarified by Pharmacist"
                        : "Doctor Handwriting Awaiting Review"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Requested Category: {selectedPass.category} • Destination: {selectedPass.facilityName}
                  </p>
                </div>

                {/* Allergy Badge */}
                <div
                  className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                    selectedPass.allergies.toLowerCase() !== "none"
                      ? "bg-warning/20 border-warning text-ink"
                      : "bg-surface border-border text-muted"
                  }`}
                >
                  {selectedPass.allergies.toLowerCase() !== "none" ? (
                    <span className="flex items-center gap-1 text-amber-900 dark:text-amber-200">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>Allergy: {selectedPass.allergies}</span>
                    </span>
                  ) : (
                    <span>No Declared Drug Allergies</span>
                  )}
                </div>
              </div>

              {/* Prescription Image Inspection Surface with Zoom Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-muted uppercase tracking-wider">
                    Doctor Written Prescription Slip
                  </span>

                  {/* Viewer Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setHighContrast(!highContrast)}
                      className={`px-2 py-1 rounded text-xs font-semibold border transition-colors ${
                        highContrast
                          ? "bg-ink text-canvas border-ink"
                          : "bg-surface text-ink border-border hover:bg-surface-subtle"
                      }`}
                      title="Toggle high contrast to sharpen faint pen ink"
                    >
                      <SunMedium className="w-3.5 h-3.5 inline mr-1" />
                      <span>{highContrast ? "Normal Contrast" : "Sharpen Ink"}</span>
                    </button>

                    <button
                      type="button"
                      disabled={zoomLevel <= 1}
                      onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                      className="p-1 rounded bg-surface border border-border text-ink hover:bg-surface-subtle disabled:opacity-40"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>

                    <span className="font-mono text-xs text-muted px-1">
                      {zoomLevel}x
                    </span>

                    <button
                      type="button"
                      disabled={zoomLevel >= 2.5}
                      onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.5))}
                      className="p-1 rounded bg-surface border border-border text-ink hover:bg-surface-subtle disabled:opacity-40"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setZoomLevel(1)}
                      className="p-1 rounded bg-surface border border-border text-ink hover:bg-surface-subtle"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Image Container */}
                <div className="relative rounded-xl border border-border bg-slate-900/5 p-2 overflow-hidden flex items-center justify-center max-h-64 sm:max-h-72">
                  <div
                    className={`w-full h-full overflow-auto flex items-center justify-center transition-all ${
                      highContrast ? "contrast-150 brightness-95" : ""
                    }`}
                  >
                    <img
                      src={selectedPass.prescriptionImage}
                      alt="Doctor handwritten prescription"
                      style={{
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: "center center",
                        transition: "transform 0.2s ease-out",
                      }}
                      className="max-h-60 sm:max-h-68 object-contain rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted block">
                  Quick Clinical Presets for UNN Prescriptions:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {COMMON_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setTranscriptionNotes(preset.text)}
                      className="px-2.5 py-1.5 rounded-md border border-border bg-surface hover:bg-surface-subtle text-ink text-xs font-semibold transition-colors shadow-2xs"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transcription & Deciphering Form */}
              <form onSubmit={handleStampPrescription} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label
                    htmlFor="pharmacist-transcription-notes"
                    className="text-xs font-bold text-ink block"
                  >
                    PCN Pharmacist Handwriting Clarification and Instructions:
                  </label>
                  <p className="text-[11px] text-muted">
                    Write out drug names, exact dosages, meal timing, and durations in clear plain English for the student.
                  </p>
                  <textarea
                    id="pharmacist-transcription-notes"
                    rows={4}
                    value={transcriptionNotes}
                    onChange={(e) => setTranscriptionNotes(e.target.value)}
                    placeholder="Example: Artemether 80mg and Lumefantrine 480mg: Take 1 tablet twice daily with fatty meals for 3 days. Paracetamol 1g: Take 2 tablets three times daily after food as needed for fever."
                    className="w-full p-3 rounded-lg border border-border bg-surface text-ink text-xs leading-relaxed placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-muted font-mono">
                    Official Dispenser Stamp: Pharm. C. C. Aniagu (PCN Registered)
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !transcriptionNotes.trim()}
                    className="px-5 py-2.5 rounded-lg bg-accent text-on-accent font-bold text-xs shadow-xs hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify and Stamp Legible (PCN Pharmacist)</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
