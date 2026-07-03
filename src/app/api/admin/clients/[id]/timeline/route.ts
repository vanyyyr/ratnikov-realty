import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the client first to have their name for searching
    const client = await db.client.findUnique({
      where: { id },
      include: { lead: true, deals: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Search activity logs where details contain client ID or client name
    const logs = await db.activityLog.findMany({
      where: {
        OR: [
          { details: { contains: id } },
          { details: { contains: client.name } },
          { details: { contains: client.phone } },
          ...(client.leadId ? [{ details: { contains: client.leadId } }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      client: {
        id: client.id,
        name: client.name,
        phone: client.phone,
      },
      timeline: logs,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}