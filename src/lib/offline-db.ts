import {
  CareCategory,
  CrowdToken,
  Facility,
  IntakePass,
  UNN_PILOT_FACILITIES,
} from "@/types";

const DB_NAME = "medway_offline_v1";
const DB_VERSION = 1;

interface OfflineStorageAdapter {
  getAllFacilities(): Promise<Facility[]>;
  getFacilityById(id: string): Promise<Facility | null>;
  saveFacility(facility: Facility): Promise<void>;
  saveIntakePass(pass: IntakePass): Promise<void>;
  getIntakePassByCode(passCode: string): Promise<IntakePass | null>;
  getAllIntakePasses(): Promise<IntakePass[]>;
  saveCrowdToken(token: CrowdToken): Promise<void>;
  getActiveCrowdTokens(facilityId?: string, nowMs?: number): Promise<CrowdToken[]>;
  getCrowdTokenByCode(tokenCode: string): Promise<CrowdToken | null>;
  clear(): Promise<void>;
}

// In-memory fallback adapter for test and server environments
class MemoryStorageAdapter implements OfflineStorageAdapter {
  private facilities = new Map<string, Facility>();
  private intakePasses = new Map<string, IntakePass>();
  private crowdTokens = new Map<string, CrowdToken>();

  async getAllFacilities(): Promise<Facility[]> {
    return Array.from(this.facilities.values());
  }

  async getFacilityById(id: string): Promise<Facility | null> {
    return this.facilities.get(id) ?? null;
  }

  async saveFacility(facility: Facility): Promise<void> {
    this.facilities.set(facility.id, facility);
  }

  async saveIntakePass(pass: IntakePass): Promise<void> {
    this.intakePasses.set(pass.passCode, pass);
  }

  async getIntakePassByCode(passCode: string): Promise<IntakePass | null> {
    return this.intakePasses.get(passCode) ?? null;
  }

  async getAllIntakePasses(): Promise<IntakePass[]> {
    return Array.from(this.intakePasses.values());
  }

  async saveCrowdToken(token: CrowdToken): Promise<void> {
    this.crowdTokens.set(token.tokenCode, token);
  }

  async getActiveCrowdTokens(
    facilityId?: string,
    nowMs: number = Date.now()
  ): Promise<CrowdToken[]> {
    const list = Array.from(this.crowdTokens.values()).filter(
      (t) => t.expiresAt > nowMs
    );
    if (facilityId) {
      return list.filter((t) => t.facilityId === facilityId);
    }
    return list;
  }

  async getCrowdTokenByCode(tokenCode: string): Promise<CrowdToken | null> {
    const direct = this.crowdTokens.get(tokenCode);
    if (direct) return direct;
    const lower = tokenCode.toLowerCase();
    for (const [key, val] of this.crowdTokens.entries()) {
      if (key.toLowerCase() === lower) return val;
    }
    return null;
  }

  async clear(): Promise<void> {
    this.facilities.clear();
    this.intakePasses.clear();
    this.crowdTokens.clear();
  }
}

// Browser IndexedDB adapter
class IndexedDBAdapter implements OfflineStorageAdapter {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private open(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("facilities")) {
          const store = db.createObjectStore("facilities", { keyPath: "id" });
          store.createIndex("slug", "slug", { unique: true });
        }

        if (!db.objectStoreNames.contains("intake_passes")) {
          const store = db.createObjectStore("intake_passes", {
            keyPath: "passCode",
          });
          store.createIndex("facilityId", "facilityId", { unique: false });
        }

        if (!db.objectStoreNames.contains("crowd_tokens")) {
          const store = db.createObjectStore("crowd_tokens", {
            keyPath: "tokenCode",
          });
          store.createIndex("facilityId", "facilityId", { unique: false });
          store.createIndex("expiresAt", "expiresAt", { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  async getAllFacilities(): Promise<Facility[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("facilities", "readonly");
      const store = tx.objectStore("facilities");
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as Facility[]) || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getFacilityById(id: string): Promise<Facility | null> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("facilities", "readonly");
      const store = tx.objectStore("facilities");
      const req = store.get(id);
      req.onsuccess = () => resolve((req.result as Facility) || null);
      req.onerror = () => reject(req.error);
    });
  }

  async saveFacility(facility: Facility): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("facilities", "readwrite");
      const store = tx.objectStore("facilities");
      const req = store.put(facility);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async saveIntakePass(pass: IntakePass): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("intake_passes", "readwrite");
      const store = tx.objectStore("intake_passes");
      const req = store.put(pass);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getIntakePassByCode(passCode: string): Promise<IntakePass | null> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("intake_passes", "readonly");
      const store = tx.objectStore("intake_passes");
      const req = store.get(passCode);
      req.onsuccess = () => resolve((req.result as IntakePass) || null);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllIntakePasses(): Promise<IntakePass[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("intake_passes", "readonly");
      const store = tx.objectStore("intake_passes");
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as IntakePass[]) || []);
      req.onerror = () => reject(req.error);
    });
  }

  async saveCrowdToken(token: CrowdToken): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("crowd_tokens", "readwrite");
      const store = tx.objectStore("crowd_tokens");
      const req = store.put(token);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getActiveCrowdTokens(
    facilityId?: string,
    nowMs: number = Date.now()
  ): Promise<CrowdToken[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("crowd_tokens", "readonly");
      const store = tx.objectStore("crowd_tokens");
      const req = store.getAll();
      req.onsuccess = () => {
        const all = (req.result as CrowdToken[]) || [];
        const active = all.filter((t) => t.expiresAt > nowMs);
        if (facilityId) {
          resolve(active.filter((t) => t.facilityId === facilityId));
        } else {
          resolve(active);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getCrowdTokenByCode(tokenCode: string): Promise<CrowdToken | null> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("crowd_tokens", "readonly");
      const store = tx.objectStore("crowd_tokens");
      const req = store.get(tokenCode);
      req.onsuccess = () => resolve((req.result as CrowdToken) || null);
      req.onerror = () => reject(req.error);
    });
  }

  async clear(): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(
        ["facilities", "intake_passes", "crowd_tokens"],
        "readwrite"
      );
      tx.objectStore("facilities").clear();
      tx.objectStore("intake_passes").clear();
      tx.objectStore("crowd_tokens").clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

// Select appropriate adapter based on environment
function createStorageAdapter(): OfflineStorageAdapter {
  if (typeof window !== "undefined" && typeof indexedDB !== "undefined") {
    return new IndexedDBAdapter();
  }
  return new MemoryStorageAdapter();
}

let storageInstance: OfflineStorageAdapter | null = null;

export function getOfflineStorage(): OfflineStorageAdapter {
  if (!storageInstance) {
    storageInstance = createStorageAdapter();
  }
  return storageInstance;
}

// Initialize and seed default UNN data if empty
export async function seedInitialData(force = false): Promise<void> {
  const storage = getOfflineStorage();
  const existing = await storage.getAllFacilities();

  if (existing.length === 0 || force) {
    for (const facility of UNN_PILOT_FACILITIES) {
      await storage.saveFacility({
        id: facility.id,
        slug: facility.slug,
        name: facility.name,
        facilityType: facility.facilityType,
        isCampusClinic: facility.isCampusClinic,
        isVerified: facility.isVerified,
        distanceMeters: facility.distanceMeters,
        currentQueue: facility.currentQueue,
        priceLabel: facility.priceLabel,
        tishipCovered: facility.tishipCovered,
        stock: { ...facility.stock } as Record<CareCategory, boolean>,
      });
    }
  }
}
