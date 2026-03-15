import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
