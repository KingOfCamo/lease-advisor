import { prisma } from "@/lib/prisma";
import { analyseLease } from "@/services/analysis";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lease = await prisma.lease.findUnique({
    where: { id: params.id },
    include: { property: true, client: true },
  });

  if (!lease) {
    return NextResponse.json({ error: "Lease not found" }, { status: 404 });
  }

  // For CLIENT users, ensure they can only analyze their own client's leases
  if (session.user.role === "CLIENT" && session.user.clientId && session.user.clientId !== lease.clientId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  // Take a portfolio snapshot for the client
  try {
    const clientLeases = await prisma.lease.findMany({
      where: { clientId: lease.clientId },
      include: { analyses: { orderBy: { analysedAt: "desc" }, take: 1 } },
    });

    const isLandlord = lease.client.clientType === "LANDLORD";
    const analysedLeases = clientLeases.filter((l) => l.analyses.length > 0);
    const totalRentPA = clientLeases.reduce((s, l) => s + l.baseRentPA, 0);
    const avgScore =
      analysedLeases.length > 0
        ? analysedLeases.reduce((s, l) => {
            const a = l.analyses[0];
            return s + (isLandlord ? a.overallLandlordScore : a.overallTenantScore);
          }, 0) / analysedLeases.length
        : 0;
    const totalValueAdd = analysedLeases.reduce(
      (s, l) => s + l.analyses[0].totalEstimatedAnnualImpact,
      0
    );

    await prisma.portfolioSnapshot.create({
      data: {
        clientId: lease.clientId,
        leaseCount: clientLeases.length,
        totalRentPA,
        avgScore: Math.round(avgScore),
        totalValueAdd,
      },
    });
  } catch {
    // Snapshot failure should not block the analysis response
  }

  redirect(`/leases/${lease.id}/analysis`);
}
