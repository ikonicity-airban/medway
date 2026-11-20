"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FacilityCard } from "@/components/ui/facility-card";
import { IntakePassCard } from "@/components/ui/intake-pass-card";
import { Modal } from "@/components/ui/modal";
import { CategorySelector } from "./category-selector";
import { BudgetChoice, BudgetGate } from "./budget-gate";
import { rankFacilities, RoutingPreferences } from "@/lib/routing-engine";
import { createIntakePass } from "@/lib/intake-pass";
import { getOfflineStorage, seedInitialData } from "@/lib/offline-db";
import { CareCategory, Facility, IntakePass, UNN_PILOT_FACILITIES } from "@/types";
import { AlertCircle, Lock } from "lucide-react";

export interface RouterViewProps {
  initialCategory?: CareCategory;
  initialBudget?: BudgetChoice;
}

export const RouterView: React.FC<RouterViewProps> = ({
  initialCategory = "Antimalarials (ACT)",
  initialBudget = "tiship",
}) => {
  const [selectedCategory, setSelectedCategory] =
    React.useState<CareCategory>(initialCategory);
  const [budgetChoice, setBudgetChoice] = React.useState<BudgetChoice>(initialBudget);
  const [facilities, setFacilities] = React.useState<Facility[]>([
    ...UNN_PILOT_FACILITIES,
  ]);
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

  const handleSelectFacility = async (facility: Facility) => {
    const pass = createIntakePass({
      facilityId: facility.id,
      facilityName: facility.name,
      category: selectedCategory,
      allergies: "None",
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
      {/* Care Category Selector */}
      <section className="p-4 md:p-6 bg-surface border border-border rounded-lg shadow-sm">
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {/* Budget Gate */}
      <section className="p-4 md:p-6 bg-surface border border-border rounded-lg shadow-sm">
        <BudgetGate value={budgetChoice} onChange={setBudgetChoice} />
      </section>

      {/* TISHIP Hard Lock Notice */}
      {isZeroBudget && (
        <div className="p-3.5 rounded-lg bg-success/10 border border-success flex items-center justify-between gap-3 text-xs text-body">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-success shrink-0" />
            <span>
              <strong>TISHIP Hard Lock Active:</strong> UNN Medical Centre is locked as
              the primary route for ₦0 student copay.
            </span>
          </div>
          <Badge variant="tiship">Covered</Badge>
        </div>
      )}

      {/* Ranked Facilities Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-lg font-bold text-ink">
            Recommended Care Facilities
          </h2>
          <p className="text-xs text-muted">
            Ranked by stock availability, queue length, and your budget preference.
          </p>
        </div>

        <span className="text-xs font-semibold text-muted">
          {scoredFacilities.length} Options Found
        </span>
      </div>

      {/* Facility List */}
      <div className="space-y-4">
        {scoredFacilities.map(({ facility, isAutoRerouted, rerouteReason }, index) => {
          return (
            <div key={facility.id} className="space-y-2">
              {isAutoRerouted && (
                <div className="p-3 rounded-md bg-warning/10 border border-warning text-xs text-body flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning shrink-0" />
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

      {/* Generated Intake Pass Modal */}
      {activePass && (
        <Modal
          isOpen={isPassModalOpen}
          onClose={() => setIsPassModalOpen(false)}
          title="Digital Student Intake Pass"
          description="Present this pass to the facility attendant upon arrival."
        >
          <div className="space-y-4">
            <IntakePassCard pass={activePass} />

            <div className="pt-2 text-center">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setIsPassModalOpen(false)}
              >
                Close Pass
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
