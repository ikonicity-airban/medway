"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { CategorySelector } from "./category-selector";
import { BudgetChoice, BudgetGate } from "./budget-gate";
import { rankFacilities, RoutingPreferences } from "@/lib/routing-engine";
import { createIntakePass } from "@/lib/intake-pass";
import { getOfflineStorage, seedInitialData } from "@/lib/offline-db";
import { syncChannel } from "@/lib/sync-channel";
import { CareCategory, Facility, IntakePass, UNN_PILOT_FACILITIES } from "@/types";
import { AutoRerouteBanner } from "./auto-reroute-banner";
import { PartnerDirectory } from "./partner-directory";
import { PrescriptionUpload } from "./prescription-upload";
import { AllergySelector, IntakePassView } from "@/features/intake-pass";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";

interface RedFlagItem {
  id: string;
  label: string;
  description: string;
}

const RED_FLAGS: RedFlagItem[] = [
  {
    id: "fever",
    label: "High fever lasting > 3 days or stiff neck",
    description: "Requires urgent in-person clinical assessment and malaria/meningitis exclusion.",
  },
  {
    id: "breathing",
    label: "Difficulty breathing, chest tightness, or persistent cough",
    description: "Potential respiratory distress; do not wait in an outpatient pharmacy queue.",
  },
  {
    id: "neurological",
    label: "Fainting, confusion, or severe lethargy",
    description: "Neurological or hemodynamic warning sign requiring 24/7 emergency casualty care.",
  },
  {
    id: "vomiting",
    label: "Persistent vomiting or inability to keep fluids down",
    description: "Acute dehydration risk; emergency IV fluids required.",
  },
];

export interface RouterViewProps {
  initialCategory?: CareCategory;
  initialBudget?: BudgetChoice;
  initialStep?: 1 | 2 | 3;
}

export const RouterView: React.FC<RouterViewProps> = ({
  initialCategory = "Antimalarials (ACT)",
  initialBudget = "tiship",
  initialStep = 1,
}) => {
  const [activeTab, setActiveTab] = React.useState<"router" | "directory">("router");
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3>(initialStep);
  const [selectedCategory, setSelectedCategory] =
    React.useState<CareCategory>(initialCategory);
  const [budgetChoice, setBudgetChoice] = React.useState<BudgetChoice>(initialBudget);
  const [facilities, setFacilities] = React.useState<Facility[]>([
    ...UNN_PILOT_FACILITIES,
  ]);
  const [selectedFlags, setSelectedFlags] = React.useState<string[]>([]);
  const [declaredAllergies, setDeclaredAllergies] =
    React.useState<string>("None");
  const [prescriptionImage, setPrescriptionImage] =
    React.useState<string | undefined>(undefined);
  const [showAllergies, setShowAllergies] = React.useState(false);
  const [activePass, setActivePass] = React.useState<IntakePass | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = React.useState(false);

  // Initialize and load local cached facilities
  React.useEffect(() => {
    async function loadData() {
      await seedInitialData();
      const storage = getOfflineStorage();
      const loaded = await storage.getAllFacilities();
      if (loaded.length > 0) {
        setFacilities(loaded);
      }
    }
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
  }, []);

  const hasRedFlags = selectedFlags.length > 0;
  const isZeroBudget = budgetChoice === "tiship";

  const routingPrefs: RoutingPreferences = React.useMemo(() => {
    return {
      category: selectedCategory,
      budgetPreference: budgetChoice,
      isZeroBudget,
      hasRedFlags,
    };
  }, [selectedCategory, budgetChoice, isZeroBudget, hasRedFlags]);

  const scoredFacilities = React.useMemo(() => {
    return rankFacilities(facilities, routingPrefs);
  }, [facilities, routingPrefs]);

  const campusClinic = React.useMemo(() => {
    return facilities.find((f) => f.isCampusClinic);
  }, [facilities]);

  const isClinicOutOfStock = campusClinic
    ? !campusClinic.stock[selectedCategory]
    : false;

  const isClinicHighQueue = campusClinic
    ? campusClinic.currentQueue === "high"
    : false;

  const isAutoRerouteActive = isClinicOutOfStock || isClinicHighQueue;

  const topScored = scoredFacilities[0];
  const topFacility = topScored?.facility;
  const alternativeFacilities = scoredFacilities.slice(1);

  const toggleFlag = (flagId: string) => {
    setSelectedFlags((prev) =>
      prev.includes(flagId) ? prev.filter((id) => id !== flagId) : [...prev, flagId]
    );
  };

  const handleSelectFacility = async (facility: Facility) => {
    const pass = createIntakePass({
      facilityId: facility.id,
      facilityName: facility.name,
      category: selectedCategory,
      allergies: declaredAllergies,
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
  };

  return (
    <div className="w-full space-y-6">
      {/* Sliding Segmented Tab Switcher */}
      <div className="flex justify-center sm:justify-start">
        <div
          className="bg-surface-subtle p-1 rounded-xl border border-border inline-flex gap-1 shadow-2xs"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "router"}
            onClick={() => setActiveTab("router")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold min-h-[44px] transition-all focus-visible:outline-2 ${
              activeTab === "router"
                ? "bg-surface text-ink border border-border shadow-xs"
                : "text-muted hover:text-ink hover:bg-surface/50"
            }`}
          >
            <Compass className="w-4 h-4 shrink-0 text-muted" />
            <span>Care Router</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "directory"}
            onClick={() => setActiveTab("directory")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold min-h-[44px] transition-all focus-visible:outline-2 ${
              activeTab === "directory"
                ? "bg-surface text-ink border border-border shadow-xs"
                : "text-muted hover:text-ink hover:bg-surface/50"
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0 text-muted" />
            <span>Partner Directory</span>
          </button>
        </div>
      </div>

      {activeTab === "directory" ? (
        <div className="max-w-4xl mx-auto w-full">
          <PartnerDirectory
            facilities={facilities}
            selectedCategory={selectedCategory}
            onSelectFacility={handleSelectFacility}
          />
        </div>
      ) : (
        /* Focused 520px Max Column Guided Stepper */
        <div className="max-w-[520px] mx-auto w-full space-y-6">
          {/* Subtle Progress Stepper Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-muted uppercase tracking-wider">
                Step {currentStep} of 3
              </span>
              <span className="text-muted text-xs">•</span>
              <span className="text-xs font-bold text-ink">
                {currentStep === 1 && "Quick Safety Check"}
                {currentStep === 2 && "Care Need & Budget"}
                {currentStep === 3 && "Best Route & Pass"}
              </span>
            </div>

            {/* Interactive Step Pills */}
            <div className="flex items-center gap-1.5" aria-label="Workflow progress">
              {[1, 2, 3].map((stepNum) => (
                <button
                  key={stepNum}
                  type="button"
                  disabled={stepNum > currentStep && !hasRedFlags}
                  onClick={() => setCurrentStep(stepNum as 1 | 2 | 3)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all min-h-[28px] ${
                    currentStep === stepNum
                      ? "bg-accent text-on-accent shadow-xs"
                      : stepNum < currentStep
                      ? "bg-surface border border-border text-ink hover:bg-surface-subtle"
                      : "bg-surface-subtle text-muted opacity-40 cursor-not-allowed"
                  }`}
                  aria-label={`Jump to Step ${stepNum}`}
                >
                  {stepNum}
                </button>
              ))}
            </div>
          </div>

          {/* ================= STEP 1: QUICK SAFETY CHECK ================= */}
          <div className={currentStep === 1 ? "space-y-4" : "hidden"}>
            {hasRedFlags ? (
              /* Emergency Lockout Screen */
              <div
                role="alert"
                aria-live="assertive"
                className="p-5 sm:p-6 rounded-xl bg-error/15 border-2 border-error text-ink space-y-4 shadow-md"
              >
                <div className="flex items-center gap-2 text-error font-mono font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span>24/7 Urgent Hospital Escalation</span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-ink leading-tight">
                    Retail Pharmacy Routing Locked
                  </h3>
                  <p className="text-xs sm:text-sm text-muted mt-1.5 leading-relaxed">
                    One or more WHO emergency red flag criteria were selected. MedWay has locked all outpatient pharmacy routing. Do not wait in an outpatient queue or self-medicate. Report immediately to hospital casualty care.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <a
                    href="tel:+2348037704288"
                    className="flex items-center justify-center gap-2 min-h-[48px] px-4 rounded-lg bg-error text-on-error font-bold text-xs hover:opacity-95 shadow-xs transition-opacity"
                  >
                    <PhoneCall className="w-4 h-4 shrink-0" />
                    <span>UNN Emergency Bay</span>
                  </a>
                  <a
                    href="tel:+2348035544211"
                    className="flex items-center justify-center gap-2 min-h-[48px] px-4 rounded-lg bg-surface border border-border text-ink font-bold text-xs hover:bg-surface-subtle shadow-xs transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 shrink-0 text-error" />
                    <span>Bishop Shanahan 24/7</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-error/20 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSelectedFlags([])}
                    className="text-xs font-bold text-error underline hover:opacity-80 min-h-[36px]"
                  >
                    Clear danger signs to return to pharmacy routing
                  </button>
                </div>
              </div>
            ) : (
              /* Normal Step 1 Safety Checklist */
              <div className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-ink">
                    Quick Safety Check
                  </h2>
                  <p className="text-xs text-muted leading-relaxed">
                    Select any danger sign present right now. Zero selections will continue to campus logistics routing.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {RED_FLAGS.map((flag) => {
                    const isChecked = selectedFlags.includes(flag.id);
                    return (
                      <label
                        key={flag.id}
                        className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer min-h-[48px] transition-all select-none ${
                          isChecked
                            ? "bg-error/10 border-error text-ink ring-1 ring-error/30"
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

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full min-h-[48px] rounded-lg bg-accent text-on-accent font-bold text-sm shadow-xs hover:opacity-95 transition-opacity focus-visible:outline-2 flex items-center justify-center gap-2"
                  >
                    <span>No Danger Signs, Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= STEP 2: WHAT DO YOU NEED? ================= */}
          <div className={currentStep === 2 ? "space-y-4" : "hidden"}>
            <div className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-ink">
                  What Do You Need?
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Select your requested care category and insurance preference.
                </p>
              </div>

              {/* Care Category Pill Buttons */}
              <CategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Student Budget & Insurance Gate */}
              <BudgetGate value={budgetChoice} onChange={setBudgetChoice} />

              {/* Collapsible Drug Allergies Section */}
              <div className="pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAllergies(!showAllergies)}
                  className="w-full flex items-center justify-between text-xs font-bold text-ink py-2 min-h-[44px]"
                >
                  <span className="flex items-center gap-1.5">
                    <span>Add Drug Allergies</span>
                    <span className="font-normal text-muted">(Optional, Default: None)</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform ${
                      showAllergies ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showAllergies && (
                  <div className="pt-2">
                    <AllergySelector
                      value={declaredAllergies}
                      onChange={setDeclaredAllergies}
                    />
                  </div>
                )}
              </div>

              {/* Doctor Prescription Upload / Snap Photo */}
              <PrescriptionUpload
                prescriptionImage={prescriptionImage}
                onChange={setPrescriptionImage}
              />

              {/* Step 2 Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 min-h-[48px] rounded-lg border border-border bg-surface text-ink text-xs font-bold hover:bg-surface-subtle transition-colors"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 min-h-[48px] rounded-lg bg-accent text-on-accent font-bold text-sm shadow-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                >
                  <span>Find Best Route</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ================= STEP 3: YOUR BEST ROUTE & PASS ================= */}
          <div className={currentStep === 3 ? "space-y-4" : "hidden"}>
            {/* Conditional Smart Auto-Reroute Banner */}
            {isAutoRerouteActive && topFacility && !topFacility.isCampusClinic && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider font-mono">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Smart Auto-Reroute Active</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-ink">
                    {topFacility.priceLabel}
                  </span>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  UNN Medical Centre is currently reporting {isClinicOutOfStock ? `Out of Stock for ${selectedCategory}` : "High Congestion (~2.5+ hrs)"}. Routed to the highest scoring PCN-verified pharmacy with confirmed stock.
                </p>
              </div>
            )}

            {/* #1 Best Route Now Hero Card */}
            {topFacility && (
              <div className="bg-surface border-2 border-accent rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-accent uppercase tracking-wider">
                      #1 Best Route Now
                    </span>
                    <Badge variant="tiship">Optimal Route</Badge>
                  </div>
                  <span className="text-muted font-bold">
                    {topFacility.distanceMeters}m walk
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-ink">
                      {topFacility.name}
                    </h3>
                    <Badge variant={topFacility.isCampusClinic ? "tiship" : "pcn"}>
                      {topFacility.isCampusClinic ? "Campus Health Clinic" : "PCN Verified"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted">
                    {topFacility.facilityType} near UNN Nsukka
                  </p>
                </div>

                {/* 4 Crisp Data Points Strip */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border text-xs">
                  <div className="p-2.5 rounded-lg bg-surface-subtle space-y-0.5">
                    <span className="text-[11px] text-muted block font-mono">Stock / Cost</span>
                    <strong className="text-ink block font-bold">
                      {topFacility.isCampusClinic ? "₦0 TISHIP Covered" : "In Stock"}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-subtle space-y-0.5">
                    <span className="text-[11px] text-muted block font-mono">Queue Estimate</span>
                    <strong className="text-ink block font-bold capitalize">
                      {topFacility.currentQueue} Queue (~{topFacility.currentQueue === "low" ? "15m" : topFacility.currentQueue === "moderate" ? "45m" : "2h+"})
                    </strong>
                  </div>
                </div>

                {/* Doctor Prescription Submission to Chosen Facility */}
                <div className="pt-2 border-t border-border">
                  <PrescriptionUpload
                    prescriptionImage={prescriptionImage}
                    onChange={setPrescriptionImage}
                  />
                </div>

                {/* Primary CTA */}
                <button
                  type="button"
                  onClick={() => handleSelectFacility(topFacility)}
                  className="w-full min-h-[48px] rounded-lg bg-accent text-on-accent font-bold text-sm shadow-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>
                    {prescriptionImage
                      ? "Submit Prescription and Generate Pass"
                      : "Generate Digital Intake Pass"}
                  </span>
                </button>
              </div>
            )}

            {/* Alternative Facilities (Compact Rows) */}
            {alternativeFacilities.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
                  Alternative Facilities
                </h4>

                <div className="space-y-2">
                  {alternativeFacilities.map(({ facility }) => (
                    <div
                      key={facility.id}
                      className="p-3 rounded-lg border border-border bg-surface flex items-center justify-between gap-3 text-xs hover:bg-surface-subtle transition-colors"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-ink block truncate">
                          {facility.name}
                        </span>
                        <span className="text-[11px] text-muted block mt-0.5 font-mono">
                          {facility.currentQueue} Queue • {facility.distanceMeters}m
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={
                            facility.stock[selectedCategory] ? "in-stock" : "out-of-stock"
                          }
                          className="text-[10px]"
                        >
                          {facility.stock[selectedCategory] ? "In Stock" : "Out of Stock"}
                        </Badge>

                        <button
                          type="button"
                          onClick={() => handleSelectFacility(facility)}
                          className="px-2.5 py-1 rounded bg-surface border border-border text-ink font-bold hover:bg-surface-subtle transition-colors min-h-[32px]"
                        >
                          Pass
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 Jump Back Link */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs font-semibold text-muted hover:text-ink min-h-[40px] flex items-center gap-1"
              >
                Edit Care Need or Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Intake Pass Modal / Bottom Sheet */}
      {activePass && (
        <Modal
          isOpen={isPassModalOpen}
          onClose={() => setIsPassModalOpen(false)}
          title="Digital Student Intake Pass"
          description="Present this pass to the facility attendant upon arrival."
        >
          <IntakePassView
            pass={activePass}
            onClose={() => setIsPassModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};
