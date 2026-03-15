import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // For CLIENT users, filter to their own client's data
  const where = session.user.role === "CLIENT" && session.user.clientId
    ? { id: session.user.clientId }
    : undefined;

  const clients = await prisma.client.findMany({
    where,
    select: { id: true, businessName: true, clientType: true },
    orderBy: { businessName: "asc" },
  });
  return NextResponse.json(clients);
}
