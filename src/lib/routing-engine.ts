import { CareCategory, Facility } from "@/types";

export interface RoutingPreferences {
  category: CareCategory;
  budgetPreference: "tiship" | "fast";
  isZeroBudget: boolean;
  hasRedFlags: boolean;
}

export interface ScoredFacility {
  facility: Facility;
  score: number;
  isAutoRerouted: boolean;
  rerouteReason?: string;
}

export function calculateFacilityScore(facility: Facility, prefs: RoutingPreferences): number {
  let score = 0;

  // 1. Stock scoring
  const inStock = Boolean(facility.stock[prefs.category]);
  if (inStock) {
    score += 100;
  } else {
    score -= 120;
  }

  // 2. Queue scoring
  switch (facility.currentQueue) {
    case "low":
      score += 35;
      break;
    case "moderate":
      score += 15;
      break;
    case "high":
      score -= 45;
      break;
  }

  // 3. Preference scoring
  if (prefs.budgetPreference === "tiship") {
    if (facility.isCampusClinic && inStock && facility.currentQueue !== "high") {
      score += 50;
    }
  } else if (prefs.budgetPreference === "fast") {
    if (!facility.isCampusClinic && inStock) {
      score += 30;
    }
  }

  return score;
}

export function rankFacilities(
  facilities: Facility[],
  prefs: RoutingPreferences
): ScoredFacility[] {
  // If emergency red flags are active, routing to pharmacies is prohibited
  if (prefs.hasRedFlags) {
    return [];
  }

  const scored = facilities.map((facility) => {
    let score = calculateFacilityScore(facility, prefs);
    let isAutoRerouted = false;
    let rerouteReason: string | undefined;

    // TISHIP Hard Lock enforcement:
    // If student has zero budget, campus clinic is locked as top destination
    // unless clinic is completely out of stock.
    if (prefs.isZeroBudget && facility.isCampusClinic) {
      const clinicStock = Boolean(facility.stock[prefs.category]);
      if (clinicStock) {
        score += 1000; // Hard lock boost
      } else {
        isAutoRerouted = true;
        rerouteReason = "Campus clinic out of stock; emergency off-campus referral required";
      }
    }

    return {
      facility,
      score,
      isAutoRerouted,
      rerouteReason,
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}
