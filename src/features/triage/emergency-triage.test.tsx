import * as React from "react";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmergencyModal, EmergencyView, useEmergencyTriage } from "./index";
import { rankFacilities } from "@/lib/routing-engine";
import { UNN_PILOT_FACILITIES } from "@/types";

describe("Feature 5: Emergency Red-Flag Triage & Hospital Escalation", () => {
  describe("useEmergencyTriage Hook", () => {
    it("initializes with zero red flags", () => {
      const { result } = renderHook(() => useEmergencyTriage());
      expect(result.current.hasRedFlags).toBe(false);
      expect(result.current.selectedFlags).toHaveLength(0);
    });

    it("toggles danger signs and updates red flag status", () => {
      const { result } = renderHook(() => useEmergencyTriage());

      act(() => {
        result.current.toggleDangerSign("fluids");
      });
      expect(result.current.hasRedFlags).toBe(true);
      expect(result.current.selectedFlags).toContain("fluids");
      expect(result.current.activeSigns[0].id).toBe("fluids");

      act(() => {
        result.current.toggleDangerSign("fluids");
      });
      expect(result.current.hasRedFlags).toBe(false);
    });

    it("clears all danger signs on reset", () => {
      const { result } = renderHook(() => useEmergencyTriage());

      act(() => {
        result.current.toggleDangerSign("neurological");
        result.current.toggleDangerSign("respiratory");
      });
      expect(result.current.selectedFlags).toHaveLength(2);

      act(() => {
        result.current.clearDangerSigns();
      });
      expect(result.current.hasRedFlags).toBe(false);
      expect(result.current.selectedFlags).toHaveLength(0);
    });
  });

  describe("EmergencyModal Component", () => {
    const mockSigns = [
      {
        id: "fluids",
        label: "Unable to drink or keep fluids down",
        description: "Persistent vomiting.",
      },
    ];

    it("renders telephone dialers and hospital directions when open", () => {
      render(
        <EmergencyModal
          isOpen={true}
          onClose={() => {}}
          selectedSigns={mockSigns}
          emergencyPhone="+2348037704288"
          specialistPhone="+2348035489721"
        />
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText(/Unable to drink or keep fluids down/i)).toBeInTheDocument();
      expect(screen.getByText("UNN Medical Centre Casualty Bay")).toBeInTheDocument();
      expect(screen.getByText("Bishop Shanahan Specialist Hospital")).toBeInTheDocument();

      const callUnnBtn = screen.getByRole("button", { name: /call unn casualty/i });
      expect(callUnnBtn).toBeInTheDocument();

      const callBishopBtn = screen.getByRole("button", { name: /call bishop shanahan/i });
      expect(callBishopBtn).toBeInTheDocument();
    });

    it("does not render dialog when closed", () => {
      render(
        <EmergencyModal
          isOpen={false}
          onClose={() => {}}
          selectedSigns={mockSigns}
        />
      );
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  describe("EmergencyView Component", () => {
    it("renders danger sign checklist and activates hospital banner on check", () => {
      render(<EmergencyView />);

      expect(
        screen.getByText("WHO / Red Cross Danger Signs Screening")
      ).toBeInTheDocument();
      expect(
        screen.getByText("UNN Medical Centre Casualty Bay")
      ).toBeInTheDocument();

      const checkbox = screen.getByLabelText(/Convulsions, seizures, or fainting/i);
      fireEvent.click(checkbox);

      expect(
        screen.getByText(/Emergency Hospital Escalation Active/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Pharmacy Lockout/i)).toBeInTheDocument();
    });
  });

  describe("Routing Engine Lockout on Red Flags", () => {
    it("returns an empty facility list when red flags are active", () => {
      const results = rankFacilities([...UNN_PILOT_FACILITIES], {
        category: "Antimalarials (ACT)",
        budgetPreference: "fast",
        isZeroBudget: false,
        hasRedFlags: true,
      });

      expect(results).toHaveLength(0);
    });
  });
});
