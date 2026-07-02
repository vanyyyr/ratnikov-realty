import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" } });

    const headers = "Name,Phone,Service Type,Status,Source,Comment,Created At,Tags";
    const rows = leads.map((l) => {
      const name = `"${(l.name || "").replace(/"/g, '""')}"`;
      const phone = `"${(l.phone || "").replace(/"/g, '""')}"`;
      const serviceType = `"${(l.serviceType || "").replace(/"/g, '""')}"`;
      const status = l.status;
      const source = `"${(l.source || "").replace(/"/g, '""')}"`;
      const comment = `"${(l.comment || "").replace(/"/g, '""')}"`;
      const createdAt = l.createdAt.toISOString();
      let tags = "";
      if (l.tags) {
        try {
          const parsed = JSON.parse(l.tags);
          tags = `"${(Array.isArray(parsed) ? parsed.join(", ") : l.tags).replace(/"/g, '""')}"`;
        } catch {
          tags = `"${l.tags.replace(/"/g, '""')}"`;
        }
      }
      return [name, phone, serviceType, status, source, comment, createdAt, tags].join(",");
    });

    const csv = [headers, ...rows].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=leads.csv",
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}