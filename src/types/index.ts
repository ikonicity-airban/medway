import { z } from "zod";

// 1. Enum Schemas and Types
export const QueueLevelSchema = z.enum(["low", "moderate", "high"]);
export type QueueLevel = z.infer<typeof QueueLevelSchema>;

export const CareCategorySchema = z.enum([
  "Antimalarials (ACT)",
  "Analgesics & Fever",
  "Typhoid / Lab Test",
  "ORS & Hydration",
]);
export type CareCategory = z.infer<typeof CareCategorySchema>;

export const CARE_CATEGORIES: readonly CareCategory[] = [
  "Antimalarials (ACT)",
  "Analgesics & Fever",
  "Typhoid / Lab Test",
  "ORS & Hydration",
] as const;

// 2. Database Row Schemas (reflecting PostgreSQL snake_case columns)
export const FacilityDbRowSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  facility_type: z.string(),
  is_campus_clinic: z.boolean(),
  is_verified: z.boolean(),
  distance_meters: z.number().int().nonnegative(),
  current_queue: QueueLevelSchema,
  price_label: z.string(),
  tiship_covered: z.boolean(),
  last_queue_update: z.string(),
  created_at: z.string(),
});
export type FacilityDbRow = z.infer<typeof FacilityDbRowSchema>;

export const FacilityStockDbRowSchema = z.object({
  id: z.string().uuid(),
  facility_id: z.string().uuid(),
  category: CareCategorySchema,
  in_stock: z.boolean(),
  updated_at: z.string(),
});
export type FacilityStockDbRow = z.infer<typeof FacilityStockDbRowSchema>;

export const IntakePassDbRowSchema = z.object({
  id: z.string().uuid(),
  pass_code: z.string().regex(/^MW-UNN-[A-Z0-9]{3,6}$/),
  facility_id: z.string().uuid(),
  category: CareCategorySchema,
  allergies_declared: z.string().max(256),
  tiship_applied: z.boolean(),
  red_flags_cleared: z.boolean(),
  prescription_image: z.string().optional(),
  pharmacist_notes: z.string().optional(),
  created_at: z.string(),
});
export type IntakePassDbRow = z.infer<typeof IntakePassDbRowSchema>;

export const CrowdTokenDbRowSchema = z.object({
  id: z.string().uuid(),
  token_code: z.string(),
  pass_id: z.string().uuid().nullable(),
  facility_id: z.string().uuid(),
  reported_queue: QueueLevelSchema,
  is_verified: z.boolean(),
  expires_at: z.string(),
  created_at: z.string(),
});
export type CrowdTokenDbRow = z.infer<typeof CrowdTokenDbRowSchema>;

// 3. Domain Model Schemas (used in application state and client operations)
export const FacilityStockMapSchema = z.record(CareCategorySchema, z.boolean());
export type FacilityStockMap = z.infer<typeof FacilityStockMapSchema>;

export const FacilitySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  facilityType: z.string(),
  isCampusClinic: z.boolean(),
  isVerified: z.boolean(),
  distanceMeters: z.number().int().nonnegative(),
  currentQueue: QueueLevelSchema,
  priceLabel: z.string(),
  tishipCovered: z.boolean(),
  stock: FacilityStockMapSchema,
  lastQueueUpdate: z.number().optional(),
});
export type Facility = z.infer<typeof FacilitySchema>;

export const IntakePassSchema = z.object({
  id: z.string().uuid().optional(),
  passCode: z.string().regex(/^MW-UNN-[A-Z0-9]{3,6}$/),
  timestamp: z.string(),
  facilityId: z.string().uuid(),
  facilityName: z.string(),
  category: CareCategorySchema,
  allergies: z.string().max(256),
  tishipCovered: z.boolean(),
  redFlagsCleared: z.boolean(),
  prescriptionImage: z.string().optional(),
  pharmacistNotes: z.string().optional(),
});
export type IntakePass = z.infer<typeof IntakePassSchema>;

export const CrowdTokenSchema = z.object({
  id: z.string().uuid(),
  tokenCode: z.string(),
  passId: z.string().uuid().optional(),
  facilityId: z.string().uuid(),
  reportedQueue: QueueLevelSchema,
  isVerified: z.boolean(),
  expiresAt: z.number(),
  createdAt: z.number(),
});
export type CrowdToken = z.infer<typeof CrowdTokenSchema>;

// 4. Canonical Pilot Data for University of Nigeria Nsukka (UNN)
export const UNN_PILOT_FACILITIES: readonly Facility[] = [
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
    currentQueue: "low",
    priceLabel: "₦1,500 - ₦3,500",
    tishipCovered: false,
    stock: {
      "Antimalarials (ACT)": true,
      "Analgesics & Fever": true,
      "Typhoid / Lab Test": false,
      "ORS & Hydration": true,
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    slug: "hilltop-care-pharmacy",
    name: "Hilltop Care & Meds Pharmacy",
    facilityType: "Community Pharmacy",
    isCampusClinic: false,
    isVerified: true,
    distanceMeters: 950,
    currentQueue: "moderate",
    priceLabel: "₦1,200 - ₦3,000",
    tishipCovered: false,
    stock: {
      "Antimalarials (ACT)": true,
      "Analgesics & Fever": true,
      "Typhoid / Lab Test": true,
      "ORS & Hydration": false,
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    slug: "ogige-central-pharmacy",
    name: "Ogige Central Pharmacy",
    facilityType: "Community Pharmacy",
    isCampusClinic: false,
    isVerified: true,
    distanceMeters: 1800,
    currentQueue: "low",
    priceLabel: "₦1,000 - ₦2,800",
    tishipCovered: false,
    stock: {
      "Antimalarials (ACT)": true,
      "Analgesics & Fever": true,
      "Typhoid / Lab Test": true,
      "ORS & Hydration": true,
    },
  },
] as const;

// 5. Database to Domain Mapper
export function mapFacilityDbRowToFacility(
  row: FacilityDbRow,
  stockRows: FacilityStockDbRow[] = []
): Facility {
  const stock: Record<CareCategory, boolean> = {
    "Antimalarials (ACT)": false,
    "Analgesics & Fever": false,
    "Typhoid / Lab Test": false,
    "ORS & Hydration": false,
  };

  for (const s of stockRows) {
    if (s.facility_id === row.id) {
      stock[s.category] = s.in_stock;
    }
  }

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    facilityType: row.facility_type,
    isCampusClinic: row.is_campus_clinic,
    isVerified: row.is_verified,
    distanceMeters: row.distance_meters,
    currentQueue: row.current_queue,
    priceLabel: row.price_label,
    tishipCovered: row.tiship_covered,
    stock,
    lastQueueUpdate: new Date(row.last_queue_update).getTime(),
  };
}
