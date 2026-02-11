import {
  AnalysisResult,
  ClauseScore,
  ClauseRating,
  Recommendation,
  RiskFlag,
  RetailLeaseIssue,
  LeaseWithRelations,
} from "./types";
import { getMarketBenchmarks, getComparables } from "../market/mock-market-data";

function getRemainingMonths(expiryDate: Date): number {
  const now = new Date();
  return Math.max(0, Math.round((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
}

function scoreRentReview(lease: LeaseWithRelations): ClauseScore {
  const mech = lease.rentReviewMechanism;
  const detail = lease.rentReviewDetail?.toLowerCase() || "";
  let rating: ClauseRating = "BALANCED";
  let explanation = "";
  let recommendation = "";
  let impact = 0;
  const remainingMonths = getRemainingMonths(lease.expiryDate);
  const remainingYears = remainingMonths / 12;

  if (mech === "FIXED_PERCENT") {
    const pct = parseFloat(detail) || 3;
    if (pct < 3) {
      rating = "TENANT_FRIENDLY";
      explanation = `Fixed ${pct}% annual increase is below market standard (3-3.5%). The tenant benefits from below-inflation rent growth.`;
      recommendation = "Negotiate for a higher fixed increase (3.5-4%) or switch to CPI-linked reviews at next renewal.";
      impact = (lease.baseRentPA * (3.5 - pct) / 100) * remainingYears;
    } else if (pct <= 3.5) {
      rating = "BALANCED";
      explanation = `Fixed ${pct}% annual increase is within market range for Melbourne commercial leases.`;
      recommendation = "Review mechanism is market-standard. No immediate action required.";
    } else if (pct <= 4) {
      rating = "LANDLORD_FRIENDLY";
      explanation = `Fixed ${pct}% annual increase is above market standard, providing the landlord with strong rent growth above typical CPI.`;
      recommendation = "For tenants: negotiate reduction to 3-3.5% at next review. For landlords: this is a favourable position.";
      impact = (lease.baseRentPA * (pct - 3) / 100) * remainingYears;
    } else {
      rating = "LANDLORD_FRIENDLY";
      explanation = `Fixed ${pct}% annual increase is significantly above market standard and well above typical CPI levels.`;
      recommendation = "This increase significantly exceeds inflation. Negotiate a cap or transition to CPI-linked reviews.";
      impact = (lease.baseRentPA * (pct - 3) / 100) * remainingYears;
    }
  } else if (mech === "CPI") {
    rating = "TENANT_FRIENDLY";
    explanation = "CPI-only reviews track inflation, providing the tenant with downside protection. Historically CPI has been 2-4% in Australia.";
    recommendation = "CPI reviews are generally tenant-favourable as they track actual cost-of-living increases rather than arbitrary fixed percentages.";
    impact = (lease.baseRentPA * 0.5 / 100) * remainingYears;
  } else if (mech === "CPI_PLUS") {
    const margin = parseFloat(detail.replace(/[^0-9.]/g, "")) || 1;
    if (margin <= 1) {
      rating = "LANDLORD_FRIENDLY";
      explanation = `CPI + ${margin}% provides above-inflation growth. With CPI at ~3%, effective increase is ~${3 + margin}%.`;
      recommendation = "The margin above CPI guarantees the landlord real rental growth. Tenants should negotiate for CPI-only at renewal.";
      impact = (lease.baseRentPA * margin / 100) * remainingYears;
    } else {
      rating = "LANDLORD_FRIENDLY";
      explanation = `CPI + ${margin}% is significantly above inflation. Effective annual increase could reach ${3 + margin}% or more.`;
      recommendation = "This margin is aggressive. Negotiate reduction to CPI-only or CPI + 0.5% maximum.";
      impact = (lease.baseRentPA * margin / 100) * remainingYears;
    }
  } else if (mech === "MARKET") {
    if (lease.hasRatchetClause) {
      rating = "LANDLORD_FRIENDLY";
      explanation = "Market review with ratchet clause means rent can only increase, never decrease, even if the market falls.";
      recommendation = "Ratchet clauses are extremely landlord-friendly. Negotiate removal of the ratchet provision.";
      impact = (lease.baseRentPA * 3 / 100) * remainingYears;
    } else if (detail.includes("no cap") || detail.includes("uncapped")) {
      rating = "LANDLORD_FRIENDLY";
      explanation = "Uncapped market review exposes the tenant to unlimited rent increases. The landlord's appointed valuer determines the new rent.";
      recommendation = "Negotiate a cap on market review increases (e.g., CPI + 2% maximum) and the right to appoint an independent valuer.";
      impact = (lease.baseRentPA * 5 / 100) * remainingYears;
    } else {
      rating = "BALANCED";
      explanation = "Market review aligns rent with current market conditions. Both parties benefit from fair market pricing.";
      recommendation = "Ensure the review process includes independent valuation and dispute resolution mechanisms.";
    }
  } else {
    rating = "BALANCED";
    explanation = "Combination review mechanism. The specific terms should be evaluated individually.";
    recommendation = "Review the detailed terms to ensure the combination mechanism is balanced.";
  }

  return {
    clauseName: "Rent Review",
    rating,
    explanation,
    recommendation,
    estimatedImpactPA: Math.round(impact / Math.max(remainingYears, 1)),
    weight: 25,
  };
}

function scoreOutgoings(lease: LeaseWithRelations): ClauseScore {
  const structure = lease.outgoingsStructure;
  const totalOutgoings = lease.outgoingsEstimatePA || 0;
  let rating: ClauseRating = "BALANCED";
  let explanation = "";
  let recommendation = "";
  let impact = 0;

  if (structure === "GROSS") {
    rating = "TENANT_FRIENDLY";
    explanation = "Gross lease structure means the landlord absorbs all outgoings. The tenant's total occupancy cost is limited to rent only.";
    recommendation = "For landlords: consider transitioning to semi-gross or net at renewal to recover outgoings. For tenants: this is a favourable position.";
    impact = totalOutgoings;
  } else if (structure === "SEMI_GROSS") {
    rating = "BALANCED";
    explanation = "Semi-gross lease shares outgoings responsibility. The tenant pays some recoverable outgoings while the landlord absorbs others.";
    recommendation = "Review which outgoings are recovered to ensure the split is market-standard for this property type.";
  } else if (structure === "NET") {
    rating = "LANDLORD_FRIENDLY";
    explanation = `Net lease requires the tenant to pay all outgoings (estimated ${totalOutgoings > 0 ? `$${totalOutgoings.toLocaleString()}/yr` : "amount unspecified"}). Total occupancy cost is rent plus outgoings.`;
    recommendation = "For tenants: negotiate caps on annual outgoings increases or transition to semi-gross. For landlords: net leases provide full outgoings recovery.";
    impact = totalOutgoings;
  }

  return {
    clauseName: "Outgoings",
    rating,
    explanation,
    recommendation,
    estimatedImpactPA: Math.round(impact),
    weight: 15,
  };
}

function scoreLeaseTerm(lease: LeaseWithRelations): ClauseScore {
  const termMonths = lease.totalTermMonths;
  const options = lease.optionsToRenew ? JSON.parse(lease.optionsToRenew) : [];
  const hasOptions = options.length > 0;
  let rating: ClauseRating = "BALANCED";
  let explanation = "";
  let recommendation = "";

  if (termMonths < 36 && !hasOptions) {
    rating = "LANDLORD_FRIENDLY";
    explanation = `Short ${termMonths}-month term with no renewal options gives the landlord flexibility to re-let at market rates. The tenant has no security of tenure.`;
    recommendation = "Tenants should negotiate options to renew. Short terms without options carry high vacancy risk for landlords too.";
  } else if (termMonths > 84 && lease.rentReviewMechanism === "FIXED_PERCENT") {
    rating = "TENANT_FRIENDLY";
    explanation = `Long ${Math.round(termMonths / 12)}-year term with fixed percentage reviews locks in below-market rent growth. The tenant benefits from long-term certainty.`;
    recommendation = "For landlords: consider including a market review mid-term or at option exercise to realign rent with market.";
  } else if (hasOptions) {
    const optionOnSameTerms = options.some((o: { conditions: string }) =>
      o.conditions?.toLowerCase().includes("same terms")
    );
    if (optionOnSameTerms) {
      rating = "TENANT_FRIENDLY";
      explanation = "Options to renew on the same terms and conditions gives the tenant certainty and locks in current rent review mechanisms.";
      recommendation = "For landlords: future options should include a market review at exercise to reset rent to current market levels.";
    } else {
      rating = "BALANCED";
      explanation = "Lease includes options to renew, providing the tenant with security while allowing rent adjustment at option exercise.";
      recommendation = "Standard market practice. Both parties benefit from lease continuity.";
    }
  } else {
    rating = "BALANCED";
    explanation = `${Math.round(termMonths / 12)}-year term is within market range for this property type.`;
    recommendation = "Consider the remaining term in context of the tenant's business plans and market conditions.";
  }

  return {
    clauseName: "Lease Term",
    rating,
    explanation,
    recommendation,
    estimatedImpactPA: 0,
    weight: 15,
  };
}

function scoreBond(lease: LeaseWithRelations): ClauseScore {
  const bondAmount = lease.bondAmount || 0;
  const monthlyRent = lease.baseRentPA / 12;
  const bondMonths = monthlyRent > 0 ? bondAmount / monthlyRent : 0;
  let rating: ClauseRating = "BALANCED";
  let explanation = "";
  let recommendation = "";
  let impact = 0;

  if (bondMonths > 6) {
    rating = "LANDLORD_FRIENDLY";
    explanation = `Bond of $${bondAmount.toLocaleString()} represents ${bondMonths.toFixed(1)} months' rent — well above the standard 3-6 months.`;
    recommendation = "Negotiate reduction to 3 months' rent, which is market standard. Include a bond reduction clause linked to compliance.";
    impact = (bondAmount - monthlyRent * 3) * 0.05;
  } else if (bondMonths >= 3) {
    rating = "BALANCED";
    explanation = `Bond of $${bondAmount.toLocaleString()} represents ${bondMonths.toFixed(1)} months' rent, which is within the standard range.`;
    recommendation = "Standard security level. Consider negotiating a reduction clause after 2-3 years of full compliance.";
  } else if (bondMonths > 0) {
    rating = "TENANT_FRIENDLY";
    explanation = `Bond of $${bondAmount.toLocaleString()} represents only ${bondMonths.toFixed(1)} months' rent — below market standard.`;
    recommendation = "For landlords: consider increasing security to 3 months' rent to adequately protect against default.";
    impact = (monthlyRent * 3 - bondAmount) * 0.05;
  }

  if (lease.bondType === "BANK_GUARANTEE" && bondMonths > 0) {
    explanation += " Bank guarantee provides stronger security than a cash bond.";
  }

  if (!lease.bondReductionTerms && bondMonths >= 3) {
    recommendation += " No bond reduction terms — tenants should negotiate reduction after proven compliance.";
  }

  return {
    clauseName: "Bond / Security",
    rating,
    explanation,
    recommendation,
    estimatedImpactPA: Math.round(impact),
    weight: 10,
  };
}

function scoreMakeGood(lease: LeaseWithRelations): ClauseScore {
  const obligations = (lease.makeGoodObligations || "").toLowerCase();
  const nla = lease.property.nla;
  let rating: ClauseRating = "BALANCED";
  let explanation = "";
  let recommendation = "";
  if (obligations.includes("base building") || obligations.includes("original condition") || obligations.includes("shell")) {
    if (obligations.includes("fair wear and tear")) {
      rating = "BALANCED";
      explanation = "Make good to base building condition with fair wear and tear excluded is market standard.";
      recommendation = "Standard clause. Ensure 'fair wear and tear' is clearly defined in the lease.";
    } else {
      rating = "LANDLORD_FRIENDLY";
      explanation = `Full make good to base building/original condition without fair wear and tear exclusion is very onerous for the tenant. Estimated cost: $${(nla * 300).toLocaleString()}.`;
      recommendation = "Negotiate fair wear and tear exclusion. Estimated make good cost: $200-400/sqm.";
    }
  } else if (!obligations || obligations.includes("no make good") || obligations.includes("as is")) {
    rating = "TENANT_FRIENDLY";
    explanation = "No make good obligation means the tenant can leave the premises as-is at lease end.";
    recommendation = `For landlords: include make good provisions in future leases to protect property condition. Potential exposure: $${(nla * 250).toLocaleString()}.`;
  } else {
    rating = "BALANCED";
    explanation = "Make good obligations are specified but should be reviewed for clarity and fairness.";
    recommendation = "Ensure make good requirements are clearly defined and proportionate.";
  }

  return {
    clauseName: "Make Good",
    rating,
    explanation,
    recommendation,
    estimatedImpactPA: 0,
    weight: 10,
  };
}

function scoreAssignment(lease: LeaseWithRelations): ClauseScore {
  const rights = (lease.assignmentRights || "").toLowerCase();
  const subletting = (lease.sublettingRights || "").toLowerCase();
  let rating: ClauseRating = "BALANCED";
  let explanation = "";
  let recommendation = "";

  if (rights.includes("absolute discretion") || rights.includes("not permitted") || rights.includes("no assignment")) {
    rating = "LANDLORD_FRIENDLY";
    explanation = "Assignment restricted or at landlord's absolute discretion. The tenant has limited ability to transfer the lease.";
    recommendation = "Tenants should negotiate for consent not to be unreasonably withheld, as per standard commercial practice.";
  } else if (rights.includes("unreasonably withheld")) {
    if (rights.includes("no requirement") || rights.includes("without condition")) {
      rating = "TENANT_FRIENDLY";
      explanation = "Assignment permitted with landlord consent (not to be unreasonably withheld) and no additional financial conditions on the assignee.";
      recommendation = "For landlords: consider requiring the assignee to demonstrate equivalent financial capacity.";
    } else {
      rating = "BALANCED";
      explanation = "Standard assignment clause — landlord consent required but not to be unreasonably withheld.";
      recommendation = "Market standard. Ensure the process for assignment is clearly documented.";
    }
  } else if (rights.includes("unrestricted") || rights.includes("freely")) {
    rating = "TENANT_FRIENDLY";
    explanation = "Unrestricted assignment rights give the tenant maximum flexibility to transfer the lease.";
    recommendation = "For landlords: unrestricted assignment carries risk. Negotiate for reasonable consent requirements.";
  }

  if (subletting.includes("no subletting") || subletting.includes("not permitted")) {
    if (rating === "BALANCED") rating = "LANDLORD_FRIENDLY";
    explanation += " Subletting is not permitted.";
  }

  return {
    clauseName: "Assignment & Subletting",
    rating,
    explanation,
    recommendation,
    estimatedImpactPA: 0,
    weight: 10,
  };
}

function scoreOtherClauses(lease: LeaseWithRelations): ClauseScore {
  let landlordPoints = 0;
  let tenantPoints = 0;
  const notes: string[] = [];

  if (lease.demolitionClause) {
    landlordPoints += 2;
    notes.push("Demolition clause allows landlord to terminate for redevelopment");
  }
  if (lease.relocationClause) {
    landlordPoints += 2;
    notes.push("Relocation clause allows landlord to move tenant to alternative premises");
  }
  if (lease.firstRightOfRefusal) {
    tenantPoints += 1;
    notes.push("First right of refusal on adjoining/nearby premises benefits tenant");
  }
  if (lease.curePeriodDays && lease.curePeriodDays < 14) {
    landlordPoints += 1;
    notes.push(`Short ${lease.curePeriodDays}-day cure period is below standard 14 days`);
  }
  if (lease.curePeriodDays && lease.curePeriodDays >= 21) {
    tenantPoints += 1;
    notes.push(`${lease.curePeriodDays}-day cure period is generous`);
  }

  let rating: ClauseRating = "BALANCED";
  if (landlordPoints > tenantPoints + 1) rating = "LANDLORD_FRIENDLY";
  else if (tenantPoints > landlordPoints + 1) rating = "TENANT_FRIENDLY";

  return {
    clauseName: "Other Provisions",
    rating,
    explanation: notes.length > 0 ? notes.join(". ") + "." : "Standard provisions apply.",
    recommendation: lease.demolitionClause || lease.relocationClause
      ? "Demolition and relocation clauses significantly disadvantage the tenant. Negotiate for adequate compensation and notice periods."
      : "No unusual provisions noted.",
    estimatedImpactPA: 0,
    weight: 15,
  };
}

function checkRetailLeasesAct(lease: LeaseWithRelations): RetailLeaseIssue[] {
  if (!lease.property.isRetailLease) return [];

  const issues: RetailLeaseIssue[] = [];

  if (lease.hasRatchetClause) {
    issues.push({
      section: "s35 Retail Leases Act 2003",
      issue: "Ratchet clause potentially non-compliant",
      detail: "Section 35 of the Retail Leases Act 2003 (Vic) restricts ratchet clauses in retail leases. The rent review clause should be reviewed for compliance.",
    });
  }

  if (lease.totalTermMonths < 60) {
    issues.push({
      section: "s21 Retail Leases Act 2003",
      issue: "Lease term below 5-year minimum",
      detail: "Section 21 requires a minimum 5-year term for new retail leases unless the tenant has waived this right with independent legal advice.",
    });
  }

  if (lease.rentReviewMechanism === "MARKET" && !lease.rentReviewDetail?.toLowerCase().includes("cap")) {
    issues.push({
      section: "s35 Retail Leases Act 2003",
      issue: "Market review mechanism should comply with Act requirements",
      detail: "Market rent reviews under the Act must follow specific procedures including independent valuation and tenant's right to dispute.",
    });
  }

  if (!lease.outgoingsDetail || lease.outgoingsStructure === "NET") {
    issues.push({
      section: "s46-52 Retail Leases Act 2003",
      issue: "Outgoings disclosure required",
      detail: "The landlord must provide an estimate and detailed breakdown of outgoings before lease commencement, and annual reconciliation statements.",
    });
  }

  return issues;
}

function generateRiskFlags(
  lease: LeaseWithRelations,
  clauses: ClauseScore[]
): RiskFlag[] {
  const flags: RiskFlag[] = [];
  const remainingMonths = getRemainingMonths(lease.expiryDate);

  if (remainingMonths < 12) {
    flags.push({
      flag: "Lease Expiry Imminent",
      severity: "HIGH",
      detail: `Lease expires in ${remainingMonths} months. Renewal negotiations should begin immediately.`,
    });
  } else if (remainingMonths < 24) {
    flags.push({
      flag: "Lease Expiry Approaching",
      severity: "MEDIUM",
      detail: `Lease expires in ${remainingMonths} months. Begin planning for renewal or relocation.`,
    });
  }

  if (lease.hasRatchetClause) {
    flags.push({
      flag: "Ratchet Clause Present",
      severity: "HIGH",
      detail: "Ratchet clause prevents rent from decreasing even if market falls. This significantly increases tenant risk.",
    });
  }

  if (lease.demolitionClause) {
    flags.push({
      flag: "Demolition Clause",
      severity: "HIGH",
      detail: "Landlord can terminate the lease for demolition/redevelopment. Tenant should understand notice requirements and compensation rights.",
    });
  }

  if (lease.relocationClause) {
    flags.push({
      flag: "Relocation Clause",
      severity: "MEDIUM",
      detail: "Landlord can relocate tenant to alternative premises. Review conditions and compensation provisions.",
    });
  }

  const unfavourable = clauses.filter((c) => c.rating !== "BALANCED");
  if (unfavourable.length >= 4) {
    flags.push({
      flag: "Multiple Unfavourable Clauses",
      severity: "MEDIUM",
      detail: `${unfavourable.length} clauses are rated as unfavourable. Consider a comprehensive lease renegotiation.`,
    });
  }

  return flags;
}

export async function analyseWithMockEngine(
  lease: LeaseWithRelations
): Promise<AnalysisResult> {
  // 1.5s artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const clientType = lease.client.clientType;
  const benchmarks = getMarketBenchmarks(
    lease.property.propertyType,
    lease.property.suburb,
    lease.property.postcode
  );
  const comparables = getComparables(
    lease.property.propertyType,
    lease.property.suburb,
    lease.property.postcode
  );

  // Score each clause
  const clauseScores = [
    scoreRentReview(lease),
    scoreOutgoings(lease),
    scoreLeaseTerm(lease),
    scoreBond(lease),
    scoreMakeGood(lease),
    scoreAssignment(lease),
    scoreOtherClauses(lease),
  ];

  // Calculate weighted overall scores
  let landlordScore = 0;
  let tenantScore = 0;
  let totalWeight = 0;

  for (const clause of clauseScores) {
    totalWeight += clause.weight;
    if (clause.rating === "LANDLORD_FRIENDLY") {
      landlordScore += clause.weight;
    } else if (clause.rating === "TENANT_FRIENDLY") {
      tenantScore += clause.weight;
    } else {
      landlordScore += clause.weight * 0.5;
      tenantScore += clause.weight * 0.5;
    }
  }

  const overallLandlordScore = Math.round((landlordScore / totalWeight) * 100);
  const overallTenantScore = Math.round((tenantScore / totalWeight) * 100);

  // Generate recommendations (unfavourable for the client's type)
  const recommendations: Recommendation[] = [];

  for (const clause of clauseScores) {
    const isUnfavourable =
      (clientType === "LANDLORD" && clause.rating === "TENANT_FRIENDLY") ||
      (clientType === "TENANT" && clause.rating === "LANDLORD_FRIENDLY");

    if (isUnfavourable && clause.recommendation) {
      const impact = clause.estimatedImpactPA;
      recommendations.push({
        title: `${clause.clauseName}: Renegotiate Terms`,
        description: clause.recommendation,
        estimatedAnnualImpact: impact,
        priority: impact > 10000 ? "HIGH" : impact > 2000 ? "MEDIUM" : "LOW",
      });
    }
  }

  // Add market rent comparison recommendation
  const rentPSQM = lease.baseRentPSQM || (lease.property.nla > 0 ? lease.baseRentPA / lease.property.nla : 0);
  if (clientType === "TENANT" && rentPSQM > benchmarks.rentPSQM.median * 1.1) {
    const overpayment = (rentPSQM - benchmarks.rentPSQM.median) * lease.property.nla;
    recommendations.push({
      title: "Rent Above Market: Negotiate Reduction",
      description: `Current rent of $${rentPSQM.toFixed(0)}/sqm is above the market median of $${benchmarks.rentPSQM.median}/sqm. Negotiate a rent reduction or additional incentives.`,
      estimatedAnnualImpact: Math.round(overpayment),
      priority: overpayment > 10000 ? "HIGH" : "MEDIUM",
    });
  } else if (clientType === "LANDLORD" && rentPSQM < benchmarks.rentPSQM.median * 0.9) {
    const undercharge = (benchmarks.rentPSQM.median - rentPSQM) * lease.property.nla;
    recommendations.push({
      title: "Rent Below Market: Review at Next Opportunity",
      description: `Current rent of $${rentPSQM.toFixed(0)}/sqm is below the market median of $${benchmarks.rentPSQM.median}/sqm. Target market rent at next review or renewal.`,
      estimatedAnnualImpact: Math.round(undercharge),
      priority: undercharge > 10000 ? "HIGH" : "MEDIUM",
    });
  }

  // Sort recommendations by impact
  recommendations.sort((a, b) => b.estimatedAnnualImpact - a.estimatedAnnualImpact);

  const totalImpact = recommendations.reduce(
    (sum, r) => sum + r.estimatedAnnualImpact,
    0
  );

  const riskFlags = generateRiskFlags(lease, clauseScores);
  const retailIssues = checkRetailLeasesAct(lease);

  return {
    overallLandlordScore,
    overallTenantScore,
    clauseAnalysis: clauseScores,
    topRecommendations: recommendations.slice(0, 10),
    totalEstimatedAnnualImpact: totalImpact,
    riskFlags,
    retailLeasesActIssues: retailIssues,
    marketContext: {
      benchmarks,
      comparables,
    },
  };
}
