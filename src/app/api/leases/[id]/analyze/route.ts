import { prisma } from "@/lib/prisma";
import { analyseLease } from "@/services/analysis";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const lease = await prisma.lease.findUnique({
    where: { id: params.id },
    include: { property: true, client: true },
  });

  if (!lease) {
    return NextResponse.json({ error: "Lease not found" }, { status: 404 });
  }

  const result = await analyseLease(lease);

  // Store the analysis
  await prisma.leaseAnalysis.create({
    data: {
      leaseId: lease.id,
      overallLandlordScore: result.overallLandlordScore,
      overallTenantScore: result.overallTenantScore,
      clauseAnalysis: JSON.stringify(result.clauseAnalysis),
      topRecommendations: JSON.stringify(result.topRecommendations),
      totalEstimatedAnnualImpact: result.totalEstimatedAnnualImpact,
      riskFlags: JSON.stringify(result.riskFlags),
      retailLeasesActIssues: JSON.stringify(result.retailLeasesActIssues),
      marketContext: JSON.stringify(result.marketContext),
      aiModel: "mock",
    },
  });

  // Update lease status
  await prisma.lease.update({
    where: { id: lease.id },
    data: { status: "ANALYSED" },
  });

  redirect(`/leases/${lease.id}/analysis`);
}
