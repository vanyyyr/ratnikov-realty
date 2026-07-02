import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const tagsParam = searchParams.get("tags");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { phone: { contains: search } },
    ];
  }
  if (tagsParam) {
    const tags = tagsParam.split(",").map((t) => t.trim()).filter(Boolean);
    if (tags.length > 0) {
      // SQLite doesn't support JSON array contains, so we match tags as substrings
      // Each tag in the JSON array is wrapped in quotes
      const tagConditions = tags.map((tag) => ({
        tags: { contains: `"${tag}"` },
      }));
      // If there are multiple tags, use OR (match any)
      if (tagConditions.length === 1) {
        where.tags = tagConditions[0].tags;
      } else {
        // Combine with existing OR or create new one
        const existingOr = where.OR as Array<Record<string, unknown>> | undefined;
        where.OR = [
          ...(existingOr || []),
          ...tagConditions,
        ];
      }
    }
  }

  const [leads, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.lead.count({ where }),
  ]);

  return NextResponse.json({ leads, total, page, totalPages: Math.ceil(total / limit) });
}

export async function PUT(req: NextRequest) {
  const { id, status, notes, tags } = await req.json();
  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;
  if (tags !== undefined) {
    updateData.tags = typeof tags === "string" ? tags : JSON.stringify(tags);
  }
  const lead = await db.lead.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(lead);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.lead.delete({ where: { id } });
  return NextResponse.json({ success: true });
}