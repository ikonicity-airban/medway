import {
  CareCategory,
  CrowdToken,
  IntakePass,
  IntakePassSchema,
  QueueLevel,
} from "@/types";

export interface CreateIntakePassInput {
  facilityId: string;
  facilityName: string;
  category: CareCategory;
  allergies?: string;
  tishipCovered: boolean;
  redFlagsCleared: boolean;
  isCampusClinic?: boolean;
  prescriptionImage?: string;
  pharmacistNotes?: string;
}

export interface CreateCrowdTokenInput {
  facilityId: string;
  reportedQueue: QueueLevel;
  passId?: string;
  nowMs?: number;
}

// Generate an intake pass code adhering to MW-UNN-XXX format
export function generatePassCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // excludes ambiguous characters like 0, O, 1, I
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    suffix += chars[randomIndex];
  }
  return `MW-UNN-${suffix}`;
}

// Generate a random unique crowd telemetry token code
export function generateTokenCode(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let suffix = "";
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    suffix += chars[randomIndex];
  }
  return `CT-UNN-${suffix}`;
}

// Create and validate a digital student intake pass
export function createIntakePass(input: CreateIntakePassInput): IntakePass {
  // Safety Invariant: Emergency red flag patients cannot route to retail pharmacies
  if (!input.redFlagsCleared && !input.isCampusClinic) {
    throw new Error(
      "Emergency red flag detected: routing to commercial pharmacies is prohibited. Student must seek emergency care at UNN Medical Centre or hospital casualty immediately."
    );
  }

  const pass: IntakePass = {
    passCode: generatePassCode(),
    timestamp: new Date().toISOString(),
    facilityId: input.facilityId,
    facilityName: input.facilityName,
    category: input.category,
    allergies: input.allergies?.trim() || "None",
    tishipCovered: input.tishipCovered,
    redFlagsCleared: input.redFlagsCleared,
    prescriptionImage: input.prescriptionImage,
    pharmacistNotes: input.pharmacistNotes,
  };

  return IntakePassSchema.parse(pass);
}

// Create a crowd telemetry check in token with 30 minute time to live
export function createCrowdToken(input: CreateCrowdTokenInput): CrowdToken {
  const createdAt = input.nowMs ?? Date.now();
  const tokenTtlMs = 30 * 60 * 1000; // 30 minutes in milliseconds

  return {
    id: crypto.randomUUID(),
    tokenCode: generateTokenCode(),
    passId: input.passId,
    facilityId: input.facilityId,
    reportedQueue: input.reportedQueue,
    isVerified: false,
    expiresAt: createdAt + tokenTtlMs,
    createdAt,
  };
}

// Validate whether a crowd token is still active within its 30 minute window
export function isCrowdTokenValid(
  token: CrowdToken,
  nowMs: number = Date.now()
): boolean {
  return nowMs < token.expiresAt;
}

// Mark a crowd telemetry token as verified by a partner pharmacy counter
export function verifyCrowdToken(token: CrowdToken): CrowdToken {
  return {
    ...token,
    isVerified: true,
  };
}

// Calculate the consensus queue level from active tokens
export function calculateAggregatedQueue(
  tokens: CrowdToken[],
  fallbackQueue: QueueLevel,
  nowMs: number = Date.now()
): QueueLevel {
  const activeTokens = tokens.filter((t) => isCrowdTokenValid(t, nowMs));

  if (activeTokens.length === 0) {
    return fallbackQueue;
  }

  const weights: Record<QueueLevel, number> = {
    low: 0,
    moderate: 0,
    high: 0,
  };

  for (const token of activeTokens) {
    // Verified partner scans carry double the weight of unverified submissions
    const weight = token.isVerified ? 2 : 1;
    weights[token.reportedQueue] += weight;
  }

  if (weights.high >= weights.moderate && weights.high >= weights.low && weights.high > 0) {
    return "high";
  }
  if (weights.moderate >= weights.low && weights.moderate > 0) {
    return "moderate";
  }
  return "low";
}

// Format an intake pass into a clean plain text summary for clipboard or SMS sharing
export function formatPassText(pass: IntakePass): string {
  const dateStr = new Date(pass.timestamp).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const lines = [
    "MEDWAY STUDENT INTAKE PASS",
    `Pass Code: ${pass.passCode}`,
    `Facility: ${pass.facilityName}`,
    `Care Category: ${pass.category}`,
    `Declared Allergies: ${pass.allergies}`,
    `TISHIP Status: ${pass.tishipCovered ? "₦0 Covered" : "Retail Care"}`,
    `Generated: ${dateStr}`,
  ];

  if (pass.prescriptionImage) {
    lines.push("Prescription: Doctor Written Rx Attached");
  }

  if (pass.pharmacistNotes) {
    lines.push(`Pharmacist Decoded Notes: ${pass.pharmacistNotes}`);
  }

  lines.push("---");
  lines.push("Note: Present this code upon arrival. Not a prescription.");
  return lines.join("\n");
}
