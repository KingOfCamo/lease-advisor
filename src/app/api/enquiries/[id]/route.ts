import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET — single enquiry (admin-only)
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
    });

    if (!enquiry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(enquiry);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch enquiry" },
      { status: 500 }
    );
  }
}

// PATCH — update status / notes (admin-only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { status, notes } = body;

    const data: Record<string, string> = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;

    const enquiry = await prisma.enquiry.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(enquiry);
  } catch {
    return NextResponse.json(
      { error: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}
