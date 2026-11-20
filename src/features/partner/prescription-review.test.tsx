import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { PrescriptionReviewConsole } from "./prescription-review";
import { getOfflineStorage } from "@/lib/offline-db";
import { createIntakePass } from "@/lib/intake-pass";
import { generateSampleDoctorRx } from "@/features/router/prescription-upload";
import { UNN_PILOT_FACILITIES } from "@/types";

describe("Doctor Prescription Handwriting Review & Deciphering Workstation", () => {
  const mockFacility = UNN_PILOT_FACILITIES[1]; // Odim Gate Community Pharmacy

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it("renders empty queue state and loads demo doctor prescription when clicked", async () => {
    render(
      <PrescriptionReviewConsole
        facilityId={mockFacility.id}
        facilityName={mockFacility.name}
      />
    );

    expect(
      screen.getByText("Doctor Prescription Handwriting Review")
    ).toBeInTheDocument();

    // Click load demo button
    const loadButtons = screen.getAllByRole("button", {
      name: /Load Demo Rx Slip|Load Sample UNN Medical Centre Slip/i,
    });
    fireEvent.click(loadButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByText("Doctor Written Prescription Slip")
      ).toBeInTheDocument();
      expect(
        screen.getByText(/PCN Pharmacist Handwriting Clarification and Instructions/i)
      ).toBeInTheDocument();
    });
  });

  it("allows selecting quick clinical presets and stamping legible instructions", async () => {
    const handleClarified = vi.fn();

    // Seed a pass with prescription beforehand
    const storage = getOfflineStorage();
    const seededPass = createIntakePass({
      facilityId: mockFacility.id,
      facilityName: mockFacility.name,
      category: "Antimalarials (ACT)",
      allergies: "None",
      tishipCovered: false,
      redFlagsCleared: true,
      prescriptionImage: generateSampleDoctorRx(),
    });
    await storage.saveIntakePass(seededPass);

    render(
      <PrescriptionReviewConsole
        facilityId={mockFacility.id}
        facilityName={mockFacility.name}
        onPrescriptionClarified={handleClarified}
      />
    );

    // Verify pass is visible
    await waitFor(() => {
      expect(screen.getAllByText(seededPass.passCode).length).toBeGreaterThan(0);
    });

    // Click the ACT and Paracetamol clinical preset
    const presetButton = screen.getByRole("button", {
      name: /ACT and Paracetamol/i,
    });
    fireEvent.click(presetButton);

    const textarea = screen.getByLabelText(
      /PCN Pharmacist Handwriting Clarification and Instructions/i
    ) as HTMLTextAreaElement;
    expect(textarea.value).toContain("Artemether 80mg and Lumefantrine 480mg");

    // Click stamp button
    const stampButton = screen.getByRole("button", {
      name: /Verify and Stamp Legible/i,
    });
    fireEvent.click(stampButton);

    await waitFor(() => {
      expect(handleClarified).toHaveBeenCalledWith(
        seededPass.passCode,
        expect.stringContaining("Artemether 80mg")
      );
    });

    // Check offline storage updated
    const updated = await storage.getIntakePassByCode(seededPass.passCode);
    expect(updated?.pharmacistNotes).toContain("Artemether 80mg and Lumefantrine 480mg");
  });

  it("provides zoom and high contrast ink controls for inspecting cursive", async () => {
    const storage = getOfflineStorage();
    const seededPass = createIntakePass({
      facilityId: mockFacility.id,
      facilityName: mockFacility.name,
      category: "Antimalarials (ACT)",
      allergies: "None",
      tishipCovered: false,
      redFlagsCleared: true,
      prescriptionImage: generateSampleDoctorRx(),
    });
    await storage.saveIntakePass(seededPass);

    render(
      <PrescriptionReviewConsole
        facilityId={mockFacility.id}
        facilityName={mockFacility.name}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText(seededPass.passCode).length).toBeGreaterThan(0);
    });

    // Initial zoom is 1x
    expect(screen.getByText("1x")).toBeInTheDocument();

    // Click Zoom In
    const zoomInBtn = screen.getByTitle("Zoom In");
    fireEvent.click(zoomInBtn);
    expect(screen.getByText("1.5x")).toBeInTheDocument();

    // Click Sharpen Ink toggle
    const contrastBtn = screen.getByTitle(
      "Toggle high contrast to sharpen faint pen ink"
    );
    fireEvent.click(contrastBtn);
    expect(screen.getByText("Normal Contrast")).toBeInTheDocument();
  });
});
