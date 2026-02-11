import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const clients = await prisma.client.findMany({
    select: { id: true, businessName: true, clientType: true },
    orderBy: { businessName: "asc" },
  });
  return NextResponse.json(clients);
}
