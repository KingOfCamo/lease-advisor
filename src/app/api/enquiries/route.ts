import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST — public contact form submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        service: service || null,
        message,
      },
    });

    return NextResponse.json({ id: enquiry.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create enquiry" },
      { status: 500 }
    );
  }
}

// GET — platform list of enquiries (admin-only)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const enquiries = await prisma.enquiry.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(enquiries);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}
