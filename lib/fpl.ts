/**
 * Federal Poverty Level (FPL) 2024 Guidelines
 * Source: HHS Poverty Guidelines
 * Base: $15,060 for 1 person, +$5,380 per additional person
 */

const FPL_BASE = 15060;
const FPL_INCREMENT = 5380;

export function getFPL(householdSize: number): number {
  if (householdSize < 1) return FPL_BASE;
  return FPL_BASE + FPL_INCREMENT * (householdSize - 1);
}

export function getMonthlyFPL(householdSize: number): number {
  return Math.round(getFPL(householdSize) / 12);
}

export function getIncomeAsPctFPL(annualIncome: number, householdSize: number): number {
  return Math.round((annualIncome / getFPL(householdSize)) * 100);
}

export function getMonthlyIncomeAsPctFPL(monthlyIncome: number, householdSize: number): number {
  return getIncomeAsPctFPL(monthlyIncome * 12, householdSize);
}

/** SNAP gross income limits (130% FPL) by household size */
export const SNAP_GROSS_INCOME_LIMITS: Record<number, number> = {
  1: 1580, 2: 2137, 3: 2694, 4: 3250,
  5: 3807, 6: 4364, 7: 4921, 8: 5478,
};

/** SNAP maximum monthly allotment by household size (FY2024) */
export const SNAP_MAX_BENEFITS: Record<number, number> = {
  1: 292, 2: 536, 3: 768, 4: 975,
  5: 1158, 6: 1390, 7: 1536, 8: 1756,
};

/** For household sizes > 8, add per additional member */
export const SNAP_ADDITIONAL_MEMBER_INCOME = 557;
export const SNAP_ADDITIONAL_MEMBER_BENEFIT = 220;
