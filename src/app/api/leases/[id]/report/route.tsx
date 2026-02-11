import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { renderPdfToBuffer } from "@/services/pdf/render";
import { LeaseReport } from "@/services/pdf/lease-report";
import type { ReportData } from "@/services/pdf/lease-report";
import React from "react";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const lease = await prisma.lease.findUnique({
    where: { id: params.id },
    include: { property: true, client: true, analyses: true },
  });

  if (!lease) {
    return NextResponse.json({ error: "Lease not found" }, { status: 404 });
  }

  const analysis = lease.analyses[lease.analyses.length - 1];
  if (!analysis) {
    return NextResponse.json(
      { error: "No analysis found. Please analyse the lease first." },
      { status: 400 }
    );
  }

  // Load business settings
  let settings = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });
  if (!settings) {
    settings = {
      id: "default",
      companyName: "Ben Palmieri Consulting",
      tagline: "Director | Leasing Consultant",
      licenceNumber: "",
      email: "",
      phone: "",
      address: "",
      logoUrl: null,
      primaryColor: "#1e3a5f",
      disclaimer:
        "This report is advisory in nature and does not constitute legal advice. Ben Palmieri Consulting recommends seeking independent legal advice before acting on any recommendations.",
      termsOfEngagement: "",
      updatedAt: new Date(),
    };
  }

  // Parse JSON fields from analysis
  const clauses = JSON.parse(analysis.clauseAnalysis);
  const recommendations = JSON.parse(analysis.topRecommendations);
  const riskFlags = analysis.riskFlags ? JSON.parse(analysis.riskFlags) : [];
  const retailIssues = analysis.retailLeasesActIssues
    ? JSON.parse(analysis.retailLeasesActIssues)
    : [];
  const marketCtx = analysis.marketContext
    ? JSON.parse(analysis.marketContext)
    : null;

  const reportData: ReportData = {
    lease: {
      leaseName: lease.leaseName,
      tenantName: lease.tenantName,
      landlordName: lease.landlordName,
      commencementDate: lease.commencementDate,
      expiryDate: lease.expiryDate,
      totalTermMonths: lease.totalTermMonths,
      optionsToRenew: lease.optionsToRenew,
      baseRentPA: lease.baseRentPA,
      baseRentPSQM: lease.baseRentPSQM,
      rentReviewMechanism: lease.rentReviewMechanism,
      rentReviewDetail: lease.rentReviewDetail,
      rentReviewFrequencyMonths: lease.rentReviewFrequencyMonths,
      hasRatchetClause: lease.hasRatchetClause,
      outgoingsStructure: lease.outgoingsStructure,
      outgoingsDetail: lease.outgoingsDetail,
      outgoingsEstimatePA: lease.outgoingsEstimatePA,
      permittedUse: lease.permittedUse,
      makeGoodObligations: lease.makeGoodObligations,
      fitoutContribution: lease.fitoutContribution,
      rentFreePeriodMonths: lease.rentFreePeriodMonths,
      bondAmount: lease.bondAmount,
      bondType: lease.bondType,
      assignmentRights: lease.assignmentRights,
      sublettingRights: lease.sublettingRights,
      demolitionClause: lease.demolitionClause,
      relocationClause: lease.relocationClause,
      firstRightOfRefusal: lease.firstRightOfRefusal,
      specialConditions: lease.specialConditions,
    },
    property: {
      address: lease.property.address,
      suburb: lease.property.suburb,
      state: lease.property.state,
      postcode: lease.property.postcode,
      propertyType: lease.property.propertyType,
      nla: lease.property.nla,
      propertyGrade: lease.property.propertyGrade,
      isRetailLease: lease.property.isRetailLease,
    },
    client: {
      businessName: lease.client.businessName,
      clientType: lease.client.clientType,
    },
    analysis: {
      overallLandlordScore: analysis.overallLandlordScore,
      overallTenantScore: analysis.overallTenantScore,
      totalEstimatedAnnualImpact: analysis.totalEstimatedAnnualImpact,
      analysedAt: analysis.analysedAt,
      aiModel: analysis.aiModel,
    },
    clauses,
    recommendations,
    riskFlags,
    retailIssues,
    benchmarks: marketCtx?.benchmarks || null,
    comparables: marketCtx?.comparables || [],
    settings: {
      companyName: settings.companyName,
      tagline: settings.tagline,
      licenceNumber: settings.licenceNumber,
      disclaimer: settings.disclaimer,
    },
  };

  const element = React.createElement(LeaseReport, { data: reportData });
  const buffer = await renderPdfToBuffer(element);

  const filename = `${lease.leaseName.replace(/[^a-zA-Z0-9]/g, "_")}_Analysis_Report.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
