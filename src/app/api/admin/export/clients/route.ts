import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const clients = await db.client.findMany({ orderBy: { createdAt: "desc" } });

    const headers = "Name,Phone,Email,Telegram,Source,Notes,Tags,Created At";
    const rows = clients.map((c) => {
      const name = `"${(c.name || "").replace(/"/g, '""')}"`;
      const phone = `"${(c.phone || "").replace(/"/g, '""')}"`;
      const email = `"${(c.email || "").replace(/"/g, '""')}"`;
      const telegram = `"${(c.telegram || "").replace(/"/g, '""')}"`;
      const source = `"${(c.source || "").replace(/"/g, '""')}"`;
      const notes = `"${(c.notes || "").replace(/"/g, '""')}"`;
      let tags = "";
      if (c.tags) {
        try {
          const parsed = JSON.parse(c.tags);
          tags = `"${(Array.isArray(parsed) ? parsed.join(", ") : c.tags).replace(/"/g, '""')}"`;
        } catch {
          tags = `"${c.tags.replace(/"/g, '""')}"`;
        }
      }
      const createdAt = c.createdAt.toISOString();
      return [name, phone, email, telegram, source, notes, tags, createdAt].join(",");
    });

    const csv = [headers, ...rows].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=clients.csv",
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}