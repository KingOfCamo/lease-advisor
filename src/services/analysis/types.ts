export type ClauseRating = "LANDLORD_FRIENDLY" | "TENANT_FRIENDLY" | "BALANCED";
export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Severity = "HIGH" | "MEDIUM" | "LOW";

export interface ClauseScore {
  clauseName: string;
  rating: ClauseRating;
  explanation: string;
  recommendation: string;
  estimatedImpactPA: number;
  weight: number;
}

export interface Recommendation {
  title: string;
  description: string;
  estimatedAnnualImpact: number;
  priority: Priority;
}

export interface RiskFlag {
  flag: string;
  severity: Severity;
  detail: string;
}

export interface RetailLeaseIssue {
  section: string;
  issue: string;
  detail: string;
}

export interface MarketBenchmark {
  rentPSQM: { low: number; median: number; high: number };
  typicalIncentive: string;
  typicalReview: string;
}

export interface Comparable {
  address: string;
  suburb: string;
  propertyType: string;
  nla: number;
  rentPSQM: number;
  leaseTerm: string;
  reviewType: string;
}

export interface AnalysisResult {
  overallLandlordScore: number;
  overallTenantScore: number;
  clauseAnalysis: ClauseScore[];
  topRecommendations: Recommendation[];
  totalEstimatedAnnualImpact: number;
  riskFlags: RiskFlag[];
  retailLeasesActIssues: RetailLeaseIssue[];
  marketContext: {
    benchmarks: MarketBenchmark;
    comparables: Comparable[];
  };
}

export interface LeaseWithRelations {
  id: string;
  clientId: string;
  client: {
    id: string;
    businessName: string;
    clientType: string;
  };
  property: {
    id: string;
    address: string;
    suburb: string;
    state: string;
    postcode: string;
    propertyType: string;
    nla: number;
    propertyGrade: string | null;
    isRetailLease: boolean;
  };
  leaseName: string;
  tenantName: string;
  landlordName: string;
  commencementDate: Date;
  expiryDate: Date;
  totalTermMonths: number;
  optionsToRenew: string | null;
  baseRentPA: number;
  baseRentPSQM: number | null;
  rentReviewMechanism: string;
  rentReviewDetail: string | null;
  rentReviewFrequencyMonths: number;
  hasRatchetClause: boolean;
  outgoingsStructure: string;
  outgoingsDetail: string | null;
  outgoingsEstimatePA: number | null;
  permittedUse: string | null;
  makeGoodObligations: string | null;
  fitoutContribution: number | null;
  rentFreePeriodMonths: number | null;
  incentivesDetail: string | null;
  bondAmount: number | null;
  bondType: string | null;
  bondReductionTerms: string | null;
  assignmentRights: string | null;
  sublettingRights: string | null;
  defaultProvisions: string | null;
  curePeriodDays: number | null;
  demolitionClause: boolean;
  relocationClause: boolean;
  firstRightOfRefusal: boolean;
  specialConditions: string | null;
}
