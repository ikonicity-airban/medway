import { describe, it, expect } from "vitest";
import { rankFacilities } from "./routing-engine";
import { Facility } from "@/types";

const mockCampusClinic: Facility = {
  id: "00000000-0000-0000-0000-000000000001",
  slug: "unn-medical-centre",
  name: "UNN Medical Centre",
  facilityType: "Campus Clinic",
  isCampusClinic: true,
  isVerified: true,
  distanceMeters: 400,
  currentQueue: "low",
  priceLabel: "₦0 (TISHIP Covered)",
  tishipCovered: true,
  stock: {
    "Antimalarials (ACT)": true,
    "Analgesics & Fever": true,
    "Typhoid / Lab Test": true,
    "ORS & Hydration": true,
  },
};

const mockPharmacy: Facility = {
  id: "00000000-0000-0000-0000-000000000002",
  slug: "odim-gate-pharmacy",
  name: "Odim Gate Pharmacy",
  facilityType: "Community Pharmacy",
  isCampusClinic: false,
  isVerified: true,
  distanceMeters: 650,
  currentQueue: "low",
  priceLabel: "₦1,500 - ₦3,500",
  tishipCovered: false,
  stock: {
    "Antimalarials (ACT)": true,
    "Analgesics & Fever": true,
    "Typhoid / Lab Test": false,
    "ORS & Hydration": true,
  },
};

describe("Routing Engine", () => {
  it("prioritizes campus clinic when in stock and TISHIP selected", () => {
    const results = rankFacilities([mockCampusClinic, mockPharmacy], {
      category: "Antimalarials (ACT)",
      budgetPreference: "tiship",
      isZeroBudget: false,
      hasRedFlags: false,
    });

    expect(results.length).toBe(2);
    expect(results[0].facility.id).toBe(mockCampusClinic.id);
  });

  it("enforces TISHIP Hard Lock when student has zero budget", () => {
    // High queue at campus clinic
    const busyClinic: Facility = { ...mockCampusClinic, currentQueue: "high" };

    const results = rankFacilities([busyClinic, mockPharmacy], {
      category: "Antimalarials (ACT)",
      budgetPreference: "tiship",
      isZeroBudget: true,
      hasRedFlags: false,
    });

    // Zero budget student must not be rerouted away from campus clinic
    expect(results[0].facility.id).toBe(busyClinic.id);
  });

  it("locks out all facility routing when emergency red flags are active", () => {
    const results = rankFacilities([mockCampusClinic, mockPharmacy], {
      category: "Antimalarials (ACT)",
      budgetPreference: "tiship",
      isZeroBudget: false,
      hasRedFlags: true,
    });

    // Emergency red flags must return zero pharmacy/clinic routes
    expect(results.length).toBe(0);
  });
});
