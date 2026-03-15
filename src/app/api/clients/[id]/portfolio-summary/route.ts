import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Recommendation {
  title: string;
  description: string;
  estimatedAnnualImpact: number;
  priority: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // For CLIENT users, ensure they can only access their own client's data
  if (session.user.role === "CLIENT" && session.user.clientId && session.user.clientId !== params.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      leases: {
        include: { property: true, analyses: true },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const totalRent = client.leases.reduce((s, l) => s + l.baseRentPA, 0);
  const analysedLeases = client.leases.filter((l) => l.analyses.length > 0);
  const totalValueAdd = analysedLeases.reduce((s, l) => {
    const a = l.analyses[l.analyses.length - 1];
    return s + a.totalEstimatedAnnualImpact;
  }, 0);

  const recommendations = analysedLeases.flatMap((l) => {
    const a = l.analyses[l.analyses.length - 1];
    const recs: Recommendation[] = JSON.parse(a.topRecommendations);
    return recs.map((r) => ({
      lease: l.leaseName,
      title: r.title,
      impact: r.estimatedAnnualImpact,
    }));
  }).sort((a, b) => b.impact - a.impact);

  return NextResponse.json({
    businessName: client.businessName,
    clientType: client.clientType,
    leaseCount: analysedLeases.length,
    totalRent,
    totalValueAdd,
    recommendations: recommendations.slice(0, 10),
  });
}
