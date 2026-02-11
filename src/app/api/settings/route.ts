import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const settings = await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {
      companyName: body.companyName,
      tagline: body.tagline,
      licenceNumber: body.licenceNumber,
      email: body.email,
      phone: body.phone,
      address: body.address,
      primaryColor: body.primaryColor,
      disclaimer: body.disclaimer,
      termsOfEngagement: body.termsOfEngagement,
    },
    create: {
      id: "default",
      companyName: body.companyName,
      tagline: body.tagline,
      licenceNumber: body.licenceNumber,
      email: body.email,
      phone: body.phone,
      address: body.address,
      primaryColor: body.primaryColor,
      disclaimer: body.disclaimer,
      termsOfEngagement: body.termsOfEngagement,
    },
  });

  return NextResponse.json(settings);
}
