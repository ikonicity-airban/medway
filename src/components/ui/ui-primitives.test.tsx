import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DangerSignChecklist,
  FacilityCard,
  IntakePassCard,
} from "./index";
import { Facility, IntakePass } from "@/types";

describe("MedWay UI Primitives & Accessibility Baseline", () => {
  describe("Button Component", () => {
    it("renders with 48px minimum touch target by default", () => {
      render(<Button>Proceed to Care</Button>);
      const button = screen.getByRole("button", { name: /proceed to care/i });
      expect(button).toBeInTheDocument();
      expect(button.className).toContain("min-h-[48px]");
      expect(button.className).toContain("focus-visible:outline-2");
    });

    it("applies emergency variant styling for casualty escalation", () => {
      render(<Button variant="emergency">Emergency Ward</Button>);
      const button = screen.getByRole("button", { name: /emergency ward/i });
      expect(button.className).toContain("bg-error");
      expect(button.className).toContain("text-on-error");
    });

    it("handles disabled state with aria-disabled", () => {
      render(<Button disabled>Unavailable</Button>);
      const button = screen.getByRole("button", { name: /unavailable/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-disabled", "true");
      expect(button.className).toContain("disabled:opacity-50");
    });

    it("invokes onClick when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      fireEvent.click(screen.getByRole("button", { name: /click me/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Badge Component", () => {
    it("renders semantic TISHIP badge", () => {
      render(<Badge variant="tiship">₦0 TISHIP Covered</Badge>);
      const badge = screen.getByText(/₦0 TISHIP Covered/i);
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain("bg-success");
    });

    it("renders queue level badge with explicit label", () => {
      render(<Badge variant="queue-low">Low Queue (&lt; 15m)</Badge>);
      const badge = screen.getByText(/Low Queue/i);
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain("bg-success");
    });
  });

  describe("Card Component", () => {
    it("renders clean semantic heading without pills", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle as="h2">UNN Medical Centre</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Campus clinic serving students 24/7</p>
          </CardContent>
        </Card>
      );
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("UNN Medical Centre");
      expect(heading.tagName).toBe("H2");
    });
  });

  describe("FacilityCard Component", () => {
    const mockFacility: Facility = {
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

    it("renders facility details, queue, price, and triggers select callback", () => {
      const handleSelect = vi.fn();
      render(
        <FacilityCard
          facility={mockFacility}
          selectedCategory="Antimalarials (ACT)"
          onSelectRoute={handleSelect}
        />
      );

      expect(screen.getByText("UNN Medical Centre")).toBeInTheDocument();
      expect(screen.getByText("₦0 (TISHIP Covered)")).toBeInTheDocument();
      expect(screen.getByText(/400m/i)).toBeInTheDocument();
      expect(screen.getByText(/In Stock/i)).toBeInTheDocument();

      const selectBtn = screen.getByRole("button", { name: /select route/i });
      fireEvent.click(selectBtn);
      expect(handleSelect).toHaveBeenCalledWith(mockFacility);
    });
  });

  describe("DangerSignChecklist Component", () => {
    it("triggers emergency escalation alert when danger sign is checked", () => {
      const handleDangerChange = vi.fn();
      render(<DangerSignChecklist onDangerSignChange={handleDangerChange} />);

      // Initially no alert
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();

      // Check first danger sign (fluids)
      const checkbox = screen.getByLabelText(/Unable to drink or keep fluids down/i);
      fireEvent.click(checkbox);

      // Now emergency alert is active
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/Immediate Hospital Escalation Required/i);
      expect(handleDangerChange).toHaveBeenCalledWith(true, ["fluids"]);
    });
  });

  describe("IntakePassCard Component", () => {
    const mockPass: IntakePass = {
      passCode: "MW-UNN-A7K",
      timestamp: "2026-11-20T03:00:00.000Z",
      facilityId: "00000000-0000-0000-0000-000000000001",
      facilityName: "UNN Medical Centre",
      category: "Antimalarials (ACT)",
      allergies: "Sulfonamides",
      tishipCovered: true,
      redFlagsCleared: true,
    };

    it("displays pass code, facility, care category, and allergy warnings", () => {
      render(<IntakePassCard pass={mockPass} tokenCode="CT-UNN-testtoken123" />);

      expect(screen.getByText("MW-UNN-A7K")).toBeInTheDocument();
      expect(screen.getByText("UNN Medical Centre")).toBeInTheDocument();
      expect(screen.getByText("Antimalarials (ACT)")).toBeInTheDocument();
      expect(screen.getByText("Sulfonamides")).toBeInTheDocument();
      expect(screen.getByText(/CT-UNN-testtoken123/i)).toBeInTheDocument();
      expect(screen.getByText(/₦0 TISHIP Applied/i)).toBeInTheDocument();
    });
  });
});
