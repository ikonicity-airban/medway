import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  aggregateTelemetry,
  buildAnonymizedExport,
  calculateCategoryDistribution,
  calculateFacilityMetrics,
  calculateQueueDistribution,
  CategoryDemandBarChart,
  FacilityStatusMatrix,
  QueueCongestionMeter,
  TelemetryView,
} from "./index";
import { Facility, IntakePass, UNN_PILOT_FACILITIES } from "@/types";
import { getOfflineStorage } from "@/lib/offline-db";

describe("Institutional Population Health Telemetry", () => {
  const sampleFacilities: Facility[] = [
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
      currentQueue: "high",
      priceLabel: "₦1,500 - ₦3,500",
      tishipCovered: false,
      stock: {
        "Antimalarials (ACT)": false,
        "Analgesics & Fever": true,
        "Typhoid / Lab Test": false,
        "ORS & Hydration": true,
      },
    },
  ];

  const samplePasses: IntakePass[] = [
    {
      passCode: "MW-UNN-A1B2",
      timestamp: "2026-11-20T05:00:00.000Z",
      facilityId: "00000000-0000-0000-0000-000000000001",
      facilityName: "UNN Medical Centre",
      category: "Antimalarials (ACT)",
      allergies: "None",
      tishipCovered: true,
      redFlagsCleared: true,
    },
    {
      passCode: "MW-UNN-C3D4",
      timestamp: "2026-11-20T05:10:00.000Z",
      facilityId: "00000000-0000-0000-0000-000000000001",
      facilityName: "UNN Medical Centre",
      category: "Antimalarials (ACT)",
      allergies: "Penicillin",
      tishipCovered: true,
      redFlagsCleared: true,
    },
    {
      passCode: "MW-UNN-E5F6",
      timestamp: "2026-11-20T05:20:00.000Z",
      facilityId: "00000000-0000-0000-0000-000000000002",
      facilityName: "Odim Gate Community Pharmacy",
      category: "Analgesics & Fever",
      allergies: "None",
      tishipCovered: false,
      redFlagsCleared: true,
    },
  ];

  beforeEach(async () => {
    const storage = getOfflineStorage();
    await storage.clear();
  });

  describe("Category Distribution Math", () => {
    it("falls back to baseline counts when no passes are stored", () => {
      const { metrics, total } = calculateCategoryDistribution([]);
      expect(total).toBe(120);

      const act = metrics.find((m) => m.category === "Antimalarials (ACT)");
      expect(act?.count).toBe(54);
      expect(act?.percentage).toBe(45);
    });

    it("calculates accurate counts and percentages from real intake passes", () => {
      const { metrics, total } = calculateCategoryDistribution(samplePasses);
      expect(total).toBe(3);

      const act = metrics.find((m) => m.category === "Antimalarials (ACT)");
      expect(act?.count).toBe(2);
      expect(act?.percentage).toBe(67);

      const anal = metrics.find((m) => m.category === "Analgesics & Fever");
      expect(anal?.count).toBe(1);
      expect(anal?.percentage).toBe(33);

      const typhoid = metrics.find((m) => m.category === "Typhoid / Lab Test");
      expect(typhoid?.count).toBe(0);
      expect(typhoid?.percentage).toBe(0);
    });
  });

  describe("Queue Distribution Math", () => {
    it("evaluates queue distribution and average wait times", () => {
      const queue = calculateQueueDistribution(sampleFacilities);
      expect(queue.low).toBe(1);
      expect(queue.moderate).toBe(0);
      expect(queue.high).toBe(1);
      expect(queue.lowPercentage).toBe(50);
      expect(queue.highPercentage).toBe(50);
      // Low is 10 min, High is 60 min -> avg 35 min
      expect(queue.averageWaitMinutes).toBe(35);
    });
  });

  describe("Facility Stockout Metrics", () => {
    it("identifies stockouts and in-stock categories correctly", () => {
      const metrics = calculateFacilityMetrics(sampleFacilities);
      expect(metrics).toHaveLength(2);

      const unn = metrics.find((m) => m.facilityId === sampleFacilities[0].id);
      expect(unn?.outOfStockCount).toBe(0);
      expect(unn?.inStockCategories).toHaveLength(4);

      const odim = metrics.find((m) => m.facilityId === sampleFacilities[1].id);
      expect(odim?.outOfStockCount).toBe(2);
      expect(odim?.stockoutCategories).toEqual([
        "Antimalarials (ACT)",
        "Typhoid / Lab Test",
      ]);
    });
  });

  describe("Complete Telemetry Aggregation", () => {
    it("computes complete population telemetry with TISHIP rate", () => {
      const agg = aggregateTelemetry(samplePasses, sampleFacilities);
      expect(agg.totalInquiries).toBe(3);
      expect(agg.tishipCoverageCount).toBe(2);
      expect(agg.tishipCoveragePercentage).toBe(67);
      expect(agg.totalStockouts).toBe(2);
      expect(agg.categoryMetrics).toHaveLength(4);
    });
  });

  describe("Zero PII Export Enforcement", () => {
    it("guarantees exported summary contains zero student personal identifiers", () => {
      const agg = aggregateTelemetry(samplePasses, sampleFacilities);
      const exported = buildAnonymizedExport(agg);

      const jsonString = JSON.stringify(exported);

      // Verify no student pass codes exist in the exported JSON
      expect(jsonString).not.toContain("MW-UNN-A1B2");
      expect(jsonString).not.toContain("MW-UNN-C3D4");
      expect(jsonString).not.toContain("MW-UNN-E5F6");

      // Verify no allergy or student medical info leaked
      expect(jsonString).not.toContain("Penicillin");

      // Verify privacy statement and aggregated summary structures
      expect(exported.reportType).toBe(
        "Institutional Population Health Logistics Telemetry"
      );
      expect(exported.campus).toBe("University of Nigeria, Nsukka (UNN)");
      expect(exported.summary.totalRoutingInquiries).toBe(3);
      expect(exported.summary.tishipEligibleInquiries).toBe(2);
      expect(exported.summary.tishipEligibilityRate).toBe("67%");
      expect(exported.privacyStatement).toContain("zero student PII");
    });
  });

  describe("Accessible Visual Components", () => {
    it("renders SVG Category Demand Bar Chart with accessibility attributes", () => {
      const { metrics } = calculateCategoryDistribution(samplePasses);
      render(
        <CategoryDemandBarChart metrics={metrics} totalInquiries={samplePasses.length} />
      );

      const svg = screen.getByRole("graphics-document", {
        name: /Category Demand Distribution Bar Chart/i,
      });
      expect(svg).toBeInTheDocument();
      expect(screen.getByText(/N = 3 queries/i)).toBeInTheDocument();
      expect(screen.getByText("Antimalarials (ACT)")).toBeInTheDocument();
    });

    it("renders Queue Congestion Meter with average wait indicator", () => {
      const queue = calculateQueueDistribution(sampleFacilities);
      render(<QueueCongestionMeter distribution={queue} />);

      expect(screen.getByText(/Campus Queue Load/i)).toBeInTheDocument();
      expect(screen.getByText(/~35 min avg wait/i)).toBeInTheDocument();
      expect(screen.getByText(/Low \(<15m\)/i)).toBeInTheDocument();
      expect(screen.getByText(/High \(>45m\)/i)).toBeInTheDocument();
    });

    it("renders Facility Status Matrix with stockout badges", () => {
      const facilityMetrics = calculateFacilityMetrics(sampleFacilities);
      render(<FacilityStatusMatrix facilities={facilityMetrics} />);

      expect(screen.getByText("UNN Medical Centre")).toBeInTheDocument();
      expect(screen.getByText("Odim Gate Community Pharmacy")).toBeInTheDocument();
      expect(screen.getByText("All 4 In Stock")).toBeInTheDocument();
      expect(screen.getByText("2 Stockouts")).toBeInTheDocument();
    });
  });

  describe("TelemetryView Integration", () => {
    it("renders complete telemetry dashboard and handles export action", async () => {
      const storage = getOfflineStorage();
      for (const fac of UNN_PILOT_FACILITIES) {
        await storage.saveFacility(fac);
      }
      for (const pass of samplePasses) {
        await storage.saveIntakePass(pass);
      }

      // Mock anchor element click for file download
      const clickSpy = vi
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(() => {});

      render(<TelemetryView />);

      // Wait for data load
      await waitFor(() => {
        expect(
          screen.getByText("Campus Logistics Telemetry")
        ).toBeInTheDocument();
      });

      expect(screen.getByText(/Institutional Public Health Feed/i)).toBeInTheDocument();
      expect(screen.getByText(/Strict Non Diagnostic & Zero Student PII Boundary/i)).toBeInTheDocument();
      expect(screen.getByText("Total Inquiries")).toBeInTheDocument();
      expect(screen.getByText("TISHIP Coverage")).toBeInTheDocument();

      // Trigger export
      const exportButton = screen.getByRole("button", {
        name: /Export JSON Summary/i,
      });
      fireEvent.click(exportButton);

      expect(clickSpy).toHaveBeenCalled();
      expect(
        await screen.findByRole("status")
      ).toHaveTextContent(/Export downloaded: zero PII summary ready/i);

      clickSpy.mockRestore();
    });
  });
});
