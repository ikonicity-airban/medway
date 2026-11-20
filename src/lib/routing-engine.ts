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

  const campusClinic = facilities.find((f) => f.isCampusClinic);
  const clinicHasStock = campusClinic
    ? Boolean(campusClinic.stock[prefs.category])
    : true;

  const scored = facilities.map((facility) => {
    let score = calculateFacilityScore(facility, prefs);
    const isAutoRerouted = false;
    let rerouteReason: string | undefined;

    // TISHIP Hard Lock enforcement:
    // If student has zero budget, campus clinic is locked as top destination
    // only when the clinic actually has the requested item in stock.
    if (prefs.isZeroBudget && facility.isCampusClinic) {
      if (clinicHasStock) {
        score += 1000; // Hard lock boost
      } else {
        rerouteReason = `Campus clinic out of stock for ${prefs.category}. Off campus referral required.`;
      }
    }

    return {
      facility,
      score,
      isAutoRerouted,
      rerouteReason,
    };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);

  // If the campus clinic is out of stock, promote the highest scoring alternate facility
  // and mark it as auto rerouted with an informative banner reason.
  if (!clinicHasStock && sorted.length > 0) {
    const topAlternative = sorted.find((item) => !item.facility.isCampusClinic);
    if (topAlternative) {
      topAlternative.isAutoRerouted = true;
      topAlternative.rerouteReason = `Auto rerouted: UNN Medical Centre is out of ${prefs.category}. Recommended ${topAlternative.facility.name} with confirmed stock.`;
    }
  }

  return sorted;
}
