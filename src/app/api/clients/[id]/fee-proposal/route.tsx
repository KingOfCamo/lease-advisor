import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { renderPdfToBuffer } from "@/services/pdf/render";
import { FeeProposalPdf } from "@/services/pdf/fee-proposal";
import type { FeeProposalData } from "@/services/pdf/fee-proposal";
import React from "react";

export const dynamic = "force-dynamic";

interface Recommendation {
  title: string;
  description: string;
  estimatedAnnualImpact: number;
  priority: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { feeModel, feeAmount, feeDetail } = body;

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      leases: {
        include: { analyses: true },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const analysedLeases = client.leases.filter((l) => l.analyses.length > 0);
  const totalRent = client.leases.reduce((s, l) => s + l.baseRentPA, 0);
  const totalValueAdd = analysedLeases.reduce((s, l) => {
    const a = l.analyses[l.analyses.length - 1];
    return s + a.totalEstimatedAnnualImpact;
  }, 0);

  const recommendations = analysedLeases
    .flatMap((l) => {
      const a = l.analyses[l.analyses.length - 1];
      const recs: Recommendation[] = JSON.parse(a.topRecommendations);
      return recs.map((r) => ({
        lease: l.leaseName,
        title: r.title,
        impact: r.estimatedAnnualImpact,
      }));
    })
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 10);

  let settings = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });
  if (!settings) {
    settings = {
      id: "default",
      companyName: "Ben Palmieri Consulting",
      tagline: "Director | Leasing Consultant",
      licenceNumber: "095428L",
      email: "",
      phone: "",
      address: "",
      logoUrl: null,
      primaryColor: "#1e3a5f",
      disclaimer:
        "This report is advisory in nature and does not constitute legal advice.",
      termsOfEngagement: "",
      updatedAt: new Date(),
    };
  }

  const proposalData: FeeProposalData = {
    client: {
      businessName: client.businessName,
      clientType: client.clientType,
    },
    leaseCount: analysedLeases.length,
    totalRent,
    totalValueAdd,
    recommendations,
    feeModel,
    feeAmount,
    feeDetail,
    settings: {
      companyName: settings.companyName,
      tagline: settings.tagline,
      licenceNumber: settings.licenceNumber,
      disclaimer: settings.disclaimer,
    },
  };

  const element = React.createElement(FeeProposalPdf, { data: proposalData });
  const buffer = await renderPdfToBuffer(element);

  const filename = `Fee_Proposal_${client.businessName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
