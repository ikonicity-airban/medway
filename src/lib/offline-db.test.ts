import { beforeEach, describe, expect, it } from "vitest";
import { createCrowdToken, createIntakePass } from "./intake-pass";
import { getOfflineStorage, seedInitialData } from "./offline-db";

describe("Offline Storage and Persistence Layer", () => {
  const storage = getOfflineStorage();
  const unnClinicId = "00000000-0000-0000-0000-000000000001";

  beforeEach(async () => {
    await storage.clear();
  });

  it("seeds the 4 UNN pilot facilities when storage is empty", async () => {
    const initial = await storage.getAllFacilities();
    expect(initial).toHaveLength(0);

    await seedInitialData();

    const facilities = await storage.getAllFacilities();
    expect(facilities).toHaveLength(4);

    const unnClinic = await storage.getFacilityById(unnClinicId);
    expect(unnClinic).not.toBeNull();
    expect(unnClinic?.name).toBe("UNN Medical Centre");
    expect(unnClinic?.isCampusClinic).toBe(true);
    expect(unnClinic?.tishipCovered).toBe(true);
    expect(unnClinic?.stock["Antimalarials (ACT)"]).toBe(true);
  });

  it("persists and retrieves digital student intake passes", async () => {
    await seedInitialData();

    const pass = createIntakePass({
      facilityId: unnClinicId,
      facilityName: "UNN Medical Centre",
      category: "Antimalarials (ACT)",
      allergies: "Sulfonamides",
      tishipCovered: true,
      redFlagsCleared: true,
      isCampusClinic: true,
    });

    await storage.saveIntakePass(pass);

    const retrieved = await storage.getIntakePassByCode(pass.passCode);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.passCode).toBe(pass.passCode);
    expect(retrieved?.allergies).toBe("Sulfonamides");

    const allPasses = await storage.getAllIntakePasses();
    expect(allPasses).toHaveLength(1);
  });

  it("persists and filters crowd telemetry tokens by expiration", async () => {
    const now = 1700000000000;

    const activeToken = createCrowdToken({
      facilityId: unnClinicId,
      reportedQueue: "low",
      nowMs: now,
    });

    const expiredToken = createCrowdToken({
      facilityId: unnClinicId,
      reportedQueue: "high",
      nowMs: now - 35 * 60 * 1000, // 35 minutes ago -> expired
    });

    await storage.saveCrowdToken(activeToken);
    await storage.saveCrowdToken(expiredToken);

    const activeList = await storage.getActiveCrowdTokens(unnClinicId, now);
    expect(activeList).toHaveLength(1);
    expect(activeList[0].tokenCode).toBe(activeToken.tokenCode);

    const singleLookup = await storage.getCrowdTokenByCode(activeToken.tokenCode);
    expect(singleLookup?.tokenCode).toBe(activeToken.tokenCode);
  });
});
