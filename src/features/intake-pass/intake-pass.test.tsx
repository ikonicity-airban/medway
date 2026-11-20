import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { PassQrCode } from "./pass-qr-code";
import { AllergySelector } from "./allergy-selector";
import { IntakePassView } from "./intake-pass-view";
import { formatPassText } from "@/lib/intake-pass";
import { getOfflineStorage } from "@/lib/offline-db";
import { IntakePass } from "@/types";

describe("Feature 8: Student Self Advocacy Intake Pass", () => {
  const mockPass: IntakePass = {
    passCode: "MW-UNN-8K2Q",
    timestamp: "2026-11-20T10:00:00.000Z",
    facilityId: "00000000-0000-0000-0000-000000000001",
    facilityName: "UNN Medical Centre",
    category: "Antimalarials (ACT)",
    allergies: "Penicillin",
    tishipCovered: true,
    redFlagsCleared: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  describe("PassQrCode Component", () => {
    it("renders vector SVG with accessible aria label and pass code text", () => {
      render(<PassQrCode passCode="MW-UNN-8K2Q" size={180} />);

      const img = screen.getByRole("img", {
        name: /Digital verification matrix for pass MW-UNN-8K2Q/i,
      });
      expect(img).toBeInTheDocument();
      expect(screen.getAllByText("MW-UNN-8K2Q").length).toBeGreaterThan(0);
    });
  });

  describe("AllergySelector Component", () => {
    it("renders quick selection chips and updates declared allergy", () => {
      let currentAllergy = "None";
      const handleChange = vi.fn((val: string) => {
        currentAllergy = val;
      });

      const { rerender } = render(
        <AllergySelector value={currentAllergy} onChange={handleChange} />
      );

      // Select Penicillin
      const penicillinChip = screen.getByRole("button", { name: "Penicillin" });
      fireEvent.click(penicillinChip);
      expect(handleChange).toHaveBeenCalledWith("Penicillin");

      // Rerender with new value to check warning box
      rerender(<AllergySelector value="Penicillin" onChange={handleChange} />);
      expect(
        screen.getByText(/This allergy will be highlighted in bold amber on your intake slip/i)
      ).toBeInTheDocument();

      // Reset back to No known allergies
      const noneChip = screen.getByRole("button", {
        name: "No known drug allergies",
      });
      fireEvent.click(noneChip);
      expect(handleChange).toHaveBeenCalledWith("None");
    });

    it("allows typing custom allergy text into input field", () => {
      const handleChange = vi.fn();
      render(<AllergySelector value="None" onChange={handleChange} />);

      const input = screen.getByPlaceholderText(/Other allergy/i);
      fireEvent.change(input, { target: { value: "Ciprofloxacin hives" } });
      expect(handleChange).toHaveBeenCalledWith("Ciprofloxacin hives");
    });
  });

  describe("formatPassText Utility", () => {
    it("produces clean structured plain text for clipboard sharing", () => {
      const text = formatPassText(mockPass);

      expect(text).toContain("MEDWAY STUDENT INTAKE PASS");
      expect(text).toContain("Pass Code: MW-UNN-8K2Q");
      expect(text).toContain("Facility: UNN Medical Centre");
      expect(text).toContain("Care Category: Antimalarials (ACT)");
      expect(text).toContain("Declared Allergies: Penicillin");
      expect(text).toContain("TISHIP Status: ₦0 Covered");
      expect(text).toContain("Note: Present this code upon arrival. Not a prescription.");
    });
  });

  describe("IntakePassView Component", () => {
    it("renders full student pass details, allergy alert box, and executes clipboard copy", async () => {
      const handleClose = vi.fn();
      render(<IntakePassView pass={mockPass} onClose={handleClose} />);

      expect(screen.getAllByText("MW-UNN-8K2Q").length).toBeGreaterThan(0);
      expect(screen.getByText("UNN Medical Centre")).toBeInTheDocument();
      expect(screen.getByText("Antimalarials (ACT)")).toBeInTheDocument();
      expect(screen.getByText("Penicillin")).toBeInTheDocument();
      expect(screen.getByText(/₦0 TISHIP Covered/i)).toBeInTheDocument();

      // Test Copy button
      const copyButton = screen.getByRole("button", {
        name: /Copy Slip to Clipboard/i,
      });
      fireEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);

      // Status toast should appear
      const toast = await screen.findByRole("status");
      expect(toast).toHaveTextContent(/Intake slip copied to clipboard!/i);

      // Done button
      const doneButton = screen.getByRole("button", {
        name: /Done & Return to Router/i,
      });
      fireEvent.click(doneButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Offline Storage Integration", () => {
    it("saves and retrieves intake pass by pass code in local storage", async () => {
      const storage = getOfflineStorage();
      await storage.saveIntakePass(mockPass);

      const retrieved = await storage.getIntakePassByCode("MW-UNN-8K2Q");
      expect(retrieved).not.toBeNull();
      expect(retrieved?.passCode).toBe("MW-UNN-8K2Q");
      expect(retrieved?.facilityName).toBe("UNN Medical Centre");
      expect(retrieved?.allergies).toBe("Penicillin");
    });
  });
});
