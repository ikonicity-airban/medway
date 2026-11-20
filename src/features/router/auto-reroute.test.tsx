import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { rankFacilities, RoutingPreferences } from "@/lib/routing-engine";
import { AutoRerouteBanner } from "./auto-reroute-banner";
import { PartnerDirectory } from "./partner-directory";
import { RouterView } from "./router-view";
import { Facility } from "@/types";

describe("Feature 7: Auto Reroute Engine & Partner Directory", () => {
  const mockFacilities: Facility[] = [
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
        "Antimalarials (ACT)": false, // Simulated clinic stockout
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
    {
      id: "00000000-0000-0000-0000-000000000003",
      slug: "hilltop-pharmacy",
      name: "Hilltop Care Pharmacy",
      facilityType: "Community Pharmacy",
      isCampusClinic: false,
      isVerified: true,
      distanceMeters: 900,
      currentQueue: "moderate",
      priceLabel: "₦1,200 - ₦3,000",
      tishipCovered: false,
      stock: {
        "Antimalarials (ACT)": true,
        "Analgesics & Fever": true,
        "Typhoid / Lab Test": false,
        "ORS & Hydration": true,
      },
    },
  ];

  describe("rankFacilities stockout handling", () => {
    it("penalizes UNN clinic and promotes Odim Gate Pharmacy when clinic stock is depleted", () => {
      const prefs: RoutingPreferences = {
        category: "Antimalarials (ACT)",
        budgetPreference: "tiship",
        isZeroBudget: true,
        hasRedFlags: false,
      };

      const ranked = rankFacilities(mockFacilities, prefs);

      // Odim Gate Pharmacy should be ranked #1 because clinic has no stock
      expect(ranked[0].facility.slug).toBe("odim-gate-pharmacy");
      expect(ranked[0].isAutoRerouted).toBe(true);
      expect(ranked[0].rerouteReason).toContain("Auto rerouted: UNN Medical Centre is out of Antimalarials (ACT)");

      // Clinic should be ranked lower due to -120 stock penalty
      const clinicRank = ranked.findIndex((r) => r.facility.isCampusClinic);
      expect(clinicRank).toBeGreaterThan(0);
      expect(ranked[clinicRank].rerouteReason).toContain("Campus clinic out of stock");
    });
  });

  describe("AutoRerouteBanner Component", () => {
    it("renders warning banner with depleted category and alternative recommendation", () => {
      const onSelect = vi.fn();
      render(
        <AutoRerouteBanner
          category="Antimalarials (ACT)"
          alternativeFacility={mockFacilities[1]}
          onSelectAlternative={onSelect}
        />
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/Clinic Stockout Notice: Antimalarials \(ACT\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Odim Gate Community Pharmacy/i)).toBeInTheDocument();

      const button = screen.getByRole("button", { name: /Select Odim/i });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(onSelect).toHaveBeenCalledWith(mockFacilities[1]);
    });
  });

  describe("PartnerDirectory Component", () => {
    it("lists only off campus partner pharmacies and allows gate filtering", () => {
      const onSelect = vi.fn();
      render(
        <PartnerDirectory
          facilities={mockFacilities}
          selectedCategory="Antimalarials (ACT)"
          onSelectFacility={onSelect}
        />
      );

      // Clinic must not appear in partner directory
      expect(screen.queryByText(/UNN Medical Centre/i)).not.toBeInTheDocument();

      // Partner pharmacies must appear
      expect(screen.getByText(/Odim Gate Community Pharmacy/i)).toBeInTheDocument();
      expect(screen.getByText(/Hilltop Care Pharmacy/i)).toBeInTheDocument();

      // Gate filtering
      const gateSelect = screen.getByLabelText(/Filter by campus gate/i);
      fireEvent.change(gateSelect, { target: { value: "odim" } });

      expect(screen.getByText(/Odim Gate Community Pharmacy/i)).toBeInTheDocument();
      expect(screen.queryByText(/Hilltop Care Pharmacy/i)).not.toBeInTheDocument();
    });
  });

  describe("RouterView Tab Navigation", () => {
    it("switches cleanly between Care Router and Partner Directory tabs", () => {
      render(<RouterView initialCategory="Antimalarials (ACT)" />);

      // Defaults to Care Router tab
      expect(screen.getByRole("tab", { name: /Care Router/i })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText(/Student Budget & Insurance Gate/i)).toBeInTheDocument();

      // Switch to Partner Directory
      const directoryTab = screen.getByRole("tab", { name: /Partner Directory/i });
      fireEvent.click(directoryTab);

      expect(directoryTab).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText(/Accredited Partner Directory/i)).toBeInTheDocument();
      expect(screen.getByText(/PCN Accredited/i)).toBeInTheDocument();
    });
  });
});
