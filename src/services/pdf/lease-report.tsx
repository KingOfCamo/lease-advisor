import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Types matching analysis output
interface ClauseScore {
  clauseName: string;
  rating: string;
  explanation: string;
  recommendation: string;
  estimatedImpactPA: number;
}

interface Recommendation {
  title: string;
  description: string;
  estimatedAnnualImpact: number;
  priority: string;
}

interface RiskFlag {
  flag: string;
  severity: string;
  detail: string;
}

interface RetailIssue {
  section: string;
  issue: string;
  detail: string;
}

interface Benchmark {
  rentPSQM: { low: number; median: number; high: number };
  typicalIncentive: string;
  typicalReview: string;
}

interface Comparable {
  address: string;
  suburb: string;
  propertyType: string;
  nla: number;
  rentPSQM: number;
  leaseTerm: string;
  reviewType: string;
}

export interface ReportData {
  lease: {
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
    bondAmount: number | null;
    bondType: string | null;
    assignmentRights: string | null;
    sublettingRights: string | null;
    demolitionClause: boolean;
    relocationClause: boolean;
    firstRightOfRefusal: boolean;
    specialConditions: string | null;
  };
  property: {
    address: string;
    suburb: string;
    state: string;
    postcode: string;
    propertyType: string;
    nla: number;
    propertyGrade: string | null;
    isRetailLease: boolean;
  };
  client: {
    businessName: string;
    clientType: string;
  };
  analysis: {
    overallLandlordScore: number;
    overallTenantScore: number;
    totalEstimatedAnnualImpact: number;
    analysedAt: Date;
    aiModel: string;
  };
  clauses: ClauseScore[];
  recommendations: Recommendation[];
  riskFlags: RiskFlag[];
  retailIssues: RetailIssue[];
  benchmarks: Benchmark | null;
  comparables: Comparable[];
  settings: {
    companyName: string;
    tagline: string;
    licenceNumber: string;
    disclaimer: string;
  };
}

const navy = "#1e3a5f";
const navyLight = "#486581";
const green = "#16a34a";
const amber = "#d97706";
const red = "#dc2626";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 50,
    color: "#1a1a1a",
  },
  // Cover
  coverPage: {
    fontFamily: "Helvetica",
    padding: 50,
    color: "#ffffff",
    backgroundColor: navy,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 16,
    marginBottom: 40,
    opacity: 0.8,
  },
  coverDetail: {
    fontSize: 12,
    marginBottom: 6,
    opacity: 0.9,
  },
  coverFooter: {
    position: "absolute",
    bottom: 50,
    left: 50,
    right: 50,
  },
  coverCompany: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  coverTagline: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 2,
  },
  // Section headers
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom: 16,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: navy,
  },
  subTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom: 8,
    marginTop: 14,
  },
  // Content
  bodyText: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  label: {
    fontSize: 8,
    color: navyLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  // Table
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: navy,
    color: "#ffffff",
    padding: 6,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    padding: 6,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    padding: 6,
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    fontSize: 9,
  },
  // Cards
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  scoreCard: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  // Badge
  badge: {
    fontSize: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    fontFamily: "Helvetica-Bold",
  },
  badgeGreen: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  badgeAmber: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  badgeRed: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  // Grid
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  col2: {
    flex: 1,
  },
  col3: {
    width: "33%",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: navyLight,
  },
  // Disclaimer
  disclaimerBox: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    borderRadius: 4,
    padding: 16,
    marginTop: 16,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 9,
    lineHeight: 1.6,
    color: "#4b5563",
  },
});

function fmtCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function fmtDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd/MM/yyyy");
}

function fmtMonths(months: number): string {
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} months`;
  if (rem === 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${years}y ${rem}m`;
}

function ratingLabel(rating: string) {
  if (rating === "LANDLORD_FRIENDLY") return "Landlord-Friendly";
  if (rating === "TENANT_FRIENDLY") return "Tenant-Friendly";
  return "Balanced";
}

function ratingBadgeStyle(rating: string, isLandlord: boolean) {
  const isFavourable =
    (isLandlord && rating === "LANDLORD_FRIENDLY") ||
    (!isLandlord && rating === "TENANT_FRIENDLY");
  if (isFavourable) return styles.badgeGreen;
  if (rating === "BALANCED") return styles.badgeAmber;
  return styles.badgeRed;
}

function PageFooter({ companyName, reportDate }: { companyName: string; reportDate: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text>{companyName} — Confidential</Text>
      <Text>Report generated {reportDate}</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

export function LeaseReport({ data }: { data: ReportData }) {
  const isLandlord = data.client.clientType === "LANDLORD";
  const clientScore = isLandlord
    ? data.analysis.overallLandlordScore
    : data.analysis.overallTenantScore;
  const reportDate = format(new Date(), "dd/MM/yyyy");
  const outgoings = data.lease.outgoingsDetail
    ? JSON.parse(data.lease.outgoingsDetail)
    : null;

  return (
    <Document>
      {/* 1. Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={{ marginTop: 120 }}>
          <Text style={styles.coverTitle}>Lease Analysis Report</Text>
          <Text style={styles.coverSubtitle}>{data.lease.leaseName}</Text>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.coverDetail}>
              Property: {data.property.address}, {data.property.suburb} {data.property.state} {data.property.postcode}
            </Text>
            <Text style={styles.coverDetail}>
              Client: {data.client.businessName} ({isLandlord ? "Landlord" : "Tenant"})
            </Text>
            <Text style={styles.coverDetail}>
              Tenant: {data.lease.tenantName} | Landlord: {data.lease.landlordName}
            </Text>
            <Text style={styles.coverDetail}>
              Report Date: {reportDate}
            </Text>
          </View>
        </View>
        <View style={styles.coverFooter}>
          <Text style={styles.coverCompany}>{data.settings.companyName}</Text>
          <Text style={styles.coverTagline}>{data.settings.tagline}</Text>
          {data.settings.licenceNumber ? (
            <Text style={{ fontSize: 8, opacity: 0.6, marginTop: 2 }}>
              Licence: {data.settings.licenceNumber}
            </Text>
          ) : null}
        </View>
      </Page>

      {/* 2. Executive Summary */}
      <Page size="A4" style={styles.page}>
        <PageFooter companyName={data.settings.companyName} reportDate={reportDate} />
        <Text style={styles.sectionTitle}>Executive Summary</Text>

        <Text style={styles.bodyText}>
          This report analyses the commercial lease for {data.lease.leaseName} at{" "}
          {data.property.address}, {data.property.suburb} from the perspective of{" "}
          {data.client.businessName} ({isLandlord ? "Landlord" : "Tenant"}).
        </Text>

        <View style={styles.row}>
          <View style={[styles.scoreCard, { flex: 1, borderColor: navy }]}>
            <Text style={styles.label}>{isLandlord ? "Landlord" : "Tenant"} Score</Text>
            <Text style={{ fontSize: 36, fontFamily: "Helvetica-Bold", color: navy }}>{clientScore}</Text>
            <Text style={{ fontSize: 8, color: navyLight }}>/100</Text>
          </View>
          <View style={[styles.scoreCard, { flex: 1, borderColor: green }]}>
            <Text style={styles.label}>Est. Annual Value-Add</Text>
            <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: green }}>
              {fmtCurrency(data.analysis.totalEstimatedAnnualImpact)}
            </Text>
            <Text style={{ fontSize: 8, color: navyLight }}>per annum</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.scoreCard, { flex: 1, borderColor: "#e5e7eb" }]}>
            <Text style={styles.label}>Landlord Score</Text>
            <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: red }}>
              {data.analysis.overallLandlordScore}
            </Text>
          </View>
          <View style={[styles.scoreCard, { flex: 1, borderColor: "#e5e7eb" }]}>
            <Text style={styles.label}>Tenant Score</Text>
            <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: green }}>
              {data.analysis.overallTenantScore}
            </Text>
          </View>
        </View>

        <Text style={styles.bodyText}>
          The analysis identified {data.recommendations.length} actionable recommendations
          with a total estimated annual impact of{" "}
          {fmtCurrency(data.analysis.totalEstimatedAnnualImpact)}.
          {data.riskFlags.length > 0
            ? ` ${data.riskFlags.length} risk flag${data.riskFlags.length > 1 ? "s" : ""} require attention.`
            : ""}
          {data.retailIssues.length > 0
            ? ` ${data.retailIssues.length} Retail Leases Act 2003 (Vic) compliance issue${data.retailIssues.length > 1 ? "s" : ""} identified.`
            : ""}
        </Text>

        {data.riskFlags.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.subTitle}>Risk Alerts</Text>
            {data.riskFlags.map((flag, i) => (
              <View
                key={i}
                style={[
                  styles.card,
                  {
                    borderLeftWidth: 3,
                    borderLeftColor: flag.severity === "HIGH" ? red : amber,
                  },
                ]}
              >
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>
                  {flag.flag}
                </Text>
                <Text style={{ fontSize: 8, color: "#6b7280" }}>{flag.detail}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>

      {/* 3. Property & Lease Overview */}
      <Page size="A4" style={styles.page}>
        <PageFooter companyName={data.settings.companyName} reportDate={reportDate} />
        <Text style={styles.sectionTitle}>Property & Lease Overview</Text>

        <Text style={styles.subTitle}>Property Details</Text>
        <View style={styles.row}>
          <View style={styles.col2}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>
              {data.property.address}, {data.property.suburb} {data.property.state} {data.property.postcode}
            </Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.label}>Property Type</Text>
            <Text style={styles.value}>{data.property.propertyType}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col2}>
            <Text style={styles.label}>Net Lettable Area</Text>
            <Text style={styles.value}>{data.property.nla} sqm</Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.label}>Grade</Text>
            <Text style={styles.value}>{data.property.propertyGrade || "Ungraded"}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col2}>
            <Text style={styles.label}>Retail Lease</Text>
            <Text style={styles.value}>{data.property.isRetailLease ? "Yes" : "No"}</Text>
          </View>
        </View>

        <Text style={styles.subTitle}>Lease Parties & Term</Text>
        <View style={styles.row}>
          <View style={styles.col2}>
            <Text style={styles.label}>Tenant</Text>
            <Text style={styles.value}>{data.lease.tenantName}</Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.label}>Landlord</Text>
            <Text style={styles.value}>{data.lease.landlordName}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col3}>
            <Text style={styles.label}>Commencement</Text>
            <Text style={styles.value}>{fmtDate(data.lease.commencementDate)}</Text>
          </View>
          <View style={styles.col3}>
            <Text style={styles.label}>Expiry</Text>
            <Text style={styles.value}>{fmtDate(data.lease.expiryDate)}</Text>
          </View>
          <View style={styles.col3}>
            <Text style={styles.label}>Term</Text>
            <Text style={styles.value}>{fmtMonths(data.lease.totalTermMonths)}</Text>
          </View>
        </View>
        {data.lease.optionsToRenew && (
          <View>
            <Text style={styles.label}>Options to Renew</Text>
            <Text style={styles.value}>{data.lease.optionsToRenew}</Text>
          </View>
        )}

        <Text style={styles.subTitle}>Rent & Reviews</Text>
        <View style={styles.row}>
          <View style={styles.col2}>
            <Text style={styles.label}>Base Rent (p.a.)</Text>
            <Text style={styles.value}>{fmtCurrency(data.lease.baseRentPA)}</Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.label}>Rent per sqm</Text>
            <Text style={styles.value}>
              {data.lease.baseRentPSQM ? `$${data.lease.baseRentPSQM.toFixed(0)}/sqm` : "—"}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col2}>
            <Text style={styles.label}>Review Mechanism</Text>
            <Text style={styles.value}>
              {data.lease.rentReviewMechanism.replace(/_/g, " ")}
            </Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.label}>Review Frequency</Text>
            <Text style={styles.value}>Every {data.lease.rentReviewFrequencyMonths} months</Text>
          </View>
        </View>
        {data.lease.rentReviewDetail && (
          <View>
            <Text style={styles.label}>Review Detail</Text>
            <Text style={styles.value}>{data.lease.rentReviewDetail}</Text>
          </View>
        )}
        {data.lease.hasRatchetClause && (
          <View style={[styles.card, { borderLeftWidth: 3, borderLeftColor: red }]}>
            <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: red }}>
              Ratchet Clause Present
            </Text>
            <Text style={{ fontSize: 8, color: "#6b7280" }}>
              Rent can only increase, never decrease at review
            </Text>
          </View>
        )}

        <Text style={styles.subTitle}>Outgoings</Text>
        <View style={styles.row}>
          <View style={styles.col2}>
            <Text style={styles.label}>Structure</Text>
            <Text style={styles.value}>
              {data.lease.outgoingsStructure.replace(/_/g, " ")}
            </Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.label}>Estimated Outgoings (p.a.)</Text>
            <Text style={styles.value}>
              {data.lease.outgoingsEstimatePA
                ? fmtCurrency(data.lease.outgoingsEstimatePA)
                : "—"}
            </Text>
          </View>
        </View>
        {outgoings && (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Item</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>Amount (p.a.)</Text>
            </View>
            {[
              { label: "Council Rates", val: outgoings.councilRates },
              { label: "Water Rates", val: outgoings.waterRates },
              { label: "Insurance", val: outgoings.insurance },
              { label: "Land Tax", val: outgoings.landTax },
              { label: "Management Fee", val: outgoings.managementFee },
              { label: "Structural Maintenance", val: outgoings.structuralMaintenance },
              { label: "Other", val: outgoings.otherOutgoings || outgoings.other },
            ]
              .filter((item) => item.val && item.val > 0)
              .map((item, i) => (
                <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{item.label}</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                    {fmtCurrency(item.val)}
                  </Text>
                </View>
              ))}
          </View>
        )}
      </Page>

      {/* 4. Clause-by-Clause Analysis */}
      <Page size="A4" style={styles.page}>
        <PageFooter companyName={data.settings.companyName} reportDate={reportDate} />
        <Text style={styles.sectionTitle}>Clause-by-Clause Analysis</Text>

        <Text style={styles.bodyText}>
          Each clause has been assessed from the {isLandlord ? "landlord" : "tenant"}&apos;s
          perspective and rated as Landlord-Friendly, Balanced, or Tenant-Friendly.
        </Text>

        {data.clauses.map((clause, i) => (
          <View
            key={i}
            style={[
              styles.card,
              {
                borderLeftWidth: 3,
                borderLeftColor:
                  (isLandlord && clause.rating === "LANDLORD_FRIENDLY") ||
                  (!isLandlord && clause.rating === "TENANT_FRIENDLY")
                    ? green
                    : clause.rating === "BALANCED"
                    ? amber
                    : red,
              },
            ]}
            wrap={false}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: navy }}>
                {clause.clauseName}
              </Text>
              <Text style={[styles.badge, ratingBadgeStyle(clause.rating, isLandlord)]}>
                {ratingLabel(clause.rating)}
              </Text>
            </View>
            <Text style={{ fontSize: 9, color: "#4b5563", marginBottom: 4 }}>
              {clause.explanation}
            </Text>
            {clause.recommendation && (
              <View style={{ backgroundColor: "#f0f4f8", padding: 6, borderRadius: 3, marginTop: 2 }}>
                <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: navyLight, marginBottom: 2 }}>
                  RECOMMENDATION
                </Text>
                <Text style={{ fontSize: 8, color: "#374151" }}>{clause.recommendation}</Text>
              </View>
            )}
            {clause.estimatedImpactPA > 0 && (
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: green, marginTop: 4 }}>
                Estimated annual impact: {fmtCurrency(clause.estimatedImpactPA)}
              </Text>
            )}
          </View>
        ))}
      </Page>

      {/* 5. Financial Impact Summary */}
      <Page size="A4" style={styles.page}>
        <PageFooter companyName={data.settings.companyName} reportDate={reportDate} />
        <Text style={styles.sectionTitle}>Financial Impact Summary</Text>

        <View style={[styles.scoreCard, { borderColor: green, marginBottom: 16 }]}>
          <Text style={styles.label}>Total Estimated Annual Impact</Text>
          <Text style={{ fontSize: 28, fontFamily: "Helvetica-Bold", color: green }}>
            {fmtCurrency(data.analysis.totalEstimatedAnnualImpact)}
          </Text>
          <Text style={{ fontSize: 8, color: navyLight }}>per annum</Text>
        </View>

        <Text style={styles.subTitle}>Top Recommendations</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Priority</Text>
            <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Recommendation</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>Impact (p.a.)</Text>
          </View>
          {data.recommendations.map((rec, i) => (
            <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.badge,
                    rec.priority === "HIGH"
                      ? styles.badgeRed
                      : rec.priority === "MEDIUM"
                      ? styles.badgeAmber
                      : styles.badgeGreen,
                  ]}
                >
                  {rec.priority}
                </Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>
                  {rec.title}
                </Text>
                <Text style={{ fontSize: 8, color: "#6b7280" }}>{rec.description}</Text>
              </View>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right", fontFamily: "Helvetica-Bold", color: green }]}>
                {rec.estimatedAnnualImpact > 0
                  ? `+${fmtCurrency(rec.estimatedAnnualImpact)}`
                  : "—"}
              </Text>
            </View>
          ))}
        </View>

        {/* Impact by clause */}
        <Text style={styles.subTitle}>Impact by Clause Area</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Clause</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Rating</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>Impact (p.a.)</Text>
          </View>
          {data.clauses
            .filter((c) => c.estimatedImpactPA > 0)
            .sort((a, b) => b.estimatedImpactPA - a.estimatedImpactPA)
            .map((clause, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{clause.clauseName}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.badge, ratingBadgeStyle(clause.rating, isLandlord)]}>
                    {ratingLabel(clause.rating)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 1, textAlign: "right", fontFamily: "Helvetica-Bold" },
                  ]}
                >
                  {fmtCurrency(clause.estimatedImpactPA)}
                </Text>
              </View>
            ))}
        </View>
      </Page>

      {/* 6. Market Context */}
      {data.benchmarks && (
        <Page size="A4" style={styles.page}>
          <PageFooter companyName={data.settings.companyName} reportDate={reportDate} />
          <Text style={styles.sectionTitle}>Market Context</Text>

          <Text style={styles.bodyText}>
            The following market benchmarks and comparable leases provide context for evaluating
            the subject lease terms against current market conditions in {data.property.suburb}.
          </Text>

          <Text style={styles.subTitle}>Market Rent Benchmarks ($/sqm p.a.)</Text>
          <View style={styles.row}>
            <View style={styles.col3}>
              <Text style={styles.label}>Market Low</Text>
              <Text style={styles.value}>${data.benchmarks.rentPSQM.low}/sqm</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.label}>Market Median</Text>
              <Text style={styles.value}>${data.benchmarks.rentPSQM.median}/sqm</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.label}>Market High</Text>
              <Text style={styles.value}>${data.benchmarks.rentPSQM.high}/sqm</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>This Lease</Text>
              <Text style={[styles.value, { color: navy, fontSize: 14 }]}>
                {data.lease.baseRentPSQM
                  ? `$${data.lease.baseRentPSQM.toFixed(0)}/sqm`
                  : "—"}
              </Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>vs Median</Text>
              <Text
                style={[
                  styles.value,
                  {
                    fontSize: 14,
                    color:
                      data.lease.baseRentPSQM && data.lease.baseRentPSQM > data.benchmarks.rentPSQM.median
                        ? isLandlord
                          ? green
                          : red
                        : isLandlord
                        ? red
                        : green,
                  },
                ]}
              >
                {data.lease.baseRentPSQM
                  ? `${data.lease.baseRentPSQM > data.benchmarks.rentPSQM.median ? "+" : ""}${(
                      ((data.lease.baseRentPSQM - data.benchmarks.rentPSQM.median) /
                        data.benchmarks.rentPSQM.median) *
                      100
                    ).toFixed(1)}%`
                  : "—"}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Typical Incentive</Text>
              <Text style={styles.value}>{data.benchmarks.typicalIncentive}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Typical Review</Text>
              <Text style={styles.value}>{data.benchmarks.typicalReview}</Text>
            </View>
          </View>

          {data.comparables.length > 0 && (
            <View>
              <Text style={styles.subTitle}>Comparable Leases</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Address</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Type</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>NLA</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>$/sqm</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Term</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Review</Text>
                </View>
                {data.comparables.map((comp, i) => (
                  <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      {comp.address}, {comp.suburb}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{comp.propertyType}</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                      {comp.nla} sqm
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                      ${comp.rentPSQM}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{comp.leaseTerm}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{comp.reviewType}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Page>
      )}

      {/* 7. Risk Register */}
      {data.riskFlags.length > 0 && (
        <Page size="A4" style={styles.page}>
          <PageFooter companyName={data.settings.companyName} reportDate={reportDate} />
          <Text style={styles.sectionTitle}>Risk Register</Text>

          <Text style={styles.bodyText}>
            The following risks have been identified in the lease terms. Each risk is rated
            by severity and should be addressed according to its priority.
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Severity</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Risk</Text>
              <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Detail</Text>
            </View>
            {data.riskFlags.map((flag, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.badge,
                      flag.severity === "HIGH"
                        ? styles.badgeRed
                        : flag.severity === "MEDIUM"
                        ? styles.badgeAmber
                        : styles.badgeGreen,
                    ]}
                  >
                    {flag.severity}
                  </Text>
                </View>
                <Text style={[styles.tableCell, { flex: 2, fontFamily: "Helvetica-Bold" }]}>
                  {flag.flag}
                </Text>
                <Text style={[styles.tableCell, { flex: 3 }]}>{flag.detail}</Text>
              </View>
            ))}
          </View>
        </Page>
      )}

      {/* 8. Retail Leases Act Compliance */}
      {data.retailIssues.length > 0 && (
        <Page size="A4" style={styles.page}>
          <PageFooter companyName={data.settings.companyName} reportDate={reportDate} />
          <Text style={styles.sectionTitle}>Retail Leases Act 2003 (Vic) Compliance</Text>

          <Text style={styles.bodyText}>
            The Retail Leases Act 2003 (Vic) imposes specific requirements on commercial
            leases classified as retail premises. The following compliance issues have been
            identified in this lease.
          </Text>

          {data.retailIssues.map((issue, i) => (
            <View
              key={i}
              style={[styles.card, { borderLeftWidth: 3, borderLeftColor: amber }]}
              wrap={false}
            >
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: amber, marginBottom: 2 }}>
                {issue.section}
              </Text>
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>
                {issue.issue}
              </Text>
              <Text style={{ fontSize: 9, color: "#4b5563" }}>{issue.detail}</Text>
            </View>
          ))}

          <View style={{ marginTop: 12, padding: 10, backgroundColor: "#eff6ff", borderRadius: 4 }}>
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: navy, marginBottom: 4 }}>
              NOTE
            </Text>
            <Text style={{ fontSize: 8, color: "#374151", lineHeight: 1.5 }}>
              Compliance assessment is based on the lease terms as provided. It is not a
              comprehensive legal review. Independent legal advice should be sought to
              confirm compliance with the Retail Leases Act 2003 (Vic) and any applicable
              regulations.
            </Text>
          </View>
        </Page>
      )}

      {/* 9. Disclaimer */}
      <Page size="A4" style={styles.page}>
        <PageFooter companyName={data.settings.companyName} reportDate={reportDate} />
        <Text style={styles.sectionTitle}>Important Notices</Text>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Disclaimer</Text>
          <Text style={styles.disclaimerText}>{data.settings.disclaimer}</Text>
        </View>

        <View style={[styles.disclaimerBox, { marginTop: 12 }]}>
          <Text style={styles.disclaimerTitle}>Scope & Limitations</Text>
          <Text style={styles.disclaimerText}>
            This analysis has been prepared based on the lease terms as provided to{" "}
            {data.settings.companyName}. The analysis does not constitute a legal review
            of the lease document. Market data used in this report is indicative only and
            based on available benchmark data for the {data.property.suburb} area.
          </Text>
          <Text style={[styles.disclaimerText, { marginTop: 8 }]}>
            Analysis engine: {data.analysis.aiModel === "mock" ? "Rule-based scoring" : "AI-assisted analysis"}.
            Report generated on {reportDate}.
          </Text>
        </View>

        <View style={[styles.disclaimerBox, { marginTop: 12 }]}>
          <Text style={styles.disclaimerTitle}>Confidentiality</Text>
          <Text style={styles.disclaimerText}>
            This report has been prepared exclusively for {data.client.businessName} and
            is strictly confidential. It should not be distributed to any third party
            without the express written consent of {data.settings.companyName}.
          </Text>
        </View>

        <View style={{ marginTop: 40, textAlign: "center" }}>
          <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: navy }}>
            {data.settings.companyName}
          </Text>
          <Text style={{ fontSize: 10, color: navyLight, marginTop: 4 }}>
            {data.settings.tagline}
          </Text>
          {data.settings.licenceNumber ? (
            <Text style={{ fontSize: 8, color: navyLight, marginTop: 2 }}>
              Licence: {data.settings.licenceNumber}
            </Text>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
