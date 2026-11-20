import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { rankFacilities, RoutingPreferences } from "@/lib/routing-engine";
import { createIntakePass, formatPassText } from "@/lib/intake-pass";
import { syncChannel } from "@/lib/sync-channel";
import { Facility, UNN_PILOT_FACILITIES } from "@/types";
import { RouterView } from "./router-view";

describe("MedWay Engineering Design Specification — Section 9 Acceptance Criteria", () => {
  const testFacilities: Facility[] = [
    {
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
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      slug: "odim-gate-pharmacy",
      name: "Odim Gate Community Pharmacy",
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
        "Typhoid / Lab Test": true,
        "ORS & Hydration": true,
      },
    },
  ];

  // Test 1 (Red-Flag Safety Gate)
  it("Test 1: Red-Flag Safety Gate — checking any red flag locks pharmacy routing and returns 0 facilities", () => {
    // Zero red flags: facilities routed normally
    const normalRank = rankFacilities(testFacilities, {
      category: "Antimalarials (ACT)",
      budgetPreference: "tiship",
      isZeroBudget: true,
      hasRedFlags: false,
    });
    expect(normalRank.length).toBeGreaterThan(0);

    // Any red flag triggered: 100% deterministic lockout to casualty care
    const redFlagRank = rankFacilities(testFacilities, {
      category: "Antimalarials (ACT)",
      budgetPreference: "tiship",
      isZeroBudget: true,
      hasRedFlags: true,
    });
    expect(redFlagRank.length).toBe(0);
  });

  // Test 2 (TISHIP Default Routing)
  it("Test 2: TISHIP Default Routing — ranks UNN Medical Centre #1 with ₦0 TISHIP coverage under baseline conditions", () => {
    const ranked = rankFacilities(testFacilities, {
      category: "Antimalarials (ACT)",
      budgetPreference: "tiship",
      isZeroBudget: true,
      hasRedFlags: false,
    });

    expect(ranked[0].facility.isCampusClinic).toBe(true);
    expect(ranked[0].facility.name).toBe("UNN Medical Centre");
    expect(ranked[0].facility.priceLabel).toContain("₦0");
  });

  // Test 3 (Live Stockout Reroute)
  it("Test 3: Live Stockout Reroute — toggling UNN Medical Centre stock to false triggers auto reroute and promotes Odim Gate", () => {
    const depletedFacilities: Facility[] = testFacilities.map((f) => {
      if (f.isCampusClinic) {
        return {
          ...f,
          stock: { ...f.stock, "Antimalarials (ACT)": false },
        };
      }
      return f;
    });

    const ranked = rankFacilities(depletedFacilities, {
      category: "Antimalarials (ACT)",
      budgetPreference: "tiship",
      isZeroBudget: true,
      hasRedFlags: false,
    });

    // Odim Gate Community Pharmacy is promoted to #1
    expect(ranked[0].facility.name).toBe("Odim Gate Community Pharmacy");
    expect(ranked[0].isAutoRerouted).toBe(true);
    expect(ranked[0].rerouteReason).toContain("Auto rerouted: UNN Medical Centre is out of Antimalarials (ACT)");
  });

  // Test 4 (Cross-Tab Real-Time Sync)
  it("Test 4: Cross-Tab Real-Time Sync — broadcasts telemetry events across tabs via syncChannel", async () => {
    const subscriber = vi.fn();
    const unsubscribe = syncChannel.subscribe(subscriber);

    // Simulate partner toggling queue in another tab
    syncChannel.broadcast({
      type: "queue_updated",
      facilityId: testFacilities[0].id,
      queue: "high",
    });

    expect(subscriber).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "queue_updated",
        facilityId: testFacilities[0].id,
        queue: "high",
      })
    );

    unsubscribe();
  });

  // Test 5 (Digital Intake Pass)
  it("Test 5: Digital Intake Pass — generates valid MW-UNN-XXX slip and exports clean clipboard text", () => {
    const pass = createIntakePass({
      facilityId: testFacilities[0].id,
      facilityName: testFacilities[0].name,
      category: "Antimalarials (ACT)",
      allergies: "Penicillin, Sulfa",
      tishipCovered: true,
      redFlagsCleared: true,
      isCampusClinic: true,
    });

    expect(pass.passCode).toMatch(/^MW-UNN-[A-Z0-9]{3,4}$/);
    expect(pass.allergies).toBe("Penicillin, Sulfa");
    expect(pass.tishipCovered).toBe(true);
    expect(pass.redFlagsCleared).toBe(true);

    const summary = formatPassText(pass);
    expect(summary).toContain(pass.passCode);
    expect(summary).toContain("UNN Medical Centre");
    expect(summary).toContain("Penicillin, Sulfa");
    expect(summary).toContain("Antimalarials (ACT)");
  });
});
