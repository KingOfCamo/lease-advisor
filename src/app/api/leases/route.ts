import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Create or link client
  let clientId = data.clientId;
  if (data.createNewClient && data.newClientName) {
    const client = await prisma.client.create({
      data: {
        businessName: data.newClientName,
        clientType: data.newClientType || "TENANT",
        email: data.newClientEmail || null,
        phone: data.newClientPhone || null,
        status: "ACTIVE",
      },
    });
    clientId = client.id;
  }

  if (!clientId) {
    return NextResponse.json({ error: "Client is required" }, { status: 400 });
  }

  // Create property
  const property = await prisma.property.create({
    data: {
      address: data.address,
      suburb: data.suburb,
      state: data.state || "VIC",
      postcode: data.postcode,
      propertyType: data.propertyType,
      nla: data.nla || 0,
      propertyGrade: data.propertyGrade || null,
      isRetailLease: data.isRetailLease || false,
    },
  });

  // Calculate total term in months
  const startDate = new Date(data.commencementDate);
  const endDate = new Date(data.expiryDate);
  const totalTermMonths = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  );

  // Build outgoings detail JSON
  const outgoingsDetail = JSON.stringify({
    councilRates: data.councilRates || 0,
    waterRates: data.waterRates || 0,
    insurance: data.insurance || 0,
    landTax: data.landTax || 0,
    managementFee: data.managementFee || 0,
    structuralMaintenance: data.structuralMaintenance || 0,
    other: data.otherOutgoings || 0,
  });

  const totalOutgoings =
    (data.councilRates || 0) + (data.waterRates || 0) + (data.insurance || 0) +
    (data.landTax || 0) + (data.managementFee || 0) + (data.structuralMaintenance || 0) +
    (data.otherOutgoings || 0);

  // Build rent review detail
  let rentReviewDetail = data.rentReviewDetail || "";
  if (data.rentReviewMechanism === "FIXED_PERCENT" && data.fixedPercent) {
    rentReviewDetail = `${data.fixedPercent}% fixed increase annually`;
  } else if (data.rentReviewMechanism === "CPI") {
    rentReviewDetail = "CPI annual reviews";
  } else if (data.rentReviewMechanism === "CPI_PLUS" && data.cpiMargin) {
    rentReviewDetail = `CPI + ${data.cpiMargin}% annually`;
  } else if (data.rentReviewMechanism === "MARKET") {
    rentReviewDetail = data.marketCap
      ? `Market review with ${data.marketCap}% cap`
      : "Market review (uncapped)";
  }

  const lease = await prisma.lease.create({
    data: {
      clientId,
      propertyId: property.id,
      leaseName: data.leaseName,
      tenantName: data.tenantName,
      landlordName: data.landlordName,
      commencementDate: startDate,
      expiryDate: endDate,
      totalTermMonths,
      optionsToRenew: data.optionsToRenew?.length > 0
        ? JSON.stringify(data.optionsToRenew)
        : null,
      baseRentPA: data.baseRentPA || 0,
      baseRentPSQM: data.baseRentPA && data.nla ? data.baseRentPA / data.nla : null,
      rentReviewMechanism: data.rentReviewMechanism,
      rentReviewDetail: rentReviewDetail || null,
      rentReviewFrequencyMonths: data.rentReviewFrequencyMonths || 12,
      hasRatchetClause: data.hasRatchetClause || false,
      outgoingsStructure: data.outgoingsStructure,
      outgoingsDetail,
      outgoingsEstimatePA: totalOutgoings > 0 ? totalOutgoings : null,
      permittedUse: data.permittedUse || null,
      makeGoodObligations: data.makeGoodObligations || null,
      fitoutContribution: data.fitoutContribution || null,
      rentFreePeriodMonths: data.rentFreePeriodMonths || null,
      incentivesDetail: data.incentivesDetail || null,
      bondAmount: data.bondAmount || null,
      bondType: data.bondType || null,
      bondReductionTerms: data.bondReductionTerms || null,
      assignmentRights: data.assignmentRights || null,
      sublettingRights: data.sublettingRights || null,
      defaultProvisions: data.defaultProvisions || null,
      curePeriodDays: data.curePeriodDays || null,
      demolitionClause: data.demolitionClause || false,
      relocationClause: data.relocationClause || false,
      firstRightOfRefusal: data.firstRightOfRefusal || false,
      specialConditions: data.specialConditions || null,
      status: "DRAFT",
    },
  });

  return NextResponse.json(lease);
}
