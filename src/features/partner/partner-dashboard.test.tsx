import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { PartnerAuth } from "./partner-auth";
import { InventoryToggles } from "./inventory-toggles";
import { QueueSelector } from "./queue-selector";
import { TokenScanner } from "./token-scanner";
import { PartnerDashboard } from "./partner-dashboard";
import { getOfflineStorage } from "@/lib/offline-db";
import { createCrowdToken } from "@/lib/intake-pass";
import { Facility, UNN_PILOT_FACILITIES } from "@/types";

describe("Feature 9: Partner Dashboard & Counter Check-In Telemetry", () => {
  const mockFacility: Facility = { ...UNN_PILOT_FACILITIES[1] }; // Odim Gate Community Pharmacy

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PartnerAuth Component", () => {
    it("rejects invalid PIN and displays error alert", () => {
      const handleAuth = vi.fn();
      render(<PartnerAuth onAuthenticate={handleAuth} />);

      const pinInput = screen.getByPlaceholderText("••••");
      fireEvent.change(pinInput, { target: { value: "0000" } });

      const submitButton = screen.getByRole("button", {
        name: /Unlock Attendant Console/i,
      });
      fireEvent.click(submitButton);

      expect(handleAuth).not.toHaveBeenCalled();
      expect(
        screen.getByText(/Incorrect 4-digit attendant PIN/i)
      ).toBeInTheDocument();
    });

    it("authenticates successfully with valid facility PIN", () => {
      const handleAuth = vi.fn();
      render(<PartnerAuth onAuthenticate={handleAuth} />);

      // Default facility is UNN Medical Centre (PIN 4288)
      const pinInput = screen.getByPlaceholderText("••••");
      fireEvent.change(pinInput, { target: { value: "4288" } });

      const submitButton = screen.getByRole("button", {
        name: /Unlock Attendant Console/i,
      });
      fireEvent.click(submitButton);

      expect(handleAuth).toHaveBeenCalledTimes(1);
      expect(handleAuth).toHaveBeenCalledWith(
        expect.objectContaining({ id: UNN_PILOT_FACILITIES[0].id })
      );
    });
  });

  describe("InventoryToggles Component", () => {
    it("renders all canonical care categories and triggers onToggle callback", () => {
      const handleToggle = vi.fn();
      render(
        <InventoryToggles
          stock={mockFacility.stock}
          onToggle={handleToggle}
        />
      );

      expect(screen.getByText("Antimalarials (ACT)")).toBeInTheDocument();
      expect(screen.getByText("Analgesics & Fever")).toBeInTheDocument();
      expect(screen.getByText("Typhoid / Lab Test")).toBeInTheDocument();
      expect(screen.getByText("ORS & Hydration")).toBeInTheDocument();

      const actButton = screen.getByRole("switch", {
        name: /Antimalarials \(ACT\)/i,
      });
      fireEvent.click(actButton);

      expect(handleToggle).toHaveBeenCalledWith("Antimalarials (ACT)");
    });
  });

  describe("QueueSelector Component", () => {
    it("allows switching queue levels and triggers callback", () => {
      const handleQueue = vi.fn();
      render(
        <QueueSelector
          currentQueue="low"
          onSelectQueue={handleQueue}
        />
      );

      const highButton = screen.getByRole("radio", {
        name: /High Congestion/i,
      });
      fireEvent.click(highButton);

      expect(handleQueue).toHaveBeenCalledWith("high");
    });
  });

  describe("TokenScanner Component", () => {
    it("verifies and redeems student crowd telemetry tokens in storage", async () => {
      const storage = getOfflineStorage();
      const crowdToken = createCrowdToken({
        facilityId: mockFacility.id,
        reportedQueue: "low",
      });
      await storage.saveCrowdToken(crowdToken);

      const handleVerified = vi.fn();
      render(
        <TokenScanner
          facilityId={mockFacility.id}
          facilityName={mockFacility.name}
          onVerifiedArrival={handleVerified}
        />
      );

      const input = screen.getByPlaceholderText(/Enter pass code/i);
      fireEvent.change(input, { target: { value: crowdToken.tokenCode } });

      const verifyButton = screen.getByRole("button", {
        name: /Verify Arrival/i,
      });
      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(screen.getByRole("status")).toHaveTextContent(
          /Queue telemetry updated/i
        );
      });

      expect(handleVerified).toHaveBeenCalledWith(crowdToken.tokenCode.toUpperCase());

      // Verify token in storage was marked verified
      const stored = await storage.getCrowdTokenByCode(crowdToken.tokenCode);
      expect(stored?.isVerified).toBe(true);
    });
  });

  describe("PartnerDashboard Integration", () => {
    it("renders authenticated console, toggles stock, and switches queue", async () => {
      render(<PartnerDashboard initialFacility={mockFacility} />);

      expect(screen.getByText("Odim Gate Community Pharmacy")).toBeInTheDocument();
      expect(screen.getByText(/PCN Accredited/i)).toBeInTheDocument();

      // Toggle stock
      const toggle = screen.getByRole("switch", {
        name: /ORS & Hydration/i,
      });
      fireEvent.click(toggle);

      await waitFor(() => {
        expect(screen.getByRole("status")).toHaveTextContent(/Updated ORS & Hydration stock/i);
      });

      // Switch queue
      const queueChoice = screen.getByRole("radio", {
        name: /Moderate Queue/i,
      });
      fireEvent.click(queueChoice);

      await waitFor(() => {
        expect(screen.getByRole("status")).toHaveTextContent(/Updated current queue to moderate/i);
      });

      // Sign out
      const signOutButton = screen.getByRole("button", { name: /Sign Out/i });
      fireEvent.click(signOutButton);

      expect(screen.getByText(/Pharmacy & Clinic Attendant Portal/i)).toBeInTheDocument();
    });
  });
});
