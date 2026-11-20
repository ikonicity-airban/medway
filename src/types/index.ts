import { z } from "zod";

export const QueueLevelSchema = z.enum(["low", "moderate", "high"]);
export type QueueLevel = z.infer<typeof QueueLevelSchema>;

export const CareCategorySchema = z.enum([
  "Antimalarials (ACT)",
  "Analgesics & Fever",
  "Typhoid / Lab Test",
  "ORS & Hydration",
]);
export type CareCategory = z.infer<typeof CareCategorySchema>;

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
  stock: z.record(CareCategorySchema, z.boolean()),
  lastQueueUpdate: z.number().optional(),
});
export type Facility = z.infer<typeof FacilitySchema>;

export const IntakePassSchema = z.object({
  passCode: z.string().regex(/^MW-UNN-[A-Z0-9]{3,6}$/),
  timestamp: z.string(),
  facilityId: z.string().uuid(),
  facilityName: z.string(),
  category: CareCategorySchema,
  allergies: z.string().max(256),
  tishipCovered: z.boolean(),
  redFlagsCleared: z.boolean(),
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
