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
  const specialLower = (lease.specialConditions || "").toLowerCase();
  const makeGoodLower = (lease.makeGoodObligations || "").toLowerCase();
  const assignmentLower = (lease.assignmentRights || "").toLowerCase();
  const outgoings = lease.outgoingsDetail ? JSON.parse(lease.outgoingsDetail) : null;

  // ── Part 3: Disclosure (s15-20) ──

  if (!specialLower.includes("disclosure statement")) {
    issues.push({
      section: "s17 — Disclosure Statement",
      issue: "No disclosure statement referenced in lease",
      detail: "The landlord must provide the tenant with a disclosure statement in the prescribed form before the lease is entered into.",
      requirement: "Disclosure statement must be provided at least 7 days before the tenant enters into the lease or pays any consideration.",
    });
  }

  // ── Part 4: Lease Terms (s21-25) ──

  if (lease.totalTermMonths < 60) {
    issues.push({
      section: "s21 — Minimum Term",
      issue: "Lease term below 5-year minimum",
      detail: `Current term is ${lease.totalTermMonths} months (${(lease.totalTermMonths / 12).toFixed(1)} years). The Act requires a minimum 5-year term for retail leases.`,
      requirement: "Minimum 5-year term unless the tenant has obtained independent legal advice and signed a written waiver (s21(1)(a)).",
    });
  }

  const options = lease.optionsToRenew ? JSON.parse(lease.optionsToRenew) : [];
  if (options.length === 0 && lease.totalTermMonths <= 60) {
    issues.push({
      section: "s23 — Options to Renew",
      issue: "No options to renew on a short-term retail lease",
      detail: "Retail lease with no renewal options may leave the tenant without security of tenure after the initial term.",
      requirement: "While not mandatory, the Act encourages options that together with the initial term provide at least 5 years of occupancy.",
    });
  }

  if (!specialLower.includes("holding over") && !specialLower.includes("hold over")) {
    issues.push({
      section: "s25 — Holding Over",
      issue: "Holding over provisions not addressed",
      detail: "The lease does not appear to address holding over arrangements after expiry.",
      requirement: "Under s25, a tenant who holds over after lease expiry does so on a month-to-month basis on the same terms. The lease should clearly address this.",
    });
  }

  // ── Part 5: Rent (s26-34) ──

  if (lease.rentReviewFrequencyMonths < 12) {
    issues.push({
      section: "s26 — Rent Review Frequency",
      issue: "Rent reviews more frequent than annually",
      detail: `Rent reviews are set at every ${lease.rentReviewFrequencyMonths} months, which is more frequent than the standard annual cycle.`,
      requirement: "The Act does not prohibit sub-annual reviews, but they are unusual for retail leases and should be carefully scrutinised.",
    });
  }

  if (lease.rentReviewMechanism === "MARKET") {
    const detailLower = (lease.rentReviewDetail || "").toLowerCase();
    if (!detailLower.includes("independent") && !detailLower.includes("valuer") && !detailLower.includes("valuation")) {
      issues.push({
        section: "s28 — Market Rent Review",
        issue: "Market review process may not comply with Act requirements",
        detail: "Market rent reviews must follow specific procedures for determining current market rent.",
        requirement: "Under s28, if parties cannot agree, an independent valuer must determine market rent. The tenant has the right to make submissions and dispute the determination.",
      });
    }
  }

  if (lease.hasRatchetClause) {
    issues.push({
      section: "s28(3) — Ratchet Clause",
      issue: "Ratchet clause potentially non-compliant",
      detail: "A ratchet clause prevents rent from decreasing at market review, even if the market has fallen. This is restricted under the Act.",
      requirement: "Section 28(3) provides that a provision requiring rent to be not less than rent payable immediately before the review is void in a retail lease.",
    });
  }

  const permittedUseLower = (lease.permittedUse || "").toLowerCase();
  if (permittedUseLower.includes("retail") || permittedUseLower.includes("shop") || permittedUseLower.includes("food")) {
    if (specialLower.includes("turnover") || specialLower.includes("percentage rent")) {
      issues.push({
        section: "s30-34 — Turnover Rent",
        issue: "Turnover rent provisions must comply with disclosure requirements",
        detail: "Where a lease includes turnover-based rent, specific disclosure and calculation requirements apply.",
        requirement: "The landlord must not require turnover figures more frequently than monthly. The tenant must provide an annual audited statement (s31-32).",
      });
    }
  }

  // ── Part 6: Outgoings (s35-40) ──

  if (!lease.outgoingsDetail || lease.outgoingsStructure === "NET") {
    issues.push({
      section: "s36 — Outgoings Estimate",
      issue: "Outgoings estimate and breakdown required",
      detail: "The landlord must provide a written estimate and detailed breakdown of outgoings before the lease commences.",
      requirement: "Annual outgoings estimates must be provided before each accounting period. Annual reconciliation statements are required within 3 months of the end of each accounting period.",
    });
  }

  if (lease.outgoingsStructure === "NET" || lease.outgoingsStructure === "SEMI_GROSS") {
    if (!specialLower.includes("audit")) {
      issues.push({
        section: "s37 — Outgoings Audit",
        issue: "Tenant audit rights for outgoings not referenced",
        detail: "The lease does not appear to address the tenant's right to audit outgoings expenditure.",
        requirement: "Under s37, the tenant has the right to request an audit of any outgoings expenditure. The landlord must comply within a reasonable time.",
      });
    }
  }

  if (outgoings && outgoings.landTax && outgoings.landTax > 0) {
    issues.push({
      section: "s38 — Land Tax",
      issue: "Land tax recovery from retail tenant",
      detail: `Land tax of $${outgoings.landTax.toLocaleString()}/yr is included in outgoings. This is prohibited for retail leases.`,
      requirement: "Section 38 prohibits the recovery of land tax from a retail tenant. Any lease provision requiring the tenant to pay land tax is void.",
    });
  }

  if (outgoings && outgoings.other && outgoings.other > 0) {
    if (specialLower.includes("marketing") || specialLower.includes("promotion")) {
      issues.push({
        section: "s39 — Marketing Fund",
        issue: "Marketing/promotion fund contributions require compliance",
        detail: "Contributions to marketing or promotion funds in retail leases are subject to specific requirements.",
        requirement: "Under s39, marketing fund expenditure must be disclosed, accounted for, and audited. Tenants must be consulted on marketing plans.",
      });
    }
  }

  // ── Part 7: Repairs & Maintenance (s41-43) ──

  if (makeGoodLower.includes("structural") || makeGoodLower.includes("capital")) {
    issues.push({
      section: "s42 — Landlord Repairs",
      issue: "Structural/capital repair obligations may be incorrectly allocated",
      detail: "The make good or repair provisions may place structural or capital repair obligations on the tenant.",
      requirement: "Under s42, the landlord is responsible for maintaining the structure, fixtures, plant, and equipment (unless damaged by the tenant). These obligations cannot be passed to the retail tenant.",
    });
  }

  if (!makeGoodLower && !specialLower.includes("repair")) {
    issues.push({
      section: "s43 — Repair Obligations",
      issue: "Repair and maintenance responsibilities not clearly defined",
      detail: "The lease does not clearly set out the respective repair and maintenance obligations of the parties.",
      requirement: "Under s43, the tenant is only obligated for non-structural repairs and maintenance. Responsibilities should be clearly documented to avoid disputes.",
    });
  }

  // ── Part 8: Security Deposits (s44-50) ──

  const bondAmount = lease.bondAmount || 0;
  const monthlyRent = lease.baseRentPA / 12;
  const bondMonths = monthlyRent > 0 ? bondAmount / monthlyRent : 0;
  if (bondMonths > 3) {
    issues.push({
      section: "s44-45 — Security Deposit",
      issue: `Security deposit exceeds 3 months' rent (${bondMonths.toFixed(1)} months)`,
      detail: `Bond of $${bondAmount.toLocaleString()} equates to ${bondMonths.toFixed(1)} months' rent, which exceeds the typical threshold for retail leases.`,
      requirement: "While not strictly capped by the Act, security deposits exceeding 3 months' gross rent are considered excessive for retail leases and may be challenged.",
    });
  }

  if (bondAmount > 0 && !lease.bondReductionTerms) {
    issues.push({
      section: "s46 — Security Return",
      issue: "No provisions for security deposit return",
      detail: "The lease does not specify terms for the return or reduction of the security deposit.",
      requirement: "The Act requires the landlord to return the security deposit within a reasonable time after the lease ends, less any amounts properly claimed.",
    });
  }

  // ── Part 9: Compensation (s51-53) ──

  if (lease.demolitionClause) {
    if (!specialLower.includes("compensation") || !specialLower.includes("demolition compensation")) {
      issues.push({
        section: "s52 — Demolition Compensation",
        issue: "Demolition clause without compensation provisions",
        detail: "The lease contains a demolition clause but does not appear to address tenant compensation rights.",
        requirement: "Under s52, a tenant is entitled to compensation if the lease is terminated due to demolition, including reasonable relocation costs and loss of business value.",
      });
    }
  }

  if (lease.relocationClause) {
    if (!specialLower.includes("comparable") && !specialLower.includes("equivalent")) {
      issues.push({
        section: "s53 — Relocation",
        issue: "Relocation clause lacks adequate tenant protections",
        detail: "The lease allows relocation but does not reference comparable or equivalent premises.",
        requirement: "Under s53, any relocation must be to premises of comparable size, quality, and position. The landlord must pay all reasonable relocation costs.",
      });
    }
  }

  // ── Part 10: Assignment (s54-56) ──

  if (assignmentLower.includes("absolute discretion") || assignmentLower.includes("not permitted") || assignmentLower.includes("no assignment")) {
    issues.push({
      section: "s54 — Assignment",
      issue: "Assignment restrictions may not comply with the Act",
      detail: "The lease restricts or prohibits assignment, which may be inconsistent with the Act's requirements.",
      requirement: "Under s54, a landlord cannot unreasonably withhold consent to an assignment. The landlord can only impose conditions relating to the financial standing and business experience of the proposed assignee (s55).",
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
