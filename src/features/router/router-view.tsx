"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { FacilityCard } from "@/components/ui/facility-card";
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
import { AllergySelector, IntakePassView } from "@/features/intake-pass";
import { AlertCircle, Building2, Compass, Lock } from "lucide-react";

export interface RouterViewProps {
  initialCategory?: CareCategory;
  initialBudget?: BudgetChoice;
}

export const RouterView: React.FC<RouterViewProps> = ({
  initialCategory = "Antimalarials (ACT)",
  initialBudget = "tiship",
}) => {
  const [activeTab, setActiveTab] = React.useState<"router" | "directory">("router");
  const [selectedCategory, setSelectedCategory] =
    React.useState<CareCategory>(initialCategory);
  const [budgetChoice, setBudgetChoice] = React.useState<BudgetChoice>(initialBudget);
  const [facilities, setFacilities] = React.useState<Facility[]>([
    ...UNN_PILOT_FACILITIES,
  ]);
  const [declaredAllergies, setDeclaredAllergies] =
    React.useState<string>("None");
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

    const unsubscribe = syncChannel.subscribe(() => {
      loadData();
    });

    return unsubscribe;
  }, []);

  const isZeroBudget = budgetChoice === "tiship";

  const routingPrefs: RoutingPreferences = React.useMemo(() => {
    return {
      category: selectedCategory,
      budgetPreference: budgetChoice,
      isZeroBudget,
      hasRedFlags: false,
    };
  }, [selectedCategory, budgetChoice, isZeroBudget]);

  const scoredFacilities = React.useMemo(() => {
    return rankFacilities(facilities, routingPrefs);
  }, [facilities, routingPrefs]);

  const campusClinic = React.useMemo(() => {
    return facilities.find((f) => f.isCampusClinic);
  }, [facilities]);

  const isClinicOutOfStock = campusClinic
    ? !campusClinic.stock[selectedCategory]
    : false;

  const topAlternative = React.useMemo(() => {
    return scoredFacilities.find((s) => !s.facility.isCampusClinic)?.facility;
  }, [scoredFacilities]);

  const handleSelectFacility = async (facility: Facility) => {
    const pass = createIntakePass({
      facilityId: facility.id,
      facilityName: facility.name,
      category: selectedCategory,
      allergies: declaredAllergies,
      tishipCovered: facility.tishipCovered,
      redFlagsCleared: true,
      isCampusClinic: facility.isCampusClinic,
    });

    const storage = getOfflineStorage();
    await storage.saveIntakePass(pass);

    setActivePass(pass);
    setIsPassModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Sliding Segmented Tab Switcher (Coss UI pattern) */}
      <div className="bg-surface-subtle p-1 rounded-xl border border-border inline-flex gap-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "router"}
          onClick={() => setActiveTab("router")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold min-h-[48px] transition-all focus-visible:outline-2 ${
            activeTab === "router"
              ? "bg-surface text-ink border border-border shadow-sm"
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold min-h-[48px] transition-all focus-visible:outline-2 ${
            activeTab === "directory"
              ? "bg-surface text-ink border border-border shadow-sm"
              : "text-muted hover:text-ink hover:bg-surface/50"
          }`}
        >
          <Building2 className="w-4 h-4 shrink-0 text-muted" />
          <span>Partner Directory</span>
        </button>
      </div>

      {activeTab === "directory" ? (
        <PartnerDirectory
          facilities={facilities}
          selectedCategory={selectedCategory}
          onSelectFacility={handleSelectFacility}
        />
      ) : (
        <div className="space-y-6">
          {/* Consolidated Triage Command Console Card */}
          <section
            aria-label="Triage preferences console"
            className="bg-surface border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden"
          >
            {/* Step 1: Care Category */}
            <div className="p-4 sm:p-6">
              <CategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Step 2: Budget Gate */}
            <div className="p-4 sm:p-6">
              <BudgetGate value={budgetChoice} onChange={setBudgetChoice} />
            </div>

            {/* Step 3: Drug Allergy Declaration */}
            <div className="p-4 sm:p-6">
              <AllergySelector
                value={declaredAllergies}
                onChange={setDeclaredAllergies}
              />
            </div>
          </section>

          {/* Dynamic Guidance: Auto Reroute Banner if clinic is out of stock */}
          {isClinicOutOfStock && (
            <AutoRerouteBanner
              category={selectedCategory}
              alternativeFacility={topAlternative}
              onSelectAlternative={handleSelectFacility}
            />
          )}

          {/* Dynamic Guidance: TISHIP Hard Lock Notice (only when clinic is in stock) */}
          {isZeroBudget && !isClinicOutOfStock && (
            <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between gap-3 text-xs text-body shadow-sm">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-ink shrink-0" />
                <span>
                  <strong className="text-ink">TISHIP Hard Lock Active:</strong> UNN Medical Centre is prioritized as the primary destination for ₦0 student copay.
                </span>
              </div>
              <Badge variant="tiship">₦0 Covered</Badge>
            </div>
          )}

          {/* Ranked Facilities Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-ink">
                  Recommended Care Facilities
                </h2>
                <p className="text-xs text-muted">
                  Ranked by live stock availability, queue congestion, and your budget preference.
                </p>
              </div>

              <span className="text-xs font-mono font-medium text-muted bg-surface-subtle px-2.5 py-1 rounded border border-border">
                {scoredFacilities.length} Options
              </span>
            </div>

            {/* Facility List */}
            <div className="space-y-3">
              {scoredFacilities.map(({ facility, isAutoRerouted, rerouteReason }, index) => {
                return (
                  <div key={facility.id} className="space-y-2">
                    {isAutoRerouted && (
                      <div className="p-3 rounded-lg bg-surface border border-border text-xs text-body flex items-center gap-2 shadow-sm">
                        <AlertCircle className="w-4 h-4 text-ink shrink-0" />
                        <span>{rerouteReason}</span>
                      </div>
                    )}

                    <FacilityCard
                      facility={facility}
                      selectedCategory={selectedCategory}
                      isRecommended={index === 0}
                      onSelect={handleSelectFacility}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Generated Intake Pass Modal */}
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
