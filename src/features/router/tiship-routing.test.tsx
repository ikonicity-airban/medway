import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BudgetGate, CategorySelector, RouterView } from "./index";
import { rankFacilities } from "@/lib/routing-engine";
import { Facility, UNN_PILOT_FACILITIES } from "@/types";

describe("Feature 6: TISHIP Routing & Zero-Cost Hard Lock", () => {
  describe("CategorySelector Component", () => {
    it("renders the 4 canonical care categories", () => {
      render(
        <CategorySelector
          selectedCategory="Antimalarials (ACT)"
          onSelectCategory={() => {}}
        />
      );

      expect(screen.getByText("Antimalarials (ACT)")).toBeInTheDocument();
      expect(screen.getByText("Analgesics & Fever")).toBeInTheDocument();
      expect(screen.getByText("Typhoid / Lab Test")).toBeInTheDocument();
      expect(screen.getByText("ORS & Hydration")).toBeInTheDocument();
    });

    it("triggers category selection callback on click", () => {
      const handleSelect = vi.fn();
      render(
        <CategorySelector
          selectedCategory="Antimalarials (ACT)"
          onSelectCategory={handleSelect}
        />
      );

      fireEvent.click(screen.getByText("Analgesics & Fever"));
      expect(handleSelect).toHaveBeenCalledWith("Analgesics & Fever");
    });
  });

  describe("BudgetGate Component", () => {
    it("renders TISHIP ₦0 and fast retail radio choices", () => {
      const handleChange = vi.fn();
      render(<BudgetGate value="tiship" onChange={handleChange} />);

      expect(screen.getByText(/₦0 TISHIP Coverage/i)).toBeInTheDocument();
      expect(screen.getByText(/Fast Retail Care/i)).toBeInTheDocument();

      const fastRadio = screen.getByLabelText(/Fast Retail Care/i);
      fireEvent.click(fastRadio);
      expect(handleChange).toHaveBeenCalledWith("fast");
    });
  });

  describe("TISHIP Hard Lock Priority Scoring", () => {
    it("locks UNN Medical Centre as top rank even when clinic queue is high", () => {
      // Simulate high congestion at UNN Medical Centre
      const simulatedFacilities: Facility[] = UNN_PILOT_FACILITIES.map((f) => {
        if (f.isCampusClinic) {
          return { ...f, currentQueue: "high" }; // high wait
        }
        return { ...f, currentQueue: "low" }; // low wait at pharmacies
      });

      const ranked = rankFacilities(simulatedFacilities, {
        category: "Antimalarials (ACT)",
        budgetPreference: "tiship",
        isZeroBudget: true,
        hasRedFlags: false,
      });

      // UNN Medical Centre must remain rank 1 due to +1000 TISHIP lock
      expect(ranked[0].facility.isCampusClinic).toBe(true);
      expect(ranked[0].facility.name).toBe("UNN Medical Centre");
      expect(ranked[0].score).toBeGreaterThan(900);
    });

    it("allows fast retail pharmacies to outrank clinic when budget is not locked to zero", () => {
      const simulatedFacilities: Facility[] = UNN_PILOT_FACILITIES.map((f) => {
        if (f.isCampusClinic) {
          return { ...f, currentQueue: "high" };
        }
        return { ...f, currentQueue: "low" };
      });

      const ranked = rankFacilities(simulatedFacilities, {
        category: "Antimalarials (ACT)",
        budgetPreference: "fast",
        isZeroBudget: false,
        hasRedFlags: false,
      });

      // Off-campus pharmacy with low queue should outrank high-queue clinic
      expect(ranked[0].facility.isCampusClinic).toBe(false);
      expect(ranked[0].facility.name).toBe("Odim Gate Community Pharmacy");
    });
  });

  describe("RouterView Integration", () => {
    it("renders interactive router view with category, budget gate, and ranked facilities", () => {
      render(
        <RouterView
          initialCategory="Antimalarials (ACT)"
          initialBudget="tiship"
        />
      );

      expect(
        screen.getAllByText(/TISHIP Hard Lock Active/i).length
      ).toBeGreaterThan(0);
      expect(screen.getByText("UNN Medical Centre")).toBeInTheDocument();
      expect(screen.getByText("Optimal Route")).toBeInTheDocument();
    });
  });
});
