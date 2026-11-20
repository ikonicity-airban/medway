import { describe, expect, it } from "vitest";
import {
  calculateAggregatedQueue,
  createCrowdToken,
  createIntakePass,
  generatePassCode,
  isCrowdTokenValid,
  verifyCrowdToken,
} from "./intake-pass";

describe("Intake Pass and Telemetry Logic", () => {
  const unnClinicId = "00000000-0000-0000-0000-000000000001";
  const commercialPharmacyId = "00000000-0000-0000-0000-000000000002";

  describe("generatePassCode", () => {
    it("generates a pass code matching the MW-UNN-XXX format", () => {
      const code = generatePassCode();
      expect(code).toMatch(/^MW-UNN-[A-Z0-9]{3,6}$/);
    });

    it("generates distinct codes on consecutive calls", () => {
      const code1 = generatePassCode();
      const code2 = generatePassCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe("createIntakePass", () => {
    it("successfully creates an intake pass for campus clinic", () => {
      const pass = createIntakePass({
        facilityId: unnClinicId,
        facilityName: "UNN Medical Centre",
        category: "Antimalarials (ACT)",
        allergies: "Penicillin",
        tishipCovered: true,
        redFlagsCleared: true,
        isCampusClinic: true,
      });

      expect(pass.passCode).toMatch(/^MW-UNN-[A-Z0-9]{3,6}$/);
      expect(pass.facilityId).toBe(unnClinicId);
      expect(pass.allergies).toBe("Penicillin");
      expect(pass.tishipCovered).toBe(true);
      expect(pass.redFlagsCleared).toBe(true);
      expect(pass.timestamp).toBeDefined();
    });

    it("defaults allergies to None when omitted or blank", () => {
      const pass = createIntakePass({
        facilityId: commercialPharmacyId,
        facilityName: "Odim Gate Pharmacy",
        category: "Analgesics & Fever",
        tishipCovered: false,
        redFlagsCleared: true,
        isCampusClinic: false,
      });

      expect(pass.allergies).toBe("None");
    });

    it("prohibits routing to commercial pharmacy when red flags are detected", () => {
      expect(() =>
        createIntakePass({
          facilityId: commercialPharmacyId,
          facilityName: "Odim Gate Pharmacy",
          category: "Analgesics & Fever",
          tishipCovered: false,
          redFlagsCleared: false,
          isCampusClinic: false,
        })
      ).toThrowError(/Emergency red flag detected/);
    });

    it("allows campus clinic routing when red flags are present", () => {
      const pass = createIntakePass({
        facilityId: unnClinicId,
        facilityName: "UNN Medical Centre",
        category: "Analgesics & Fever",
        tishipCovered: true,
        redFlagsCleared: false,
        isCampusClinic: true,
      });

      expect(pass.facilityId).toBe(unnClinicId);
      expect(pass.redFlagsCleared).toBe(false);
    });
  });

  describe("Crowd Telemetry Tokens", () => {
    const baseTime = 1700000000000;

    it("creates a crowd token with exactly 30 minutes time to live", () => {
      const token = createCrowdToken({
        facilityId: unnClinicId,
        reportedQueue: "low",
        nowMs: baseTime,
      });

      expect(token.tokenCode).toMatch(/^CT-UNN-[a-z0-9]{16}$/);
      expect(token.facilityId).toBe(unnClinicId);
      expect(token.reportedQueue).toBe("low");
      expect(token.isVerified).toBe(false);
      expect(token.createdAt).toBe(baseTime);
      expect(token.expiresAt).toBe(baseTime + 30 * 60 * 1000);
    });

    it("validates token within the 30 minute window", () => {
      const token = createCrowdToken({
        facilityId: unnClinicId,
        reportedQueue: "moderate",
        nowMs: baseTime,
      });

      // 10 minutes later -> valid
      expect(isCrowdTokenValid(token, baseTime + 10 * 60 * 1000)).toBe(true);
      // 29 minutes later -> valid
      expect(isCrowdTokenValid(token, baseTime + 29 * 60 * 1000)).toBe(true);
      // 31 minutes later -> expired
      expect(isCrowdTokenValid(token, baseTime + 31 * 60 * 1000)).toBe(false);
    });

    it("verifies a token on partner counter check in", () => {
      const token = createCrowdToken({
        facilityId: unnClinicId,
        reportedQueue: "high",
        nowMs: baseTime,
      });

      expect(token.isVerified).toBe(false);
      const verified = verifyCrowdToken(token);
      expect(verified.isVerified).toBe(true);
    });

    it("calculates aggregated queue from active weighted tokens", () => {
      const token1 = createCrowdToken({
        facilityId: unnClinicId,
        reportedQueue: "high",
        nowMs: baseTime,
      });
      const verifiedToken = verifyCrowdToken(token1);

      const token2 = createCrowdToken({
        facilityId: unnClinicId,
        reportedQueue: "low",
        nowMs: baseTime,
      });

      // high has weight 2 (verified), low has weight 1 (unverified)
      const queue = calculateAggregatedQueue([verifiedToken, token2], "moderate", baseTime + 5000);
      expect(queue).toBe("high");
    });

    it("returns fallback queue level when all tokens are expired", () => {
      const expiredToken = createCrowdToken({
        facilityId: unnClinicId,
        reportedQueue: "high",
        nowMs: baseTime,
      });

      const queue = calculateAggregatedQueue(
        [expiredToken],
        "low",
        baseTime + 60 * 60 * 1000
      );
      expect(queue).toBe("low");
    });
  });
});
