import {
  CARE_CATEGORIES,
  CareCategory,
  Facility,
  IntakePass,
  QueueLevel,
} from "@/types";

export interface CategoryMetric {
  category: CareCategory;
  count: number;
  percentage: number;
}

export interface QueueDistribution {
  low: number;
  moderate: number;
  high: number;
  lowPercentage: number;
  moderatePercentage: number;
  highPercentage: number;
  averageWaitMinutes: number;
}

export interface FacilityStockoutMetric {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  isCampusClinic: boolean;
  tishipCovered: boolean;
  currentQueue: QueueLevel;
  outOfStockCount: number;
  totalCategoriesCount: number;
  stockoutCategories: CareCategory[];
  inStockCategories: CareCategory[];
}

export interface AggregatedTelemetry {
  generatedAt: string;
  totalInquiries: number;
  tishipCoverageCount: number;
  tishipCoveragePercentage: number;
  totalStockouts: number;
  categoryMetrics: CategoryMetric[];
  queueDistribution: QueueDistribution;
  facilityMetrics: FacilityStockoutMetric[];
}

export interface AnonymizedTelemetryExport {
  reportType: "Institutional Population Health Logistics Telemetry";
  campus: "University of Nigeria, Nsukka (UNN)";
  generatedAt: string;
  summary: {
    totalRoutingInquiries: number;
    tishipEligibleInquiries: number;
    tishipEligibilityRate: string;
    totalActiveStockouts: number;
    averageQueueWaitMinutes: number;
  };
  categoryDemandDistribution: Array<{
    category: CareCategory;
    inquiriesCount: number;
    percentage: number;
  }>;
  facilityOperationalStatus: Array<{
    facilityName: string;
    facilityType: string;
    currentQueue: QueueLevel;
    stockoutsReported: number;
    tishipPartner: boolean;
  }>;
  privacyStatement: string;
}

// Fallback baseline distribution representing 120 historical campus search events
const BASELINE_SEARCH_COUNTS: Record<CareCategory, number> = {
  "Antimalarials (ACT)": 54,
  "Analgesics & Fever": 36,
  "Typhoid / Lab Test": 18,
  "ORS & Hydration": 12,
};

// Queue time approximations in minutes based on clinical observations
const QUEUE_WAIT_MINUTES: Record<QueueLevel, number> = {
  low: 10,
  moderate: 30,
  high: 60,
};

/**
 * Calculates category distribution from recorded intake passes.
 * If pass list is empty, applies deterministic baseline counts.
 */
export function calculateCategoryDistribution(
  passes: IntakePass[]
): { metrics: CategoryMetric[]; total: number } {
  const counts: Record<CareCategory, number> = {
    "Antimalarials (ACT)": 0,
    "Analgesics & Fever": 0,
    "Typhoid / Lab Test": 0,
    "ORS & Hydration": 0,
  };

  if (passes.length === 0) {
    // Use baseline distribution
    for (const cat of CARE_CATEGORIES) {
      counts[cat] = BASELINE_SEARCH_COUNTS[cat];
    }
  } else {
    for (const pass of passes) {
      if (pass.category in counts) {
        counts[pass.category] += 1;
      }
    }
  }

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  const metrics: CategoryMetric[] = CARE_CATEGORIES.map((category) => {
    const count = counts[category];
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      category,
      count,
      percentage,
    };
  });

  return { metrics, total };
}

/**
 * Calculates queue distribution across facilities.
 */
export function calculateQueueDistribution(
  facilities: Facility[]
): QueueDistribution {
  let low = 0;
  let moderate = 0;
  let high = 0;

  for (const fac of facilities) {
    if (fac.currentQueue === "low") low += 1;
    else if (fac.currentQueue === "moderate") moderate += 1;
    else if (fac.currentQueue === "high") high += 1;
  }

  const total = facilities.length;
  const lowPercentage = total > 0 ? Math.round((low / total) * 100) : 0;
  const moderatePercentage = total > 0 ? Math.round((moderate / total) * 100) : 0;
  const highPercentage = total > 0 ? Math.round((high / total) * 100) : 0;

  let totalWaitMinutes = 0;
  for (const fac of facilities) {
    totalWaitMinutes += QUEUE_WAIT_MINUTES[fac.currentQueue];
  }
  const averageWaitMinutes =
    total > 0 ? Math.round(totalWaitMinutes / total) : 15;

  return {
    low,
    moderate,
    high,
    lowPercentage,
    moderatePercentage,
    highPercentage,
    averageWaitMinutes,
  };
}

/**
 * Evaluates facility level stock availability and stockout incidents.
 */
export function calculateFacilityMetrics(
  facilities: Facility[]
): FacilityStockoutMetric[] {
  return facilities.map((facility) => {
    const stockoutCategories: CareCategory[] = [];
    const inStockCategories: CareCategory[] = [];

    for (const cat of CARE_CATEGORIES) {
      if (facility.stock[cat]) {
        inStockCategories.push(cat);
      } else {
        stockoutCategories.push(cat);
      }
    }

    return {
      facilityId: facility.id,
      facilityName: facility.name,
      facilityType: facility.facilityType,
      isCampusClinic: facility.isCampusClinic,
      tishipCovered: facility.tishipCovered,
      currentQueue: facility.currentQueue,
      outOfStockCount: stockoutCategories.length,
      totalCategoriesCount: CARE_CATEGORIES.length,
      stockoutCategories,
      inStockCategories,
    };
  });
}

/**
 * Aggregates complete population telemetry from passes and facility records.
 */
export function aggregateTelemetry(
  passes: IntakePass[],
  facilities: Facility[],
  now: Date = new Date()
): AggregatedTelemetry {
  const { metrics: categoryMetrics, total: totalInquiries } =
    calculateCategoryDistribution(passes);

  const queueDistribution = calculateQueueDistribution(facilities);
  const facilityMetrics = calculateFacilityMetrics(facilities);

  const totalStockouts = facilityMetrics.reduce(
    (sum, f) => sum + f.outOfStockCount,
    0
  );

  let tishipCoverageCount = 0;
  if (passes.length > 0) {
    tishipCoverageCount = passes.filter((p) => p.tishipCovered).length;
  } else {
    // In baseline sample, estimate 75% coverage for campus students
    tishipCoverageCount = Math.round(totalInquiries * 0.75);
  }

  const tishipCoveragePercentage =
    totalInquiries > 0
      ? Math.round((tishipCoverageCount / totalInquiries) * 100)
      : 0;

  return {
    generatedAt: now.toISOString(),
    totalInquiries,
    tishipCoverageCount,
    tishipCoveragePercentage,
    totalStockouts,
    categoryMetrics,
    queueDistribution,
    facilityMetrics,
  };
}

/**
 * Exports anonymized institutional summary enforcing zero PII invariants.
 * Strips all individual timestamps, pass codes, allergy details, and user identifiers.
 */
export function buildAnonymizedExport(
  telemetry: AggregatedTelemetry
): AnonymizedTelemetryExport {
  return {
    reportType: "Institutional Population Health Logistics Telemetry",
    campus: "University of Nigeria, Nsukka (UNN)",
    generatedAt: telemetry.generatedAt,
    summary: {
      totalRoutingInquiries: telemetry.totalInquiries,
      tishipEligibleInquiries: telemetry.tishipCoverageCount,
      tishipEligibilityRate: `${telemetry.tishipCoveragePercentage}%`,
      totalActiveStockouts: telemetry.totalStockouts,
      averageQueueWaitMinutes: telemetry.queueDistribution.averageWaitMinutes,
    },
    categoryDemandDistribution: telemetry.categoryMetrics.map((c) => ({
      category: c.category,
      inquiriesCount: c.count,
      percentage: c.percentage,
    })),
    facilityOperationalStatus: telemetry.facilityMetrics.map((f) => ({
      facilityName: f.facilityName,
      facilityType: f.facilityType,
      currentQueue: f.currentQueue,
      stockoutsReported: f.outOfStockCount,
      tishipPartner: f.tishipCovered,
    })),
    privacyStatement:
      "Deterministic aggregation with zero student PII, zero device identifiers, zero IP addresses, and zero clinical diagnoses.",
  };
}
