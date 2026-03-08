import {
  getMonthlyIncomeAsPctFPL,
  SNAP_GROSS_INCOME_LIMITS,
  SNAP_MAX_BENEFITS,
  SNAP_ADDITIONAL_MEMBER_INCOME,
  SNAP_ADDITIONAL_MEMBER_BENEFIT,
  getMonthlyFPL,
} from "./fpl";

export interface UserInput {
  zip: string;
  householdSize: number;
  monthlyIncome: number;
  age?: number;
  hasChildren?: boolean;
  childrenAges?: number[];
  isPregnant?: boolean;
  isDisabled?: boolean;
  isElderly?: boolean;
  isCitizen?: boolean;
}

export interface BenefitResult {
  programId: string;
  programName: string;
  programType: string;
  eligible: boolean;
  estimatedMonthlyBenefit: number | null;
  confidence: "high" | "medium" | "low";
  applicationUrl: string;
  description: string;
  nextSteps: string;
  icon: string;
}

function getSnapGrossLimit(size: number): number {
  if (size <= 8) return SNAP_GROSS_INCOME_LIMITS[size] || 5478;
  return 5478 + SNAP_ADDITIONAL_MEMBER_INCOME * (size - 8);
}

function getSnapMaxBenefit(size: number): number {
  if (size <= 8) return SNAP_MAX_BENEFITS[size] || 1756;
  return 1756 + SNAP_ADDITIONAL_MEMBER_BENEFIT * (size - 8);
}

function estimateSnapBenefit(monthlyIncome: number, householdSize: number): number {
  const maxBenefit = getSnapMaxBenefit(householdSize);
  // Standard deduction varies by household size
  const standardDeduction = householdSize <= 3 ? 198 : householdSize <= 5 ? 228 : 261;
  // 20% earned income deduction
  const earnedIncomeDeduction = monthlyIncome * 0.2;
  const adjustedIncome = Math.max(0, monthlyIncome - standardDeduction - earnedIncomeDeduction);
  // 30% of adjusted income expected to go to food
  const expectedContribution = adjustedIncome * 0.3;
  const benefit = Math.max(0, Math.round(maxBenefit - expectedContribution));
  // Minimum benefit for 1-2 person households
  if (householdSize <= 2 && benefit > 0 && benefit < 23) return 23;
  return benefit;
}

export function calculateBenefits(input: UserInput): BenefitResult[] {
  const results: BenefitResult[] = [];
  const pctFPL = getMonthlyIncomeAsPctFPL(input.monthlyIncome, input.householdSize);
  const isIllinois = input.zip.startsWith("60") || input.zip.startsWith("61") || input.zip.startsWith("62");

  // --- SNAP ---
  const snapGrossLimit = getSnapGrossLimit(input.householdSize);
  const snapEligible = input.monthlyIncome <= snapGrossLimit;
  const snapBenefit = snapEligible ? estimateSnapBenefit(input.monthlyIncome, input.householdSize) : 0;
  
  results.push({
    programId: "snap",
    programName: "SNAP (Food Stamps)",
    programType: "Federal",
    eligible: snapEligible,
    estimatedMonthlyBenefit: snapEligible ? snapBenefit : null,
    confidence: "high",
    applicationUrl: isIllinois
      ? "https://abe.illinois.gov/abe/access/"
      : "https://www.fns.usda.gov/snap/state-directory",
    description: "Monthly funds loaded onto an EBT card to buy groceries at authorized retailers.",
    nextSteps: isIllinois
      ? "Apply online at ABE (Application for Benefits Eligibility) or visit your local IDHS office."
      : "Apply through your state's SNAP office.",
    icon: "🛒",
  });

  // --- WIC ---
  const hasWicEligibleChildren = !!(input.hasChildren && (input.childrenAges?.some(a => a < 5) ?? true));
  const wicEligible = !!(pctFPL <= 185 && (input.isPregnant || hasWicEligibleChildren));

  results.push({
    programId: "wic",
    programName: "WIC (Women, Infants & Children)",
    programType: "Federal",
    eligible: wicEligible,
    estimatedMonthlyBenefit: wicEligible ? 75 : null,
    confidence: "medium",
    applicationUrl: isIllinois
      ? "https://www.dhs.state.il.us/page.aspx?item=30513"
      : "https://www.fns.usda.gov/wic/wic-how-apply",
    description:
      "Nutrition assistance for pregnant/postpartum women, infants, and children under 5. Covers formula, milk, eggs, fruits, vegetables, and more.",
    nextSteps: "Contact your local WIC clinic to schedule a certification appointment.",
    icon: "🍎",
  });

  // --- Medicaid ---
  const medicaidThreshold = input.hasChildren || input.isPregnant ? 213 : input.isElderly || input.isDisabled ? 100 : 138;
  const medicaidEligible = !!(pctFPL <= medicaidThreshold);

  results.push({
    programId: "medicaid",
    programName: isIllinois ? "Medicaid / All Kids" : "Medicaid",
    programType: "Federal/State",
    eligible: medicaidEligible,
    estimatedMonthlyBenefit: null,
    confidence: medicaidEligible ? "high" : "medium",
    applicationUrl: isIllinois
      ? "https://abe.illinois.gov/abe/access/"
      : "https://www.healthcare.gov/medicaid-chip/",
    description: "Free or low-cost health coverage including doctor visits, hospital stays, prescriptions, and preventive care.",
    nextSteps: isIllinois
      ? "Apply online at ABE or visit your local IDHS office. Coverage can start the same month you apply."
      : "Apply through your state Medicaid office or Healthcare.gov.",
    icon: "🏥",
  });

  // --- LIHEAP (energy assistance) ---
  const liheapEligible = !!(pctFPL <= 200);

  results.push({
    programId: "liheap",
    programName: "LIHEAP (Energy Assistance)",
    programType: "Federal",
    eligible: liheapEligible,
    estimatedMonthlyBenefit: liheapEligible ? null : null,
    confidence: "medium",
    applicationUrl: isIllinois
      ? "https://www.ceda.org/energy/"
      : "https://www.acf.hhs.gov/ocs/low-income-home-energy-assistance-program-liheap",
    description: "Help paying heating and cooling bills. One-time or seasonal payments directly to your utility company.",
    nextSteps: isIllinois
      ? "Apply through CEDA (Community and Economic Development Association) or your local community action agency."
      : "Contact your state or local LIHEAP office.",
    icon: "💡",
  });

  // --- Free/Reduced School Meals ---
  const schoolMealsEligible = !!(input.hasChildren && pctFPL <= 185);
  const freeMealsEligible = !!(input.hasChildren && pctFPL <= 130);

  if (input.hasChildren) {
    results.push({
      programId: "school-meals",
      programName: freeMealsEligible ? "Free School Meals" : "Reduced-Price School Meals",
      programType: "Federal",
      eligible: schoolMealsEligible || false,
      estimatedMonthlyBenefit: schoolMealsEligible ? (freeMealsEligible ? 150 : 120) : null,
      confidence: "medium",
      applicationUrl: "https://www.fns.usda.gov/cn/applying-free-and-reduced-price-school-meals",
      description: freeMealsEligible
        ? "Your children may qualify for FREE breakfast and lunch at school."
        : "Your children may qualify for reduced-price meals (40¢ lunch, 30¢ breakfast) at school.",
      nextSteps: "Contact your child's school or school district for an application. If you receive SNAP, your children automatically qualify.",
      icon: "🏫",
    });
  }

  // --- TANF (Cash Assistance) ---
  const tanfEligible = !!(pctFPL <= 50 && input.hasChildren);

  if (input.hasChildren) {
    results.push({
      programId: "tanf",
      programName: isIllinois ? "TANF (Temporary Assistance)" : "TANF (Cash Assistance)",
      programType: "Federal/State",
      eligible: tanfEligible || false,
      estimatedMonthlyBenefit: tanfEligible ? Math.round(input.householdSize * 120) : null,
      confidence: "low",
      applicationUrl: isIllinois
        ? "https://abe.illinois.gov/abe/access/"
        : "https://www.acf.hhs.gov/ofa/programs/temporary-assistance-needy-families-tanf",
      description: "Monthly cash assistance for families with children. Helps cover rent, utilities, and other basic needs.",
      nextSteps: "Apply online at ABE or at your local IDHS office. You'll need to participate in work activities.",
      icon: "💵",
    });
  }

  // --- Chicago-specific: Emergency Food ---
  if (isIllinois && input.zip.startsWith("606")) {
    results.push({
      programId: "chicago-food-pantries",
      programName: "Chicago Food Pantries & Food Banks",
      programType: "Local",
      eligible: true,
      estimatedMonthlyBenefit: null,
      confidence: "high",
      applicationUrl: "https://www.chicagosfoodbank.org/find-food/",
      description:
        "Free groceries available at hundreds of food pantries across Chicago. No income verification required at most locations.",
      nextSteps:
        "Visit chicagosfoodbank.org/find-food to find your nearest pantry. Most are walk-in, no appointment needed.",
      icon: "📦",
    });
  }

  return results;
}

export function getTotalEstimatedBenefits(results: BenefitResult[]): number {
  return results
    .filter((r) => r.eligible && r.estimatedMonthlyBenefit)
    .reduce((sum, r) => sum + (r.estimatedMonthlyBenefit || 0), 0);
}
